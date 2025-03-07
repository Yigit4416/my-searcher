import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { changeUserChoice, getUserChoice } from "~/server/queries";
import SettingsForm from "../_components/settingsform";

export default async function Setting() {
  const user = await currentUser();

  async function updateUserChoice(searchEngine: string) {
    "use server";
    return await changeUserChoice(searchEngine);
  }

  let userChoice = await getUserChoice();

  if (userChoice === undefined || userChoice === null) {
    userChoice = "!duck";
  }

  console.log(userChoice);

  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p className="text-center text-lg font-medium text-gray-300">
            To access this page, please sign in.
          </p>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="mt-16 flex flex-col items-center justify-center space-y-6 p-6">
          <div className="flex items-center space-x-2 text-lg">
            <span className="font-semibold">User Info:</span>
            <span>{user?.username ?? user?.fullName}</span>
          </div>
          <SettingsForm
            searchEngine={userChoice}
            updateUserChoice={updateUserChoice}
          />
        </div>
      </SignedIn>
    </>
  );
}
