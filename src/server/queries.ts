import "server-only";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { customBangs, userChoice } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getBang(bang: string) {
  const reqBang = await db.query.bangs.findFirst({
    where: (model, { eq }) => eq(model.bang, bang),
  });
  return reqBang;
}

export async function getAllBangs() {
  const allBangs = await db.query.bangs.findMany({
    columns: {
      bang: true,
    },
  });

  const updatedBangs = allBangs.map((bangObj) => ({
    bang: bangObj.bang ?? "!g",
  }));

  return updatedBangs;
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

export async function getCustomBang(bang: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const result = await db.query.customBangs.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.bang, bang), eq(model.creator, user.userId)),
  });
  return result;
}

export async function getCustomBangs() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const result = await db.query.customBangs.findMany({
    where: (model, { eq }) => eq(model.creator, user.userId),
    columns: {
      id: true,
      name: true,
      bang: true,
      banglink: true,
    },
  });

  if (!result || result.length === 0) console.log("You don't have any record");
  //throw new Error("You don't have any record");

  return result;
}

interface CustomBangs {
  name: string;
  bang: string;
  banglink: string;
}

export async function addCustomBang({ name, bang, banglink }: CustomBangs) {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  if (name === null || bang === null || banglink === null) {
    throw new Error("Fill all values");
  }
  const result = await db
    .insert(customBangs)
    .values({
      name: name,
      bang: bang,
      banglink: banglink,
      creator: user.userId,
    })
    .returning({
      name: customBangs.name,
      bang: customBangs.bang,
      banglink: customBangs.banglink,
    });

  return result;
}

export async function deleteBang(bangId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const result = await db
    .delete(customBangs)
    .where(
      and(eq(customBangs.creator, user.userId), eq(customBangs.id, bangId)),
    )
    .returning({ id: customBangs.id });

  return result;
}
