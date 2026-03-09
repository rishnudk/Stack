import * as ProjectService from "./project.service"
import * as ProjectSchema from "./project.schema"
import { protectedProcedure, publicProcedure, router } from "../../trpc/trpc"

export const projectRouter = router({
    createProject: protectedProcedure
        .input(ProjectSchema.createProjectSchema)
        .mutation(({ ctx, input }) =>
            ProjectService.createProject(ctx.prisma, ctx.session.user.id, input)
        ),

    getProjects: protectedProcedure
        .input(ProjectSchema.getProjectsSchema)
        .query(({ ctx, input }) =>
            ProjectService.getProjects(ctx.prisma, input)),

    getProjectsByUserId: protectedProcedure
        .input(ProjectSchema.getProjectsByUserIdSchema)
        .query(({ ctx, input }) =>
            ProjectService.getProjectsByUserId(ctx.prisma, input.userId)),

    deleteProject: protectedProcedure
        .input(ProjectSchema.deleteProjectSchema)
        .mutation(({ ctx, input }) =>
            ProjectService.deleteProject(ctx.prisma, ctx.session.user.id, input)),

    editProject: protectedProcedure
        .input(ProjectSchema.editProjectSchema)
        .mutation(({ ctx, input }) =>
            ProjectService.editProject(ctx.prisma, ctx.session.user.id, input)),


})  