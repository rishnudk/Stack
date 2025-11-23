"use client";
import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div className="flex items-center justify-center py-4">
      <Image
        src="/twitch.svg" 
        alt="App Logo"
        width={36}
        height={36}
        className="cursor-pointer hover:opacity-80 transition"
      />
    </div>
  );
}
