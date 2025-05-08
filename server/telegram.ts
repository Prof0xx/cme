import axios from 'axios';
import { Lead } from '@shared/schema';

/**
 * Extended Lead type to include custom message
 */
interface LeadWithCustomMessage extends Lead {
  customMessage?: string;
}

/**
 * Send a notification to Telegram when a new lead is created
 * @param lead The lead information to send
 * @returns Promise resolving to success or error message
 */
export async function sendTelegramNotification(lead: LeadWithCustomMessage): Promise<{ success: boolean; message: string }> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    // If the environment variables aren't set, skip sending notification
    if (!botToken || !chatId) {
      console.log('Telegram notification skipped: Bot token or chat ID not provided');
      return { success: false, message: 'Bot token or chat ID not configured' };
    }

    // Use custom message if provided, otherwise generate the default message
    let message: string;
    
    if (lead.customMessage) {
      message = lead.customMessage;
    } else {
      // Parse the selected services if it's a string
      let parsedServices: any[] = [];
      if (typeof lead.selectedServices === 'string') {
        try {
          parsedServices = JSON.parse(lead.selectedServices as string);
        } catch (e) {
          console.error('Error parsing selected services:', e);
          parsedServices = [];
        }
      } else {
        parsedServices = lead.selectedServices as any[];
      }

      // Format the message with all the lead information
      const servicesText = parsedServices.length > 0
        ? parsedServices
            .map((service: any) => `• ${service.category} / ${service.name}: $${service.price}`)
            .join('\n')
        : 'No services selected';

      // Check if the lead has referral information
      const referralInfo = lead.referralCode 
        ? `\nReferral Code: ${lead.referralCode}\nDiscount Applied: $${lead.discountApplied || 0}`
        : '';

      message = `🚀 New Lead Alert! 🚀\n\nTelegram: ${lead.telegram}\nTotal Value: $${lead.totalValue}${referralInfo}\n\nSelected Services:\n${servicesText}\n\nMessage:\n${lead.message || 'No message provided'}`;
    }

    // Send the message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message
    });

    if (response.data.ok) {
      console.log('Telegram notification sent successfully');
      return { success: true, message: 'Notification sent successfully' };
    } else {
      console.error('Failed to send Telegram notification:', response.data);
      return { success: false, message: 'Failed to send notification' };
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send a direct message to a specified Telegram handle
 * @param telegramHandle The Telegram handle to send to (must include @)
 * @param messageText The message text to send
 * @returns Promise resolving to success or error message
 */
export async function sendDirectTelegramMessage(
  telegramHandle: string, 
  messageText: string
): Promise<{ success: boolean; message: string }> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // If the bot token isn't set, skip sending message
    if (!botToken) {
      console.log('Telegram message skipped: Bot token not provided');
      return { success: false, message: 'Bot token not configured' };
    }

    // Send the message to the specified Telegram handle
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(telegramUrl, {
      chat_id: telegramHandle,
      text: messageText
    });

    if (response.data.ok) {
      console.log(`Direct Telegram message sent successfully to ${telegramHandle}`);
      return { success: true, message: 'Message sent successfully' };
    } else {
      console.error(`Failed to send direct Telegram message to ${telegramHandle}:`, response.data);
      return { success: false, message: 'Failed to send message' };
    }
  } catch (error) {
    console.error(`Error sending direct Telegram message to ${telegramHandle}:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}