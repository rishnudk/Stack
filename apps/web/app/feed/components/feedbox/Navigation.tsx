'use client'

import React from 'react'


export function Navigation({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  const tabs = ["For you", "Following", "Groups"];

  return (
    <nav className="flex justify-around border-b border-neutral-800 bg-black text-white sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-3 flex-1 text-sm font-semibold transition ${
            activeTab === tab ? "border-b-2 border-sky-500 text-white" : "text-neutral-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
