"use client";

import { useState, useEffect } from "react";
import { authClient } from "@auth/auth-client";
import { useRouter } from "next/navigation";
import Loading from "@/app/profile/loading";
import { useCreatePrompt } from "@/actions";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [error, setError] = useState(null);

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

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!session?.user._id) {
        throw new Error("User session not found");
      }

      const response = await useCreatePrompt({
        prompt: post.prompt,
        userId: session.user._id,
        tag: post.tag,
      });

      if (response.status === "success") {
        router.push("/");
      } else {
        setError(response.error?.message || "Failed to create prompt");
        console.error("Create prompt error:", response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Create prompt error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1500);
  
    return () => clearTimeout(delay);
  }, []);
  

  return (
    <>
      {loading ? (
        <Loading />  
      ) : (
        <Form
          type='Create'
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={createPrompt}
          error={error}
        />
      )}
    </>
  );
};

export default CreatePrompt;
