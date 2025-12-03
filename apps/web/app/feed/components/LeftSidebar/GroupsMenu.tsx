"use client";
import { useState, useRef, useEffect } from "react";
import { Users, Plus, Star, Trophy, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GroupsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleGroupClick = (groupId: string) => {
    router.push(`/feed?groupId=${groupId}`);
    setIsOpen(false);
  };

  const handleCreateGroup = () => {
    console.log("Create Group - Modal coming soon");
    setIsOpen(false);
  };

  const topGroups = [
    { id: "1", name: "React Developers" },
    { id: "2", name: "Startup Founders" },
    { id: "3", name: "Next.js Wizards" },
  ];

  const starredGroups = [
    { id: "4", name: "Web Design Pros" },
    { id: "1", name: "React Developers" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-20">
          <div className="p-2 border-b border-neutral-800">
            <button
              onClick={handleCreateGroup}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Create Group</span>
            </button>
          </div>

          <div className="py-2">
            <div className="px-4 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Trophy size={12} />
              Top Joined
            </div>
            {topGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <span className="truncate">{group.name}</span>
              </button>
            ))}
          </div>

          <div className="py-2 border-t border-neutral-800">
            <div className="px-4 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Star size={12} />
              Starred
            </div>
            {starredGroups.map((group) => (
              <button
                key={`starred-${group.id}`}
                onClick={() => handleGroupClick(group.id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <span className="truncate">{group.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Users size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
            Groups
          </span>
        </div>
        <ChevronUp
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
