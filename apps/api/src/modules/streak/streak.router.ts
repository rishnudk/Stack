import { router, protectedProcedure } from "../../trpc/trpc";
import {
  getStreakSchema,
  updateStreakSchema,
} from "./streak.schema"
import * as StreakService from "./streak.service"

export const streakRouter = router({
  getStreak: protectedProcedure
    .input(getStreakSchema)
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      return StreakService.getStreakService(ctx.prisma, userId)
    }),

  updateStreak: protectedProcedure
    .input(updateStreakSchema)
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id
      return StreakService.updateStreakService(ctx.prisma, userId)
    }),
})