import { router, publicProcedure } from "../../trpc/trpc";
import * as DevStatsService from "./dev-stats.service";
import * as DevStatsSchema from "./dev-stats.schema";

export const devStatsRouter = router({
    getLeetCodeStats: publicProcedure
        .input(DevStatsSchema.usernameSchema)
        .query(({ input }) =>
            DevStatsService.getLeetCodeStats(input.username)
        ),

    getGitHubStats: publicProcedure
        .input(DevStatsSchema.usernameSchema)
        .query(({ input }) =>
            DevStatsService.getGitHubStats(input.username)
        ),
});
