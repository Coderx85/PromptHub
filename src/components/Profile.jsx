import PromptCard from "./PromptCard";
import { authClient } from "@auth/auth-client";
import Image from "next/image";
import { useState, useEffect } from "react";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: sessData } = await authClient.getSession();
        setSession(sessData);
      } catch (error) {
        console.error("Failed to get session:", error);
      }
    };
    getSession();
  }, []);
  return (
    <section className='w-full'>
      <div className="flex items-center gap-x-40 border-red-500 ">
        
        {/* {session && session.user && (
          <div className="flex gap-3 flex-col">
            <Image 
              src={session.user.image}
              alt="Profile"
              width={150}
              height={150} 
              className="rounded-full object-cover" 
            />
            <span className="font-semibold dark:text-white">{name}</span>
            <span className="font-inter dark:text-gray-500 text-sm text-gray-900">{session.user.email}</span>
          </div>
        )} */}
        <div>
          <h1 className='head_text text-left flex-row'>
            <span className='red_gradient'>{name} Profile</span>
          </h1>
          <p className='desc text-left'>{desc}</p>

        </div>
      </div>

      <div className='mt-10 prompt_layout'>
        {data.map((post) => (
          <PromptCard
            handleTagClick={() => {}}
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
