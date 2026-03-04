import { z } from "zod";

// getLeetCodeStats / getGitHubStats
export const usernameSchema = z.object({
    username: z.string(),
});
