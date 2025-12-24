import { z } from "zod";
import { router, protectedProcedure } from "../trpc.js";

export const hireMeRouter = router({
  // Get current user's hire me status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        availableForHire: true,
        hourlyRate: true,
        preferredWorkType: true,
        resumeUrl: true,
      },
    });

    return user;
  }),

  // Update hire me settings
  updateSettings: protectedProcedure
    .input(
      z.object({
        availableForHire: z.boolean(),
        hourlyRate: z.string().optional(),
        preferredWorkType: z.string().optional(),
        resumeUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          availableForHire: input.availableForHire,
          hourlyRate: input.hourlyRate,
          preferredWorkType: input.preferredWorkType,
          resumeUrl: input.resumeUrl,
        },
        select: {
          availableForHire: true,
          hourlyRate: true,
          preferredWorkType: true,
          resumeUrl: true,
        },
      });

      return updatedUser;
    }),
});