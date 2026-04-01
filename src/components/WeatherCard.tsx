import { Thermometer, Drop, Wind } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import type { Weather } from '@/data/itinerary'

interface WeatherCardProps {
  weather: Weather
  compact?: boolean
}

export function WeatherCard({ weather, compact = false }: WeatherCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-sky-blue/10 px-3 py-2 rounded-lg">
        <span className="text-2xl">{weather.icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{weather.temp}°C</span>
          <span className="text-xs text-muted-foreground">{weather.condition}</span>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-5 bg-gradient-to-br from-sky-blue/5 to-sky-blue/10 border-sky-blue/20">
      <div className="flex items-start gap-4">
        <div className="text-5xl">{weather.icon}</div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{weather.temp}°C</span>
            <span className="text-sm text-muted-foreground">
              {weather.high}° / {weather.low}°
            </span>
          </div>
          <p className="text-base font-medium text-foreground mb-3">{weather.condition}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Drop size={16} weight="fill" className="text-sky-blue" />
              <span>{weather.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind size={16} weight="fill" className="text-sky-blue" />
              <span>{weather.windSpeed} km/h wind</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
