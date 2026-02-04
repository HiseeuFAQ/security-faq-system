import { z } from "zod";
import { protectedProcedure, adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createFAQ,
  updateFAQ,
  getFAQById,
  getFAQBySlug,
  listFAQs,
  deleteFAQ,
  publishFAQ,
  unpublishFAQ,
  createFAQVersion,
  getFAQVersionHistory,
  getFAQVersion,
  uploadFAQImage,
  getFAQImages,
  deleteFAQImage,
  updateFAQImage,
  generateSlug,
  ensureUniqueSlug,
} from "../faq-db";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

/**
 * Validation schemas
 */
const questionsSchema = z.record(z.string(), z.string().min(10).max(500));
const answersSchema = z.record(z.string(), z.string().min(50).max(10000));

const createFAQInput = z.object({
  productType: z.enum(["wireless", "wired", "eseries"]),
  scenario: z.enum(["home", "commercial", "industrial"]),
  questions: questionsSchema,
  answers: answersSchema,
  featuredImageUrl: z.string().url().optional(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

const updateFAQInput = z.object({
  id: z.number().int().positive(),
  productType: z.enum(["wireless", "wired", "eseries"]).optional(),
  scenario: z.enum(["home", "commercial", "industrial"]).optional(),
  questions: questionsSchema.optional(),
  answers: answersSchema.optional(),
  featuredImageUrl: z.string().url().optional().nullable(),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  changeSummary: z.string().max(500).optional(),
});

const listFAQsInput = z.object({
  status: z.enum(["draft", "published", "all"]).default("all"),
  productType: z.string().optional(),
  scenario: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.enum(["created_at", "updated_at"]).default("updated_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * FAQ Router
 */
export const faqRouter = router({
  /**
   * Create a new FAQ
   */
  create: adminProcedure
    .input(createFAQInput)
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate slug from English question
        const baseSlug = generateSlug((input.questions as Record<string, string>).en || "faq");
        const slug = await ensureUniqueSlug(baseSlug);

        // Create FAQ
        const faq = await createFAQ({
          slug,
          status: input.status,
          productType: input.productType,
          scenario: input.scenario,
          questions: JSON.stringify(input.questions),
          answers: JSON.stringify(input.answers),
          featuredImageUrl: input.featuredImageUrl,
          seoTitle: input.seoTitle,
          seoDescription: input.seoDescription,
          tags: input.tags ? JSON.stringify(input.tags) : null,
          version: 1,
          createdBy: ctx.user.id,
          updatedBy: ctx.user.id,
        });

        // Create initial version record
        await createFAQVersion({
          faqId: faq.id,
          version: 1,
          changeSummary: "Initial creation",
          questions: faq.questions,
          answers: faq.answers,
          status: (faq.status as "draft" | "published") || undefined,
          changedBy: ctx.user.id,
        });

        return {
          id: faq.id,
          slug: faq.slug,
          status: faq.status,
          version: faq.version,
          createdAt: faq.createdAt,
        };
      } catch (error) {
        console.error("[FAQ Create Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create FAQ",
        });
      }
    }),

  /**
   * Update an existing FAQ
   */
  update: adminProcedure
    .input(updateFAQInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const faq = await getFAQById(input.id);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        // Prepare update data
        const updateData: any = {
          updatedBy: ctx.user.id,
        };

        if (input.productType) updateData.productType = input.productType;
        if (input.scenario) updateData.scenario = input.scenario;
        if (input.questions) updateData.questions = JSON.stringify(input.questions);
        if (input.answers) updateData.answers = JSON.stringify(input.answers);
        if (input.featuredImageUrl !== undefined) updateData.featuredImageUrl = input.featuredImageUrl;
        if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle;
        if (input.seoDescription !== undefined) updateData.seoDescription = input.seoDescription;
        if (input.tags !== undefined) updateData.tags = input.tags ? JSON.stringify(input.tags) : null;
        if (input.status) updateData.status = input.status;

        // Increment version
        updateData.version = faq.version + 1;

        // Update FAQ
        const updated = await updateFAQ(input.id, updateData);

        // Create version record
        await createFAQVersion({
          faqId: input.id,
          version: updated.version,
          changeSummary: input.changeSummary || "Updated",
          questions: updated.questions,
          answers: updated.answers,
          status: (updated.status as "draft" | "published") || undefined,
          changedBy: ctx.user.id,
        });

        return {
          id: updated.id,
          slug: updated.slug,
          status: updated.status,
          version: updated.version,
          updatedAt: updated.updatedAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ Update Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update FAQ",
        });
      }
    }),

  /**
   * Get FAQ by ID (admin can see all, public only sees published)
   */
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      try {
        const faq = await getFAQById(input.id);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        // Check permission: non-admin can only see published FAQs
        if (faq.status === "draft" && ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view this FAQ",
          });
        }

        // Get images
        const images = await getFAQImages(faq.id);

        // Get version history (admin only)
        const versions = ctx.user?.role === "admin" ? await getFAQVersionHistory(faq.id) : [];

        return {
          id: faq.id,
          slug: faq.slug,
          status: faq.status,
          productType: faq.productType,
          scenario: faq.scenario,
          questions: JSON.parse(faq.questions),
          answers: JSON.parse(faq.answers),
          featuredImageUrl: faq.featuredImageUrl,
          seoTitle: faq.seoTitle,
          seoDescription: faq.seoDescription,
          tags: faq.tags ? JSON.parse(faq.tags) : [],
          version: faq.version,
          publishedAt: faq.publishedAt,
          createdAt: faq.createdAt,
          updatedAt: faq.updatedAt,
          createdBy: { id: faq.createdBy },
          updatedBy: faq.updatedBy ? { id: faq.updatedBy } : null,
          images: images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            caption: img.caption,
            displayOrder: img.displayOrder,
          })),
          versions: versions.map((v) => ({
            version: v.version,
            changeSummary: v.changeSummary,
            changedAt: v.changedAt,
            changedBy: { id: v.changedBy },
          })),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ GetById Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch FAQ",
        });
      }
    }),

  /**
   * List FAQs with filtering
   */
  list: publicProcedure
    .input(listFAQsInput)
    .query(async ({ input, ctx }) => {
      try {
        // Non-admin can only see published FAQs
        const status = ctx.user?.role === "admin" ? input.status : "published";

        const { items, total } = await listFAQs({
          status: status as "draft" | "published" | "all",
          productType: input.productType,
          scenario: input.scenario,
          search: input.search,
          page: input.page,
          limit: input.limit,
          sort: input.sort,
          order: input.order,
        });

        const itemsWithImages = await Promise.all(
          items.map(async (faq) => {
            const images = await getFAQImages(faq.id);
            return {
              id: faq.id,
              slug: faq.slug,
              status: faq.status,
              productType: faq.productType,
              scenario: faq.scenario,
              questions: JSON.parse(faq.questions),
              answers: JSON.parse(faq.answers),
              seoTitle: faq.seoTitle,
              seoDescription: faq.seoDescription,
              tags: faq.tags ? JSON.parse(faq.tags) : [],
              version: faq.version,
              publishedAt: faq.publishedAt,
              createdAt: faq.createdAt,
              updatedAt: faq.updatedAt,
              images: images.map((img) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                altText: img.altText,
                caption: img.caption,
                displayOrder: img.displayOrder,
              })),
            };
          })
        );

        return {
          items: itemsWithImages,
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        };
      } catch (error) {
        console.error("[FAQ List Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch FAQs",
        });
      }
    }),

  /**
   * Delete FAQ
   */
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        const faq = await getFAQById(input.id);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        const success = await deleteFAQ(input.id);
        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete FAQ",
          });
        }

        return { success: true, id: input.id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ Delete Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete FAQ",
        });
      }
    }),

  /**
   * Publish FAQ
   */
  publish: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        const faq = await getFAQById(input.id);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        const published = await publishFAQ(input.id);

        return {
          id: published.id,
          status: published.status,
          publishedAt: published.publishedAt,
          version: published.version,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ Publish Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to publish FAQ",
        });
      }
    }),

  /**
   * Unpublish FAQ
   */
  unpublish: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        const faq = await getFAQById(input.id);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        const unpublished = await unpublishFAQ(input.id);

        return {
          id: unpublished.id,
          status: unpublished.status,
          version: unpublished.version,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ Unpublish Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unpublish FAQ",
        });
      }
    }),

  /**
   * Get version history
   */
  getVersionHistory: adminProcedure
    .input(z.object({ faqId: z.number().int().positive(), limit: z.number().int().default(10) }))
    .query(async ({ input }) => {
      try {
        const versions = await getFAQVersionHistory(input.faqId, input.limit);

        return {
          versions: versions.map((v) => ({
            version: v.version,
            changeSummary: v.changeSummary,
            status: v.status,
            changedAt: v.changedAt,
            changedBy: { id: v.changedBy },
          })),
        };
      } catch (error) {
        console.error("[FAQ GetVersionHistory Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch version history",
        });
      }
    }),

  /**
   * Restore to specific version
   */
  restoreVersion: adminProcedure
    .input(
      z.object({
        faqId: z.number().int().positive(),
        version: z.number().int().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const faq = await getFAQById(input.faqId);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        const versionData = await getFAQVersion(input.faqId, input.version);
        if (!versionData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Version not found",
          });
        }

        // Update FAQ with version data
        const restored = await updateFAQ(input.faqId, {
          questions: versionData.questions,
          answers: versionData.answers,
          status: (versionData.status as "draft" | "published") || undefined,
          version: faq.version + 1,
          updatedBy: ctx.user.id,
        });

        // Create new version record
        await createFAQVersion({
          faqId: input.faqId,
          version: restored.version,
          changeSummary: `Restored from version ${input.version}`,
          questions: restored.questions,
          answers: restored.answers,
          status: (restored.status as "draft" | "published") || undefined,
          changedBy: ctx.user.id,
        });

        return {
          id: restored.id,
          version: restored.version,
          restoredFromVersion: input.version,
          updatedAt: restored.updatedAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ RestoreVersion Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to restore version",
        });
      }
    }),

  /**
   * Upload image
   */
  uploadImage: adminProcedure
    .input(
      z.object({
        faqId: z.number().int().positive(),
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        altText: z.string().optional(),
        caption: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const faq = await getFAQById(input.faqId);
        if (!faq) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "FAQ not found",
          });
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload to S3
        const fileKey = `faq/${input.faqId}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, "image/jpeg");

        // Get max display order
        const images = await getFAQImages(input.faqId);
        const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.displayOrder || 0)) : 0;

        // Save image metadata
        const image = await uploadFAQImage({
          faqId: input.faqId,
          imageUrl: url,
          imageKey: fileKey,
          altText: input.altText,
          caption: input.caption,
          displayOrder: maxOrder + 1,
          uploadedBy: ctx.user.id,
        });

        return {
          id: image.id,
          faqId: image.faqId,
          imageUrl: image.imageUrl,
          altText: image.altText,
          caption: image.caption,
          displayOrder: image.displayOrder,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ UploadImage Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  /**
   * Delete image
   */
  deleteImage: adminProcedure
    .input(z.object({ imageId: z.number().int().positive(), faqId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        const success = await deleteFAQImage(input.imageId);
        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Image not found",
          });
        }

        return { success: true, id: input.imageId };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[FAQ DeleteImage Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
    }),

  /**
   * Update image metadata
   */
  updateImage: adminProcedure
    .input(
      z.object({
        imageId: z.number().int().positive(),
        altText: z.string().optional(),
        caption: z.string().optional(),
        displayOrder: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const updated = await updateFAQImage(input.imageId, {
          altText: input.altText,
          caption: input.caption,
          displayOrder: input.displayOrder,
        });

        return {
          id: updated.id,
          altText: updated.altText,
          caption: updated.caption,
          displayOrder: updated.displayOrder,
        };
      } catch (error) {
        console.error("[FAQ UpdateImage Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update image",
        });
      }
    }),
});
