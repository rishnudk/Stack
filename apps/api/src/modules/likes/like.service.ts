import type { PrismaClient } from "@prisma/client";

// ──────────────────────────────────────────────
// TOGGLE LIKE
// ──────────────────────────────────────────────
export async function toggleLike(
  prisma: PrismaClient,
  userId: string,
  postId: string
) {
  const existing = await prisma.like.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({
    data: { postId, userId },
  });

  return { liked: true };
}
