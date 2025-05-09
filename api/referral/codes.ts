import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { z } from 'zod';

const referralCodeSchema = z.object({
  code: z.string().min(1),
  userId: z.number(),
  discountPercentage: z.number().min(0).max(100),
  commissionPercentage: z.number().min(0).max(100),
  maxUses: z.number().optional(),
  expiresAt: z.string().optional().transform(str => str ? new Date(str) : undefined)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        // Get specific code if provided
        const code = req.query.code as string;
        if (code) {
          const referralCode = await storage.getReferralCodeByCode(code);
          return referralCode 
            ? res.status(200).json(referralCode)
            : res.status(404).json({ error: 'Referral code not found' });
        }
        
        // Get all codes
        const codes = await storage.getAllReferralCodes();
        return res.status(200).json(codes);
      }

      case 'POST': {
        const result = referralCodeSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid request body' });
        }

        const newCode = await storage.createReferralCode(result.data);
        return res.status(201).json(newCode);
      }

      case 'PUT': {
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const result = referralCodeSchema.partial().safeParse(updateData);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid request body' });
        }

        const updated = await storage.updateReferralCode(id, result.data);
        return updated
          ? res.status(200).json(updated)
          : res.status(404).json({ error: 'Referral code not found' });
      }

      case 'DELETE': {
        const id = parseInt(req.query.id as string);
        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid ID' });
        }

        const success = await storage.deleteReferralCode(id);
        return success
          ? res.status(200).json({ message: 'Referral code deleted' })
          : res.status(404).json({ error: 'Referral code not found' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Referral Code Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 