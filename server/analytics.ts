import { eq, and, gte, desc } from "drizzle-orm";
import { getDb } from "./db";
import { faqViews, faqAnalytics, feedbackAnalytics, feedbacks, autoReplyLogs } from "../drizzle/schema";

/**
 * Track a FAQ view
 */
export async function trackFAQView(
  faqId: string,
  faqQuestionEn: string,
  faqQuestionZh: string,
  category: string,
  subcategory: string,
  userEmail?: string,
  language: string = "en"
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot track FAQ view: database not available");
    return;
  }

  try {
    await db.insert(faqViews).values({
      faqId,
      faqQuestionEn,
      faqQuestionZh,
      category,
      subcategory,
      userEmail,
      language,
    });
  } catch (error) {
    console.error("[Analytics] Failed to track FAQ view:", error);
  }
}

/**
 * Get top viewed FAQs
 */
export async function getTopViewedFAQs(limit_count: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot get top viewed FAQs: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        faqId: faqAnalytics.faqId,
        faqQuestionEn: faqAnalytics.faqQuestionEn,
        faqQuestionZh: faqAnalytics.faqQuestionZh,
        category: faqAnalytics.category,
        subcategory: faqAnalytics.subcategory,
        totalViews: faqAnalytics.totalViews,
        viewsToday: faqAnalytics.viewsToday,
        viewsThisWeek: faqAnalytics.viewsThisWeek,
        viewsThisMonth: faqAnalytics.viewsThisMonth,
        lastViewedAt: faqAnalytics.lastViewedAt,
      })
      .from(faqAnalytics)
      .orderBy(desc(faqAnalytics.totalViews))
      .limit(limit_count);

    return result;
  } catch (error) {
    console.error("[Analytics] Failed to get top viewed FAQs:", error);
    return [];
  }
}

/**
 * Get FAQ analytics by category
 */
export async function getFAQAnalyticsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot get FAQ analytics: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(faqAnalytics)
      .where(eq(faqAnalytics.category, category))
      .orderBy(desc(faqAnalytics.totalViews));

    return result;
  } catch (error) {
    console.error("[Analytics] Failed to get FAQ analytics by category:", error);
    return [];
  }
}

/**
 * Get feedback analytics
 */
export async function getFeedbackAnalytics() {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot get feedback analytics: database not available");
    return null;
  }

  try {
    const result = await db.select().from(feedbackAnalytics).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Analytics] Failed to get feedback analytics:", error);
    return null;
  }
}

/**
 * Update FAQ analytics (called periodically)
 */
export async function updateFAQAnalytics(faqId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot update FAQ analytics: database not available");
    return;
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get view counts for different time periods
    const allViews = await db
      .select()
      .from(faqViews)
      .where(eq(faqViews.faqId, faqId));

    const viewsToday = allViews.filter((v) => v.viewedAt >= today).length;
    const viewsThisWeek = allViews.filter((v) => v.viewedAt >= weekAgo).length;
    const viewsThisMonth = allViews.filter((v) => v.viewedAt >= monthAgo).length;

    if (allViews.length === 0) return;

    const faqData = allViews[0];
    const lastViewedAt = new Date(Math.max(...allViews.map((v) => v.viewedAt.getTime())));

    // Update or insert analytics
    const existing = await db
      .select()
      .from(faqAnalytics)
      .where(eq(faqAnalytics.faqId, faqId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(faqAnalytics)
        .set({
          totalViews: allViews.length,
          viewsToday,
          viewsThisWeek,
          viewsThisMonth,
          lastViewedAt,
        })
        .where(eq(faqAnalytics.faqId, faqId));
    } else {
      await db.insert(faqAnalytics).values({
        faqId,
        faqQuestionEn: faqData.faqQuestionEn || "",
        faqQuestionZh: faqData.faqQuestionZh || "",
        category: faqData.category,
        subcategory: faqData.subcategory,
        totalViews: allViews.length,
        viewsToday,
        viewsThisWeek,
        viewsThisMonth,
        lastViewedAt,
      });
    }
  } catch (error) {
    console.error("[Analytics] Failed to update FAQ analytics:", error);
  }
}

/**
 * Update feedback analytics (called periodically)
 */
export async function updateFeedbackAnalytics() {
  const db = await getDb();
  if (!db) {
    console.warn("[Analytics] Cannot update feedback analytics: database not available");
    return;
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get feedback counts
    const allFeedbacks = await db.select().from(feedbacks);
    const feedbacksToday = allFeedbacks.filter((f) => f.createdAt >= today).length;
    const feedbacksThisWeek = allFeedbacks.filter((f) => f.createdAt >= weekAgo).length;
    const feedbacksThisMonth = allFeedbacks.filter((f) => f.createdAt >= monthAgo).length;
    const pendingFeedbacks = allFeedbacks.filter((f) => f.status === "pending").length;
    const resolvedFeedbacks = allFeedbacks.filter((f) => f.status === "resolved").length;

    // Get auto-reply stats
    const autoReplies = await db.select().from(autoReplyLogs);
    const successfulReplies = autoReplies.filter((r) => r.status === "sent").length;
    const autoReplySuccessRate =
      autoReplies.length > 0 ? Math.round((successfulReplies / autoReplies.length) * 100) : 0;

    // Calculate average response time (simplified)
    const averageResponseTime = 12; // hours

    // Update or insert analytics
    const existing = await db.select().from(feedbackAnalytics).limit(1);

    if (existing.length > 0) {
      await db
        .update(feedbackAnalytics)
        .set({
          totalFeedbacks: allFeedbacks.length,
          feedbacksToday,
          feedbacksThisWeek,
          feedbacksThisMonth,
          pendingFeedbacks,
          resolvedFeedbacks,
          autoReplySuccessRate,
          averageResponseTime,
        })
        .where(eq(feedbackAnalytics.id, existing[0].id));
    } else {
      await db.insert(feedbackAnalytics).values({
        totalFeedbacks: allFeedbacks.length,
        feedbacksToday,
        feedbacksThisWeek,
        feedbacksThisMonth,
        pendingFeedbacks,
        resolvedFeedbacks,
        autoReplySuccessRate,
        averageResponseTime,
      });
    }
  } catch (error) {
    console.error("[Analytics] Failed to update feedback analytics:", error);
  }
}
