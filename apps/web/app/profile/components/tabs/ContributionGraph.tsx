"use client"

import { useState } from "react"

type ContributionDay = {
  date: string
  count: number
}

interface Props {
  contributions: ContributionDay[]
}

export default function ContributionGraph({ contributions }: Props) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null)

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200"
    if (count < 3) return "bg-green-200"
    if (count < 6) return "bg-green-400"
    return "bg-green-600"
  }

  return (
    <div className="relative">

      {/* Tooltip */}
      {hovered && (
        <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded">
          {hovered.count} contributions on {hovered.date}
        </div>
      )}

      <div className="grid grid-cols-52 gap-1">
        {contributions.map((day, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(day)}
            onMouseLeave={() => setHovered(null)}
            className={`w-3 h-3 rounded-sm cursor-pointer ${getColor(day.count)}`}
          />
        ))}
      </div>
    </div>
  )
}