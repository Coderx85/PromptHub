"use client";

import { useState, useEffect } from "react";
import { authClient } from "@auth/auth-client";
import { useRouter } from "next/navigation";
import Loading from "@/app/profile/loading";
import { useCreatePrompt } from "@/actions";

import Form from "@components/Form";
import { Session, User } from "better-auth/types";

type AuthSession = {
  session: Session | null;
  user: User | null;
};

const CreatePrompt = () => {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

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
        setSessionLoading(false);
      }
    };
    getSession();
  }, []);

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!session?.user.id) {
        setError("Please sign in to create a prompt.");
        router.push("/auth/signin");
        return;
      }

      const response = await useCreatePrompt({
        prompt: post.prompt,
        userId: session.user.id,
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

  return (
    <>
      {sessionLoading ? (
        <Loading />
      ) : (
        <Form
          type="Create"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={createPrompt}
          error={error}
          isAuthenticated={Boolean(session?.user.id)}
        />
      )}
    </>
  );
};

export default CreatePrompt;
