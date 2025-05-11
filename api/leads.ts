import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from './lib/storage.js';
import { handleCors } from './middleware.js';
import { z } from 'zod';
import { sendTelegramNotification, sendDirectTelegramMessage } from './lib/telegram.js';

const leadSchema = z.object({
  telegram: z.string().startsWith('@'),
  message: z.string().optional(),
  referralCode: z.string().optional(),
  selectedServices: z.array(z.object({
    category: z.string(),
    name: z.string(),
    price: z.union([z.string(), z.number()])
  })),
  totalValue: z.number(),
  discountApplied: z.number().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fix: Parse JSON body if not already parsed (for Vercel/Express compatibility)
    if (
      req.method === 'POST' &&
      req.headers['content-type'] &&
      req.headers['content-type'].includes('application/json') &&
      typeof req.body === 'string'
    ) {
      try {
        req.body = JSON.parse(req.body);
        console.log('✅ Parsed req.body as JSON:', req.body);
      } catch (e) {
        console.error('❌ Failed to parse req.body as JSON:', e);
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

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
          // Log the raw request body directly from req
          console.log('🛑 RAW REQUEST BODY:', JSON.stringify(req.body));
          
          // 1. Log incoming request
          console.log('🔍 Incoming lead request:', {
            body: req.body,
            referralCode: req.body.referralCode,
            discountApplied: req.body.discountApplied
          });
          
          // 2. Validate data
          const validatedData = leadSchema.parse(req.body);
          console.log('✅ Validated data:', validatedData);
          
          let referralCodeData = null;
          
          // 3. Handle referral code - get directly from request body as fallback
          const referralCode = validatedData.referralCode || req.body.referralCode;
          console.log('📋 Extracted referral code:', referralCode);
          
          if (referralCode) {
            try {
              console.log('🔍 Fetching referral code:', referralCode);
              referralCodeData = await storage.getReferralCodeByCode(referralCode);
              console.log('📋 Referral code data:', referralCodeData);
              
              if (!referralCodeData) {
                console.log('❌ Invalid referral code');
                return res.status(400).json({ error: 'Invalid referral code' });
              }

              if (!referralCodeData.isActive) {
                console.log('❌ Referral code is inactive');
                return res.status(400).json({ error: 'Referral code is inactive' });
              }
            } catch (error) {
              console.error('❌ Error fetching referral code:', error);
              return res.status(500).json({ error: 'Error processing referral code' });
            }
          }
          
          // 4. Create lead - explicitly include referral code
          console.log('📝 Creating lead with data:', {
            ...validatedData,
            referralCode: referralCode || null,
            discountApplied: validatedData.discountApplied || 0
          });
          
          const lead = await storage.createLead({
            ...validatedData,
            referralCode: referralCode || null,
            selectedServices: JSON.stringify(validatedData.selectedServices),
            createdAt: new Date().toISOString()
          });
          
          console.log('✅ Lead created:', lead);
          
          // 5. Handle referral tracking and notification
          if (referralCodeData) {
            try {
              const finalTotal = validatedData.totalValue - (validatedData.discountApplied || 0);
              const commissionAmount = Math.round((finalTotal * (referralCodeData.commissionPercent || 10)) / 100);
              
              console.log('💰 Referral calculations:', {
                finalTotal,
                commissionAmount,
                commissionPercent: referralCodeData.commissionPercent
              });
              
              // Create tracking record
              const tracking = await storage.createReferralTracking({
                leadId: lead.id,
                referralCodeId: referralCodeData.id,
                commissionAmount,
                isPaid: false
              });
              
              console.log('✅ Referral tracking created:', tracking);
              
              // Notify referrer
              if (referralCodeData.creatorTelegram) {
                const referrerMessage = `🎉 New Lead with Your Code!\n\n` +
                  `Code Used: ${referralCodeData.code}\n` +
                  `Lead Value: $${validatedData.totalValue}\n` +
                  `Final Total: $${finalTotal}\n` +
                  `Commission: $${commissionAmount} (${referralCodeData.commissionPercent}%)\n\n` +
                  `The lead will be contacted soon.`;
                
                console.log('📨 Sending referrer notification:', {
                  to: referralCodeData.creatorTelegram,
                  message: referrerMessage
                });
                
                try {
                  await sendDirectTelegramMessage(
                    referralCodeData.creatorTelegram,
                    referrerMessage
                  );
                  console.log('✅ Referrer notification sent');
                } catch (error) {
                  console.error('❌ Failed to send referrer notification:', error);
                }
              }
            } catch (error) {
              console.error('❌ Error handling referral:', error);
            }
          }
          
          // 6. Send admin notification
          try {
            console.log('🔔 Preparing admin notification with data:', {
              lead,
              referralCode: referralCodeData?.code ?? null,
              discountApplied: validatedData.discountApplied ?? 0,
              referralDetails: referralCodeData ? {
                discountPercent: referralCodeData.discountPercent,
                commissionPercent: referralCodeData.commissionPercent,
                creatorTelegram: referralCodeData.creatorTelegram
              } : null
            });
            
            await sendTelegramNotification({
              ...lead,
              referralCode: referralCodeData?.code ?? null,
              discountApplied: validatedData.discountApplied ?? 0,
              referralCodeDetails: referralCodeData ? {
                discountPercent: referralCodeData.discountPercent ?? 0,
                commissionPercent: referralCodeData.commissionPercent ?? 0,
                creatorTelegram: referralCodeData.creatorTelegram ?? ''
              } : undefined
            });
            console.log('✅ Admin notification sent');
          } catch (telegramError) {
            console.error('❌ Failed to send admin notification:', telegramError);
          }
          
          // 7. Send response
          return res.status(201).json({
            ...lead,
            referralDetails: referralCodeData ? {
              code: referralCodeData.code,
              discountPercent: referralCodeData.discountPercent,
              commissionPercent: referralCodeData.commissionPercent
            } : null
          });
        } catch (err) {
          if (err instanceof z.ZodError) {
            console.error('❌ Validation error:', JSON.stringify(err.errors, null, 2));
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