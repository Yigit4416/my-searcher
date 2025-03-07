import "server-only";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { customBangs, userChoice } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getBang(bang: string) {
  const reqBang = await db.query.bangs.findFirst({
    where: (model, { eq }) => eq(model.bang, bang),
  });
  return reqBang;
}

export async function addBang(
  bang: string,
  bangLink: string,
  userId: string,
  name: string,
) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");
  const result = await db
    .insert(customBangs)
    .values({
      name: name,
      banglink: bangLink,
      creator: userId,
      bang: bang,
    })
    .returning();
  return result;
}

export async function getCustomBang(bang: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const result = await db.query.customBangs.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.bang, bang), eq(model.creator, user.userId)),
  });
  return result;
}

export async function getUserChoice() {
  const user = await auth();
  if (!user.userId) return "!duck";

  let result = await db.query.userChoice.findFirst({
    where: (model, { eq }) => eq(model.userId, user.userId),
  });

  if (!result || result === undefined) {
    result = {
      userId: user.userId,
      searchEngine: "!duck",
    };
  }
  return result.searchEngine;
}

export async function changeUserChoice(searchEngine: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  let result = await db
    .update(userChoice)
    .set({ searchEngine: searchEngine })
    .where(eq(userChoice.userId, user.userId)) // Correct way to filter by userId
    .returning();

  if (!result || result.length === 0) {
    result = await db
      .insert(userChoice)
      .values({ userId: user.userId, searchEngine: searchEngine })
      .returning();
  }
  return result;
}
