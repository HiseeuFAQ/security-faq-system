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