import type { Day, Activity } from '@/data/itinerary'

const NYC_TIMEZONE = 'America/New_York'

export function getNYCTime(): Date {
  const now = new Date()
  const nycString = now.toLocaleString('en-US', { timeZone: NYC_TIMEZONE })
  return new Date(nycString)
}

export function getActivityDateTime(day: Day, activity: Activity): Date {
  const [hours, minutes] = activity.time.split(':').map(Number)
  const date = new Date(day.isoDate + 'T00:00:00')
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function isDayPast(day: Day): boolean {
  const now = getNYCTime()
  const lastActivity = day.activities[day.activities.length - 1]
  if (!lastActivity) return false
  const lastTime = getActivityDateTime(day, lastActivity)
  lastTime.setHours(lastTime.getHours() + 2)
  return now > lastTime
}

export function isDayFuture(day: Day): boolean {
  const now = getNYCTime()
  const dayDate = new Date(day.isoDate + 'T00:00:00')
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const today = new Date(todayStr + 'T00:00:00')
  return dayDate > today
}

export function isToday(day: Day): boolean {
  const now = getNYCTime()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return day.isoDate === todayStr
}

export type ActivityStatus = 'past' | 'current' | 'upcoming'

export function getActivityStatus(day: Day, activity: Activity): ActivityStatus {
  const now = getNYCTime()
  const activityTime = getActivityDateTime(day, activity)
  const activityIndex = day.activities.findIndex(a => a.id === activity.id)
  const nextActivity = day.activities[activityIndex + 1]

  if (nextActivity) {
    const nextTime = getActivityDateTime(day, nextActivity)
    if (now >= activityTime && now < nextTime) {
      return 'current'
    }
    if (now >= nextTime) {
      return 'past'
    }
  } else {
    if (now >= activityTime) {
      const endTime = new Date(activityTime)
      endTime.setHours(endTime.getHours() + 2)
      if (now < endTime) {
        return 'current'
      }
      return 'past'
    }
  }

  return 'upcoming'
}

export function getNextActivity(itinerary: Day[]): { day: Day; activity: Activity; index: number } | null {
  for (const day of itinerary) {
    for (let i = 0; i < day.activities.length; i++) {
      const status = getActivityStatus(day, day.activities[i])
      if (status === 'current' || status === 'upcoming') {
        return { day, activity: day.activities[i], index: i }
      }
    }
  }
  return null
}

export function getCurrentDay(itinerary: Day[]): Day | null {
  return itinerary.find(day => isToday(day)) || null
}

export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export function getRelativeTime(day: Day, activity: Activity): string {
  const now = getNYCTime()
  const activityTime = getActivityDateTime(day, activity)
  const diffMs = activityTime.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / 60000)

  if (diffMins > 0) {
    if (diffMins < 60) return `eftir ${diffMins} mín`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    if (hours < 24) {
      return mins > 0 ? `eftir ${hours} klst ${mins} mín` : `eftir ${hours} klst`
    }
    const days = Math.floor(hours / 24)
    return `eftir ${days} ${days === 1 ? 'dag' : 'daga'}`
  }

  const pastMins = Math.abs(diffMins)
  if (pastMins < 60) return `fyrir ${pastMins} mín`
  const hours = Math.floor(pastMins / 60)
  if (hours < 24) return `fyrir ${hours} klst`
  return ''
}
