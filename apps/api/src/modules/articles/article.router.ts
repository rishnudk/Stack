import * as ArticleService from "./article.service"
import * as ArticleSchema from "./article.schema"
import { protectedProcedure, publicProcedure, router } from "../../trpc/trpc"

export const articleRouter = router({
  createArticle: protectedProcedure
    .input(ArticleSchema.createArticleSchema)
    .mutation(({ ctx, input }) =>
      ArticleService.createArticle(ctx.prisma, ctx.session.user.id, input)
    ),

  updateArticle: protectedProcedure
    .input(ArticleSchema.updateArticleSchema)
    .mutation(({ ctx, input }) =>
      ArticleService.updateArticle(ctx.prisma, ctx.session.user.id, input)
    ),

  deleteArticle: protectedProcedure
    .input(ArticleSchema.deleteArticleSchema)
    .mutation(({ ctx, input }) =>
      ArticleService.deleteArticle(ctx.prisma, ctx.session.user.id, input)
    ),

  getArticleBySlug: publicProcedure
    .input(ArticleSchema.getArticleBySlugSchema)
    .query(({ ctx, input }) =>
      ArticleService.getArticleBySlug(ctx.prisma, input.slug)
    ),

  getArticles: publicProcedure
    .input(ArticleSchema.getArticlesSchema)
    .query(({ ctx, input }) =>
      ArticleService.getArticles(ctx.prisma, input)
    ),

  getArticlesByUserId: publicProcedure
    .input(ArticleSchema.getArticlesByUserIdSchema)
    .query(({ ctx, input }) =>
      ArticleService.getArticlesByUserId(ctx.prisma, input)
    ),

  getMyArticles: protectedProcedure
    .input(ArticleSchema.getMyArticlesSchema)
    .query(({ ctx, input }) =>
      ArticleService.getMyArticles(ctx.prisma, ctx.session.user.id, input)
    ),
})
