import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { setCorsHeaders } from '../_middleware';
import { sendTelegramNotification } from '../_lib/telegram';
import { storage } from '../_lib/storage';

const serviceRequestSchema = z.object({
  telegramHandle: z.string()
    .min(2, { message: "Telegram handle is required" })
    .startsWith('@', { message: "Telegram handle must start with @" }),
  description: z.string().min(1, "Description is required"),
  referralCode: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check environment variables first
    console.log('SERVICE REQUEST - Checking environment variables...');
    console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
    console.log('TELEGRAM_CHAT_ID exists:', !!process.env.TELEGRAM_CHAT_ID);
    console.log('TELEGRAM_CHAT_ID value:', process.env.TELEGRAM_CHAT_ID);

    // Add CORS headers
    setCorsHeaders(res);

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Received service request body:', req.body);

    const result = serviceRequestSchema.safeParse(req.body);
    if (!result.success) {
      console.error('Service request validation failed:', result.error);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    console.log('Validated service request data:', result.data);

    const { telegramHandle, description, referralCode } = result.data;

    // Create a lead for the service request
    const lead = await storage.createLead({
      telegram: telegramHandle,
      message: description,
      referralCode: referralCode || null,
      selectedServices: [],
      totalValue: 0,
      createdAt: new Date().toISOString(),
      discountApplied: 0
    });

    console.log('Created service request lead:', lead);

    // If there's a referral code, create tracking
    if (referralCode) {
      const referralCodeData = await storage.getReferralCodeByCode(referralCode);
      if (referralCodeData) {
        await storage.createReferralTracking({
          leadId: lead.id,
          referralCodeId: referralCodeData.id,
          isPaid: false
        });
      }
    }

    // Format custom message for service request
    const customMessage = `🎯 New Service Request!\n\nTelegram: ${telegramHandle}\n\nDescription:\n${description}${referralCode ? `\n\nReferral Code: ${referralCode}` : ''}`;

    console.log('Sending telegram notification with message:', customMessage);

    try {
      // Send telegram notification with timeout
      const notificationResult = await Promise.race([
        sendTelegramNotification({
          ...lead,
          customMessage
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Telegram notification timeout')), 10000)
        )
      ]);
      console.log('SERVICE REQUEST - Telegram notification result:', notificationResult);
    } catch (telegramError) {
      console.error('SERVICE REQUEST - Failed to send Telegram notification:', telegramError);
    }

    return res.status(201).json({ 
      message: 'Service request received',
      data: lead
    });
  } catch (error) {
    console.error('Service Request Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 