import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, feedbacks, InsertFeedback, type Feedback, autoReplyTemplates, autoReplyLogs, InsertAutoReplyLog, type AutoReplyLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new feedback entry in the database.
 */
export async function createFeedback(feedback: InsertFeedback) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create feedback: database not available");
    return null;
  }

  try {
    const result = await db.insert(feedbacks).values(feedback);
    const feedbackId = (result as any).insertId;
    
    if (feedbackId) {
      const created = await db.select().from(feedbacks).where(eq(feedbacks.id, feedbackId)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create feedback:", error);
    throw error;
  }
}

/**
 * Get all feedbacks for admin review.
 */
export async function getAllFeedbacks() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get feedbacks: database not available");
    return [];
  }

  try {
    return await db.select().from(feedbacks);
  } catch (error) {
    console.error("[Database] Failed to get feedbacks:", error);
    return [];
  }
}


/**
 * Get all auto-reply templates.
 */
export async function getAllAutoReplyTemplates() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get templates: database not available");
    return [];
  }

  try {
    return await db.select().from(autoReplyTemplates);
  } catch (error) {
    console.error("[Database] Failed to get templates:", error);
    return [];
  }
}

/**
 * Get enabled auto-reply templates.
 */
export async function getEnabledAutoReplyTemplates() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get templates: database not available");
    return [];
  }

  try {
    return await db.select().from(autoReplyTemplates).where(eq(autoReplyTemplates.enabled, "true"));
  } catch (error) {
    console.error("[Database] Failed to get enabled templates:", error);
    return [];
  }
}

/**
 * Find matching template based on keywords in feedback message.
 */
export async function findMatchingTemplate(message: string) {
  const templates = await getEnabledAutoReplyTemplates();
  
  const messageLower = message.toLowerCase();
  
  for (const template of templates) {
    try {
      const keywords = JSON.parse(template.keywords) as string[];
      
      // Check if any keyword matches (case-insensitive)
      for (const keyword of keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          return template;
        }
      }
    } catch (error) {
      console.error(`[Database] Failed to parse keywords for template ${template.id}:`, error);
    }
  }
  
  return null;
}

/**
 * Log auto-reply action.
 */
export async function logAutoReply(log: InsertAutoReplyLog) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot log reply: database not available");
    return null;
  }

  try {
    const result = await db.insert(autoReplyLogs).values(log);
    const logId = (result as any).insertId;
    
    if (logId) {
      const created = await db.select().from(autoReplyLogs).where(eq(autoReplyLogs.id, logId)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to log reply:", error);
    return null;
  }
}

/**
 * Get auto-reply logs for a specific feedback.
 */
export async function getAutoReplyLogsForFeedback(feedbackId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get logs: database not available");
    return [];
  }

  try {
    return await db.select().from(autoReplyLogs).where(eq(autoReplyLogs.feedbackId, feedbackId));
  } catch (error) {
    console.error("[Database] Failed to get logs:", error);
    return [];
  }
}

/**
 * Initialize default auto-reply templates.
 */
export async function initializeDefaultTemplates() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot initialize templates: database not available");
    return;
  }

  const defaultTemplates = [
    {
      category: "offline_camera",
      keywords: JSON.stringify(["offline", "disconnected", "not connecting", "离线", "无法连接", "断线"]),
      titleEn: "Camera Offline - Troubleshooting",
      titleZh: "摄像头离线 - 故障排除",
      responseEn: `Thank you for reporting this issue. Here are the common solutions for offline cameras:

1. Check your internet connection and router
2. Restart the camera by unplugging it for 30 seconds
3. Verify the camera is within WiFi range
4. Check if your WiFi password is correct
5. Update the camera firmware to the latest version

If the issue persists, please reply with:
- Camera model
- Error message (if any)
- How long it's been offline

Our support team will assist you further.`,
      responseZh: `感谢您报告此问题。以下是摄像头离线的常见解决方案：

1. 检查您的网络连接和路由器
2. 拔掉摄像头电源 30 秒后重新启动
3. 确保摄像头在 WiFi 范围内
4. 检查 WiFi 密码是否正确
5. 将摄像头固件更新到最新版本

如果问题仍未解决，请回复提供：
- 摄像头型号
- 错误消息（如有）
- 离线时长

我们的支持团队将进一步协助您。`,
    },
    {
      category: "poor_video_quality",
      keywords: JSON.stringify(["blurry", "pixelated", "low quality", "模糊", "清晰度", "画质"]),
      titleEn: "Video Quality Issues - Solutions",
      titleZh: "视频质量问题 - 解决方案",
      responseEn: `Thank you for contacting us about video quality. Here are solutions to improve clarity:

1. Clean the camera lens with a soft cloth
2. Improve lighting conditions in the area
3. Move the camera closer to your WiFi router
4. Reduce the number of devices connected to WiFi
5. Adjust camera resolution settings in the app

For night vision issues:
- Ensure infrared mode is enabled
- Check if the lens is clean
- Verify the camera has sufficient power

Please try these steps and let us know if the quality improves.`,
      responseZh: `感谢您联系我们关于视频质量的问题。以下是改善清晰度的解决方案：

1. 用软布清洁摄像头镜头
2. 改善该区域的照明条件
3. 将摄像头移近 WiFi 路由器
4. 减少连接到 WiFi 的设备数量
5. 在应用中调整摄像头分辨率设置

对于夜视问题：
- 确保启用了红外模式
- 检查镜头是否干净
- 验证摄像头电源充足

请尝试这些步骤，并告诉我们质量是否改善。`,
    },
    {
      category: "app_connection",
      keywords: JSON.stringify(["app", "cannot connect", "login", "应用", "无法连接", "登录"]),
      titleEn: "App Connection Issues",
      titleZh: "应用连接问题",
      responseEn: `We're here to help with your app connection issues. Please try these steps:

1. Restart the app completely
2. Check your internet connection
3. Log out and log back in
4. Update the app to the latest version
5. Clear the app cache (Settings > Apps > [App Name] > Storage > Clear Cache)

If using a new camera:
- Ensure the camera is powered on
- Check that WiFi is enabled on the camera
- Verify you're using the correct WiFi network
- Try resetting the camera to factory settings

Please let us know if this resolves your issue.`,
      responseZh: `我们在此帮助您解决应用连接问题。请尝试以下步骤：

1. 完全重启应用
2. 检查您的网络连接
3. 登出后重新登录
4. 将应用更新到最新版本
5. 清除应用缓存（设置 > 应用 > [应用名称] > 存储 > 清除缓存）

如果使用新摄像头：
- 确保摄像头已打开
- 检查摄像头上的 WiFi 是否启用
- 验证您使用的是正确的 WiFi 网络
- 尝试将摄像头重置为出厂设置

请告诉我们这是否解决了您的问题。`,
    },
  ];

  try {
    for (const template of defaultTemplates) {
      await db.insert(autoReplyTemplates).values(template).onDuplicateKeyUpdate({
        set: {
          keywords: template.keywords,
          titleEn: template.titleEn,
          titleZh: template.titleZh,
          responseEn: template.responseEn,
          responseZh: template.responseZh,
        },
      });
    }
    console.log("[Database] Default templates initialized successfully");
  } catch (error) {
    console.error("[Database] Failed to initialize templates:", error);
  }
}
