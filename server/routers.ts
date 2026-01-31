import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createFeedback, getAllFeedbacks } from "./db";
import { sendFeedbackNotification } from "./_core/email";
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

          // Send email notification to admin
          const emailSent = await sendFeedbackNotification(
            input.email,
            input.message,
            input.language
          );

          return {
            success: true,
            feedbackId: feedback.id,
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
});

export type AppRouter = typeof appRouter;
