import Image from "next/image"
import { Check } from "lucide-react"
import { Writer } from "@stack/types"

type Props = {
  writer: Writer
}

export function WriterCard({ writer }: Props) {
  return (
    <div className="flex items-start gap-3 py-3">

      {/* Avatar */}
      <div className="relative w-10 h-10">

        <Image
          src={writer.avatar}
          alt={writer.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        {/* Verified Badge */}
        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-[2px]">
          <Check size={10} className="text-white" />
        </div>

      </div>

      {/* Content */}
      <div className="flex flex-col">

        <span className="text-sm font-semibold text-white">
          {writer.name}
        </span>

        <p className="text-xs text-zinc-400 line-clamp-2">
          {writer.bio}
        </p>

        <span className="text-xs text-green-500 mt-1">
          {writer.topArticles} Top article
        </span>

      </div>

    </div>
  )
}
