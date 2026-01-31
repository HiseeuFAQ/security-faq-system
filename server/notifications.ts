import { eq, desc } from "drizzle-orm";
import { 
  notifications, 
  notificationPreferences, 
  InsertNotification, 
  Notification,
  NotificationPreference,
  InsertNotificationPreference 
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a new notification.
 */
export async function createNotification(notification: InsertNotification): Promise<Notification | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot create notification: database not available");
    return null;
  }

  try {
    const result = await db.insert(notifications).values(notification);
    const notificationId = (result as any).insertId;
    
    if (notificationId) {
      const created = await db.select().from(notifications).where(eq(notifications.id, notificationId)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Notifications] Failed to create notification:", error);
    return null;
  }
}

/**
 * Get all notifications for a user.
 */
export async function getUserNotifications(userEmail: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot get notifications: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userEmail, userEmail))
      .orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error("[Notifications] Failed to get notifications:", error);
    return [];
  }
}

/**
 * Get unread notifications for a user.
 */
export async function getUnreadNotifications(userEmail: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot get unread notifications: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(notifications)
      .where(
        eq(notifications.userEmail, userEmail) && 
        eq(notifications.isRead, "false")
      )
      .orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error("[Notifications] Failed to get unread notifications:", error);
    return [];
  }
}

/**
 * Mark notification as read.
 */
export async function markNotificationAsRead(notificationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot mark as read: database not available");
    return false;
  }

  try {
    await db
      .update(notifications)
      .set({ isRead: "true" })
      .where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to mark as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userEmail: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot mark all as read: database not available");
    return false;
  }

  try {
    await db
      .update(notifications)
      .set({ isRead: "true" })
      .where(eq(notifications.userEmail, userEmail));
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to mark all as read:", error);
    return false;
  }
}

/**
 * Delete a notification.
 */
export async function deleteNotification(notificationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot delete notification: database not available");
    return false;
  }

  try {
    await db
      .delete(notifications)
      .where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to delete notification:", error);
    return false;
  }
}

/**
 * Get or create notification preferences for a user.
 */
export async function getOrCreateNotificationPreferences(
  userEmail: string
): Promise<NotificationPreference | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot get preferences: database not available");
    return null;
  }

  try {
    // Try to get existing preferences
    const existing = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userEmail, userEmail))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create default preferences
    const defaultPrefs: InsertNotificationPreference = {
      userEmail,
      emailNotifications: "true",
      feedbackSubmittedNotification: "true",
      statusUpdateNotification: "true",
      autoReplyNotification: "true",
    };

    const result = await db.insert(notificationPreferences).values(defaultPrefs);
    const prefId = (result as any).insertId;

    if (prefId) {
      const created = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.id, prefId))
        .limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Notifications] Failed to get/create preferences:", error);
    return null;
  }
}

/**
 * Update notification preferences.
 */
export async function updateNotificationPreferences(
  userEmail: string,
  updates: Partial<InsertNotificationPreference>
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot update preferences: database not available");
    return false;
  }

  try {
    await db
      .update(notificationPreferences)
      .set(updates)
      .where(eq(notificationPreferences.userEmail, userEmail));
    return true;
  } catch (error) {
    console.error("[Notifications] Failed to update preferences:", error);
    return false;
  }
}

/**
 * Get notification count for a user.
 */
export async function getNotificationCount(userEmail: string): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot get count: database not available");
    return 0;
  }

  try {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userEmail, userEmail));
    return result.length;
  } catch (error) {
    console.error("[Notifications] Failed to get count:", error);
    return 0;
  }
}

/**
 * Get unread notification count for a user.
 */
export async function getUnreadNotificationCount(userEmail: string): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Notifications] Cannot get unread count: database not available");
    return 0;
  }

  try {
    const result = await db
      .select()
      .from(notifications)
      .where(
        eq(notifications.userEmail, userEmail) && 
        eq(notifications.isRead, "false")
      );
    return result.length;
  } catch (error) {
    console.error("[Notifications] Failed to get unread count:", error);
    return 0;
  }
}
