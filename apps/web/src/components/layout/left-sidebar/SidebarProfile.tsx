import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function SidebarProfile() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900 cursor-pointer transition">
      
      <div className="flex items-center gap-3">
        <Image
          src="/profile.jpg"
          alt="profile"
          width={36}
          height={36}
          className="rounded-full"
        />

        <div>
          <p className="text-[15px] font-medium text-white">Rishnu</p>
          <p className="text-[12px] text-zinc-400">
            0 followers • 0 following
          </p>
        </div>
      </div>

      <ArrowRight size={16} className="text-zinc-400" />
    </div>
  );
}