"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  // const pathName = usePathname();
  // const router = useRouter();

  const [copied, setCopied] = useState("");
  console.log(post)

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }

  return (
    <div className='prompt_card'>
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src={session?.user.image}
            alt="post" 
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h3>{session?.user.name}</h3>
          <p className="text-sm text-gray-700 blue_gradient">{session?.user.email}</p>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={ copied === post.prompt
              ? '/assets/icons/tick.svg'
              : '/assets/icons/copy.svg'
            }
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className="my-4 text-sm text-gray-700">
        {post.prompt}
      </p>

      <p 
        className="text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >    
        {post.tag}
      </p>
    </div>
  );
};

export default PromptCard;