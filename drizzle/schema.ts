import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Feedback table for storing user submissions from the FAQ system.
 * Stores email, message, and timestamp for each feedback entry.
 */
export const feedbacks = mysqlTable("feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  status: mysqlEnum("status", ["pending", "read", "resolved"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

/**
 * Auto-reply templates for categorized feedback responses.
 * Stores predefined responses for common feedback categories.
 */
export const autoReplyTemplates = mysqlTable("auto_reply_templates", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull().unique(),
  keywords: text("keywords").notNull(), // JSON array of keywords
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleZh: varchar("titleZh", { length: 255 }).notNull(),
  responseEn: text("responseEn").notNull(),
  responseZh: text("responseZh").notNull(),
  enabled: mysqlEnum("enabled", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AutoReplyTemplate = typeof autoReplyTemplates.$inferSelect;
export type InsertAutoReplyTemplate = typeof autoReplyTemplates.$inferInsert;

/**
 * Auto-reply log for tracking sent automatic responses.
 */
export const autoReplyLogs = mysqlTable("auto_reply_logs", {
  id: int("id").autoincrement().primaryKey(),
  feedbackId: int("feedbackId").notNull(),
  templateId: int("templateId").notNull(),
  userEmail: varchar("userEmail", { length: 320 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  responseLanguage: varchar("responseLanguage", { length: 10 }).notNull(),
  status: mysqlEnum("status", ["sent", "failed", "pending_review"]).default("pending_review").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AutoReplyLog = typeof autoReplyLogs.$inferSelect;
export type InsertAutoReplyLog = typeof autoReplyLogs.$inferInsert;

/**
 * Notifications table for storing system and user notifications.
 * Tracks notification status, read/unread state, and delivery method.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  feedbackId: int("feedbackId").notNull(),
  userEmail: varchar("userEmail", { length: 320 }).notNull(),
  type: mysqlEnum("type", [
    "feedback_submitted",
    "feedback_read",
    "feedback_resolved",
    "auto_reply_sent",
    "status_updated",
  ]).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleZh: varchar("titleZh", { length: 255 }).notNull(),
  contentEn: text("contentEn").notNull(),
  contentZh: text("contentZh").notNull(),
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  emailSent: mysqlEnum("emailSent", ["true", "false"]).default("false").notNull(),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification preferences for users.
 * Stores user preferences for notification delivery methods and types.
 */
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userEmail: varchar("userEmail", { length: 320 }).notNull().unique(),
  emailNotifications: mysqlEnum("emailNotifications", ["true", "false"]).default("true").notNull(),
  feedbackSubmittedNotification: mysqlEnum("feedbackSubmittedNotification", ["true", "false"]).default("true").notNull(),
  statusUpdateNotification: mysqlEnum("statusUpdateNotification", ["true", "false"]).default("true").notNull(),
  autoReplyNotification: mysqlEnum("autoReplyNotification", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

/**
 * FAQ view tracking for analytics.
 * Records each time a user views an FAQ question.
 */
export const faqViews = mysqlTable("faq_views", {
  id: int("id").autoincrement().primaryKey(),
  faqId: varchar("faqId", { length: 100 }).notNull(),
  faqQuestionEn: text("faqQuestionEn"),
  faqQuestionZh: text("faqQuestionZh"),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }).notNull(),
  userEmail: varchar("userEmail", { length: 320 }),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type FAQView = typeof faqViews.$inferSelect;
export type InsertFAQView = typeof faqViews.$inferInsert;

/**
 * FAQ analytics summary for dashboard.
 * Stores aggregated view counts and statistics per FAQ.
 */
export const faqAnalytics = mysqlTable("faq_analytics", {
  id: int("id").autoincrement().primaryKey(),
  faqId: varchar("faqId", { length: 100 }).notNull().unique(),
  faqQuestionEn: text("faqQuestionEn"),
  faqQuestionZh: text("faqQuestionZh"),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }).notNull(),
  totalViews: int("totalViews").default(0).notNull(),
  viewsToday: int("viewsToday").default(0).notNull(),
  viewsThisWeek: int("viewsThisWeek").default(0).notNull(),
  viewsThisMonth: int("viewsThisMonth").default(0).notNull(),
  lastViewedAt: timestamp("lastViewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FAQAnalytic = typeof faqAnalytics.$inferSelect;
export type InsertFAQAnalytic = typeof faqAnalytics.$inferInsert;

/**
 * Feedback analytics summary for dashboard.
 * Stores aggregated feedback statistics.
 */
export const feedbackAnalytics = mysqlTable("feedback_analytics", {
  id: int("id").autoincrement().primaryKey(),
  totalFeedbacks: int("totalFeedbacks").default(0).notNull(),
  feedbacksToday: int("feedbacksToday").default(0).notNull(),
  feedbacksThisWeek: int("feedbacksThisWeek").default(0).notNull(),
  feedbacksThisMonth: int("feedbacksThisMonth").default(0).notNull(),
  pendingFeedbacks: int("pendingFeedbacks").default(0).notNull(),
  resolvedFeedbacks: int("resolvedFeedbacks").default(0).notNull(),
  autoReplySuccessRate: int("autoReplySuccessRate").default(0).notNull(),
  averageResponseTime: int("averageResponseTime").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeedbackAnalytic = typeof feedbackAnalytics.$inferSelect;
export type InsertFeedbackAnalytic = typeof feedbackAnalytics.$inferInsert;
