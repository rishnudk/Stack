"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

export function SuggestionsCard() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: suggestions = [], isLoading } =
    trpc.users.getSuggestions.useQuery(undefined, {
      enabled: !!session?.user,
    });

  const followMutation = trpc.users.follow.useMutation({
    onSuccess: () => {
      // Refetch suggestions after following someone
      utils.users.getSuggestions.invalidate();
    },
  });

  const utils = trpc.useUtils();

  if (!session?.user) return null;

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
        <h3 className="font-bold text-lg mb-3">You might like</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-700" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded bg-neutral-700" />
                  <div className="h-2 w-16 rounded bg-neutral-700" />
                </div>
              </div>
              <div className="h-8 w-16 rounded-full bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  const handleFollow = (userId: string) => {
    followMutation.mutate({ userId });
  };

  const handleNavigate = (email: string | null | undefined) => {
    if (!email) return;
    const username = email.split("@")[0];
    router.push(`/profile/${username}`);
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 text-white border border-neutral-800">
      <h3 className="font-bold text-lg mb-3">You might like</h3>

      <div className="space-y-3">
        {suggestions.map((user) => {
          const displayImage = user.avatarUrl ?? user.image;
          const username = user.email ? user.email.split("@")[0] : user.id;

          return (
            <div key={user.id} className="flex items-center justify-between">
              {/* User Info */}
              <button
                className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                onClick={() => handleNavigate(user.email)}
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={user.name ?? "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div>
                  <p className="font-semibold leading-tight">{user.name}</p>
                  <p className="text-sm text-neutral-400">@{username}</p>
                  {user.headline && (
                    <p className="text-xs text-neutral-500 truncate max-w-[120px]">
                      {user.headline}
                    </p>
                  )}
                  {/* Match reason badges */}
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {user.sharedSkillCount > 0 && (
                      <span className="text-xs text-sky-400">
                        {user.sharedSkillCount} shared skill{user.sharedSkillCount > 1 ? "s" : ""}
                      </span>
                    )}
                    {user.sameCompany && user.company && (
                      <span className="text-xs text-purple-400">
                        · {user.company}
                      </span>
                    )}
                    {user.sameLocation && user.location && (
                      <span className="text-xs text-emerald-400">
                        · {user.location}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Follow button */}
              <Button
                className="bg-white text-black rounded-full hover:bg-neutral-200 text-sm"
                onClick={() => handleFollow(user.id)}
                disabled={followMutation.isPending}
              >
                Follow
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
