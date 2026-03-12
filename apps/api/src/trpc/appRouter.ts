import { router } from "./trpc";

import { userRouter } from "../modules/user/user.router";
import { likeRouter } from "../modules/likes/like.router";
import { postRouter } from "../modules/posts/post.router";
import { commentRouter } from "../modules/comment/comment.router";
import { uploadRouter } from "../modules/uploads/upload.router";
import { devStatsRouter } from "../modules/dev-stats/dev-stats.router";
import { hireMeRouter } from "../modules/hire-me/hire-me.router";
import { groupRouter } from "../modules/group/group.router";
import { messagingRouter } from "../modules/messaging/messaging.router";
import { projectRouter } from "../modules/projects/project.router";
import { articleRouter } from "../modules/articles/article.router";
import { githubRouter } from "../modules/github/github.router";

export const appRouter = router({
  posts: postRouter,
  comments: commentRouter,
  likes: likeRouter,
  users: userRouter,
  upload: uploadRouter,
  devStats: devStatsRouter,
  hireMe: hireMeRouter,
  groups: groupRouter,
  messaging: messagingRouter,
  projects: projectRouter,
  articles: articleRouter,
  github: githubRouter,
});

export type AppRouter = typeof appRouter;