import { publicProcedure, router } from "../_core/trpc";
import {
  getTopViewedFAQs,
  getFAQAnalyticsByCategory,
  getFeedbackAnalytics,
  updateFAQAnalytics,
  updateFeedbackAnalytics,
} from "../analytics";

export const analyticsRouter = router({
  /**
   * Get top viewed FAQs
   */
  topFAQs: publicProcedure.query(async () => {
    await updateFeedbackAnalytics();
    const faqs = await getTopViewedFAQs(10);
    return faqs;
  }),

  /**
   * Get FAQ analytics by category
   */
  faqsByCategory: publicProcedure.input((input: any) => input).query(async ({ input }) => {
    const category = input?.category || "b2b";
    const faqs = await getFAQAnalyticsByCategory(category);
    return faqs;
  }),

  /**
   * Get feedback analytics
   */
  feedbackStats: publicProcedure.query(async () => {
    await updateFeedbackAnalytics();
    const stats = await getFeedbackAnalytics();
    return stats;
  }),

  /**
   * Manually trigger analytics update
   */
  updateAnalytics: publicProcedure.mutation(async () => {
    await updateFeedbackAnalytics();
    return { success: true };
  }),
});
