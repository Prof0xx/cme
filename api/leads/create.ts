import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { sendTelegramNotification } from '../../server/telegram';
import { z } from 'zod';

const serviceSchema = z.object({
  category: z.string(),
  name: z.string(),
  price: z.union([z.number(), z.string()]),
});

const leadSchema = z.object({
  telegram: z.string().startsWith('@'),
  message: z.string().optional(),
  referralCode: z.string().optional(),
  discountApplied: z.number().optional(),
  selectedServices: z.array(serviceSchema),
  totalValue: z.number()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check environment variables first
    console.log('Checking environment variables...');
    console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
    console.log('TELEGRAM_CHAT_ID exists:', !!process.env.TELEGRAM_CHAT_ID);
    console.log('TELEGRAM_CHAT_ID value:', process.env.TELEGRAM_CHAT_ID);

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Missing required environment variables for Telegram notifications');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Received lead request body:', JSON.stringify(req.body, null, 2));

    const result = leadSchema.safeParse(req.body);
    if (!result.success) {
      console.error('Lead validation failed:', result.error.errors);
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    console.log('Validated lead data:', JSON.stringify(result.data, null, 2));
    console.log('Selected services:', JSON.stringify(result.data.selectedServices, null, 2));

    const lead = await storage.createLead({
      ...result.data,
      createdAt: new Date().toISOString()
    });
    
    console.log('Created lead:', JSON.stringify(lead, null, 2));

    // If there's a referral code, create tracking
    if (lead.referralCode) {
      const referralCode = await storage.getReferralCodeByCode(lead.referralCode);
      if (referralCode) {
        await storage.createReferralTracking({
          leadId: lead.id,
          referralCodeId: referralCode.id,
          isPaid: false
        });
      }
    }

    try {
      // Format services text with error handling
      const servicesText = result.data.selectedServices
        .map(service => {
          try {
            return `• ${service.category} / ${service.name}: ${typeof service.price === 'number' ? `$${service.price}` : service.price}`;
          } catch (err) {
            console.error('Error formatting service:', service, err);
            return `• Error formatting service`;
          }
        })
        .join('\n');

      console.log('Formatted services text:', servicesText);

      // Format custom message for lead
      const customMessage = `🚀 New Lead Alert!\n\nTelegram: ${result.data.telegram}\nTotal Value: $${result.data.totalValue}${result.data.referralCode ? `\nReferral Code: ${result.data.referralCode}` : ''}\n\nSelected Services:\n${servicesText}\n\nMessage:\n${result.data.message || 'No message provided'}`;

      console.log('About to send telegram notification with message:', customMessage);

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
      console.log('Telegram notification result:', notificationResult);
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
      // Log the full error stack
      if (telegramError instanceof Error) {
        console.error('Error stack:', telegramError.stack);
      }
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    return res.status(201).json(lead);
  } catch (error) {
    console.error('Create Lead Error:', error);
    // Log the full error stack
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
} 