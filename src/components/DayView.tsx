import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CalendarDots } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ActivityCard } from '@/components/ActivityCard'
import { WeatherCard } from '@/components/WeatherCard'
import { McDonaldsLocator } from '@/components/McDonaldsLocator'
import type { Day } from '@/data/itinerary'

interface DayViewProps {
  day: Day
  onBack: () => void
}

export function DayView({ day, onBack }: DayViewProps) {
  const [showMcDonalds, setShowMcDonalds] = useState(false)
  
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
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border"
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-3 hover:bg-primary/10"
            >
              <ArrowLeft size={20} weight="bold" className="mr-2" />
              Back to Overview
            </Button>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{day.emoji}</span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {day.title}
                  </h1>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {day.dayName}
                  </span>
                </div>
                <p className="text-muted-foreground">{day.date}</p>
                <p className="text-sm text-foreground/80 italic mt-1">{day.summary}</p>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <WeatherCard weather={day.weather} />
          </motion.div>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDots size={18} weight="duotone" />
            <span>{day.activities.length} activities planned</span>
          </div>

          <div className="space-y-4">
            {day.activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
