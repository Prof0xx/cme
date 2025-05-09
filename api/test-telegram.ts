import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendTelegramNotification } from '../server/telegram';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('TEST - Checking environment variables...');
    console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
    console.log('TELEGRAM_CHAT_ID exists:', !!process.env.TELEGRAM_CHAT_ID);
    console.log('TELEGRAM_CHAT_ID value:', process.env.TELEGRAM_CHAT_ID);

    const customMessage = '🧪 Test message from API endpoint\n\nThis is a test of the Telegram notification system.';

    const result = await sendTelegramNotification({
      id: 0,
      telegram: '@test',
      selectedServices: [],
      totalValue: 0,
      message: 'test',
      createdAt: new Date().toISOString(),
      referralCode: null,
      discountApplied: 0,
      customMessage
    });

    console.log('Test notification result:', result);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Test Error:', error);
    return res.status(500).json({ error: 'Failed to send test message' });
  }
} 