import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock analytics functions
vi.mock("./analytics", () => ({
  trackFAQView: vi.fn(async () => {}),
  getTopViewedFAQs: vi.fn(async () => [
    {
      faqId: "b2b-bulk-001",
      faqQuestionEn: "How do I get a bulk purchase quotation for my business?",
      faqQuestionZh: "我如何获得企业批量采购报价？",
      category: "b2b",
      subcategory: "b2b-bulk-purchase",
      totalViews: 150,
      viewsToday: 5,
      viewsThisWeek: 25,
      viewsThisMonth: 100,
      lastViewedAt: new Date(),
    },
    {
      faqId: "b2c-install-001",
      faqQuestionEn: "How do I install the security camera?",
      faqQuestionZh: "我如何安装安全摄像头？",
      category: "b2c",
      subcategory: "b2c-installation",
      totalViews: 120,
      viewsToday: 3,
      viewsThisWeek: 20,
      viewsThisMonth: 80,
      lastViewedAt: new Date(),
    },
  ]),
  getFAQAnalyticsByCategory: vi.fn(async () => [
    {
      faqId: "b2b-bulk-001",
      faqQuestionEn: "How do I get a bulk purchase quotation for my business?",
      faqQuestionZh: "我如何获得企业批量采购报价？",
      category: "b2b",
      subcategory: "b2b-bulk-purchase",
      totalViews: 150,
      viewsToday: 5,
      viewsThisWeek: 25,
      viewsThisMonth: 100,
      lastViewedAt: new Date(),
    },
  ]),
  getFeedbackAnalytics: vi.fn(async () => ({
    id: 1,
    totalFeedbacks: 45,
    feedbacksToday: 2,
    feedbacksThisWeek: 10,
    feedbacksThisMonth: 40,
    pendingFeedbacks: 5,
    resolvedFeedbacks: 40,
    autoReplySuccessRate: 85,
    averageResponseTime: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateFAQAnalytics: vi.fn(async () => {}),
  updateFeedbackAnalytics: vi.fn(async () => {}),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Analytics API", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("analytics.topFAQs", () => {
    it("should retrieve top viewed FAQs", async () => {
      const faqs = await caller.analytics.topFAQs();

      expect(Array.isArray(faqs)).toBe(true);
      expect(faqs.length).toBeGreaterThan(0);
      expect(faqs[0]).toHaveProperty("faqId");
      expect(faqs[0]).toHaveProperty("totalViews");
      expect(faqs[0]).toHaveProperty("faqQuestionEn");
    });

    it("should return FAQs sorted by total views", async () => {
      const faqs = await caller.analytics.topFAQs();

      if (faqs.length > 1) {
        expect(faqs[0].totalViews).toBeGreaterThanOrEqual(faqs[1].totalViews);
      }
    });
  });

  describe("analytics.faqsByCategory", () => {
    it("should retrieve FAQs for a specific category", async () => {
      const faqs = await caller.analytics.faqsByCategory({ category: "b2b" });

      expect(Array.isArray(faqs)).toBe(true);
      faqs.forEach((faq) => {
        expect(faq.category).toBe("b2b");
      });
    });
  });

  describe("analytics.feedbackStats", () => {
    it("should retrieve feedback statistics", async () => {
      const stats = await caller.analytics.feedbackStats();

      expect(stats).not.toBeNull();
      expect(stats).toHaveProperty("totalFeedbacks");
      expect(stats).toHaveProperty("feedbacksToday");
      expect(stats).toHaveProperty("feedbacksThisWeek");
      expect(stats).toHaveProperty("feedbacksThisMonth");
      expect(stats).toHaveProperty("pendingFeedbacks");
      expect(stats).toHaveProperty("resolvedFeedbacks");
      expect(stats).toHaveProperty("autoReplySuccessRate");
      expect(stats).toHaveProperty("averageResponseTime");
    });

    it("should have valid feedback statistics values", async () => {
      const stats = await caller.analytics.feedbackStats();

      if (stats) {
        expect(stats.totalFeedbacks).toBeGreaterThanOrEqual(0);
        expect(stats.feedbacksToday).toBeGreaterThanOrEqual(0);
        expect(stats.autoReplySuccessRate).toBeGreaterThanOrEqual(0);
        expect(stats.autoReplySuccessRate).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("analytics.updateAnalytics", () => {
    it("should trigger analytics update", async () => {
      const result = await caller.analytics.updateAnalytics();

      expect(result.success).toBe(true);
    });
  });
});
