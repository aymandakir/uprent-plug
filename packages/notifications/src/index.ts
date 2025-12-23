import { Resend } from "resend";
import { Twilio } from "twilio";
import TelegramBot from "node-telegram-bot-api";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import { supabaseAdmin } from "@rentfusion/database";
import type { Property } from "@rentfusion/database";

const resend = new Resend(process.env.RESEND_API_KEY);
const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", { polling: false });
const expo = new Expo();

export interface NotificationPayload {
  userId: string;
  propertyId: string;
  property: Property;
  matchScore: number;
  channels: Array<"email" | "push" | "sms" | "telegram">;
}

export interface NotificationResult {
  channel: string;
  success: boolean;
  messageId?: string;
  error?: string;
}

export class NotificationService {
  /**
   * Send notifications across requested channels with rate limiting and logging.
   */
  async sendPropertyAlert(payload: NotificationPayload): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, phone, metadata")
      .eq("id", payload.userId)
      .single();

    if (userError || !user) {
      console.error("User not found:", payload.userId);
      return [];
    }

    const shouldSend = await this.checkRateLimit(payload.userId);
    if (!shouldSend) {
      console.log(`[Notifications] Rate limited for user ${payload.userId}`);
      return [{ channel: "all", success: false, error: "Rate limited" }];
    }

    const promises = payload.channels.map(async (channel) => {
      try {
        switch (channel) {
          case "email":
            return await this.sendEmail(user.email, payload.property);
          case "push":
            return await this.sendPush(user.metadata?.pushToken, payload.property);
          case "sms":
            return await this.sendSMS(user.phone, payload.property);
          case "telegram":
            return await this.sendTelegram(user.metadata?.telegramChatId, payload.property);
          default:
            return { channel, success: false, error: "Unknown channel" };
        }
      } catch (error) {
        console.error(`[Notifications] ${channel} error:`, error);
        return { channel, success: false, error: String(error) };
      }
    });

    results.push(...(await Promise.all(promises)));
    await this.logNotifications(payload, results);

