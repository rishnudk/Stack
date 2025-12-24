import { z } from "zod";
import { protectedProcedure, router } from "../../trpc/trpc.js";
import { createPresignedUrl } from "./s3.service.js";


export const uploadRouter = router({
    getPresignedUrl: protectedProcedure
        .input(
            z.object({
                fileType: z.string(),
                fileName: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            return await createPresignedUrl(input.fileType, input.fileName);
        })
})