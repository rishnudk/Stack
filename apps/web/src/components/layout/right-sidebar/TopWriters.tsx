import {WriterCard} from "./WriterCard"
import { Writer } from "@stack/types"


type Props = {
  writers: Writer[]
}

export function TopWriters({ writers }: Props) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">

      {/* Title */}
      <h2 className="text-sm font-semibold text-white mb-3">
        Top Writers of the Week
      </h2>

      {/* Writers */}
      <div className="flex flex-col">
        {writers.map((writer) => (
          <WriterCard key={writer.id} writer={writer} />
        ))}
      </div>

    </div>
  )
}