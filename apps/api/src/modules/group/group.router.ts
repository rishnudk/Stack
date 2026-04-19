import { router, protectedProcedure, publicProcedure } from "../../trpc/trpc";
import * as GroupService from "./group.service";
import * as GroupSchema from "./group.schema";

export const groupRouter = router({
    getGroups: publicProcedure
        .query(({ ctx }) =>
            GroupService.getGroups(ctx.prisma, ctx.session?.user?.id)
        ),

    getGroupById: publicProcedure
        .input(GroupSchema.groupIdSchema)
        .query(({ ctx, input }) =>
            GroupService.getGroupById(ctx.prisma, ctx.session?.user?.id, input.groupId)
        ),

    getGroupPosts: publicProcedure
        .input(GroupSchema.groupIdSchema)
        .query(({ ctx, input }) =>
            GroupService.getGroupPosts(ctx.prisma, ctx.session?.user?.id, input.groupId)
        ),

    getTopGroups: protectedProcedure
        .query(({ ctx }) =>
            GroupService.getTopGroups(ctx.prisma, ctx.session.user.id)
        ),

    joinGroup: protectedProcedure
        .input(GroupSchema.groupIdSchema)
        .mutation(({ ctx, input }) =>
            GroupService.joinGroup(ctx.prisma, ctx.session.user.id, input.groupId)
        ),

    createGroup: protectedProcedure
        .input(GroupSchema.createGroupSchema)
        .mutation(({ ctx, input }) =>
            GroupService.createGroup(ctx.prisma, ctx.session.user.id, input)
        ),
});
