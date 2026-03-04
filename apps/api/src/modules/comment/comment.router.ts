import { router, protectedProcedure } from "../../trpc/trpc";
import * as CommentService from "./comment.service";
import * as CommentSchema from "./comment.schema";

export const commentRouter = router({
    getComments: protectedProcedure
        .input(CommentSchema.getCommentsSchema)
        .query(({ ctx, input }) =>
            CommentService.getComments(ctx.prisma, input.postId)
        ),

    addComment: protectedProcedure
        .input(CommentSchema.addCommentSchema)
        .mutation(({ ctx, input }) =>
            CommentService.addComment(ctx.prisma, ctx.session.user.id, input)
        ),

    toggleCommentLike: protectedProcedure
        .input(CommentSchema.toggleCommentLikeSchema)
        .mutation(({ ctx, input }) =>
            CommentService.toggleCommentLike(ctx.prisma, ctx.session.user.id, input.commentId)
        ),
});
