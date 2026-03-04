import { z } from "zod";

// getComments
export const getCommentsSchema = z.object({
    postId: z.string(),
});

// addComment
export const addCommentSchema = z.object({
    postId: z.string(),
    content: z.string(),
    parentId: z.string().optional(),
});

// toggleCommentLike
export const toggleCommentLikeSchema = z.object({
    commentId: z.string(),
});
