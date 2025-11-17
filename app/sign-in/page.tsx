"use client";

import Flow from "@/components/Flow/Flow";
import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  if (isSignedIn) {
    return redirect("/flow");
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
