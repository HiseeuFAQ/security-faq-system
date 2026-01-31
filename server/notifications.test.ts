import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock all external dependencies
vi.mock("./notifications", () => ({
  createNotification: vi.fn(async () => null),
  getUserNotifications: vi.fn(async () => [
    {
      id: 1,
      feedbackId: 1,
      userEmail: "user@example.com",
      type: "feedback_submitted",
      titleEn: "Feedback Received",
      titleZh: "反馈已收到",
      contentEn: "Thank you for submitting your feedback.",
      contentZh: "感谢您提交的反馈。",
      isRead: "false",
      emailSent: "false",
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getUnreadNotifications: vi.fn(async () => [
    {
      id: 1,
      feedbackId: 1,
      userEmail: "user@example.com",
      type: "feedback_submitted",
      titleEn: "Feedback Received",
      titleZh: "反馈已收到",
      contentEn: "Thank you for submitting your feedback.",
      contentZh: "感谢您提交的反馈。",
      isRead: "false",
      emailSent: "false",
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  markNotificationAsRead: vi.fn(async () => true),
  markAllNotificationsAsRead: vi.fn(async () => true),
  deleteNotification: vi.fn(async () => true),
  getOrCreateNotificationPreferences: vi.fn(async () => ({
    id: 1,
    userEmail: "user@example.com",
    emailNotifications: "true",
    feedbackSubmittedNotification: "true",
    statusUpdateNotification: "true",
    autoReplyNotification: "true",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateNotificationPreferences: vi.fn(async () => true),
  getUnreadNotificationCount: vi.fn(async () => 1),
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

describe("Notification API Endpoints", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("notifications.list", () => {
    it("should retrieve all notifications for a user", async () => {
      const notifications = await caller.notifications.list({
        userEmail: "user@example.com",
      });

      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0]).toHaveProperty("id");
      expect(notifications[0]).toHaveProperty("type");
    });
  });

  describe("notifications.unread", () => {
    it("should retrieve unread notifications for a user", async () => {
      const unreadNotifications = await caller.notifications.unread({
        userEmail: "user@example.com",
      });

      expect(Array.isArray(unreadNotifications)).toBe(true);
      unreadNotifications.forEach((notification: any) => {
        expect(notification.isRead).toBe("false");
      });
    });
  });

  describe("notifications.unreadCount", () => {
    it("should return unread notification count", async () => {
      const count = await caller.notifications.unreadCount({
        userEmail: "user@example.com",
      });

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("notifications.markAsRead", () => {
    it("should mark a notification as read", async () => {
      const result = await caller.notifications.markAsRead({
        notificationId: 1,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("notifications.markAllAsRead", () => {
    it("should mark all notifications as read for a user", async () => {
      const result = await caller.notifications.markAllAsRead({
        userEmail: "user@example.com",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("notifications.delete", () => {
    it("should delete a notification", async () => {
      const result = await caller.notifications.delete({
        notificationId: 1,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("notifications.preferences", () => {
    it("should retrieve notification preferences for a user", async () => {
      const preferences = await caller.notifications.preferences({
        userEmail: "user@example.com",
      });

      expect(preferences).not.toBeNull();
      expect(preferences).toHaveProperty("emailNotifications");
      expect(preferences).toHaveProperty("feedbackSubmittedNotification");
    });
  });

  describe("notifications.updatePreferences", () => {
    it("should update notification preferences", async () => {
      const result = await caller.notifications.updatePreferences({
        userEmail: "user@example.com",
        emailNotifications: "false",
      });

      expect(result.success).toBe(true);
    });
  });
});
