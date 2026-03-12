import { router, publicProcedure } from "../../trpc/trpc"
import * as GithubService from "./github.service"
import { getPinnedReposSchema } from "./github.schema"

export const githubRouter = router({
    getPinnedRepos: publicProcedure
        .input(getPinnedReposSchema)
        .query(({ input }) => {
            return GithubService.getPinnedRepos(input.username)
        }),
})