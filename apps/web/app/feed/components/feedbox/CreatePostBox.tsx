"use client";
import { useState } from "react";
import { FileText, Sparkles, Code2, Users, Image, Smile } from "lucide-react";
import ImageNext from "next/image";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import Link from "next/link";
import { CreatePostModal } from "./CreatePostModal";
import { DraftModal } from "./DraftModal";

interface CreatePostBoxProps {
  groupId?: string;
  session?: Session | null;
}

export function CreatePostBox({ groupId, session }: CreatePostBoxProps = {}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // ── Guest CTA Banner ──────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="border-b border-neutral-800 bg-linear-to-br from-neutral-950 to-black px-5 py-5 text-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest">
            <Sparkles size={12} className="text-green-400" />
            <span>The dev social network</span>
          </div>
          <h3 className="text-[15px] font-semibold text-white leading-snug">
            Share your work, connect with devs,<br />
            <span className="text-green-400">and build your engineering brand.</span>
          </h3>
          <div className="flex items-center gap-4 text-neutral-500 text-xs mt-1">
            <span className="flex items-center gap-1.5">
              <Code2 size={12} className="text-neutral-400" />
              Share code &amp; projects
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-neutral-400" />
              Follow top engineers
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Link href="/signup">
              <button className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200 active:scale-95">
                Join Stack
              </button>
            </Link>
            <Link href="/signin">
              <button className="text-neutral-300 hover:text-white text-sm border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-full transition-all duration-200">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Create Post Box ─────────────────────────────────────────
  return (
    <>
      <div className="border-b border-neutral-800 bg-black px-4 py-3 text-white">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <ImageNext
            src={session?.user?.image || "/profile.png"}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />

          <div className="flex-1">
            {/* Clickable fake textarea that opens the modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left text-neutral-500 text-[15px] py-1 hover:text-neutral-400 transition-colors focus:outline-none"
            >
              What are you building?
            </button>

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-5 text-neutral-400">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hover:text-white transition-colors"
                  title="Add image"
                >
                  <Image size={18} />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hover:text-white transition-colors"
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>
                {/* Drafts icon */}
                <button
                  onClick={() => setIsDraftModalOpen(true)}
                  className="hover:text-white transition-colors"
                  title="View drafts"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2h11" />
                    <path d="M18 6v13.5" />
                    <path d="M6.5 2v15.5A2 2 0 0 0 8.5 19H18" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/article")}
                  className="flex items-center gap-2 border border-neutral-700 px-4 py-1.5 rounded-full text-sm hover:bg-neutral-900 transition-colors"
                >
                  <FileText size={16} />
                  Write Article
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-green-500 hover:bg-green-400 px-5 py-1.5 text-black font-semibold text-sm transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={session}
        groupId={groupId}
      />

      {/* Draft List Modal */}
      <DraftModal
        open={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        session={session}
        groupId={groupId}
      />
    </>
  );
}
