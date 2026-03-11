import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Article } from "@stack/types";

function formatArticleDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapArticle(article: any): Article {
  return {
    id: article.id,
    slug: article.slug,
    author: article.author?.name ?? "Unknown author",
    date: formatArticleDate(article.createdAt),
    description: article.description,
    tags: article.tags ?? [],
    image: article.image ?? article.thumbnail,
    title: article.title,
    thumbnail: article.thumbnail,
    comments: article._count?.comments ?? 0,
    likes: article._count?.likes ?? 0,
    createdAt: article.createdAt.toISOString(),
  };
}

function mapArticleDetail(article: any) {
  return {
    ...mapArticle(article),
    content: article.content,
    published: article.published,
    updatedAt: article.updatedAt.toISOString(),
  };
}

async function ensureSlugAvailable(
  prisma: PrismaClient,
  slug: string,
  excludeArticleId?: string
) {
  const existingArticle = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingArticle && existingArticle.id !== excludeArticleId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "An article with this slug already exists",
    });
  }
}

async function ensureArticleOwner(
  prisma: PrismaClient,
  articleId: string,
  userId: string
) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, authorId: true },
  });

  if (!article) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
  }

  if (article.authorId !== userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
  }

  return article;
}

const articleInclude = {
  author: {
    select: {
      name: true,
    },
  },
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
};

export async function createArticle(
  prisma: PrismaClient,
  userId: string,
  input: {
    slug: string;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    image?: string;
    tags: string[];
    published: boolean;
  }
) {
  await ensureSlugAvailable(prisma, input.slug);

  const article = await prisma.article.create({
    data: {
      authorId: userId,
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content,
      thumbnail: input.thumbnail,
      image: input.image,
      tags: input.tags,
      published: input.published,
    },
    include: articleInclude,
  });

  return mapArticleDetail(article);
}

export async function updateArticle(
  prisma: PrismaClient,
  userId: string,
  input: {
    id: string;
    slug?: string;
    title?: string;
    description?: string;
    content?: string;
    thumbnail?: string;
    image?: string | null;
    tags?: string[];
    published?: boolean;
  }
) {
  await ensureArticleOwner(prisma, input.id, userId);

  if (input.slug) {
    await ensureSlugAvailable(prisma, input.slug, input.id);
  }

  const article = await prisma.article.update({
    where: { id: input.id },
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content,
      thumbnail: input.thumbnail,
      image: input.image === undefined ? undefined : input.image,
      tags: input.tags,
      published: input.published,
    },
    include: articleInclude,
  });

  return mapArticleDetail(article);
}

export async function deleteArticle(
  prisma: PrismaClient,
  userId: string,
  input: { id: string }
) {
  await ensureArticleOwner(prisma, input.id, userId);

  return prisma.article.delete({
    where: { id: input.id },
    select: { id: true },
  });
}

export async function getArticleBySlug(
  prisma: PrismaClient,
  slug: string
) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      published: true,
    },
    include: articleInclude,
  });

  if (!article) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
  }

  return mapArticleDetail(article);
}

export async function getArticles(
  prisma: PrismaClient,
  input: {
    cursor?: string;
    limit: number;
    authorId?: string;
    tag?: string;
    publishedOnly: boolean;
  }
) {
  const articles = await prisma.article.findMany({
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    where: {
      authorId: input.authorId,
      published: input.publishedOnly ? true : undefined,
      tags: input.tag ? { has: input.tag } : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: articleInclude,
  });

  const nextCursor = articles.length > input.limit ? articles.pop()?.id ?? null : null;

  return {
    articles: articles.map(mapArticle),
    nextCursor,
  };
}

export async function getArticlesByUserId(
  prisma: PrismaClient,
  input: {
    userId: string;
    cursor?: string;
    limit: number;
  }
) {
  const articles = await prisma.article.findMany({
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    where: {
      authorId: input.userId,
      published: true,
    },
    orderBy: { createdAt: "desc" },
    include: articleInclude,
  });

  const nextCursor = articles.length > input.limit ? articles.pop()?.id ?? null : null;

  return {
    articles: articles.map(mapArticle),
    nextCursor,
  };
}

export async function getMyArticles(
  prisma: PrismaClient,
  userId: string,
  input: {
    cursor?: string;
    limit: number;
    includeDrafts: boolean;
  }
) {
  const articles = await prisma.article.findMany({
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    where: {
      authorId: userId,
      published: input.includeDrafts ? undefined : true,
    },
    orderBy: { createdAt: "desc" },
    include: articleInclude,
  });

  const nextCursor = articles.length > input.limit ? articles.pop()?.id ?? null : null;

  return {
    articles: articles.map(mapArticle),
    nextCursor,
  };
}

// ──────────────────────────────────────────────
// COMMENTS & INTERACTIONS
// ──────────────────────────────────────────────

export async function getComments(prisma: PrismaClient, articleId: string) {
  return prisma.articleComment.findMany({
    where: { articleId, parentId: null },
    include: {
      user: true,
      likes: true,
      replies: {
        include: {
          user: true,
          likes: true,
          replies: {
            include: { user: true, likes: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function addComment(
  prisma: PrismaClient,
  userId: string,
  input: { articleId: string; content: string; parentId?: string }
) {
  return prisma.articleComment.create({
    data: {
      content: input.content,
      articleId: input.articleId,
      userId,
      parentId: input.parentId,
    },
    include: {
      user: true,
      likes: true,
    },
  });
}

export async function toggleCommentLike(
  prisma: PrismaClient,
  userId: string,
  commentId: string
) {
  const existing = await prisma.articleCommentLike.findFirst({
    where: { commentId, userId },
  });

  if (existing) {
    await prisma.articleCommentLike.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.articleCommentLike.create({
    data: { commentId, userId },
  });

  return { liked: true };
}

export async function toggleLike(
  prisma: PrismaClient,
  userId: string,
  articleId: string
) {
  const existing = await prisma.articleLike.findFirst({
    where: { articleId, userId },
  });

  if (existing) {
    await prisma.articleLike.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.articleLike.create({
    data: { articleId, userId },
  });

  return { liked: true };
}

export async function toggleSave(
  prisma: PrismaClient,
  userId: string,
  articleId: string
) {
  const existing = await prisma.savedArticle.findFirst({
    where: { articleId, userId },
  });

  if (existing) {
    await prisma.savedArticle.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await prisma.savedArticle.create({
    data: { articleId, userId },
  });

  return { saved: true };
}
