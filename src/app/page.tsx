"use client"

import Feed from "@components/Feed";
import { useState, useEffect } from 'react';
import Loading from "./loading";


export default function Home() {
  // await new Promise((resolve) => (resolve, 2000));
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate a 2-second delay
    const delay = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
  }, 1000);
  
    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
  }, []); // Empty dependency array ensures this effect runs only once
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="w-full flex justify-center bg-black items-center flex-col px-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg">
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.15] dark:text-slate-300 text-black sm:text-6xl text-center">
            Discover & Share
            <br className="max-md:hidden" />
            <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent text-center">
              AI-Powered Prompts
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-300 sm:text-xl max-w-2xl text-center">
            PromptHub is a platform that enables users to seamlessly share and
            explore prompts for writing and ideation. With a clean, intuitive
            interface, it offers an enriching experience in a streamlined,
            user-friendly environment
          </p>
          <Feed />
        </section>
      )}
    </>
  );
};