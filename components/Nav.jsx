"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  // const isLoggedIn = true;

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await getProviders();
      setProviders(response)
    })();
  }, []);

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href="/" className="flex gap-2 flex-center red_gradient">
        <Image 
          src="/assets/images/logo.svg"
          alt="Brand-Logo"
          className="object-contain"
          width={30}
          height={30}
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

          <button className="outline_btn" type="button" onClick={signOut}>
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
          {providers && Object.values(providers).map((providers) => (
            <button
              type="button"
              key={providers.name}
              onClick={() => signIn(providers.id)}
              className="black_btn"
            >
              Sign In
            </button>
          ))}
        </>
      )}
    </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        {session?.user ? (
          <div className='flex'>
            <Image
              src={session.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className='dropdown'>
                <Link
                  href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-prompt'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type='button'
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className='mt-5 w-full black_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>

    </nav>
  );
};

export default Nav;
