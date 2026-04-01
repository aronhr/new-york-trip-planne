import { useState } from 'react'
import { ArrowLeft, CalendarDots } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { McDonaldsLocator } from '@/components/McDonalds
import { WeatherCard } from '@/components/WeatherCard'
import type { Day } from '@/data/itinerary'

interface DayViewProps {
  
  onBack: () => void
 

export function DayView({ day, onBack }: DayViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        transition={{ delay: 0.5, type: 'spring', 
        🍔

        {sho

        <motion.header
          animate={{ o
        >
            <Button
              onClick={onBack}
         
              Back to Overview
            <div cl
              <div className=
                  <h1 classNam
                  </h1>
            >
                </div>
              Back to Overview
            </div>
        </motion.header>
        <main className="max-w-4xl mx-auto px-6 py-8">
            initial={{ opacity: 0, y: 
            transition={{ duration: 0.4 }}
          >
          </motion.div>
                  </h1>
            <span>{day.activities.length} activities planned</span>

            {day.activiti
                </div>
                animate={{ opacity: 1, x: 0 }}
              >
              </moti
            </div>
      </div>
  )

        <main className="max-w-4xl mx-auto px-6 py-8">





          >

          </motion.div>



            <span>{day.activities.length} activities planned</span>





                key={activity.id}

                animate={{ opacity: 1, x: 0 }}

              >

              </motion.div>

          </div>

      </div>

  )

