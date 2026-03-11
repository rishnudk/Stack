import { router, publicProcedure, protectedProcedure } from "../../trpc/trpc";
import * as UserService from "./user.service";
import * as UserSchema from "./user.schema";

export const userRouter = router({
    createUser: publicProcedure
        .input(UserSchema.createUserSchema)
        .mutation(({ ctx, input }) =>
            UserService.createUser(ctx.prisma, input)
        ),

    getSidebarInfo: publicProcedure
        .input(UserSchema.getSidebarInfoSchema)
        .query(({ ctx, input }) =>
            UserService.getSidebarInfo(ctx.prisma, input.userId ?? ctx.session?.user?.id)
        ),

    getUserByUsername: publicProcedure
        .input(UserSchema.getUserByUsernameSchema)
        .query(({ ctx, input }) =>
            UserService.getUserByUsername(ctx.prisma, input.username)
        ),

    getUserById: publicProcedure
        .input(UserSchema.getUserByIdSchema)
        .query(({ ctx, input }) =>
            UserService.getUserById(ctx.prisma, ctx.session?.user?.id, input.userId)
        ),

    follow: protectedProcedure
        .input(UserSchema.followSchema)
        .mutation(({ ctx, input }) =>
            UserService.follow(ctx.prisma, ctx.session.user.id, input.userId)
        ),

    unfollow: protectedProcedure
        .input(UserSchema.followSchema)
        .mutation(({ ctx, input }) =>
            UserService.unfollow(ctx.prisma, ctx.session.user.id, input.userId)
        ),

    updateProfile: protectedProcedure
        .input(UserSchema.updateProfileSchema)
        .mutation(({ ctx, input }) =>
            UserService.updateProfile(ctx.prisma, ctx.session.user.id, input)
        ),

    getGithubPinnedRepos: publicProcedure
        .input(UserSchema.getGithubPinnedReposSchema)
        .query(({ input }) =>
            UserService.getGithubPinnedRepos(input.username)
        ),

    completeOnboarding: protectedProcedure
        .mutation(({ ctx }) =>
            UserService.completeOnboarding(ctx.prisma, ctx.session.user.id)
        ),

    getSuggestions: protectedProcedure
        .query(({ ctx }) =>
            UserService.getSuggestions(ctx.prisma, ctx.session.user.id)
        ),

    getContributionGraph: publicProcedure
        .input(UserSchema.getContributionGraphSchema)
        .query(({ input }) =>
            UserService.getContributionGraph(input.username)
        ),
});
