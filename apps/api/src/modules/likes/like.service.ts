import { prisma } from "../../prismaClient.js";

export async function toggleLikeService(userId: string, postId: string) {
  const existing = await prisma.like.findFirst({
    where: { userId, postId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  return { liked: true };
}
