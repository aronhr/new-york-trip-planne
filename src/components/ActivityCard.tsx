import { useState } from 'react'
import { Clock, MapPin, Info, NavigationArrow } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { ActivityModal } from '@/components/ActivityModal'
import type { Activity, Day } from '@/data/itinerary'
import type { ActivityStatus } from '@/lib/timeUtils'
import { formatTimeDisplay, getRelativeTime } from '@/lib/timeUtils'

interface ActivityCardProps {
  activity: Activity
  day: Day
  status: ActivityStatus
  isNext?: boolean
}

export function ActivityCard({ activity, day, status, isNext }: ActivityCardProps) {
  const [showModal, setShowModal] = useState(false)

  const isPast = status === 'past'
  const isCurrent = status === 'current'
  const relativeTime = getRelativeTime(day, activity)

  return (
    <>
      <Card
        className={`p-5 transition-all duration-200 relative overflow-hidden ${
          isCurrent || isNext
            ? 'shadow-lg border-l-4 border-l-accent bg-accent/5 hover:shadow-xl'
            : isPast
            ? 'opacity-60 hover:opacity-80 hover:shadow-md'
            : 'hover:shadow-lg'
        }`}
      >
        {(isCurrent || isNext) && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {isCurrent ? 'NÚNA' : 'NÆST'}
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex flex-col items-center pt-0.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              isCurrent || isNext
                ? 'bg-accent text-accent-foreground'
                : isPast
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary/10 text-primary'
            }`}>
              {formatTimeDisplay(activity.time).split(' ')[0]}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${
              isCurrent || isNext ? 'text-accent' : 'text-muted-foreground'
            }`}>
              {formatTimeDisplay(activity.time).split(' ')[1]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`font-semibold text-base transition-colors ${
                    isPast ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {activity.title}
                </h3>

                {relativeTime && (
                  <div className={`flex items-center gap-1.5 mt-1 text-xs ${
                    isCurrent || isNext ? 'text-accent font-medium' : 'text-muted-foreground'
                  }`}>
                    <Clock size={12} weight="duotone" />
                    <span>{relativeTime}</span>
                  </div>
                )}

                {activity.location && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-secondary">
                    <MapPin size={14} weight="fill" />
                    <span className="truncate">{activity.location.name}</span>
                  </div>
                )}

                {activity.notes && (
                  <p className="text-xs text-accent mt-2 italic bg-accent/10 px-2 py-1 rounded-md">
                    💡 {activity.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {activity.location && (isCurrent || isNext) && (
                  <button
                    onClick={() => {
                      if (!activity.location) return
                      const { lat, lng, name } = activity.location
                      const encodedName = encodeURIComponent(name)
                      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
                      const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent)
                      if (isIOS || isMac) {
                        window.location.href = `http://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}&z=16`
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedName}`, '_blank')
                      }
                    }}
                    className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                    aria-label="Get directions"
                  >
                    <NavigationArrow size={18} weight="fill" className="text-accent group-hover:scale-110 transition-transform" />
                  </button>
                )}

                {(activity.description || activity.location) && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                    aria-label="View details"
                  >
                    <Info size={20} weight="duotone" className="text-primary group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ActivityModal
        activity={activity}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
