import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import { storage } from './lib/storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Basic health check endpoint
    if (req.method === 'GET') {
      return res.status(200).json({ status: 'ok' });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 