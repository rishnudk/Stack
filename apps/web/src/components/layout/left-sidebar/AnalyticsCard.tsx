"use client";

export default function AnalyticsCard() {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800">
      <ul className="text-sm">
        <li className="flex justify-between px-4 py-2 hover:bg-neutral-800 cursor-pointer">
          <span className="text-neutral-400">Profile viewers</span>
          <span className="text-sky-500 font-semibold">268</span>
        </li>
        <li className="flex justify-between px-4 py-2 hover:bg-neutral-800 cursor-pointer">
          <span className="text-neutral-400">Post impressions</span>
          <span className="text-sky-500 font-semibold">204</span>
        </li>
      </ul>
    </div>
  );
}
