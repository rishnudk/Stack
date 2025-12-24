import { mergeRouters, router } from "./trpc.js";
import { userRouter } from "./routers/userRouter.js";
import { likeRouter } from "./routers/likeRouter.js";
import { postRouter } from "./routers/postRouter.js";
import { commentRouter } from "./routers/commentRouter.js";
import { uploadRouter } from "./routers/uploadRouter.js";
import { devStatsRouter } from "./routers/devStatsRouter.js";
import { hireMeRouter } from "./routers/hireMeRouter.js";
import { groupRouter } from "./routers/group.router.js";
import { messagingRouter } from "./routers/messagingrouter.js";

export const appRouter = mergeRouters(
  router({
    posts: postRouter,
    comments: commentRouter,
    likes: likeRouter,
    users: userRouter,
    upload: uploadRouter,
    devStats: devStatsRouter,
    hireMe: hireMeRouter,
    groups: groupRouter,
    messaging: messagingRouter,
  })
);


export type AppRouter = typeof appRouter;
