import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  createFeedback, 
  getAllFeedbacks, 
  findMatchingTemplate, 
  logAutoReply,
  getAllAutoReplyTemplates,
  initializeDefaultTemplates
} from "./db";
import { sendFeedbackNotification } from "./_core/email";
import { sendAutoReplyEmail } from "./_core/auto-reply-email";
import {
  createNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getOrCreateNotificationPreferences,
  updateNotificationPreferences,
  getUnreadNotificationCount,
} from "./notifications";
import { z } from "zod";
import { analyticsRouter } from "./routers/analytics";
import { faqRouter } from "./routers/faq";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  feedback: router({
    submit: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
          message: z.string().min(10, "Message must be at least 10 characters").max(5000),
          language: z.enum(["en", "zh"]).default("en"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const feedback = await createFeedback({
            email: input.email,
            message: input.message,
            language: input.language,
            status: "pending",
          });

          if (!feedback) {
            throw new Error("Failed to save feedback");
          }

          // Create notification for feedback submission
          await createNotification({
            feedbackId: feedback.id,
            userEmail: input.email,
            type: "feedback_submitted",
            titleEn: "Feedback Received",
            titleZh: "反馈已收到",
            contentEn: "Thank you for submitting your feedback. We will review it and respond within 12 hours.",
            contentZh: "感谢您提交的反馈。我们将在 12 小时内审核并回复。",
            isRead: "false",
            emailSent: "false",
            language: input.language,
          });

          const matchingTemplate = await findMatchingTemplate(input.message);
          let autoReplyStatus = "no_match";

          if (matchingTemplate) {
            try {
              const emailSent = await sendAutoReplyEmail(
                input.email,
                matchingTemplate,
                input.language as "en" | "zh"
              );

              if (emailSent) {
                await logAutoReply({
                  feedbackId: feedback.id,
                  templateId: matchingTemplate.id,
                  userEmail: input.email,
                  category: matchingTemplate.category,
                  responseLanguage: input.language,
                  status: "sent",
                });
                
                // Create auto-reply notification
                await createNotification({
                  feedbackId: feedback.id,
                  userEmail: input.email,
                  type: "auto_reply_sent",
                  titleEn: "Auto-Reply Sent",
                  titleZh: "自动回复已发送",
                  contentEn: matchingTemplate.responseEn,
                  contentZh: matchingTemplate.responseZh,
                  isRead: "false",
                  emailSent: "true",
                  language: input.language,
                });
                
                autoReplyStatus = "sent";
              } else {
                await logAutoReply({
                  feedbackId: feedback.id,
                  templateId: matchingTemplate.id,
                  userEmail: input.email,
                  category: matchingTemplate.category,
                  responseLanguage: input.language,
                  status: "pending_review",
                });
                autoReplyStatus = "pending";
              }
            } catch (error) {
              console.error("[Feedback] Error sending auto-reply:", error);
              autoReplyStatus = "error";
            }
          }

          await sendFeedbackNotification(
            input.email,
            input.message,
            input.language as "en" | "zh"
          );

          return {
            success: true,
            feedbackId: feedback.id,
            autoReplyStatus,
            message: input.language === "en"
              ? "Thank you for your feedback! We will respond within 12 hours."
              : "感谢您的反馈！我们将在 12 小时内回复。",
          };
        } catch (error) {
          console.error("[Feedback] Error submitting feedback:", error);
          throw error;
        }
      }),

    list: publicProcedure.query(async () => {
      try {
        return await getAllFeedbacks();
      } catch (error) {
        console.error("[Feedback] Error fetching feedbacks:", error);
        return [];
      }
    }),
  }),

  autoReply: router({
    templates: publicProcedure.query(async () => {
      try {
        return await getAllAutoReplyTemplates();
      } catch (error) {
        console.error("[AutoReply] Error fetching templates:", error);
        return [];
      }
    }),

    initializeDefaults: publicProcedure.mutation(async () => {
      try {
        await initializeDefaultTemplates();
        return {
          success: true,
          message: "Default templates initialized successfully",
        };
      } catch (error) {
        console.error("[AutoReply] Error initializing templates:", error);
        throw error;
      }
    }),
  }),

  notifications: router({
    list: publicProcedure
      .input(z.object({ userEmail: z.string().email() }))
      .query(async ({ input }) => {
        try {
          return await getUserNotifications(input.userEmail);
        } catch (error) {
          console.error("[Notifications] Error fetching notifications:", error);
          return [];
        }
      }),

    unread: publicProcedure
      .input(z.object({ userEmail: z.string().email() }))
      .query(async ({ input }) => {
        try {
          return await getUnreadNotifications(input.userEmail);
        } catch (error) {
          console.error("[Notifications] Error fetching unread:", error);
          return [];
        }
      }),

    unreadCount: publicProcedure
      .input(z.object({ userEmail: z.string().email() }))
      .query(async ({ input }) => {
        try {
          return await getUnreadNotificationCount(input.userEmail);
        } catch (error) {
          console.error("[Notifications] Error fetching unread count:", error);
          return 0;
        }
      }),

    markAsRead: publicProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const success = await markNotificationAsRead(input.notificationId);
          return { success };
        } catch (error) {
          console.error("[Notifications] Error marking as read:", error);
          throw error;
        }
      }),

    markAllAsRead: publicProcedure
      .input(z.object({ userEmail: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          const success = await markAllNotificationsAsRead(input.userEmail);
          return { success };
        } catch (error) {
          console.error("[Notifications] Error marking all as read:", error);
          throw error;
        }
      }),

    delete: publicProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const success = await deleteNotification(input.notificationId);
          return { success };
        } catch (error) {
          console.error("[Notifications] Error deleting notification:", error);
          throw error;
        }
      }),

    preferences: publicProcedure
      .input(z.object({ userEmail: z.string().email() }))
      .query(async ({ input }) => {
        try {
          return await getOrCreateNotificationPreferences(input.userEmail);
        } catch (error) {
          console.error("[Notifications] Error fetching preferences:", error);
          return null;
        }
      }),

    updatePreferences: publicProcedure
      .input(
        z.object({
          userEmail: z.string().email(),
          emailNotifications: z.enum(["true", "false"]).optional(),
          feedbackSubmittedNotification: z.enum(["true", "false"]).optional(),
          statusUpdateNotification: z.enum(["true", "false"]).optional(),
          autoReplyNotification: z.enum(["true", "false"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { userEmail, ...updates } = input;
          const success = await updateNotificationPreferences(userEmail, updates);
          return { success };
        } catch (error) {
          console.error("[Notifications] Error updating preferences:", error);
          throw error;
        }
      }),
  }),

  analytics: analyticsRouter,
  faq: faqRouter,
});

export type AppRouter = typeof appRouter;
