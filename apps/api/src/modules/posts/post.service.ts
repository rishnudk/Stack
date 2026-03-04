import type { PrismaClient } from "@prisma/client";

// ── Shared author select shape ──
const AUTHOR_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  avatarUrl: true,
  skills: true,
  
} as const;

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────
export async function createPost(
  prisma: PrismaClient,
  userId: string,
  input: { content: string; images: string[]; groupId?: string }
) {
  const post = await prisma.post.create({
    data: {
      content: input.content,
      images: input.images,
      authorId: userId,
      groupId: input.groupId,
    },
  });

  // Extract and track hashtags
  const tags = [...input.content.matchAll(/#([\w]+)/g)].map((m) =>
    m[1]!.toLowerCase()
  );
  for (const tag of new Set(tags)) {
    const hashtag = await prisma.hashtag.upsert({
      where: { tag },
      create: { tag },
      update: {},
    });
    await prisma.postHashtag.create({
      data: { postId: post.id, hashtagId: hashtag.id },
    });
  }

  return post;
}

// ──────────────────────────────────────────────
// READ (paginated feed)
// ──────────────────────────────────────────────
export async function getPosts(
  prisma: PrismaClient,
  userId: string,
  input: { cursor?: string | null; limit: number }
) {
  const posts = await prisma.post.findMany({
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: AUTHOR_SELECT },
      likes: true,
      comments: true,
      savedBy: { where: { userId }, take: 1 },
    },
  });

  const nextCursor = posts.length > input.limit ? posts.pop()?.id : null;

  return {
    posts: posts.map((post) => ({
      ...post,
      isSaved: post.savedBy.length > 0,
    })),
    nextCursor,
  };
}

// ──────────────────────────────────────────────
// READ (single post)
// ──────────────────────────────────────────────
export async function getPostById(
  prisma: PrismaClient,
  userId: string,
  postId: string
) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: AUTHOR_SELECT },
      likes: true,
      comments: { include: { user: true } },
      savedBy: { where: { userId }, take: 1 },
    },
  });

  if (!post) return null;
  return { ...post, isSaved: post.savedBy.length > 0 };
}

// ──────────────────────────────────────────────
// READ (user posts for profile)
// ──────────────────────────────────────────────
export async function getUserPosts(
  prisma: PrismaClient,
  viewerId: string | undefined,
  userId: string
) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: AUTHOR_SELECT },
      likes: true,
      comments: true,
      savedBy: { where: { userId: viewerId || "" }, take: 1 },
    },
  });

  return posts.map((post) => ({
    ...post,
    isSaved: post.savedBy.length > 0,
  }));
}

// ──────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────
export async function deletePost(
  prisma: PrismaClient,
  userId: string,
  postId: string
) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Unauthorized");

  return prisma.post.delete({ where: { id: postId } });
}

// ──────────────────────────────────────────────
// EDIT
// ──────────────────────────────────────────────
export async function editPost(
  prisma: PrismaClient,
  userId: string,
  input: { id: string; content: string }
) {
  const post = await prisma.post.findUnique({ where: { id: input.id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Unauthorized");

  return prisma.post.update({
    where: { id: input.id },
    data: { content: input.content },
  });
}

// ──────────────────────────────────────────────
// TRENDING HASHTAGS
// ──────────────────────────────────────────────
export async function getTrending(prisma: PrismaClient) {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const rows = await prisma.postHashtag.groupBy({
    by: ["hashtagId"],
    _count: { postId: true },
    where: { post: { createdAt: { gte: since } } },
    orderBy: { _count: { postId: "desc" } },
    take: 5,
  });

  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.hashtagId);
  const hashtags = await prisma.hashtag.findMany({
    where: { id: { in: ids } },
  });
  const tagById = new Map(hashtags.map((h) => [h.id, h.tag]));

  return rows.map((r) => ({
    topic: `#${tagById.get(r.hashtagId) ?? r.hashtagId}`,
    posts: fmt(r._count.postId),
  }));
}

// ──────────────────────────────────────────────
// POSTS BY HASHTAG
// ──────────────────────────────────────────────
export async function getPostsByHashtag(
  prisma: PrismaClient,
  viewerId: string | undefined,
  input: { tag: string; cursor?: string | null; limit: number }
) {
  const hashtag = await prisma.hashtag.findUnique({
    where: { tag: input.tag.toLowerCase().replace(/^#/, "") },
  });

  if (!hashtag) return { posts: [], nextCursor: null };

  const pivots = await prisma.postHashtag.findMany({
    where: { hashtagId: hashtag.id },
    select: { postId: true },
  });
  const postIds = pivots.map((p) => p.postId);

  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: AUTHOR_SELECT },
      likes: true,
      comments: true,
      savedBy: viewerId
        ? { where: { userId: viewerId }, take: 1 }
        : false as any,
    },
  });

  const nextCursor = posts.length > input.limit ? posts.pop()?.id : null;

  return {
    posts: posts.map((post) => ({
      ...post,
      isSaved: Array.isArray(post.savedBy) ? post.savedBy.length > 0 : false,
    })),
    nextCursor,
  };
}

// ──────────────────────────────────────────────
// TOGGLE SAVE
// ──────────────────────────────────────────────
export async function toggleSavePost(
  prisma: PrismaClient,
  userId: string,
  postId: string
) {
  const existingSave = await prisma.savedPost.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existingSave) {
    await prisma.savedPost.delete({ where: { id: existingSave.id } });
    return { isSaved: false };
  }

  await prisma.savedPost.create({ data: { postId, userId } });
  return { isSaved: true };
}
