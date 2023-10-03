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
        <Loading/>
      ) : (
        <section className='w-full flex-center flex-col'>
          <h1 className='head_text text-center'>
            Discover & Share
            <br className='max-md:hidden' />
            <span className='red_gradient text-center'>AI-Powered Prompts</span>
          </h1>
          <p className='desc text-center'>
            PromptHub is a platform that enables users to seamlessly share and explore prompts for writing and ideation. 
            With a clean, intuitive interface, it offers an enriching experience in a streamlined, user-friendly environment
          </p>

          <Feed />
        </section>
    )}
  </>
);
}
