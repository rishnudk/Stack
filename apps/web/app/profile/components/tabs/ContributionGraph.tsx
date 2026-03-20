"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"

type ContributionDay = {
  date: string
  count: number
  color: string
}

interface ContributionData {
  totalContributions: number
  weeks: {
    contributionDays: ContributionDay[]
  }[]
}

interface Props {
  data: ContributionData
}

export default function ContributionGraph({ data }: Props) {
  const [hovered, setHovered] = useState<{ day: ContributionDay; x: number; y: number; weekIndex: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { totalContributions, weeks } = data

  // Extract month labels and their positions
  const monthLabels = weeks.reduce((acc, week, i) => {
    if (week.contributionDays.length === 0) return acc
    const firstDay = parseISO(week.contributionDays[0].date)
    const month = format(firstDay, "MMM")

    // Only add if it's a new month or first week
    if (acc.length === 0 || acc[acc.length - 1].month !== month) {
      acc.push({ month, index: i })
    }
    return acc
  }, [] as { month: string; index: number }[])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400 font-medium tracking-tight">
          <span className="text-white font-bold">{totalContributions.toLocaleString()}</span> Contributions in the last year
        </div>
      </div>

      <div className="relative pb-2 overflow-x-auto scrollbar-hide" ref={containerRef}>
        <div className="inline-grid grid-rows-[auto_1fr] gap-y-2">
          {/* Month labels */}
          <div className="flex text-[9px] text-neutral-500 font-medium h-4 relative ml-[26px] mb-1">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="absolute whitespace-nowrap"
                style={{ left: `${m.index * 13}px` }} // 10px tile + 3px gap
              >
                {m.month}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-visible">
            {/* Day labels */}
            <div className="grid grid-rows-7 gap-[3px] text-[8px] text-neutral-600 font-medium pr-1.5 mt-[1px] w-[20px]">
              <div className="h-[10px] flex items-center"></div>
              <div className="h-[10px] flex items-center leading-none">Mon</div>
              <div className="h-[10px] flex items-center"></div>
              <div className="h-[10px] flex items-center leading-none">Wed</div>
              <div className="h-[10px] flex items-center"></div>
              <div className="h-[10px] flex items-center leading-none">Fri</div>
              <div className="h-[10px] flex items-center"></div>
            </div>

            {/* The Grid */}
            <div
              className="grid grid-rows-7 grid-flow-col gap-[3px]"
            >
              {weeks.map((week, weekIndex) => (
                week.contributionDays.map((day, dayIndex) => {
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const containerRect = containerRef.current?.getBoundingClientRect()
                        if (containerRect) {
                          setHovered({
                            day,
                            x: rect.left - containerRect.left + rect.width / 2,
                            y: rect.top - containerRect.top,
                            weekIndex
                          })
                        }
                      }}
                      onMouseLeave={() => setHovered(null)}
                      className="w-[7px] h-[7px] rounded-[1px] transition-all duration-200 hover:scale-150 hover:z-10 cursor-alias"
                      style={{
                        backgroundColor: day.count === 0 ? "#161b22" : day.color,
                        boxShadow: day.count > 0 ? `0 0 4px ${day.color}30` : "none"
                      }}
                    />
                  )
                })
              ))}
            </div>
          </div>
        </div>

        {/* Custom Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: -12, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: hovered.x,
                top: hovered.y,
                transform: hovered.weekIndex > weeks.length - 10
                  ? "translateX(-90%)"
                  : hovered.weekIndex < 5
                    ? "translateX(-10%)"
                    : "translateX(-50%)"
              }}
            >
              <div className="bg-neutral-900 border border-neutral-800 text-white text-[10px] px-2.5 py-1.5 rounded-md shadow-2xl whitespace-nowrap flex flex-col items-center gap-0 backdrop-blur-md bg-opacity-95">
                <span className="font-bold text-neutral-100">
                  {hovered.day.count} {hovered.day.count === 1 ? 'contribution' : 'contributions'}
                </span>
                <span className="text-neutral-500 text-[9px]">
                  {format(parseISO(hovered.day.date), "MMMM d, yyyy")}
                </span>
                {/* Arrow */}
                <div
                  className="absolute top-full border-4 border-transparent border-t-neutral-800"
                  style={{
                    left: hovered.weekIndex > weeks.length - 10
                      ? "90%"
                      : hovered.weekIndex < 5
                        ? "10%"
                        : "50%",
                    transform: "translateX(-50%)"
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[9px] text-neutral-500 mt-2">
        <span>Less</span>
        <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#161b22]" />
        <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#0e4429]" />
        <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#006d32]" />
        <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#26a641]" />
        <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#39d353]" />
        <span>More</span>
      </div>
    </div>
  )
}
