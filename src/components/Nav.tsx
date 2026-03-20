"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@auth/auth-client";
import { Box, Button } from "@mui/material";
import { Session, User } from "better-auth/types";
import { useRouter } from "next/navigation";
import { SubscriptRounded } from "@mui/icons-material";

type AuthSession = {
  session: Session | null;
  user: User | null;
};

const Nav = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getSession();
  }, []);

  const [toggleDropdown, setToggleDropdown] = useState(false);

  // removed: next-auth getProviders() - better-auth handles this automatically

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const handleSignIn = async (provider) => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/",
    });
  };

  return (
    <nav className="flex justify-between items-center w-full mb-16 pt-3">
      <Link
        href="/"
        className="flex gap-2 flex justify-center items-center bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent"
      >
        <Image
          src="/assets/images/logo.svg"
          alt="Brand-Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="max-sm:hidden font-satoshi font-semibold text-lg tracking-wide bg-gradient-to-r to-red-900 bg-clip-text text-transparent">
          PromptHub
        </p>
      </Link>

      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link
              href="/create-prompt"
              className="rounded-full border dark:bg-gray-700 border-black bg-black py-1.5 px-5 text-white transition-all hover:bg-white hover:text-black text-center text-sm font-inter flex items-center justify-center"
            >
              Create Post
            </Link>

            <button
              className="rounded-full border border-black bg-transparent py-1.5 px-5 text-white dark:border-white transition-all hover:bg-black hover:text-white text-center text-sm font-inter flex items-center justify-center"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>

            <Link href="/profile">
              {session.user.image ? (
                <Image
                  src={
                    session.user?.image || "/assets/images/default-profile.png"
                  }
                  alt="button"
                  className="rounded-full"
                  width={37}
                  height={37}
                />
              ) : (
                <SubscriptRounded />
              )}
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleSignIn("github")}
              className="rounded-full border dark:bg-gray-700 border-black bg-black py-1.5 px-5 text-white transition-all hover:bg-white hover:text-black text-center text-sm font-inter flex items-center justify-center"
            >
              Sign In with GitHub
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.session ? (
          <div className="flex">
            <div
              className="flex bg-gray-700 p-2 w-full text-white h-36 rounded-full"
              onClick={() => setToggleDropdown((prev) => !prev)}
            >
              <Link
                href="/profile"
                className="text-sm font-inter hover:text-gray-500 h-36 bg-gray-700 font-medium"
                onClick={() => setToggleDropdown(false)}
              >
                My Profile
              </Link>
            </div>

            <div className="flex bg-green-500 dark:bg-gray-700 p-2 w-full text-white h-36 rounded-full">
              <Link
                href="/create-prompt"
                className="text-sm font-inter h-36 w-full hover:text-gray-500 font-medium"
                onClick={() => setToggleDropdown(false)}
              >
                Create Your Prompt
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setToggleDropdown(false);
                handleSignOut();
              }}
              className="w-full"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex">
            <Button
              aria-label="sign-with-google"
              variant="contained"
              color="primary"
              onClick={() => handleSignIn("github")}
            >
              Sign In with GitHub
            </Button>

            <Button
              aria-label="sign-with-google"
              variant="contained"
              color="primary"
              onClick={() => handleSignIn("google")}
            >
              Sign In with Google
            </Button>

            <Button
              aria-label="sign-in"
              variant="contained"
              color="primary"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In with Email
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
