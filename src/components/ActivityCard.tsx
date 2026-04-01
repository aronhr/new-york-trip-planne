import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Clock, MapPin, Info } from '@phosphor-icons/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { ActivityModal } from '@/components/ActivityModal'
import type { Activity } from '@/data/itinerary'

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [completed, setCompleted] = useKV<boolean>(`activity-${activity.id}`, false)
  const [showModal, setShowModal] = useState(false)

  const handleCheckboxChange = (checked: boolean) => {
    setCompleted(checked)
  }

  return (
    <>
      <Card className="p-5 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              id={activity.id}
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <label
                  htmlFor={activity.id}
                  className={`font-semibold text-base cursor-pointer transition-colors ${
                    completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {activity.title}
                </label>
                
                {activity.time && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <Clock size={14} weight="duotone" />
                    <span>{activity.time}</span>
                  </div>
                )}

                {activity.location && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-secondary">
                    <MapPin size={14} weight="fill" />
                    <span className="truncate">{activity.location.name}</span>
                  </div>
                )}

                {activity.notes && (
                  <p className="text-xs text-accent mt-2 italic">
                    💡 {activity.notes}
                  </p>
                )}
              </div>

              {(activity.description || activity.location) && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                  aria-label="View details"
                >
                  <Info size={20} weight="duotone" className="text-primary group-hover:scale-110 transition-transform" />
                </button>
              )}
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
