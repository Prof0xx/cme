import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  telegramHandle: z.string().optional(),
  isAdmin: z.boolean().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const users = await storage.getAllUsers();
        // Filter out sensitive information
        const safeUsers = users.map(({ password, ...user }) => user);
        return res.status(200).json(safeUsers);
      }

      case 'POST': {
        const result = userSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid request body' });
        }

        const newUser = await storage.createUser(result.data);
        const { password, ...safeUser } = newUser;
        return res.status(201).json(safeUser);
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const result = userSchema.partial().safeParse(updateData);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid request body' });
        }

        const updated = await storage.updateUser(id, result.data);
        if (!updated) {
          return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...safeUser } = updated;
        return res.status(200).json(safeUser);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin Users Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 