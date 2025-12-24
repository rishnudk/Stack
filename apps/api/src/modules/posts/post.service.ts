import { prisma } from "../../prismaClient.js";

export async function createPostService(
  userId: string,
  input: { content: string; images: string[] }
) {
  return prisma.post.create({
    data: {
      content: input.content,
      images: input.images,
      authorId: userId,
    },
  });
}

export async function getPostsService({
  cursor,
  limit,
}: {
  cursor?: string | null;
  limit: number;
}) {
  const posts = await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      likes: true,
      comments: true,
    },
  });

  let nextCursor: string | null = null;

  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }

  return { posts, nextCursor };
}
