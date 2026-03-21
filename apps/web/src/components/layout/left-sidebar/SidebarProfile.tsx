import Image from "next/image";
import { ArrowRight } from "lucide-react";


interface SidebarProfileProps {
  user: any;
}

export default function SidebarProfile({ user }: SidebarProfileProps) {
  if (!user) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10">
      
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <Image
            src={user.image || user.avatarUrl || "/profile.png"}
            alt={user.name || "profile"}
            fill
            className="rounded-full object-cover border border-white/10"
          />
        </div>

        <div>
          <p className="text-[15px] font-semibold text-white group-hover:text-white transition-colors">
            {user.name || "User"}
          </p>
          <p className="text-[12px] text-neutral-500 group-hover:text-neutral-400 transition-colors">
            <span className="font-medium text-neutral-300">{user._count?.followers ?? 0}</span> followers • <span className="font-medium text-neutral-300">{user._count?.following ?? 0}</span> following
          </p>
        </div>
      </div>

      <ArrowRight size={14} className="text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}
