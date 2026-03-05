"use client";

import { SlidersHorizontal } from "lucide-react";

export function Navigation({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = ["Newest", "Trending", "Following"];

  return (
    <div className="sticky top-0 z-20 bg-black border-b border-neutral-800 px-6 py-3">
      <div className="flex items-center justify-between">

        {/* Left Title */}
        <h1 className="text-white font-semibold text-lg">
          Scroll
        </h1>

        {/* Center Tabs */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition
                  ${
                    isActive
                      ? "text-green-400 border border-green-500 bg-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Right Filter Button */}
        <button className="p-2 rounded-full border border-neutral-700 hover:bg-neutral-800 transition">
          <SlidersHorizontal size={16} className="text-neutral-300" />
        </button>

      </div>
    </div>
  );
}