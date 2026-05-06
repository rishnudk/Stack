import { z } from "zod";
import { router, protectedProcedure } from "../../trpc/trpc";
import { uploadToCloudinary } from "./cloudinary.service";

export const uploadRouter = router({
    uploadFile: protectedProcedure
        .input(
            z.object({
                fileBase64: z.string(),
                fileName: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const fileUrl = await uploadToCloudinary(input.fileBase64, input.fileName);
            return { fileUrl };
        }),

    // Keep the old name as an alias so any missed references don't break
    getPresignedUrl: protectedProcedure
        .input(
            z.object({
                fileBase64: z.string(),
                fileName: z.string(),
                fileType: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const fileUrl = await uploadToCloudinary(input.fileBase64, input.fileName);
            return { fileUrl, uploadUrl: "" };
        }),
});
