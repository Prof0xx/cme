import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../shared/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const referralCode = req.query.referralCode as string | undefined;
    
    if (referralCode) {
      const leads = await storage.getLeadsByReferralCode(referralCode);
      return res.status(200).json(leads);
    }

    const leads = await storage.getAllLeads();
    return res.status(200).json(leads);
  } catch (error) {
    console.error('Leads Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 