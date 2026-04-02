import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CaretDown, Clock, Eye } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { WeatherCard } from '@/components/WeatherCard'
import { McDonaldsLocator } from '@/components/McDonaldsLocator'
import { ActivityCard } from '@/components/ActivityCard'
import type { Day } from '@/data/itinerary'
import { getActivityStatus, isToday } from '@/lib/timeUtils'
import type { ActivityStatus } from '@/lib/timeUtils'

interface DayViewProps {
  day: Day
  onBack: () => void
}

export function DayView({ day, onBack }: DayViewProps) {
  const [showMcDonalds, setShowMcDonalds] = useState(false)
  const [showPast, setShowPast] = useState(false)
  const [activityStatuses, setActivityStatuses] = useState<Record<string, ActivityStatus>>({})

  useEffect(() => {
    const updateStatuses = () => {
      const statuses: Record<string, ActivityStatus> = {}
      for (const activity of day.activities) {
        statuses[activity.id] = getActivityStatus(day, activity)
      }
      setActivityStatuses(statuses)
    }

    updateStatuses()
    const interval = setInterval(updateStatuses, 30000)
    return () => clearInterval(interval)
  }, [day])

  const isTodayDay = isToday(day)

  const pastActivities = day.activities.filter(a => activityStatuses[a.id] === 'past')
  const currentAndUpcoming = day.activities.filter(a =>
    activityStatuses[a.id] === 'current' || activityStatuses[a.id] === 'upcoming'
  )

  const firstUpcomingId = currentAndUpcoming.length > 0 ? currentAndUpcoming[0].id : null

  return (
    <div className="min-h-screen pt-4 bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, oklch(0.85 0.15 85 / 0.03) 35px, oklch(0.85 0.15 85 / 0.03) 70px)`
        }} />
      </div>

      <motion.button
        onClick={() => setShowMcDonalds(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-accent hover:bg-accent/90 rounded-full shadow-2xl flex items-center justify-center text-4xl transition-transform hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        🍔
      </motion.button>

      <AnimatePresence>
        {showMcDonalds && <McDonaldsLocator onClose={() => setShowMcDonalds(false)} />}
      </AnimatePresence>

      <div className="relative">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border"
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 -ml-2 hover:bg-primary/10"
            >
              <ArrowLeft size={20} weight="bold" className="mr-2" />
              Til baka
            </Button>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{day.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {day.title}
                  </h1>
                  {isTodayDay && (
                    <span className="text-xs font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-full">
                      Í DAG
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {day.dayName} • {day.date}
                </p>
                <p className="text-sm text-foreground/80 italic mt-1">{day.summary}</p>
              </div>
            </div>
            <WeatherCard weather={day.weather} />
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {isTodayDay && pastActivities.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowPast(!showPast)}
                className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors mb-4"
              >
                <div className="flex items-center gap-3">
                  <Eye size={24} weight="duotone" className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {pastActivities.length} {pastActivities.length === 1 ? 'liðinn hlutur' : 'liðnir hlutir'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showPast ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CaretDown size={20} weight="bold" className="text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showPast && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mb-6">
                      {pastActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                        >
                          <ActivityCard
                            activity={activity}
                            day={day}
                            status="past"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {currentAndUpcoming.length > 0 && (
            <div>
              {isTodayDay && (
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} weight="duotone" className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">Dagskrá</h2>
                </div>
              )}
              <div className="space-y-3">
                {currentAndUpcoming.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ActivityCard
                      activity={activity}
                      day={day}
                      status={activityStatuses[activity.id] || 'upcoming'}
                      isNext={activity.id === firstUpcomingId}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!isTodayDay && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} weight="duotone" className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Tímalína</h2>
              </div>
              <div className="space-y-3">
                {day.activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ActivityCard
                      activity={activity}
                      day={day}
                      status="upcoming"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="h-24" />
        </main>
      </div>
    </div>
  )
}












