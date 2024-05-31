// app/api/prompts/[id]/like/route.js
import Prompt from '@models/prompt';
import { connectToDB } from '@utils/database';

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id);
    if (!prompt) {
      return new Response('Prompt not found', { status: 404 });
    }

    prompt.likes += 1;
    await prompt.save();

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to update likes', { status: 500 });
  }
};
