import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Buildings, MapPin, CalendarDots } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { DayView } from '@/components/DayView'
import { WeatherCard } from '@/components/WeatherCard'
import { HourlyWeatherCard } from '@/components/HourlyWeather'
import { McDonaldsLocator } from '@/components/McDonaldsLocator'
import { itinerary, HOTEL } from '@/data/itinerary'
import type { Day } from '@/data/itinerary'

export default function App() {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)
  const [showMcDonalds, setShowMcDonalds] = useState(false)

  const openMaps = (lat: number, lng: number, name: string) => {
    const encodedName = encodeURIComponent(name)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent)
    
    if (isIOS || isMac) {
      const appleMapsUrl = `http://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}&z=16`
      window.location.href = appleMapsUrl
    } else {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedName}`
      window.open(googleMapsUrl, '_blank')
    }
  }

  if (selectedDay) {
    return <DayView day={selectedDay} onBack={() => setSelectedDay(null)} />
  }

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
        <header className="px-6 py-8 md:py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <span className="text-5xl md:text-6xl">🗽</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
              New York Trip
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              April 1–6, 2026
            </p>
          </motion.div>
        </header>

        <div className="max-w-4xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-card rounded-2xl p-6 shadow-lg border-l-4 border-l-accent"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-accent/10 p-3 rounded-xl">
                <Buildings size={28} weight="duotone" className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <span>{HOTEL.name}</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{HOTEL.address}</p>
                <Button
                  onClick={() => openMaps(HOTEL.lat, HOTEL.lng, HOTEL.name)}
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <MapPin size={16} weight="fill" className="mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <HourlyWeatherCard />
          </motion.div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-4">
              <CalendarDots size={28} weight="duotone" className="text-primary" />
              Your Itinerary
            </h2>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {itinerary.map((day, index) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                >
                  <button
                    onClick={() => setSelectedDay(day)}
                    className="w-full bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-200 border border-border text-left group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-200">
                        {day.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            {day.title}
                          </h3>
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {day.dayName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{day.date}</p>
                        <p className="text-sm text-foreground/80 italic">{day.summary}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDots size={14} weight="duotone" />
                            {day.activities.length} activities
                          </span>
                        </div>
                      </div>
                    </div>
                    <WeatherCard weather={day.weather} compact />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-primary/10 rounded-2xl px-6 py-4 border border-primary/20">
              <p className="text-sm font-medium text-foreground mb-1">❤️ Mikilvægast</p>
              <p className="text-xs text-muted-foreground max-w-md">
                Þetta er plan A. Ef þið eruð þreytt → sleppið neðsta atriðinu þann dag.<br />
                New York er upplifun, ekki keppni. 🗽
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
