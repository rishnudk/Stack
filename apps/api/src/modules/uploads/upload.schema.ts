import { z } from "zod";
import { protectedProcedure, router } from "../../trpc/trpc.js";
import { uploadToCloudinary } from "./cloudinary.service.js";

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