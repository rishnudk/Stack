import { z } from "zod";

export const getPinnedReposSchema = z.object({
    username: z.string(),
})

