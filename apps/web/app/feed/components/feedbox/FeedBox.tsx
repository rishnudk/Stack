"use client";

import { useState } from "react";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import { Navigation } from "./Navigation";
import { CreatePostBox } from "./CreatePostBox";
import { PostList } from "./PostList";
import { PostDetailView } from "./PostDetailView";
import { GroupsList } from "./GroupsList";
import { GroupDetailView } from "./GroupDetailView";

export function FeedBox() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("For you");
  
  // Check if we're on a post detail page
  const isPostDetail = pathname?.startsWith("/feed/post/");
  const postId = params?.id as string;
  
  // Check if we're viewing a group
  const groupId = searchParams?.get("groupId");

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
      {isPostDetail && postId ? (
        // Show post detail view
        <PostDetailView postId={postId} />
      ) : groupId ? (
        // Show group detail view
        <GroupDetailView groupId={groupId} />
      ) : (
        // Show normal feed
        <>
          {/* Top navigation tabs (For you, Following...) */}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "Groups" ? (
            <GroupsList />
          ) : (
            <>
              {/* Create new post box */}
              <CreatePostBox />

              {/* Post feed */}
              <PostList />
            </>
          )}
        </>
      )}
    </div>
  );
}