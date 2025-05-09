import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';
import { setCorsHeaders } from '../_middleware';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  price: z.number().min(0),
  features: z.array(z.string())
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    setCorsHeaders(res);

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    switch (req.method) {
      case 'GET': {
        const category = req.query.category as string | undefined;
        let services;
        
        if (category) {
          services = await storage.getServicesByCategory(category);
        } else {
          services = await storage.getAllServices();
        }

        // Add error handling for empty services
        if (!services || services.length === 0) {
          return res.status(404).json({ 
            error: category 
              ? `No services found in category: ${category}` 
              : "No services found" 
          });
        }

        // Group services by category for easier frontend rendering
        const groupedServices = services.reduce((acc, service) => {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push(service);
          return acc;
        }, {} as Record<string, typeof services>);

        return res.status(200).json({
          categories: Object.keys(groupedServices),
          services: groupedServices
        });
      }

      case 'DELETE': {
        const id = parseInt(req.query.id as string);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        const success = await storage.deleteService(id);
        return success
          ? res.status(200).json({ message: 'Service deleted' })
          : res.status(404).json({ error: 'Service not found' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Services Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 