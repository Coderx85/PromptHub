// import { connectToDB } from '@utils/database';
// import Prompt from '@models/prompt';

// export default async function handler(req, res) {
//   const { method } = req;
//   const { id } = req.query;

//   await connectToDB();

//   switch (method) {
//     case 'PATCH':
//       try {
//         const prompt = await Prompt.findById(id);
//         if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

//         prompt.likes += 1;
//         await prompt.save();

//         res.status(200).json(prompt);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['PATCH']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
