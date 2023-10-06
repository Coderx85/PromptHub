"use client";
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Loading from "@app/create-prompt/loading";
import Profile from "@components/Profile";
import Loading from "@app/create-prompt/loading";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };
      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);
        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };
        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1500);
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1500);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
    }, []);
    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
    }, []);

  return (
    <>
      {
        loading ? (
          <Loading />
        ) : (
          <Profile
            name='My'
            desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
            data={myPosts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )
      }    
    </>
  );
};

export default MyProfile;