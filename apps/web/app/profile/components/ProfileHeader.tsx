"use client";

import { trpc } from "@/utils/trpc";
import { MapPin, Building2, Calendar, Edit2, Share2, Github, Linkedin, Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";


interface ProfileHeaderProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileHeader({ userId, isOwnProfile }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { data: user, isLoading } = trpc.users.getUserByUsername.useQuery(
    { username: userId },
    { enabled: false } // We'll fetch by ID instead
  );

  // Mock data for now - we'll connect real data later
  const mockUser = {
    name: "Rishnu DK",
    username: "rishnudk",
    bio: "Full Stack Developer | Building amazing web experiences with React, Next.js & Node.js",
    location: "Kannur, Kerala",
    company: "Brototype",
    joinedDate: "January 2024",
    avatarUrl: "/rishnudk.jpg",
    coverUrl: null,
    headline: "Full Stack Developer",
    leetcodeUsername: "rishnudk",
    githubUsername: "rishnudk",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "tRPC", "Prisma"],
    socialLinks: {
      github: "https://github.com/rishnudk",
      linkedin: "https://linkedin.com/in/rishnudk",
      portfolio: "https://rishnudk.dev",
    },
    stats: {
      posts: 42,
      followers: 1234,
      following: 567,
    },
  };

  if (isLoading) {
    return <div className="animate-pulse bg-neutral-900 h-96"></div>;
  }

  return (
    <>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={mockUser}
      />
      
      <div className="border-b border-neutral-800">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          {mockUser.coverUrl && (
            <Image src={mockUser.coverUrl} alt="Cover" fill className="object-cover" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Avatar and Action Buttons */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="relative">
              <Image
                src={mockUser.avatarUrl}
                alt={mockUser.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-black"
              />
            </div>

            <div className="flex gap-2 mt-16">
              {isOwnProfile ? (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full font-semibold transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
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
          <h1 className="text-2xl font-bold text-white">{mockUser.name}</h1>
          <p className="text-neutral-500">@{mockUser.username}</p>
        </div>

        {mockUser.bio && (
          <p className="text-white mb-3">{mockUser.bio}</p>
        )}

        {/* Location, Company, Join Date */}
        <div className="flex flex-wrap gap-4 text-neutral-400 text-sm mb-3">
          {mockUser.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{mockUser.location}</span>
            </div>
          )}
          {mockUser.company && (
            <div className="flex items-center gap-1">
              <Building2 size={16} />
              <span>{mockUser.company}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined {mockUser.joinedDate}</span>
          </div>
        </div>

        {/* Social Links */}
        {mockUser.socialLinks && (
          <div className="flex gap-3 mb-4">
            {mockUser.socialLinks.github && (
              <a
                href={mockUser.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {mockUser.socialLinks.linkedin && (
              <a
                href={mockUser.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {mockUser.socialLinks.portfolio && (
              <a
                href={mockUser.socialLinks.portfolio}
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
            <span className="font-bold text-white">{mockUser.stats.posts}</span>
            <span className="text-neutral-500 ml-1">Posts</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">{mockUser.stats.followers}</span>
            <span className="text-neutral-500 ml-1">Followers</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-white">{mockUser.stats.following}</span>
            <span className="text-neutral-500 ml-1">Following</span>
          </div>
        </div>

        {/* Skills */}
        {mockUser.skills && mockUser.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mockUser.skills.map((skill) => (
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
    </>
  );
}
