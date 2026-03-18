"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdatePrompt, useGetPromptById } from "@/actions";
import { authClient } from "@auth/auth-client";

import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [post, setPost] = useState({ prompt: "", tag: "", });
  const [submitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Fetch session
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

  // Fetch prompt details
  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) return;
      
      try {
        setLoading(true);
        const response = await useGetPromptById({ promptId });

        if (response.status === "success" && response.data) {
          setPost({
            prompt: response.data.prompt,
            tag: response.data.tag,
          });
        } else {
          setError(response.error?.message || "Failed to fetch prompt");
          console.error("Fetch prompt error:", response.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Fetch prompt error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!promptId) {
      setError("Missing Prompt ID");
      setIsSubmitting(false);
      return;
    }

    if (!session?.user._id) {
      setError("User session not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await useUpdatePrompt({
        promptId,
        prompt: post.prompt,
        tag: post.tag,
        userId: session.user._id,
      });

      if (response.status === "success") {
        router.push("/");
      } else {
        setError(response.error?.message || "Failed to update prompt");
        console.error("Update prompt error:", response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Update prompt error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading prompt details...</p>
        </div>
      ) : (
        <Form
          type='Edit'
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={updatePrompt}
          error={error}
        />
      )}
    </>
  );
};

export default UpdatePrompt;
