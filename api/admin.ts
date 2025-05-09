import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './lib/storage';
import { handleCors } from './middleware';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  isAdmin: z.boolean().optional(),
  telegramHandle: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle CORS
    if (handleCors(req, res)) return;

    const path = req.query.path as string;
    
    // Handle users
    if (path === 'users') {
      switch (req.method) {
        case 'GET': {
          try {
            const username = req.query.username as string | undefined;
            const telegramHandle = req.query.telegramHandle as string | undefined;
            let user;
            
            if (username) {
              user = await storage.getUserByUsername(username);
            } else if (telegramHandle) {
              user = await storage.getUserByTelegramHandle(telegramHandle);
            } else {
              const users = await storage.getAllUsers();
              return res.status(200).json(users);
            }
            
            return user 
              ? res.status(200).json(user)
              : res.status(404).json({ error: 'User not found' });
          } catch (err) {
            console.error("🔥 API /admin/users GET failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        case 'POST': {
          try {
            const validatedData = userSchema.parse(req.body);
            const user = await storage.createUser(validatedData);
            return res.status(201).json(user);
          } catch (err) {
            if (err instanceof z.ZodError) {
              return res.status(400).json({ error: 'Invalid user data', details: err.errors });
            }
            console.error("🔥 API /admin/users POST failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        case 'PATCH': {
          try {
            const id = parseInt(req.query.id as string);
            if (isNaN(id)) {
              return res.status(400).json({ error: 'Invalid ID' });
            }

            const validatedData = userSchema.partial().parse(req.body);
            const user = await storage.updateUser(id, validatedData);
            return user
              ? res.status(200).json(user)
              : res.status(404).json({ error: 'User not found' });
          } catch (err) {
            if (err instanceof z.ZodError) {
              return res.status(400).json({ error: 'Invalid user data', details: err.errors });
            }
            console.error("🔥 API /admin/users PATCH failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        default:
          return res.status(405).json({ error: 'Method not allowed' });
      }
    }

    return res.status(404).json({ error: 'Invalid admin path' });
  } catch (error) {
    console.error('Admin Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 