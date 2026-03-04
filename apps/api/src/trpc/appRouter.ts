import { mergeRouters, router } from "./trpc";
import { userRouter } from "../modules/user/user.router";
import { likeRouter } from "./routers/likeRouter";
import { postRouter } from "../modules/posts/post.router";
import { commentRouter } from "./routers/commentRouter";
import { uploadRouter } from "./routers/uploadRouter";
import { devStatsRouter } from "./routers/devStatsRouter";
import { hireMeRouter } from "./routers/hireMeRouter";
import { groupRouter } from "./routers/group.router";
import { messagingRouter } from "./routers/messagingrouter";

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
