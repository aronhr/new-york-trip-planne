import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CaretDown, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { WeatherCard } from '@/components/WeatherCard'
import { McDonaldsLocator } from '@/components/McDonaldsLocator'
import { ActivityCard } from '@/components/ActivityCard'
import type { Day } from '@/data/itinerary'

interface DayViewProps {
  day: Day
  onBack: () => void
}

export function DayView({ day, onBack }: DayViewProps) {
  const [showMcDonalds, setShowMcDonalds] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [upcomingActivities, setUpcomingActivities] = useState<string[]>([])

  useEffect(() => {
    const checkActivities = async () => {
      const completed: string[] = []
      const upcoming: string[] = []

      for (const activity of day.activities) {
        const isCompleted = await window.spark.kv.get<boolean>(`activity-${activity.id}`)
        if (isCompleted) {
          completed.push(activity.id)
        } else {
          upcoming.push(activity.id)
        }
      }

      setCompletedActivities(completed)
      setUpcomingActivities(upcoming)
    }

    checkActivities()

    const interval = setInterval(checkActivities, 1000)
    return () => clearInterval(interval)
  }, [day.activities])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
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
              Back to Overview
            </Button>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{day.emoji}</div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {day.title}
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                  {day.dayName} • {day.date}
                </p>
                <p className="text-sm text-foreground/80 italic">{day.summary}</p>
              </div>
            </div>
            <WeatherCard weather={day.weather} />
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {upcomingActivities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Activities</h2>
              <div className="space-y-3">
                {day.activities
                  .filter(activity => upcomingActivities.includes(activity.id))
                  .map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ActivityCard activity={activity} />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {completedActivities.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors mb-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} weight="fill" className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Completed ({completedActivities.length})
                  </h2>
                </div>
                <motion.div
                  animate={{ rotate: showCompleted ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CaretDown size={24} weight="bold" className="text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3">
                      {day.activities
                        .filter(activity => completedActivities.includes(activity.id))
                        .map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ActivityCard activity={activity} />
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}












