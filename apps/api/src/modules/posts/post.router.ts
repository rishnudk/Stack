import { protectedProcedure, router, publicProcedure } from "../../trpc/trpc";
import * as PostService from "./post.service";
import * as PostSchema from "./post.schema";

export const postRouter = router({
    createPost: protectedProcedure
        .input(PostSchema.createPostSchema)
        .mutation(({ ctx, input }) =>
            PostService.createPost(ctx.prisma, ctx.session.user.id, input)
        ),

    getPosts: publicProcedure
        .input(PostSchema.getPostsSchema)
        .query(({ ctx, input }) =>
            PostService.getPosts(ctx.prisma, ctx.session?.user?.id, input)
        ),

    getPostById: publicProcedure
        .input(PostSchema.getPostByIdSchema)
        .query(({ ctx, input }) =>
            PostService.getPostById(ctx.prisma, ctx.session?.user?.id, input.postId)
        ),

    getUserPosts: publicProcedure
        .input(PostSchema.getUserPostsSchema)
        .query(({ ctx, input }) =>
            PostService.getUserPosts(ctx.prisma, ctx.session?.user?.id, input.userId)
        ),

    deletePost: protectedProcedure
        .input(PostSchema.deletePostSchema)
        .mutation(({ ctx, input }) =>
            PostService.deletePost(ctx.prisma, ctx.session.user.id, input.postId)
        ),

    editPost: protectedProcedure
        .input(PostSchema.editPostSchema)
        .mutation(({ ctx, input }) =>
            PostService.editPost(ctx.prisma, ctx.session.user.id, input)
        ),

    getTrending: publicProcedure
        .query(({ ctx }) =>
            PostService.getTrending(ctx.prisma)
        ),

    getPostsByHashtag: publicProcedure
        .input(PostSchema.getPostsByHashtagSchema)
        .query(({ ctx, input }) =>
            PostService.getPostsByHashtag(ctx.prisma, ctx.session?.user?.id, input)
        ),

    toggleSavePost: protectedProcedure
        .input(PostSchema.toggleSavePostSchema)
        .mutation(({ ctx, input }) =>
            PostService.toggleSavePost(ctx.prisma, ctx.session.user.id, input.postId)
        ),
        
    saveDraft: protectedProcedure
        .input(PostSchema.saveDraftSchema)
        .mutation(({ ctx, input }) =>
            PostService.saveDraft(ctx.prisma, ctx.session.user.id, input)
        ),

    getDrafts: protectedProcedure
        .input(PostSchema.getDraftsSchema)
        .query(({ ctx, input }) =>
            PostService.getDrafts(ctx.prisma, ctx.session.user.id, input)
        ),

    deleteDraft: protectedProcedure
        .input(PostSchema.deleteDraftSchema)
        .mutation(({ ctx, input }) =>
            PostService.deleteDraft(ctx.prisma, ctx.session.user.id, input.draftId)
        ),

    updateDraft: protectedProcedure
        .input(PostSchema.updateDraftSchema)
        .mutation(({ ctx, input }) =>
            PostService.updateDraft(ctx.prisma, ctx.session.user.id, input)
        ),

});
