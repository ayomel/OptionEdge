import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptionFlow Dashboard",
  description: "Next.js + Clerk + Supabase demo",
};

function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-lg font-semibold text-indigo-600">
          <span className="font-bold">OptionFlow</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/flow" className="hover:text-indigo-600">
            Flow
          </Link>
          <Link href="/settings" className="hover:text-indigo-600">
            Settings
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-indigo-600 text-white rounded-md text-sm font-medium px-4 py-2 hover:bg-indigo-700">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "w-10 h-10" } }}
            />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        >
          <Header />
          <main className="min-h-screen p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
