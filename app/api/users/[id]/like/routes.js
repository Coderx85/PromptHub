import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { getSession } from "next-auth/react";

export const PATCH = async (request, {params}) => {
  const { id } = params;
  const session = await getSession({req: request});
  
  if (!session) {
    return {
      status: 401,
      json: { message: "Unauthorized" }
    };
  }

  try {
    await connectToDB();

    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return {
        status: 404,
        json: { message: "Prompt not found" }
      };
    }

    const user = await User.findOne({ email: session.user.email });

    // Check if the user has already liked this prompt
    if (user.likedPrompts.includes(prompt._id)) {
      return new Response('Already liked', { status: 400 });
    }

    prompt.likes += 1;
    await prompt.save();

    user.likedPrompts.push(prompt._id);
    await user.save();

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to update likes', { status: 500 });
  } finally {
    mongoose.connection.close();
  }
};
