import { z } from "zod"

export const updateStreakSchema = z.object({
  // optional: if you want manual trigger
  trigger: z.string().optional(),
})

export const getStreakSchema = z.object({
  // no input needed for now
})