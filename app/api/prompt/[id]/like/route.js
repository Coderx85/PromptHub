// // app/api/prompts/[id]/like/route.js
// import Prompt from '@models/prompt';
// import { connectToDB } from '@utils/database';

// export const PATCH = async (request, { params }) => {
//   const session = await getSession({ req: request });
  
//   if (!session) {
//     return new Response('Unauthorized', { status: 401 });
//   }

//   try {
//     await connectToDB();

//     const prompt = await Prompt.findById(params.id);
//     if (!prompt) {
//       return new Response('Prompt not found', { status: 404 });
//     }

//     const user = await User.findOne({ email: session.user.email });

//     if (user.likedPrompts.includes(prompt._id)) {
//       return new Response('Already liked', { status: 400 });
//     }

//     prompt.likes += 1;
//     await prompt.save();

//     return new Response(JSON.stringify(prompt), { status: 200 });
//   } catch (error) {
//     return new Response('Failed to update likes', { status: 500 });
//   } finally {
//     mongoose.connection.close();
//   }
// };
