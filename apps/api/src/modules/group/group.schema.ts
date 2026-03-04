import { z } from "zod";

// getGroupById / getGroupPosts / joinGroup
export const groupIdSchema = z.object({
    groupId: z.string(),
});

// createGroup
export const createGroupSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(200).optional(),
    privacy: z.enum(["PUBLIC", "PRIVATE"]),
});
