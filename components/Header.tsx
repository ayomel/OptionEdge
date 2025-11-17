"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { useTheme } from "./ThemeProvider";

function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between px-6 h-16 border-b 
      bg-white text-gray-900 border-gray-200 
      dark:bg-[#14161b] dark:text-gray-100 dark:border-gray-800
      shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
        >
          <span className="font-bold">OptionFlow</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/flow"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Flow
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* 🌙 Dark mode toggle */}
        <button
          onClick={toggle}
          className="px-3 py-1 text-xs rounded-md border
          border-gray-300 bg-gray-100 text-gray-700
          dark:bg-[#1b1e25] dark:border-gray-700 dark:text-gray-200"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* Clerk Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium">
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
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-10 h-10" } }}
          />
        </SignedIn>
      </div>
    </header>
  );
}

export default Header;
