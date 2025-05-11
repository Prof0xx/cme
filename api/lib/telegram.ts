import type { Lead } from './schema.js';

interface TelegramNotificationOptions extends Omit<Lead, 'selectedServices'> {
  customMessage?: string;
  selectedServices: string | any[];
  referralCodeDetails?: {
    discountPercent: number;
    commissionPercent: number;
    creatorTelegram: string;
  };
}

interface Service {
  name: string;
  price: string | number;
}

function formatDefaultMessage(lead: TelegramNotificationOptions): string {
  console.log('🔍 Formatting message with lead data:', {
    telegram: lead.telegram,
    totalValue: lead.totalValue,
    referralCode: lead.referralCode,
    discountApplied: lead.discountApplied,
    referralCodeDetails: lead.referralCodeDetails,
    hasMessage: Boolean(lead.message)
  });
  
  const { telegram, selectedServices, totalValue, referralCode, discountApplied, referralCodeDetails } = lead;
  
  // Parse selected services if they're stored as a string
  let services = [];
  try {
    services = typeof selectedServices === 'string' 
      ? JSON.parse(selectedServices)
      : selectedServices;
    console.log('📦 Parsed services:', services);
  } catch (e) {
    console.error('❌ Error parsing services:', e);
    services = [];
  }

  // Format services list
  const servicesList = Array.isArray(services) && services.length > 0
    ? services.map(service => `• ${service.category} / ${service.name}: ${typeof service.price === 'number' ? `$${service.price}` : service.price}`).join('\n')
    : 'No services selected';

  // Build the message
  let message = `🚀 New Lead!\n\n`;
  message += `Telegram: ${telegram}\n`;
  
  // Add referral and discount info if present
  if (referralCode && referralCodeDetails) {
    console.log('📋 Adding referral details:', {
      code: referralCode,
      details: referralCodeDetails,
      discountApplied
    });
    
    message += `📋 Referral Details:\n`;
    message += `Code Used: ${referralCode}\n`;
    message += `Referred By: ${referralCodeDetails.creatorTelegram}\n`;
    
    if (typeof discountApplied === 'number' && discountApplied > 0) {
      // Use the exact discount amount that was calculated in the client
      // rather than recalculating it from the total
      const finalTotal = totalValue - discountApplied;
      const commissionAmount = Math.round((finalTotal * referralCodeDetails.commissionPercent) / 100);
      
      console.log('💰 Calculated amounts:', {
        finalTotal,
        discountApplied,
        discountPercent: referralCodeDetails.discountPercent,
        commissionAmount,
        commissionPercent: referralCodeDetails.commissionPercent
      });
      
      message += `Total Value: $${totalValue}\n`;
      message += `Discount: $${discountApplied} (${referralCodeDetails.discountPercent}%)\n`;
      message += `Final Total: $${finalTotal}\n`;
      message += `Commission: $${commissionAmount} (${referralCodeDetails.commissionPercent}%)\n`;
    } else {
      message += `Total Value: $${totalValue}\n`;
      console.log('⚠️ No discount applied');
    }
  } else {
    message += `Total Value: $${totalValue}\n`;
    console.log('ℹ️ No referral code or details present');
  }
  
  message += `\n📦 Selected Services:\n${servicesList}`;
  
  if (lead.message) {
    message += `\n\n💬 Message:\n${lead.message}`;
  }

  console.log('📤 Final formatted message:', message);
  return message;
}

export async function sendTelegramNotification(options: TelegramNotificationOptions): Promise<boolean> {
  console.log('🔔 sendTelegramNotification called with options:', {
    telegram: options.telegram,
    hasCustomMessage: Boolean(options.customMessage),
    hasReferralDetails: Boolean(options.referralCodeDetails)
  });

  const { customMessage } = options;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Telegram configuration missing');
    return false;
  }

  try {
    const message = customMessage || formatDefaultMessage(options);
    console.log('📤 Sending Telegram message:', message);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Telegram notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
    return false;
  }
}

export async function sendDirectTelegramMessage(telegramHandle: string, message: string): Promise<boolean> {
  console.log(`🔔 Sending direct Telegram message to ${telegramHandle}`);
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Telegram configuration missing');
    return false;
  }

  try {
    console.log('📤 Sending direct Telegram message:', message);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId, // Using admin chatId since we can't message users directly without them starting a conversation
        text: `Message for ${telegramHandle}:\n\n${message}`,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Direct Telegram message sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending direct Telegram message:', error);
    return false;
  }
}