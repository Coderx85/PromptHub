"use client";

import { authClient } from "@auth/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeletePrompt } from "@/actions";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error("Failed to get session:", error);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user._id}/posts`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user._id) fetchPosts();
  }, [session?.user._id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        if (!session?.user._id) {
          throw new Error("User session not found");
        }

        const response = await useDeletePrompt({
          promptId: post._id.toString(),
          userId: session.user._id,
        });

        if (response.status !== "success") {
          throw new Error(response.error?.message || "Failed to delete prompt");
        }

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
