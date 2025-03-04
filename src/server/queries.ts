import "server-only";
import { db } from "./db";
import { customBangs } from "./db/schema";

export async function getBang(bang: string) {
  const reqBang = await db.query.bangs.findFirst({
    where: (model, { eq }) => eq(model.bang, bang),
  });
  return reqBang;
}

export async function addBang(
  bang: string,
  bangLink: string,
  userId: number,
  name: string,
) {
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

export async function getCustomBang(userId: number, bang: string) {
  db.query.customBangs.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.bang, bang), eq(model.creator, userId)),
  });
}
