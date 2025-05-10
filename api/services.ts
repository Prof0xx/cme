import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './lib/storage.js';
import { handleCors } from './middleware.js';
import type { Service } from './lib/schema.js';

// Helper function to parse price
function parsePrice(price: string | null): number | null {
  if (!price) return null;
  if (price === 'tbd' || price === 'Custom') return null;
  if (price.includes('per')) {
    // For prices like "150 per 1000", take the base price
    return parseInt(price.split(' ')[0]) || null;
  }
  return parseInt(price) || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle CORS
    if (handleCors(req, res)) return;

    switch (req.method) {
      case 'GET': {
        try {
          // Get category from either query param or URL param
          const category = req.query.category as string || (req.url?.split('/').pop() as string | undefined);
          let services: Service[];
          
          console.log(`🔍 API /services GET request received${category ? ` for category: ${category}` : ''}`);
          
          if (category && category !== 'services') {
            console.log(`📁 Attempting to fetch services for category: ${category}`);
            try {
              services = await storage.getServicesByCategory(category);
              console.log(`✅ getServicesByCategory returned: ${services ? services.length : 0} services`);

              // Return category-specific format
              if (!services || services.length === 0) {
                const errorMsg = `No services found in category: ${category}`;
                console.error(`⚠️ ${errorMsg}`);
                return res.status(404).json({ error: errorMsg });
              }

              // Calculate total price
              const totalPrice = services.reduce((sum, service) => {
                const price = parsePrice(service.price);
                return price !== null ? sum + price : sum;
              }, 0);

              return res.status(200).json({
                services,
                totalPrice
              });
            } catch (categoryError: unknown) {
              console.error(`❌ Error fetching services for category ${category}:`, categoryError);
              return res.status(500).json({ 
                error: 'Failed to fetch services for category',
                details: categoryError instanceof Error ? categoryError.message : String(categoryError)
              });
            }
          } else {
            console.log(`📁 Attempting to fetch all services`);
            services = await storage.getAllServices();
            console.log(`✅ getAllServices returned: ${services ? services.length : 0} services`);

            // Add error handling for empty services
            if (!services || services.length === 0) {
              console.error(`⚠️ No services found`);
              return res.status(404).json({ error: "No services found" });
            }

            // Group services by category for easier frontend rendering
            const groupedServices = services.reduce<Record<string, Service[]>>((acc, service) => {
              if (!acc[service.category]) {
                acc[service.category] = [];
              }
              acc[service.category].push(service);
              return acc;
            }, {});

            console.log(`📦 Services grouped into ${Object.keys(groupedServices).length} categories`);
            console.log(`🔢 Categories: ${Object.keys(groupedServices).join(', ')}`);
            
            return res.status(200).json({
              categories: Object.keys(groupedServices),
              services: groupedServices
            });
          }
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
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 