"use client";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreatePostBox } from "./CreatePostBox";
import { PostCard } from "./PostCard";

interface GroupDetailViewProps {
  groupId: string;
}

const MOCK_GROUPS = {
  "1": {
    id: "1",
    name: "React Developers",
    description: "A community for React.js enthusiasts to share knowledge and projects.",
    memberCount: 12500,
    image: "https://github.com/facebook.png",
  },
  "2": {
    id: "2",
    name: "Startup Founders",
    description: "Connect with other founders, share resources, and get feedback.",
    memberCount: 8400,
    image: "https://github.com/ycombinator.png",
  },
  "3": {
    id: "3",
    name: "Next.js Wizards",
    description: "Everything about Next.js, Vercel, and server-side rendering.",
    memberCount: 9200,
    image: "https://github.com/vercel.png",
  },
  "4": {
    id: "4",
    name: "Web Design Pros",
    description: "Discuss trends, tools, and share your latest designs.",
    memberCount: 5600,
    image: "https://github.com/figma.png",
  },
};

const MOCK_GROUP_POSTS = [
  {
    id: "g1",
    name: "Sarah Chen",
    username: "sarahchen",
    time: "2h",
    text: "Just launched my new React component library! Check it out and let me know what you think. Built with TypeScript and fully accessible.",
    userId: "user1",
    avatarUrl: "https://github.com/shadcn.png",
    likeCount: 45,
    commentCount: 12,
  },
  {
    id: "g2",
    name: "Mike Johnson",
    username: "mikej",
    time: "5h",
    text: "Anyone else excited about React 19? The new features are game-changing! 🚀",
    userId: "user2",
    avatarUrl: "https://github.com/vercel.png",
    likeCount: 89,
    commentCount: 23,
  },
  {
    id: "g3",
    name: "Emma Wilson",
    username: "emmaw",
    time: "1d",
    text: "Looking for feedback on my portfolio redesign. Built with Next.js 14 and Tailwind CSS.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
    userId: "user3",
    avatarUrl: "https://github.com/github.png",
    likeCount: 156,
    commentCount: 34,
  },
];

export function GroupDetailView({ groupId }: GroupDetailViewProps) {
  const router = useRouter();
  const group = MOCK_GROUPS[groupId as keyof typeof MOCK_GROUPS];

  if (!group) {
    return (
      <div className="p-8 text-center text-neutral-400">
        Group not found
      </div>
    );
  }

  const handleBack = () => {
    router.push("/feed");
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <Image
              src={group.image}
              alt={group.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="font-bold text-lg">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Users size={14} />
                <span>{group.memberCount.toLocaleString()} members</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full font-semibold text-sm transition-colors">
            Joined
          </button>
        </div>
        <div className="px-4 pb-3">
          <p className="text-neutral-400 text-sm">{group.description}</p>
        </div>
      </div>

      {/* Create Post Box */}
      <CreatePostBox />

      {/* Group Posts */}
      <div className="flex flex-col">
        {MOCK_GROUP_POSTS.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            name={post.name}
            username={post.username}
            time={post.time}
            text={post.text}
            imageUrl={post.imageUrl}
            avatarUrl={post.avatarUrl}
            userId={post.userId}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
          />
        ))}
      </div>
    </div>
  );
}
