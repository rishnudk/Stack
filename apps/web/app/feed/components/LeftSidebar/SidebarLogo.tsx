"use client";
import Image from "next/image";
import Link from "next/link";

export default function SidebarLogo() {
  return (
    
    <Link href= "/feed" className="flex items-center gap-2 hover:opacity-80 transition">
    <Image 
    src="/logo.png"
    alt="App logo"
    width={36}
    height={36}
    className="dark:invert"
    /> 
    <span className="text-xl font-bold text-white">Stack</span>
    
    
    </Link>
  );
}
