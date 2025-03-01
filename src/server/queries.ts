import "server-only";
import { db } from "./db";

export async function getBang(bang: string) {
  const reqBang = await db.query.bangs.findFirst({
    where: (model, { eq }) => eq(model.bang, bang),
  });
  return reqBang;
}