// app/api/users/[id]/likes/route.js
import User from '@models/user';
import { connectToDB } from '@utils/database';
import { getSession } from 'next-auth/react';

export const GET = async (request, { params }) => {
  const session = await getSession({ req: request });

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await connectToDB();

    const user = await User.findById(params.id).populate('likedPrompts');

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const likedPromptIds = user.likedPrompts.map((prompt) => prompt._id.toString());

    return new Response(JSON.stringify(likedPromptIds), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch liked prompts', { status: 500 });
  } finally {
    mongoose.connection.close();
  }
};