import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b p-4 text-xl font-semibold">
      <div>Ojrd Corp</div>
      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
