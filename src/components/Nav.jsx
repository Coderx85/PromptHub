"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { authClient } from "@auth/auth-client";

const Nav = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href="/" className="flex gap-2 flex-center red_gradient">
        <Image 
          src="/assets/images/logo.svg"
          alt="Brand-Logo"
          width={30}
          height={30}
          className="object-contain"
          />
        <p className="logo_text">
          PromptHub  
        </p>  
      </Link>

      <div className="sm:flex hidden">
      {session?.user ? (
        <div className='flex gap-3 md:gap-5'>
          <Link href="/create-prompt" className="black_btn">
            Create Post
          </Link>

          <button className="outline_btn" type="button" onClick={handleSignOut}>
            Sign Out
          </button>

          <Link href="/profile">
            <Image
              src={session.user.image}
              alt="button"
              className="rounded-full"
              width={37}
              height={37} 
            />
          </Link>

        </div>
      ):(
        <>
          <button
            type="button"
            onClick={() => handleSignIn('github')}
            className="black_btn"
          >
            Sign In with GitHub
          </button>
        </>
      )}
    </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        {
          session?.user ? (
            <div className="flex">
              <input type="checkbox" id="active"/>
              <label htmlFor="active" className="menu-btn"><span></span></label>
              <label htmlFor="active" className="close"></label>
              <div className="wrapper">
                <ul>

                  <li>
                    <Link
                        id="active"
                        href='/profile'
                        className='dropdown_link'
                        onClick={() => setToggleDropdown(false)}
                      >
                        My Profile
                      </Link>
                  </li>

                  <li>
                    <Link
                      href='/create-prompt'
                      className='dropdown_link'
                      onClick={() => setToggleDropdown(false)}>
                      Create Prompt
                    </Link>
                  </li>

                  <li>
                    <button
                      type='button'
                      onClick={() => {
                        setToggleDropdown(false);
                        handleSignOut();
                      }}
                      className='w-full'
                    >
                      Sign Out
                    </button>
                  </li>
                  
                </ul>
              </div>
            </div>

          ) : (

            <button
              type='button'
              onClick={() => handleSignIn('github')}
              className='black_btn'
            >
              Sign In with GitHub
            </button>

          )
        }
      </div>
    </nav>
  );
};

export default Nav;
