import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { createPresignedUrl } from "../../modules/uploads/s3.service";

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
    }),
});
