import { PrismaClient } from "@prisma/client"

// helper
const getDayDiff = (date1: Date, date2: Date) => {
  const diff = Math.floor(
    (date1.getTime() - date2.getTime()) /
      (1000 * 60 * 60 * 24)
  )
  return diff
}

export const getStreakService = async (prisma: PrismaClient, userId: string) => {
  let streak = await prisma.streak.findUnique({
    where: { userId },
  })

  if (!streak) {
    streak = await prisma.streak.create({
      data: { userId },
    })
  }

  // generate last 30 days grid
  const days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const isCompleted =
      streak.lastActive &&
      new Date(streak.lastActive).toDateString() ===
        date.toDateString()

    days.push({
      date: date.toISOString(),
      completed: !!isCompleted,
    })
  }

  let isExpired = false

  if (streak.lastActive) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActiveDate = new Date(streak.lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);
    
    const diff = (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 1) isExpired = true
  }

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    days,
    isExpired,
  }
}

export const updateStreakService = async (prisma: PrismaClient, userId: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = await prisma.streak.findUnique({
    where: { userId },
  })

  if (!streak) {
    return prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActive: today,
      },
    })
  }

  const last = streak.lastActive
  if (!last) {
    return prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(streak.longestStreak, 1),
        lastActive: today,
      },
    })
  }

  const lastDate = new Date(last)
  lastDate.setHours(0, 0, 0, 0)

  const diff = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)

  if (diff === 0) {
    return streak // already updated today
  }

  let newStreak = 1
  if (diff === 1) {
    newStreak = streak.currentStreak + 1
  }

  return prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(
        streak.longestStreak,
        newStreak
      ),
      lastActive: today,
    },
  })
}