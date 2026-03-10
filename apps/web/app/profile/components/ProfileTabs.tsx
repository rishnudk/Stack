import { ProfileTab } from "@/types/profile-tab";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs: ProfileTab[] = ["projects", "posts", "resume", "articles"];

  return (
    <div className="flex border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 font-semibold relative transition-colors ${
            activeTab === tab
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}

          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}