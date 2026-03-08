import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Project description is required"),
    openToContributions: z.boolean().default(false),
    liveLink: z.string().optional(),
    githubLink: z.string().optional(),
    imageUrl: z.string().optional()
})

export const updateProjectSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    openToContributions: z.boolean().optional(),
    liveLink: z.string().optional(),
    githubLink: z.string().optional(),
    imageUrl: z.string().optional()
})

export const deleteProjectSchema = z.object({
    id: z.string()
})

export const getProjectByIdSchema = z.object({
    id: z.string()
})

export const getProjectsSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().default(10)
})