    return results;
  }

  private async sendEmail(email: string, property: Property): Promise<NotificationResult> {
    try {
      const { data, error } = await resend.emails.send({
        from: "RentFusion Alerts <alerts@rentfusion.nl>",
        to: email,
        subject: `🏠 New Property Alert: ${property.city} - €${property.price}`,
        html: this.generateEmailHTML(property)
      });

      if (error) throw error;

      return { channel: "email", success: true, messageId: data?.id };
    } catch (error) {
      return { channel: "email", success: false, error: String(error) };
    }
  }

  private async sendPush(pushToken: string | undefined, property: Property): Promise<NotificationResult> {
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      return { channel: "push", success: false, error: "Invalid push token" };
    }

    try {
      const message: ExpoPushMessage = {
        to: pushToken,
        sound: "default",
        title: "🏠 New Property Match!",
        body: `${property.title} in ${property.city} - €${property.price}/mo`,
        data: { propertyId: property.id, url: property.source_url },
        badge: 1,
        priority: "high"
      };

      const chunks = expo.chunkPushNotifications([message]);
      const tickets: ExpoPushTicket[] = [];
      for (const chunk of chunks) {
        const chunkTickets = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...chunkTickets);
      }

      const ticket = tickets[0];
      const ok = ticket ? ticket.status === "ok" : false;

      return {
        channel: "push",
        success: ok,
        messageId: ticket?.id
      };
    } catch (error) {
      return { channel: "push", success: false, error: String(error) };
    }
  }

  private async sendSMS(phone: string | null, property: Property): Promise<NotificationResult> {
    if (!phone) {
      return { channel: "sms", success: false, error: "No phone number" };
    }

    try {
      const message = await twilio.messages.create({
        body: `🏠 RentFusion Alert!\n${property.title}\n${property.city} - €${property.price}/mo\nView: ${property.source_url}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      return { channel: "sms", success: message.status !== "failed", messageId: message.sid };
    } catch (error) {
      return { channel: "sms", success: false, error: String(error) };
    }
  }

  private async sendTelegram(chatId: string | undefined, property: Property): Promise<NotificationResult> {
    if (!chatId) {
      return { channel: "telegram", success: false, error: "No Telegram chat ID" };
    }

    try {
      const parts: string[] = [
        "🏠 New Property Alert!",
        "",
        `📍 ${property.title}`,
        `🌆 ${property.city}${property.neighborhood ? ` - ${property.neighborhood}` : ""}`,
        `💰 €${Number(property.price).toLocaleString()}/month`,
        property.bedrooms ? `🛏 ${property.bedrooms} bedroom${property.bedrooms > 1 ? "s" : ""}` : "",
        property.square_meters ? `📐 ${property.square_meters} m²` : "",
        property.furnished ? "✅ Furnished" : "",
        property.pets_allowed ? "🐾 Pets allowed" : "",
        "",
        `🔗 View: ${property.source_url}`
      ].filter(Boolean);

      const text = parts.join("\n");
      const result = await telegram.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        disable_web_page_preview: false
      });

      return { channel: "telegram", success: !!result.message_id, messageId: String(result.message_id) };
    } catch (error) {
      return { channel: "telegram", success: false, error: String(error) };
    }
  }

  private generateEmailHTML(property: Property): string {
    const img = property.photos?.[0]
      ? `<img src="${property.photos[0]}" alt="${property.title}" class="property-image">`
      : "";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .property-image { width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
    .price { font-size: 32px; font-weight: bold; color: #111827; margin-bottom: 10px; }
    .title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 15px; }
    .location { color: #6B7280; font-size: 16px; margin-bottom: 20px; }
    .specs { display: flex; gap: 20px; margin-bottom: 20px; }
    .spec { color: #6B7280; font-size: 14px; }
    .tags { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 25px; }
    .tag { background-color: #DBEAFE; color: #1E40AF; padding: 6px 12px; border-radius: 20px; font-size: 12px; }
    .cta { display: inline-block; background-color: #FF6B6B; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px; }
    .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Property Match Found</h1>
    </div>
    <div class="content">
      ${img}
      <div class="price">€${Number(property.price).toLocaleString()}/month</div>
      <div class="title">${property.title}</div>
      <div class="location">📍 ${property.neighborhood || ""} ${property.city}</div>
      <div class="specs">
        ${property.bedrooms ? `<span class="spec">🛏 ${property.bedrooms} bed</span>` : ""}
        ${property.square_meters ? `<span class="spec">📐 ${property.square_meters} m²</span>` : ""}
      </div>
      <div class="tags">
        ${property.furnished ? '<span class="tag">Furnished</span>' : ""}
        ${property.pets_allowed ? '<span class="tag">Pets OK</span>' : ""}
        ${property.balcony ? '<span class="tag">Balcony</span>' : ""}
      </div>
      <a href="${property.source_url}" class="cta">View Property Details →</a>
    </div>
    <div class="footer">
      <p>You received this because it matches your search profile.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "#"}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .gte("sent_at", oneHourAgo);

    if (error) {
      console.error("Rate limit check error:", error);
      return true;
    }

    return (data?.length || 0) < 10;
  }

  private async logNotifications(payload: NotificationPayload, results: NotificationResult[]): Promise<void> {
    const notifications = results.map((result) => ({
      user_id: payload.userId,
      property_match_id: null,
      type: "new_match",
      channel: result.channel,
      subject: `New property in ${payload.property.city}`,
      body: payload.property.title,
      sent_at: new Date().toISOString(),
      delivered: result.success,
      metadata: {
        messageId: result.messageId,
        error: result.error
      }
    }));

    await supabaseAdmin.from("notifications").insert(notifications);
  }
}

export const notificationService = new NotificationService();
export { propertyMatcher, PropertyMatcher } from "./matcher";

