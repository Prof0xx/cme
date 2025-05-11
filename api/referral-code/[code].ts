import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../lib/storage.js';
import { handleCors } from '../middleware.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle CORS
    if (handleCors(req, res)) return;

    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the code from the URL parameter
    const code = req.query.code as string;
    
    if (!code) {
      return res.status(400).json({ 
        valid: false,
        message: "No referral code provided" 
      });
    }

    console.log(`🔍 Validating referral code: ${code}`);
    const referralCode = await storage.getReferralCodeByCode(code);
    
    if (!referralCode) {
      console.log(`❌ Referral code not found: ${code}`);
      return res.status(200).json({ 
        valid: false,
        message: "Invalid referral code"
      });
    }

    if (!referralCode.isActive) {
      console.log(`⚠️ Referral code is inactive: ${code}`);
      return res.status(200).json({ 
        valid: false,
        message: "Referral code is inactive"
      });
    }

    console.log(`✅ Valid referral code: ${code}, discount: ${referralCode.discountPercent}%`);
    return res.status(200).json({
      valid: true,
      discount: referralCode.discountPercent,
      message: `Referral code valid! You'll receive ${referralCode.discountPercent}% discount.`
    });
  } catch (error) {
    console.error('Referral code validation error:', error);
    return res.status(500).json({ 
      valid: false,
      message: "Error validating referral code" 
    });
  }
} 