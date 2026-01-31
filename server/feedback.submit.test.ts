import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createFeedback: vi.fn(async (feedback) => ({
    id: 1,
    ...feedback,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getAllFeedbacks: vi.fn(async () => []),
}));

// Mock the email service
vi.mock("./_core/email", () => ({
  sendFeedbackNotification: vi.fn(async () => true),
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

describe("feedback.submit", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should submit feedback successfully with valid input", async () => {
    const result = await caller.feedback.submit({
      email: "user@example.com",
      message: "This is a test feedback message with enough characters",
      language: "en",
    });

    expect(result).toEqual({
      success: true,
      feedbackId: 1,
      message: "Thank you for your feedback! We will respond within 12 hours.",
    });
  });

  it("should submit feedback with Chinese language", async () => {
    const result = await caller.feedback.submit({
      email: "user@example.com",
      message: "这是一条测试反馈消息，包含足够的字符数",
      language: "zh",
    });

    expect(result).toEqual({
      success: true,
      feedbackId: 1,
      message: "感谢您的反馈！我们将在 12 小时内回复。",
    });
  });

  it("should reject invalid email", async () => {
    try {
      await caller.feedback.submit({
        email: "invalid-email",
        message: "This is a test feedback message with enough characters",
        language: "en",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email");
    }
  });

  it("should reject message shorter than 10 characters", async () => {
    try {
      await caller.feedback.submit({
        email: "user@example.com",
        message: "short",
        language: "en",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("at least 10 characters");
    }
  });

  it("should reject message longer than 5000 characters", async () => {
    const longMessage = "a".repeat(5001);
    try {
      await caller.feedback.submit({
        email: "user@example.com",
        message: longMessage,
        language: "en",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("5000");
    }
  });

  it("should default to English language", async () => {
    const result = await caller.feedback.submit({
      email: "user@example.com",
      message: "This is a test feedback message with enough characters",
    });

    expect(result.message).toBe("Thank you for your feedback! We will respond within 12 hours.");
  });
});

describe("feedback.list", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should return list of feedbacks", async () => {
    const result = await caller.feedback.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
