import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "../context.js";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  console.log("🔒 [MIDDLEWARE] protectedProcedure called");
  console.log("🔒 [MIDDLEWARE] ctx keys:", Object.keys(ctx));
  console.log("🔒 [MIDDLEWARE] ctx.io present:", !!(ctx as any).io);

  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // Infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const mergeRouters = t.mergeRouters;
