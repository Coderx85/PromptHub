// pages/api/users/[id]/likes.js

import { connectToDB } from '@utils/database';
import User from '@models/user';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await connectToDB();

  switch (method) {
    case 'GET':
      try {
        const user = await User.findById(id).populate('likes');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.likes);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}