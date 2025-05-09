import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './_lib/storage';
import { handleCors } from './_middleware';
import { z } from 'zod';

const leadSchema = z.object({
  telegram: z.string(),
  selectedServices: z.array(z.object({
    category: z.string(),
    name: z.string(),
    price: z.union([z.string(), z.number()])
  })),
  totalValue: z.number(),
  message: z.string().optional(),
  referralCode: z.string().optional(),
  discountApplied: z.number().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle CORS
    if (handleCors(req, res)) return;

    switch (req.method) {
      case 'GET': {
        try {
          const referralCode = req.query.referralCode as string | undefined;
          let leads;
          
          if (referralCode) {
            leads = await storage.getLeadsByReferralCode(referralCode);
          } else {
            leads = await storage.getAllLeads();
          }
          
          return res.status(200).json(leads);
        } catch (err) {
          console.error("🔥 API /leads GET failed:", err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      }

      case 'POST': {
        try {
          const validatedData = leadSchema.parse(req.body);
          const lead = await storage.createLead({
            ...validatedData,
            createdAt: new Date().toISOString()
          });
          return res.status(201).json(lead);
        } catch (err) {
          if (err instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid lead data', details: err.errors });
          }
          console.error("🔥 API /leads POST failed:", err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Leads Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 