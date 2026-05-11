'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Users, Plus, Shield, Globe } from 'lucide-react';
import CreateGroupModal from '@/components/layout/left-sidebar/CreateGroupModal';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

export function GroupList() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: groups, isLoading } = trpc.groups.getGroups.useQuery();

  const createGroupMutation = trpc.groups.createGroup.useMutation({
    onSuccess: (newGroup) => {
      toast.success('Group created successfully!');
      setIsCreateModalOpen(false);
      utils.groups.getGroups.invalidate();
      router.push(`/group/${newGroup.id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create group');
    },
  });

  const handleCreateGroup = (formData: { name: string; description?: string; privacy: "PUBLIC" | "PRIVATE" }) => {
    createGroupMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col w-full h-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-white">Groups</h1>
          <p className="text-sm text-neutral-400">Discover and join communities</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus size={18} />
          Create Group
        </Button>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : groups?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/30">
            <Users size={48} className="text-neutral-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No groups found</h3>
            <p className="text-neutral-400 max-w-md mb-6">
              You haven't joined any groups yet, and there are no public groups available. Create one to get started!
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Create your first group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups?.map((group) => (
              <Card 
                key={group.id} 
                className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer overflow-hidden flex flex-col"
                onClick={() => router.push(`/group/${group.id}`)}
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-neutral-800 flex-shrink-0 overflow-hidden">
                        {group.image ? (
                          <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="text-blue-400" size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white line-clamp-1">{group.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {group.memberCount} members
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-300 line-clamp-2 mt-2 flex-1">
                    {group.description || "No description provided."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-800/50">
                    <Button 
                      variant="outline" 
                      className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/group/${group.id}`);
                      }}
                    >
                      View Group
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
        isLoading={createGroupMutation.isPending}
      />
    </div>
  );
}
