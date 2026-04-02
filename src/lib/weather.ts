export interface HourlyWeather {
  time: string
  temp: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation: number
}

export interface DailyWeather {
  temp: number
  condition: string
  icon: string
  high: number
  low: number
  humidity: number
  windSpeed: number
  hourly: HourlyWeather[]
}

const NYC_LAT = 40.7614
const NYC_LNG = -73.9776

function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code <= 3) return isDay ? '⛅' : '🌙'
  if (code <= 48) return '☁️'
  if (code <= 57) return '🌧️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '❄️'
  if (code <= 99) return '⛈️'
  return '☁️'
}

function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky'
  if (code === 1) return 'Mainly Clear'
  if (code === 2) return 'Partly Cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Foggy'
  if (code === 51 || code === 53 || code === 55) return 'Drizzle'
  if (code === 61 || code === 63 || code === 65) return 'Rain'
  if (code === 71 || code === 73 || code === 75) return 'Snow'
  if (code === 77) return 'Snow Grains'
  if (code === 80 || code === 81 || code === 82) return 'Rain Showers'
  if (code === 85 || code === 86) return 'Snow Showers'
  if (code === 95) return 'Thunderstorm'
  if (code === 96 || code === 99) return 'Thunderstorm with Hail'
  return 'Partly Cloudy'
}

export async function fetchLiveWeather(): Promise<DailyWeather | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${NYC_LAT}&longitude=${NYC_LNG}&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=celsius&wind_speed_unit=kmh&timezone=America%2FNew_York&forecast_days=1`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    
    const currentHour = new Date().getHours()
    const hourly: HourlyWeather[] = []
    
    for (let i = currentHour; i < Math.min(currentHour + 12, 24); i++) {
      const hour = data.hourly.time[i]
      const temp = Math.round(data.hourly.temperature_2m[i])
      const code = data.hourly.weather_code[i]
      const humidity = data.hourly.relative_humidity_2m[i]
      const windSpeed = Math.round(data.hourly.wind_speed_10m[i])
      const precipitation = data.hourly.precipitation[i]
      
      const timeStr = new Date(hour).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        timeZone: 'America/New_York'
      })
      
      hourly.push({
        time: timeStr,
        temp,
        condition: getWeatherCondition(code),
        icon: getWeatherIcon(code, i >= 6 && i <= 18),
        humidity,
        windSpeed,
        precipitation
      })
    }
    
    const currentTemp = Math.round(data.hourly.temperature_2m[currentHour])
    const currentCode = data.hourly.weather_code[currentHour]
    const currentHumidity = data.hourly.relative_humidity_2m[currentHour]
    const currentWindSpeed = Math.round(data.hourly.wind_speed_10m[currentHour])
    
    return {
      temp: currentTemp,
      condition: getWeatherCondition(currentCode),
      icon: getWeatherIcon(currentCode, currentHour >= 6 && currentHour <= 18),
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      humidity: currentHumidity,
      windSpeed: currentWindSpeed,
      hourly
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    return null
  }
}
