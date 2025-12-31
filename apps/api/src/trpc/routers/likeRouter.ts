
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const likeRouter = router({
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.like.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      if (existing) {
        await ctx.prisma.like.delete({ where: { id: existing.id } });
        return { liked: false };
      }

      await ctx.prisma.like.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      return { liked: true };
    }),
});
