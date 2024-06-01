"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");

  const handleProfileClick = () => {
    console.log(post);

    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // const [likes, setLikes] = useState(post.likes);
  // const [liked, setLiked] = useState(false);

  
  // useEffect(() => {
  //   if (session?.user) {
  //     checkIfLiked();
  //   }
  // }, [session]);

  // const checkIfLiked = async () => {
  //   try {
  //     const response = await fetch(`/api/users/${session.user.id}/likes`);
  //     const data = await response.json();
  //     setLiked(data.includes(post._id));
  //   } catch (error) {
  //     console.error('Failed to check if liked', error);
  //   }
  // };
  
  // const handleLike = async () => {
  //   try {
  //     const response = await fetch(`/api/prompt/${post._id}/like`, {
  //       method: 'PATCH',
  //     });

  //     if (response.ok) {
  //       const updatedPost = await response.json();
  //       setLikes(updatedPost.likes);
  //     }
  //   } catch (error) {
  //     console.error('Failed to like the prompt', error);
  //   }
  // };

  return (
  <div className='prompt_card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 p-4 rounded-lg shadow-md'>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi dark:text-white font-semibold text-gray-900'>
              {capitalizeFirstLetter(post.creator.username)}
            </h3>
            {/* <p className='font-inter text-sm text-gray-500'>
              {post.creator.email}
            </p> */}
          </div>
        </div>
        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700 dark:text-slate-300'>{post.prompt}</p>
      <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
      {/* {session?.user ? (
        <>
        <hr className=" my-3"/>
        <div className='flex items-center gap-2'>
          <button
            className={`like_btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={liked}
          >
            Like
          </button>
          <span>{likes} Likes</span>
        </div>
        </>
      ):(
        <div></div>
      )} */}
      </div>
  );
};

export default PromptCard;
