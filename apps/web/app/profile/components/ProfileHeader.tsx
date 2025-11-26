"use client";

import { trpc } from "@/utils/trpc";
import { MapPin, Building2, Calendar, Share2, Github, Linkedin, Globe } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileHeader({ userId, isOwnProfile }: ProfileHeaderProps) {
  // Fetch real user data by ID
  const { data: user, isLoading } = trpc.users.getUserById.useQuery(
    { userId },
    { enabled: !!userId }
  );

  if (isLoading) {
    return <div className="animate-pulse bg-neutral-900 h-96"></div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-neutral-500">User not found</div>;
  }

  // Extract username from email
  const username = user.email?.split("@")[0] || "user";
  
  // Format join date
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  type SocialLinks = {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };

  // Fix for TypeScript "excessively deep" error - use simpler type assertion
  const socialLinks = (user.socialLinks || {}) as SocialLinks;

  return (
    <div className="border-b border-neutral-800">
      {/* Cover Photo */}
      <div className="relative h-48">
        {user.coverUrl ? (
          <img 
            src={user.coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${user.coverGradient || 'from-blue-600 via-purple-600 to-pink-600'}`} />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        {/* Avatar and Action Buttons */}
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="relative">
            <Image
              src={user.avatarUrl || user.image || "/default-avatar.png"}
              alt={user.name || "User"}
              width={128}
              height={128}
              className="rounded-full border-4 border-black"
            />
          </div>

          <div className="flex gap-2 mt-16">
            {!isOwnProfile && (
              <button className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-full font-semibold transition-colors">
                Follow
              </button>
            )}
            <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-white">{user.name || "Anonymous"}</h1>
          <p className="text-neutral-500">@{username}</p>
        </div>

        {user.bio && (
          <p className="text-white mb-3">{user.bio}</p>
        )}

        {/* Location, Company, Join Date */}
        <div className="flex flex-wrap gap-4 text-neutral-400 text-sm mb-3">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
          )}
          {user.company && (
            <div className="flex items-center gap-1">
              <Building2 size={16} />
              <span>{user.company}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Social Links */}
        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <div className="flex gap-3 mb-4">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {socialLinks.portfolio && (
              <a
                href={socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Globe size={20} />
              </a>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">{user._count.posts}</span>
            <span className="text-neutral-500 ml-1">Posts</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">0</span>
            <span className="text-neutral-500 ml-1">Followers</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">0</span>
            <span className="text-neutral-500 ml-1">Following</span>
          </div>
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
