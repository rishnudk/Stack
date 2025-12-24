"use client";
import { trpc } from "@/utils/trpc";
import { useState, useRef, useEffect } from "react";
import { Users, Plus, Star, Trophy, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateGroupModal from "./CreateGroupModal";

interface GroupsMenuProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export default function GroupsMenu({ onOpenChange }: GroupsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  const handleGroupClick = (groupId: string) => {
    router.push(`/feed?groupId=${groupId}`);
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const createGroupMutation = trpc.groups.createGroup.useMutation({
    onSuccess: (newGroup) => {
      // Refresh the group list
      trpc.useContext().groups.getTopGroups.invalidate();
      trpc.useContext().groups.getGroups.invalidate();

      // Close modal
      setIsModalOpen(false);

      // Navigate to the new group
      router.push(`/feed?groupId=${newGroup.id}`);
    },
    onError: (error) => {
      console.error("Failed to create group:", error);
      // Modal stays open so user can see the error and try again
    },
  });

  const handleCreateGroup = (formData: {
    name: string;
    description?: string;
    privacy: "PUBLIC" | "PRIVATE";
  }) => {
    createGroupMutation.mutate(formData);
  };

  const handleOpenModal = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    setIsModalOpen(true);
  };


  const { data: topGroups, isLoading: isLoadingTop } = trpc.groups.getTopGroups.useQuery();
  const { data: allGroups, isLoading: isLoadingAll } = trpc.groups.getGroups.useQuery();


  return (
    <div className="relative" ref={menuRef}>
      {isOpen && (
        <div className="
  max-h-60
  overflow-y-auto
  scrollbar-hide
  absolute top-full left-0 right-0 mt-2
  bg-neutral-900 border border-neutral-800
  rounded-xl shadow-lg
  animate-in fade-in slide-in-from-top-2
  duration-200 z-20
">
          <div className="p-2 border-b border-neutral-800">
            <button
              onClick={handleOpenModal}
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
            {isLoadingTop ? (
              <div className="px-4 py-2 text-sm text-neutral-500">Loading...</div>
            ) : topGroups && topGroups.length > 0 ? (
              topGroups.map((group: any) => (
                <button
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <span className="truncate">{group.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-neutral-500">No groups joined yet</div>
            )}
          </div>

          <div className="py-2 border-t border-neutral-800">
            <div className="px-4 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Star size={12} />
              All Groups
            </div>
            {isLoadingAll ? (
              <div className="px-4 py-2 text-sm text-neutral-500">Loading...</div>
            ) : allGroups && allGroups.length > 0 ? (
              allGroups.slice(0, 5).map((group: any) => (
                <button
                  key={`all-${group.id}`}
                  onClick={() => handleGroupClick(group.id)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <span className="truncate">{group.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-neutral-500">No groups available</div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          onOpenChange?.(newState);
        }}
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
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGroup}
        isLoading={createGroupMutation.isPending}
      />
    </div>
  );
}
