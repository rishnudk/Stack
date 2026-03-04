import { router, protectedProcedure } from "../../trpc/trpc";
import * as HireMeService from "./hire-me.service";
import * as HireMeSchema from "./hire-me.schema";

export const hireMeRouter = router({
    getStatus: protectedProcedure
        .query(({ ctx }) =>
            HireMeService.getStatus(ctx.prisma, ctx.session.user.id)
        ),

    updateSettings: protectedProcedure
        .input(HireMeSchema.updateHireMeSettingsSchema)
        .mutation(({ ctx, input }) =>
            HireMeService.updateSettings(ctx.prisma, ctx.session.user.id, input)
        ),
});
