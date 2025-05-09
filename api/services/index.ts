import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../_lib/storage';
import { handleCors } from '../_middleware';
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
    // Handle CORS
    if (handleCors(req, res)) return;

    switch (req.method) {
      case 'GET': {
        try {
          const category = req.query.category as string | undefined;
          let services;
          
          console.log(`🔍 API /services GET request received${category ? ` for category: ${category}` : ''}`);
          
          if (category) {
            console.log(`📁 Attempting to fetch services for category: ${category}`);
            services = await storage.getServicesByCategory(category);
            console.log(`✅ getServicesByCategory returned: ${services ? services.length : 0} services`);
          } else {
            console.log(`📁 Attempting to fetch all services`);
            services = await storage.getAllServices();
            console.log(`✅ getAllServices returned: ${services ? services.length : 0} services`);
          }
          
          console.log("Fetched services:", services);

          // Add error handling for empty services
          if (!services || services.length === 0) {
            const errorMsg = category 
              ? `No services found in category: ${category}` 
              : "No services found";
            console.error(`⚠️ ${errorMsg}`);
            return res.status(404).json({ error: errorMsg });
          }

          // Group services by category for easier frontend rendering
          const groupedServices = services.reduce((acc, service) => {
            if (!acc[service.category]) {
              acc[service.category] = [];
            }
            acc[service.category].push(service);
            return acc;
          }, {} as Record<string, typeof services>);

          console.log(`📦 Services grouped into ${Object.keys(groupedServices).length} categories`);
          console.log(`🔢 Categories: ${Object.keys(groupedServices).join(', ')}`);
          
          return res.status(200).json({
            categories: Object.keys(groupedServices),
            services: groupedServices
          });
        } catch (err) {
          console.error("🔥 API /services GET failed:", err);
          return res.status(500).json({ error: 'Internal server error' });
        }
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