import Prompt from '@models/prompt';
import { connectToDB } from '@utils/database';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id } = req.query;

    try {
      await connectToDB();
      
      const prompt = await Prompt.findById(id);
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt not found' });
      }

      prompt.likes += 1;
      await prompt.save();

      res.status(200).json(prompt);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}