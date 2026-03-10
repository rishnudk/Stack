import { z } from "zod"

const optionalNonEmptyString = z.string().trim().min(1).optional()

export const createArticleSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  content: z.string().trim().min(1, "Content is required"),
  thumbnail: z.string().trim().min(1, "Thumbnail is required"),
  image: optionalNonEmptyString,
  tags: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().default(true),
})

export const updateArticleSchema = z.object({
  id: z.string().trim().min(1, "Article id is required"),
  slug: optionalNonEmptyString,
  title: optionalNonEmptyString,
  description: optionalNonEmptyString,
  content: optionalNonEmptyString,
  thumbnail: optionalNonEmptyString,
  image: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).optional(),
  published: z.boolean().optional(),
})

export const deleteArticleSchema = z.object({
  id: z.string().trim().min(1, "Article id is required"),
})

export const getArticleBySlugSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
})

export const getArticlesByUserIdSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  cursor: z.string().trim().optional(),
  limit: z.number().int().min(1).max(50).default(10),
})

export const getMyArticlesSchema = z.object({
  cursor: z.string().trim().optional(),
  limit: z.number().int().min(1).max(50).default(10),
  includeDrafts: z.boolean().default(true),
})

export const getArticlesSchema = z.object({
  cursor: z.string().trim().optional(),
  limit: z.number().int().min(1).max(50).default(10),
  authorId: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  publishedOnly: z.boolean().default(true),
})
