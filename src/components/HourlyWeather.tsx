import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Drop } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { fetchLiveWeather, type HourlyWeather } from '@/lib/weather'

export function HourlyWeatherCard() {
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadWeather = async () => {
      const weather = await fetchLiveWeather()
      if (weather && weather.hourly) {
        setHourlyData(weather.hourly)
        setError(false)
      } else {
        setError(true)
      }
      setLoading(false)
    }
    loadWeather()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} weight="duotone" className="text-primary" />
          <h3 className="text-lg font-bold text-foreground">Hourly Forecast</h3>
        </div>
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    )
  }

  if (error || hourlyData.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={24} weight="duotone" className="text-primary" />
        <h3 className="text-lg font-bold text-foreground">Hourly Forecast</h3>
      </div>
      
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-4 min-w-min">
          {hourlyData.map((hour, index) => (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {hour.time}
              </span>
              <span className="text-3xl">{hour.icon}</span>
              <span className="text-lg font-bold text-foreground">{hour.temp}°</span>
              {hour.precipitation > 0 && (
                <div className="flex items-center gap-1 text-xs text-sky-blue">
                  <Drop size={12} weight="fill" />
                  <span>{hour.precipitation}mm</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}
