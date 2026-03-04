import { z } from "zod";
import { router, protectedProcedure } from "../../trpc/trpc";
import { createPresignedUrl } from "../uploads/s3.service";

export const uploadRouter = router({
    getPresignedUrl: protectedProcedure
        .input(
            z.object({
                fileType: z.string(),
                fileName: z.string(),
            })
        )
        .mutation(({ input }) =>
            createPresignedUrl(input.fileType, input.fileName)
        ),
});
