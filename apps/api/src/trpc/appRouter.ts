import { mergeRouters, router } from "./trpc.ts";
import { userRouter } from "./routers/userRouter.ts";
import { likeRouter } from "./routers/likeRouter.ts";
import { postRouter } from "./routers/postRouter.ts";
import { commentRouter } from "./routers/commentRouter.ts";
import { uploadRouter } from "./routers/uploadRouter.ts";
import { devStatsRouter } from "./routers/devStatsRouter.ts";

export const appRouter = mergeRouters(
  router({
    posts: postRouter,
    comments: commentRouter,
    likes: likeRouter,
    users: userRouter,
    upload: uploadRouter,
    devStats: devStatsRouter,
  })
);


export type AppRouter = typeof appRouter;
