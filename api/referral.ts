import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './lib/storage';
import { handleCors } from './middleware';
import { z } from 'zod';

const referralCodeSchema = z.object({
  code: z.string(),
  creatorId: z.number().optional(),
  creatorTelegram: z.string().optional(),
  discountPercent: z.number().default(5),
  commissionPercent: z.number().default(10),
  isActive: z.boolean().default(true)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle CORS
    if (handleCors(req, res)) return;

    const path = req.query.path as string;
    
    // Handle referral codes
    if (path === 'codes') {
      switch (req.method) {
        case 'GET': {
          try {
            const code = req.query.code as string | undefined;
            let codes;
            
            if (code) {
              const referralCode = await storage.getReferralCodeByCode(code);
              return referralCode 
                ? res.status(200).json(referralCode)
                : res.status(404).json({ error: 'Referral code not found' });
            }
            
            codes = await storage.getAllReferralCodes();
            return res.status(200).json(codes);
          } catch (err) {
            console.error("🔥 API /referral/codes GET failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        case 'POST': {
          try {
            const validatedData = referralCodeSchema.parse(req.body);
            const code = await storage.createReferralCode(validatedData);
            return res.status(201).json(code);
          } catch (err) {
            if (err instanceof z.ZodError) {
              return res.status(400).json({ error: 'Invalid referral code data', details: err.errors });
            }
            console.error("🔥 API /referral/codes POST failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
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
    }
    
    // Handle referral tracking
    if (path === 'tracking') {
      switch (req.method) {
        case 'GET': {
          try {
            const leadId = parseInt(req.query.leadId as string);
            const referralCodeId = parseInt(req.query.referralCodeId as string);
            
            if (!isNaN(leadId)) {
              const tracking = await storage.getReferralTrackingByLeadId(leadId);
              return tracking 
                ? res.status(200).json(tracking)
                : res.status(404).json({ error: 'Tracking not found' });
            }
            
            if (!isNaN(referralCodeId)) {
              const trackings = await storage.getReferralTrackingsByReferralCodeId(referralCodeId);
              return res.status(200).json(trackings);
            }
            
            return res.status(400).json({ error: 'Missing leadId or referralCodeId' });
          } catch (err) {
            console.error("🔥 API /referral/tracking GET failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        case 'POST': {
          try {
            const tracking = await storage.createReferralTracking(req.body);
            return res.status(201).json(tracking);
          } catch (err) {
            console.error("🔥 API /referral/tracking POST failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        case 'PATCH': {
          try {
            const id = parseInt(req.query.id as string);
            const isPaid = req.body.isPaid;
            
            if (isNaN(id)) {
              return res.status(400).json({ error: 'Invalid ID' });
            }
            
            const tracking = await storage.updateReferralTrackingPaymentStatus(id, isPaid);
            return tracking
              ? res.status(200).json(tracking)
              : res.status(404).json({ error: 'Tracking not found' });
          } catch (err) {
            console.error("🔥 API /referral/tracking PATCH failed:", err);
            return res.status(500).json({ error: 'Internal server error' });
          }
        }

        default:
          return res.status(405).json({ error: 'Method not allowed' });
      }
    }

    return res.status(404).json({ error: 'Invalid referral path' });
  } catch (error) {
    console.error('Referral Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 