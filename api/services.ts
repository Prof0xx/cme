import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '@/shared/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const services = await storage.getServicesByCategory(category);
        return res.status(200).json(services);
      }
      
      const services = await storage.getAllServices();
      return res.status(200).json(services);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 