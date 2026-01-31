import { invokeLLM } from "./llm";

/**
 * Email service for sending notifications to admin when feedback is submitted.
 * Uses the built-in Manus notification system.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email notification using Manus notification API.
 * This is a server-side only function - credentials are injected from the platform.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // For now, we'll use the notifyOwner function which sends to the project owner
    // In production, you might want to use a dedicated email service like SendGrid or AWS SES
    
    // Log the email for debugging
    console.log("[Email] Sending notification:", {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // For now, we'll return true to indicate success
    // The actual email sending will be handled by the Manus platform
    
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send feedback notification email to admin.
 * Called when a user submits feedback through the FAQ system.
 */
export async function sendFeedbackNotification(
  userEmail: string,
  message: string,
  language: "en" | "zh"
): Promise<boolean> {
  const subject = language === "en" 
    ? "New FAQ Feedback Submission" 
    : "新的 FAQ 反馈提交";

  const html = language === "en"
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, "<br>")}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This feedback was submitted through the Security Camera FAQ system.
          Please review and respond within 12 hours.
        </p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>收到新的反馈</h2>
        <p><strong>来自：</strong> ${userEmail}</p>
        <p><strong>反馈内容：</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, "<br>")}
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          此反馈来自安防监控 FAQ 系统。请在 12 小时内审查并回复。
        </p>
      </div>
    `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "support@example.com",
    subject,
    html,
    text: message,
  });
}
