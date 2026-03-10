"use client";

import { useState } from "react";
import { Star, Share2 } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  pinned?: boolean;
}

interface Props {
  repos: Repo[];
}

export default function RepoList({ repos }: Props) {
  const [filter, setFilter] = useState<"all" | "pinned">("all");
  const [visible, setVisible] = useState(4);

  const filteredRepos =
    filter === "pinned" ? repos.filter((r) => r.pinned) : repos;

  const shareRepo = (name: string) => {
    const url = `https://github.com/${name}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-6">

      {/* Dropdown */}
      <div className="flex justify-end">
        <select
          className="border px-3 py-1 rounded-md text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "pinned")}
        >
          <option value="all">All Repositories</option>
          <option value="pinned">Pinned Repositories</option>
        </select>
      </div>

      {/* Repo Grid */}
      <div className="grid md:grid-cols-2 gap-4">

        {filteredRepos.slice(0, visible).map((repo) => (
          <div
            key={repo.id}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">

              <div>
                <h3 className="font-semibold text-lg">{repo.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {repo.description}
                </p>
              </div>

              {/* Share */}
              <button
                onClick={() => shareRepo(repo.name)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <Share2 size={16} />
              </button>

            </div>

            {/* Repo Meta */}
            <div className="flex items-center gap-4 mt-4 text-sm">

              <div className="flex items-center gap-1">
                <Star size={14} />
                {repo.stars}
              </div>

              {repo.language && (
                <span className="px-2 py-0.5 bg-gray-100 rounded">
                  {repo.language}
                </span>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* Show More */}
      {visible < filteredRepos.length && (
        <button
          onClick={() => setVisible((v) => v + 4)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Show More
        </button>
      )}

    </div>
  );
}