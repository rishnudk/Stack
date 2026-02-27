"use client";

import Link from "next/link";
import { trpc } from "@/utils/trpc";

export function TrendingCard() {
  const { data: trends = [], isLoading } = trpc.posts.getTrending.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
        <h3 className="font-bold text-lg mb-3">What&apos;s happening</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-1 p-2">
              <div className="h-2 w-20 rounded bg-neutral-700" />
              <div className="h-3 w-32 rounded bg-neutral-700" />
              <div className="h-2 w-16 rounded bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
        <h3 className="font-bold text-lg mb-3">What&apos;s happening</h3>
        <p className="text-sm text-neutral-500">
          No trending topics yet. Start using hashtags in your posts!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
      <h3 className="font-bold text-lg mb-3">What&apos;s happening</h3>

      <div className="space-y-1">
        {trends.map((trend, idx) => {
          // topic is e.g. "#nextjs" — strip the # for the URL segment
          const tagSlug = trend.topic.replace(/^#/, "");
          return (
            <Link
              key={idx}
              href={`/hashtag/${tagSlug}`}
              className="block cursor-pointer hover:bg-neutral-800 p-2 rounded-md transition-colors group"
            >
              <p className="text-xs text-neutral-500">Trending now</p>
              <p className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                {trend.topic}
              </p>
              <p className="text-xs text-neutral-500">{trend.posts} posts</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
