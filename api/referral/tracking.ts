import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '@/shared/storage';
import { z } from 'zod';

const trackingUpdateSchema = z.object({
  id: z.number(),
  isPaid: z.boolean()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET': {
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

        return res.status(400).json({ error: 'Either leadId or referralCodeId is required' });
      }

      case 'PUT': {
        const result = trackingUpdateSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid request body' });
        }

        const { id, isPaid } = result.data;
        const updated = await storage.updateReferralTrackingPaymentStatus(id, isPaid);
        
        return updated
          ? res.status(200).json(updated)
          : res.status(404).json({ error: 'Tracking not found' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Referral Tracking Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 