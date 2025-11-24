"use client";
import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div className=" ">
      <Image
        src="/logo.png" 
        alt="App Logo"
        width={36}
        height={36}
        className="cursor-pointer hover:opacity-80 transition  dark:invert"
      />
    </div>
  );
}
