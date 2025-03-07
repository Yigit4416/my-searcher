"use server";
import SearchPart from "./_components/searchpart";
import { getUserChoice as getChoice } from "~/server/queries"; // Assuming this is where your getUserChoice is defined

async function getUserChoiceServer(): Promise<string> {
  "use server";
  const result = await getChoice();
  // Return the searchEngine value or default to "!duck"
  return result ?? "!duck";
}

export default async function HomePage() {
  const userChoice = await getUserChoiceServer();
  return <SearchPart getUserChoice={userChoice} />;
}
