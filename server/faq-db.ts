import { getDb } from "./db";
import { faqs, faqVersions, faqImages, FAQ, FAQVersion, FAQImage, InsertFAQ, InsertFAQVersion, InsertFAQImage } from "../drizzle/schema";
import { eq, and, like, desc, asc } from "drizzle-orm";

/**
 * Create a new FAQ entry
 */
export async function createFAQ(data: InsertFAQ): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(faqs).values(data);
  const id = (result as any).insertId;
  
  const created = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return created[0];
}

/**
 * Update an existing FAQ
 */
export async function updateFAQ(id: number, data: Partial<InsertFAQ>): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(faqs).set(data).where(eq(faqs.id, id));
  
  const updated = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return updated[0];
}

/**
 * Get FAQ by ID
 */
export async function getFAQById(id: number): Promise<FAQ | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Get FAQ by slug
 */
export async function getFAQBySlug(slug: string): Promise<FAQ | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(faqs).where(eq(faqs.slug, slug)).limit(1);
  return result[0] || null;
}

/**
 * List FAQs with filtering and pagination
 */
export async function listFAQs(options: {
  status?: "draft" | "published" | "all";
  productType?: string;
  scenario?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "created_at" | "updated_at";
  order?: "asc" | "desc";
} = {}): Promise<{ items: FAQ[]; total: number }> {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const {
    status = "all",
    productType,
    scenario,
    search,
    page = 1,
    limit = 20,
    sort = "updated_at",
    order = "desc"
  } = options;

  const conditions: any[] = [];

  if (status !== "all") {
    conditions.push(eq(faqs.status, status as "draft" | "published"));
  }

  if (productType) {
    conditions.push(eq(faqs.productType, productType));
  }

  if (scenario) {
    conditions.push(eq(faqs.scenario, scenario));
  }

  if (search) {
    conditions.push(like(faqs.questions, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const countResult = await db
    .select({ count: faqs.id })
    .from(faqs)
    .where(whereClause);
  const total = countResult.length;

  const offset = (page - 1) * limit;
  const orderBy = sort === "created_at" 
    ? (order === "asc" ? asc(faqs.createdAt) : desc(faqs.createdAt))
    : (order === "asc" ? asc(faqs.updatedAt) : desc(faqs.updatedAt));

  const items = await db
    .select()
    .from(faqs)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return { items, total };
}

/**
 * Delete FAQ
 */
export async function deleteFAQ(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.delete(faqs).where(eq(faqs.id, id));
  return (result as any).affectedRows > 0;
}

/**
 * Publish FAQ
 */
export async function publishFAQ(id: number): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const now = new Date();
  await db
    .update(faqs)
    .set({ status: "published", publishedAt: now })
    .where(eq(faqs.id, id));
  
  const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return result[0];
}

/**
 * Unpublish FAQ
 */
export async function unpublishFAQ(id: number): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(faqs)
    .set({ status: "draft" })
    .where(eq(faqs.id, id));
  
  const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return result[0];
}

/**
 * Create FAQ version
 */
export async function createFAQVersion(data: InsertFAQVersion): Promise<FAQVersion> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(faqVersions).values(data);
  const id = (result as any).insertId;
  
  const created = await db.select().from(faqVersions).where(eq(faqVersions.id, id)).limit(1);
  return created[0];
}

/**
 * Get FAQ version history
 */
export async function getFAQVersionHistory(faqId: number, limit: number = 10): Promise<FAQVersion[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(faqVersions)
    .where(eq(faqVersions.faqId, faqId))
    .orderBy(desc(faqVersions.version))
    .limit(limit);
}

/**
 * Get specific FAQ version
 */
export async function getFAQVersion(faqId: number, version: number): Promise<FAQVersion | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(faqVersions)
    .where(and(eq(faqVersions.faqId, faqId), eq(faqVersions.version, version)))
    .limit(1);
  return result[0] || null;
}

/**
 * Upload FAQ image
 */
export async function uploadFAQImage(data: InsertFAQImage): Promise<FAQImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(faqImages).values(data);
  const id = (result as any).insertId;
  
  const created = await db.select().from(faqImages).where(eq(faqImages.id, id)).limit(1);
  return created[0];
}

/**
 * Get FAQ images
 */
export async function getFAQImages(faqId: number): Promise<FAQImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(faqImages)
    .where(eq(faqImages.faqId, faqId))
    .orderBy(asc(faqImages.displayOrder));
}

/**
 * Delete FAQ image
 */
export async function deleteFAQImage(imageId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.delete(faqImages).where(eq(faqImages.id, imageId));
  return (result as any).affectedRows > 0;
}

/**
 * Update FAQ image metadata
 */
export async function updateFAQImage(
  imageId: number,
  data: Partial<InsertFAQImage>
): Promise<FAQImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(faqImages)
    .set(data)
    .where(eq(faqImages.id, imageId));
  
  const result = await db.select().from(faqImages).where(eq(faqImages.id, imageId)).limit(1);
  return result[0];
}

/**
 * Generate unique slug from question
 */
export function generateSlug(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

/**
 * Ensure unique slug
 */
export async function ensureUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
  const db = await getDb();
  if (!db) return baseSlug;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select()
      .from(faqs)
      .where(
        excludeId
          ? and(eq(faqs.slug, slug), eq(faqs.id, excludeId))
          : eq(faqs.slug, slug)
      )
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
