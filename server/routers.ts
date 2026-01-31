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
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
    /**
     * Submit feedback from FAQ system.
     * Public endpoint - no authentication required.
     * Automatically processes with auto-reply if matching template exists.
     */
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
          // Save feedback to database
          const feedback = await createFeedback({
            email: input.email,
            message: input.message,
            language: input.language,
            status: "pending",
          });

          if (!feedback) {
            throw new Error("Failed to save feedback");
          }

          // Try to find matching auto-reply template
          const matchingTemplate = await findMatchingTemplate(input.message);
          let autoReplyStatus = "no_match";

          if (matchingTemplate) {
            try {
              // Send auto-reply email to user
              const emailSent = await sendAutoReplyEmail(
                input.email,
                matchingTemplate,
                input.language as "en" | "zh"
              );

              if (emailSent) {
                // Log the auto-reply action
                await logAutoReply({
                  feedbackId: feedback.id,
                  templateId: matchingTemplate.id,
                  userEmail: input.email,
                  category: matchingTemplate.category,
                  responseLanguage: input.language,
                  status: "sent",
                });
                autoReplyStatus = "sent";
              } else {
                // Log as pending review if email failed
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

          // Send admin notification
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

    /**
     * Get all feedbacks (for admin review).
     */
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
    /**
     * Get all auto-reply templates.
     */
    templates: publicProcedure.query(async () => {
      try {
        return await getAllAutoReplyTemplates();
      } catch (error) {
        console.error("[AutoReply] Error fetching templates:", error);
        return [];
      }
    }),

    /**
     * Initialize default auto-reply templates.
     * Should be called once during setup.
     */
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
});

export type AppRouter = typeof appRouter;
