import { z } from "zod";

// updateSettings
export const updateHireMeSettingsSchema = z.object({
    availableForHire: z.boolean(),
    hourlyRate: z.string().optional(),
    preferredWorkType: z.string().optional(),
    resumeUrl: z.string().optional(),
});
