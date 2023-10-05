import { useSession } from "next-auth/react";
import PromptCard from "./PromptCard";
import Image from "next/image";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {

  const { data: session } = useSession();

  return (
    <section className='w-full'>
      <div className="flex justify-between items-center ">
        <div className="flex-col">
          <h1 className='head_text text-left'>
            <span className='red_gradient'>{name}Profile</span>
          </h1>
          <p className='desc text-left flex col'>{desc}</p>
        </div>
        
        {/* User Profile Information */}
        {session && session.user && (
          <div className="flex  gap-3 flex-col">
            <Image 
              src={session.user.image}
              alt="Profile"
              width={200}
              height={200} 
              className="rounded-full object-cover" 
            />
            <span className="font-semibold mx-0 text-gray-900">{session.user.name}</span>
            <span className="text-sm text-gray-500">{session.user.email}</span>
          </div>
        )}
      </div>

      <div className='mt-10 prompt_layout'>
        {data.map((post) => (
          <PromptCard
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
