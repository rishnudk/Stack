import { z } from "zod";

//create post schema
export const createPostSchema = z.object({
    content: z.string(),
    images: z.array(z.string()).default([]),
    groupId: z.string().optional(),
}).refine((data) => {
    return data.content.trim().length > 0 || data.images.length > 0;
}, {
    message: "Post must have content or images",
    path: ["content", "images"],
});

//get posts schema
export const getPostsSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().default(10),
});

//get posts by Id
export const getPostByIdSchema = z.object({
    postId: z.string()
})

// get users posts
export const getUserPostsSchema = z.object({
    userId: z.string()
})

// deletePost
export const deletePostSchema = z.object({
    postId: z.string()
})

// edit
export const editPostSchema = z.object({
    id: z.string(), content: z.string()
})

//get posts by hashtag
export const getPostsByHashtagSchema = z.object({
    tag: z.string(),
    cursor: z.string().optional(),
    limit: z.number().default(10)
})

//toggle save post
export const toggleSavePostSchema = z.object({
    postId: z.string()
})