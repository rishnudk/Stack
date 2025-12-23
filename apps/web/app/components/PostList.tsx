'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';

export function PostList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.posts.getPosts.useQuery({ limit: 10 });
  const posts = data?.posts;

  const deletePost = trpc.posts.deletePost.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      utils.posts.getPosts.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });

  const editPost = trpc.posts.editPost.useMutation({
    onSuccess: () => {
      toast.success('Post updated successfully!');
      setEditingId(null);
      setEditContent('');
      utils.posts.getPosts.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update post');
    },
  });

  const handleStartEdit = (post: { id: string; content: string }) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = (postId: string) => {
    if (!editContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    editPost.mutate({ id: postId, content: editContent });
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate({ id: postId });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center text-gray-500">
        No posts yet. Create your first post!
      </div>
    );
  }

  type Post = NonNullable<typeof posts>[number];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
      {posts.map((post: Post) => (
        <div key={post.id} className="p-6 bg-white rounded-lg shadow-md">
          {editingId === post.id ? (
            <div className="space-y-4">

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={editPost.isPending}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveEdit(post.id)}
                  disabled={editPost.isPending}
                >
                  {editPost.isPending ? 'Saving...' : 'Save'}
                </Button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={editPost.isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="text-sm text-gray-500 mb-4">
                Created: {new Date(post.createdAt).toLocaleDateString()}
                {post.updatedAt !== post.createdAt && (
                  <span> • Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleStartEdit(post)}>Edit</Button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={deletePost.isPending}
                >
                  {deletePost.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

