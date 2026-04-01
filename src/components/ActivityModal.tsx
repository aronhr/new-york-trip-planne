import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, NavigationArrow } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { Activity } from '@/data/itinerary'

interface ActivityModalProps {
  activity: Activity
  open: boolean
  onClose: () => void
}

export function ActivityModal({ activity, open, onClose }: ActivityModalProps) {
  const openMaps = () => {
    if (!activity.location) return
    
    const { lat, lng, name } = activity.location
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-border">
              <div className="flex items-start justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {activity.title}
                  </h2>
                  {activity.time && (
                    <p className="text-sm text-muted-foreground">
                      🕐 {activity.time}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activity.description && (
                  <div>
                    <p className="text-base text-foreground/90 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                )}

                {activity.notes && (
                  <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-4">
                    <p className="text-sm text-foreground italic">
                      💡 {activity.notes}
                    </p>
                  </div>
                )}

                {activity.location && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} weight="fill" className="text-secondary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {activity.location.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.location.address}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-border shadow-md h-64 bg-muted">
                      <iframe
                        title={`Map of ${activity.location.name}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${activity.location.lng-0.01},${activity.location.lat-0.01},${activity.location.lng+0.01},${activity.location.lat+0.01}&layer=mapnik&marker=${activity.location.lat},${activity.location.lng}`}
                        loading="lazy"
                      />
                    </div>

                    <Button
                      onClick={openMaps}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6 font-semibold"
                      size="lg"
                    >
                      <NavigationArrow size={20} weight="fill" className="mr-2" />
                      Get Directions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
