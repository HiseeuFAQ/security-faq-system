import { sendEmail } from "./email";
import type { AutoReplyTemplate } from "../../drizzle/schema";

/**
 * Send auto-reply email to user based on their feedback language.
 */
export async function sendAutoReplyEmail(
  userEmail: string,
  template: AutoReplyTemplate,
  language: "en" | "zh"
): Promise<boolean> {
  try {
    const isEnglish = language === "en";
    const subject = isEnglish ? template.titleEn : template.titleZh;
    const responseText = isEnglish ? template.responseEn : template.responseZh;

    const html = isEnglish
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">${subject}</h2>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
            <p style="margin-top: 0;">Hello,</p>
            
            <p style="white-space: pre-wrap; line-height: 1.6;">
              ${responseText}
            </p>
            
            <p style="margin-bottom: 0;">
              Best regards,<br>
              Security Camera Support Team
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">
              This is an automated response. If you have additional questions, our team will respond within 12 hours.
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">${subject}</h2>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
            <p style="margin-top: 0;">您好，</p>
            
            <p style="white-space: pre-wrap; line-height: 1.6;">
              ${responseText}
            </p>
            
            <p style="margin-bottom: 0;">
              此致<br>
              安防监控支持团队
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">
              这是一条自动回复。如果您有其他问题，我们的团队将在 12 小时内回复。
            </p>
          </div>
        </div>
      `;

    return sendEmail({
      to: userEmail,
      subject,
      html,
      text: responseText,
    });
  } catch (error) {
    console.error("[AutoReplyEmail] Failed to send auto-reply email:", error);
    return false;
  }
}
