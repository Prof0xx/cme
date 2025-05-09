import { Lead } from './schema';

interface TelegramNotificationOptions extends Lead {
  customMessage?: string;
}

export async function sendTelegramNotification(options: TelegramNotificationOptions): Promise<boolean> {
  const { customMessage } = options;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram configuration missing');
    return false;
  }

  try {
    const message = customMessage || formatDefaultMessage(options);
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

function formatDefaultMessage(lead: Lead): string {
  const { telegram, selectedServices, totalValue, message, referralCode } = lead;
  
  const servicesText = selectedServices.length > 0
    ? selectedServices.map(s => `- ${s.name} (${s.price})`).join('\n')
    : 'No services selected';

  return `🎯 New Lead!\n\nTelegram: ${telegram}\n\nServices:\n${servicesText}\n\nTotal Value: ${totalValue}${message ? `\n\nMessage:\n${message}` : ''}${referralCode ? `\n\nReferral Code: ${referralCode}` : ''}`;
} 