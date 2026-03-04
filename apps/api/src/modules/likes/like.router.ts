import { z } from "zod";
import { router, protectedProcedure } from "../../trpc/trpc";
import * as LikeService from "./like.service";

export const likeRouter = router({
    toggleLike: protectedProcedure
        .input(z.object({ postId: z.string() }))
        .mutation(({ ctx, input }) =>
            LikeService.toggleLike(ctx.prisma, ctx.session.user.id, input.postId)
        ),
});
