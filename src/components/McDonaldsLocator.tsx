import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, NavigationArrow, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { findNearestMcDonalds, type McDonalds } from '@/data/mcdonalds'

interface McDonaldsLocatorProps {
  onClose: () => void
}

export function McDonaldsLocator({ onClose }: McDonaldsLocatorProps) {
  const [nearest, setNearest] = useState<McDonalds | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const nearestLocation = findNearestMcDonalds(latitude, longitude)
          setNearest(nearestLocation)
          setLoading(false)
        },
        () => {
          setError('Gat ekki fundið staðsetningu. Notum hótelið sem miðpunkt.')
          const nearestFromHotel = findNearestMcDonalds(40.7614, -73.9776)
          setNearest(nearestFromHotel)
          setLoading(false)
        }
      )
    } else {
      setError('Staðsetning ekki í boði. Notum hótelið sem miðpunkt.')
      const nearestFromHotel = findNearestMcDonalds(40.7614, -73.9776)
      setNearest(nearestFromHotel)
      setLoading(false)
    }
  }, [])

  const openMaps = () => {
    if (!nearest) return
    
    const encodedName = encodeURIComponent(nearest.name)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent)
    
    if (isIOS || isMac) {
      const appleMapsUrl = `http://maps.apple.com/?q=${encodedName}&ll=${nearest.lat},${nearest.lng}&z=16`
      window.location.href = appleMapsUrl
    } else {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${nearest.lat},${nearest.lng}&query_place_id=${encodedName}`
      window.open(googleMapsUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X size={24} weight="bold" className="text-muted-foreground" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-3xl mb-4">
            <span className="text-5xl">🍔</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">McDonald's Locator</h2>
          <p className="text-sm text-muted-foreground">Finndu næsta McDonald's</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-muted-foreground">Leita að McDonald's...</p>
          </div>
        )}

        {error && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
            <p className="text-xs text-accent-foreground">{error}</p>
          </div>
        )}

        {!loading && nearest && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-accent/10 p-2 rounded-lg">
                  <MapPin size={24} weight="fill" className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-1">{nearest.name}</h3>
                  <p className="text-sm text-muted-foreground">{nearest.address}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={openMaps}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 rounded-xl text-base font-semibold"
              size="lg"
            >
              <NavigationArrow size={20} weight="fill" className="mr-2" />
              Fá leiðsögn
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
