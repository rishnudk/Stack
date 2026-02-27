"use client";

import { trpc } from "@/utils/trpc";

export function TrendingCard() {
  const { data: trends = [], isLoading } = trpc.posts.getTrending.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 } // re-fetch at most every 5 minutes
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

      <div className="space-y-3">
        {trends.map((trend, idx) => (
          <div
            key={idx}
            className="cursor-pointer hover:bg-neutral-800 p-2 rounded-md transition"
          >
            <p className="text-sm text-neutral-400">Trending now</p>
            <p className="font-semibold text-white">{trend.topic}</p>
            <p className="text-sm text-neutral-400">{trend.posts} posts</p>
          </div>
        ))}
      </div>
    </div>
  );
}
