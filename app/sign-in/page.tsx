"use client";

import { SignIn, useUser } from "@clerk/nextjs";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="text-xl font-semibold">Welcome!</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm">
        <SignIn
          routing="virtual"
          appearance={{
            elements: {
              formButtonPrimary: "bg-black hover:bg-gray-800",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
