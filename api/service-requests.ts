import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { setCorsHeaders } from './middleware.js';
import { sendTelegramNotification } from './lib/telegram.js';
import { storage } from './lib/storage.js';

const serviceRequestSchema = z.object({
  telegram: z.string()
    .min(2, { message: "Telegram handle is required" })
    .refine(val => val.startsWith('@'), {
      message: "Telegram handle must start with @",
      path: ['telegram']
    })
    .optional(),
  telegramHandle: z.string()
    .min(2, { message: "Telegram handle is required" })
    .refine(val => val.startsWith('@'), {
      message: "Telegram handle must start with @",
      path: ['telegramHandle']
    })
    .optional(),
  requestedService: z.string().min(1, "Description is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  referralCode: z.string().optional()
}).refine(
  data => data.telegram || data.telegramHandle, 
  { message: "Either telegram or telegramHandle must be provided" }
).refine(
  data => data.requestedService || data.description,
  { message: "Either requestedService or description must be provided" }
);

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

    // Parse request body if needed
    const body = req.body;
    console.log('Received service request body:', JSON.stringify(body, null, 2));
    console.log('Request body type:', typeof body);
    console.log('Request body telegram:', body?.telegram);
    console.log('Request body requestedService:', body?.requestedService);

    const result = serviceRequestSchema.safeParse(body);
    if (!result.success) {
      console.error('Service request validation failed:', JSON.stringify(result.error, null, 2));
      const errorMessage = result.error.errors[0]?.message || 'Invalid request body';
      return res.status(400).json({ message: errorMessage });
    }

    console.log('Validated service request data:', result.data);

    // Extract data with fallbacks between field names
    const telegramHandle = result.data.telegramHandle || result.data.telegram || '';
    const description = result.data.description || result.data.requestedService || '';
    const { referralCode } = result.data;

    // Create a lead for the service request
    const lead = await storage.createLead({
      telegram: telegramHandle,
      message: description,
      referralCode: referralCode && referralCode.trim() !== '' ? referralCode : null,
      selectedServices: [],
      totalValue: 0,
      createdAt: new Date().toISOString(),
      discountApplied: 0
    });

    console.log('Created service request lead:', lead);

    // If there's a referral code, create tracking
    if (referralCode && referralCode.trim() !== '') {
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