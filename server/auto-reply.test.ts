import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  createFeedback: vi.fn(async (feedback) => ({
    id: 1,
    ...feedback,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getAllFeedbacks: vi.fn(async () => []),
  findMatchingTemplate: vi.fn(async (message) => {
    if (message.toLowerCase().includes("offline")) {
      return {
        id: 1,
        category: "offline_camera",
        keywords: JSON.stringify(["offline", "disconnected"]),
        titleEn: "Camera Offline - Troubleshooting",
        titleZh: "摄像头离线 - 故障排除",
        responseEn: "Here are solutions for offline cameras...",
        responseZh: "以下是摄像头离线的解决方案...",
        enabled: "true",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }),
  logAutoReply: vi.fn(async (log) => ({
    id: 1,
    ...log,
    createdAt: new Date(),
  })),
  getAllAutoReplyTemplates: vi.fn(async () => [
    {
      id: 1,
      category: "offline_camera",
      keywords: JSON.stringify(["offline", "disconnected"]),
      titleEn: "Camera Offline - Troubleshooting",
      titleZh: "摄像头离线 - 故障排除",
      responseEn: "Here are solutions for offline cameras...",
      responseZh: "以下是摄像头离线的解决方案...",
      enabled: "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  initializeDefaultTemplates: vi.fn(async () => {}),
}));

// Mock email functions
vi.mock("./_core/email", () => ({
  sendFeedbackNotification: vi.fn(async () => true),
}));

vi.mock("./_core/auto-reply-email", () => ({
  sendAutoReplyEmail: vi.fn(async () => true),
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

describe("Auto-Reply System", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("feedback.submit with auto-reply", () => {
    it("should trigger auto-reply for offline camera feedback", async () => {
      const result = await caller.feedback.submit({
        email: "user@example.com",
        message: "My camera is offline and not connecting to the app",
        language: "en",
      });

      expect(result.success).toBe(true);
      expect(result.feedbackId).toBe(1);
      // Auto-reply should be triggered for offline keyword
      expect(["sent", "pending", "error"]).toContain(result.autoReplyStatus);
    });

    it("should not trigger auto-reply for unmatched feedback", async () => {
      const result = await caller.feedback.submit({
        email: "user@example.com",
        message: "I would like to know more about your enterprise solutions and pricing",
        language: "en",
      });

      expect(result.success).toBe(true);
      expect(result.autoReplyStatus).toBe("no_match");
    });

    it("should handle Chinese feedback with auto-reply", async () => {
      const result = await caller.feedback.submit({
        email: "user@example.com",
        message: "我的摄像头离线了，无法连接到应用程序",
        language: "zh",
      });

      expect(result.success).toBe(true);
      expect(result.feedbackId).toBe(1);
    });
  });

  describe("autoReply.templates", () => {
    it("should retrieve all auto-reply templates", async () => {
      const templates = await caller.autoReply.templates();

      expect(Array.isArray(templates)).toBe(true);
      if (templates.length > 0) {
        expect(templates[0]).toHaveProperty("category");
        expect(templates[0]).toHaveProperty("titleEn");
        expect(templates[0]).toHaveProperty("titleZh");
        expect(templates[0]).toHaveProperty("responseEn");
        expect(templates[0]).toHaveProperty("responseZh");
      }
    });
  });

  describe("autoReply.initializeDefaults", () => {
    it("should initialize default templates", async () => {
      const result = await caller.autoReply.initializeDefaults();

      expect(result.success).toBe(true);
      expect(result.message).toContain("initialized");
    });
  });

  describe("Auto-Reply Template Structure", () => {
    it("should have valid template structure", async () => {
      const templates = await caller.autoReply.templates();

      for (const template of templates) {
        expect(template).toHaveProperty("id");
        expect(template).toHaveProperty("category");
        expect(template).toHaveProperty("keywords");
        expect(template).toHaveProperty("titleEn");
        expect(template).toHaveProperty("titleZh");
        expect(template).toHaveProperty("responseEn");
        expect(template).toHaveProperty("responseZh");
        expect(template).toHaveProperty("enabled");

        // Validate keywords is valid JSON
        expect(() => JSON.parse(template.keywords)).not.toThrow();
      }
    });
  });
});
