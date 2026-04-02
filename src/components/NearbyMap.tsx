import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, NavigationArrow, FunnelSimple, ArrowLeft, Info } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  getNearbyPlaces,
  CATEGORY_INFO,
  type NearbyPlace,
  type PlaceCategory,
} from '@/data/nearbyPlaces'
import { HOTEL } from '@/data/itinerary'

function createEmojiIcon(emoji: string, isSelected: boolean = false) {
  return L.divIcon({
    html: `<div style="
      font-size: ${isSelected ? '32px' : '24px'};
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${isSelected ? '48px' : '36px'};
      height: ${isSelected ? '48px' : '36px'};
      border-radius: 50%;
      background: ${isSelected ? 'oklch(0.68 0.18 45)' : 'white'};
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid ${isSelected ? 'oklch(0.68 0.18 45)' : 'white'};
      transition: all 0.2s;
    ">${emoji}</div>`,
    className: 'custom-emoji-marker',
    iconSize: [isSelected ? 48 : 36, isSelected ? 48 : 36],
    iconAnchor: [isSelected ? 24 : 18, isSelected ? 24 : 18],
    popupAnchor: [0, isSelected ? -24 : -18],
  })
}

function createUserIcon() {
  return L.divIcon({
    html: `<div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #4285F4;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #4285F4, 0 2px 8px rgba(66,133,244,0.5);
    "></div>`,
    className: 'user-location-marker',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 })
  }, [center, zoom, map])
  return null
}

interface NearbyMapProps {
  onClose: () => void
}

export function NearbyMap({ onClose }: NearbyMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<(NearbyPlace & { distance: number }) | null>(null)
  const [activeCategories, setActiveCategories] = useState<PlaceCategory[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([HOTEL.lat, HOTEL.lng])
  const [mapZoom, setMapZoom] = useState(14)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter([latitude, longitude])
          setLoading(false)
        },
        () => {
          setLocationError('Gat ekki fundið staðsetningu. Notum hótelið sem miðpunkt.')
          setUserLocation({ lat: HOTEL.lat, lng: HOTEL.lng })
          setMapCenter([HOTEL.lat, HOTEL.lng])
          setLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      setLocationError('Staðsetning ekki í boði.')
      setUserLocation({ lat: HOTEL.lat, lng: HOTEL.lng })
      setMapCenter([HOTEL.lat, HOTEL.lng])
      setLoading(false)
    }
  }, [])

  const places = userLocation
    ? getNearbyPlaces(userLocation.lat, userLocation.lng, 10, activeCategories.length > 0 ? activeCategories : undefined)
    : []

  const toggleCategory = useCallback((category: PlaceCategory) => {
    setActiveCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  const formatDistance = (km: number): string => {
    if (km < 1) return `${Math.round(km * 1000)} m`
    return `${km.toFixed(1)} km`
  }

  const openMaps = (lat: number, lng: number, name: string) => {
    const encodedName = encodeURIComponent(name)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent)
    if (isIOS || isMac) {
      window.location.href = `https://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}&z=16`
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedName}`, '_blank')
    }
  }

  const handlePlaceSelect = (place: NearbyPlace & { distance: number }) => {
    setSelectedPlace(place)
    setMapCenter([place.lat, place.lng])
    setMapZoom(16)
  }

  const allCategories = Object.keys(CATEGORY_INFO) as PlaceCategory[]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm z-10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft size={24} weight="bold" className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MapPin size={20} weight="fill" className="text-accent" />
          Nálægt mér
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
        >
          <FunnelSimple size={24} weight="bold" className={showFilters ? 'text-accent-foreground' : 'text-foreground'} />
        </button>
      </div>

      {/* Category filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card border-b border-border z-10"
          >
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {allCategories.map(cat => {
                const info = CATEGORY_INFO[cat]
                const isActive = activeCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span>{info.label}</span>
                  </button>
                )
              })}
              {activeCategories.length > 0 && (
                <button
                  onClick={() => setActiveCategories([])}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
                >
                  <X size={14} weight="bold" />
                  Hreinsa
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location error banner */}
      {locationError && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 text-xs text-accent-foreground flex items-center gap-2 z-10">
          <Info size={14} weight="fill" />
          {locationError}
        </div>
      )}

      {/* Map + List Layout */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Leita að staðsetningu...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Map */}
            <div className="h-[55vh] md:h-[60vh] relative z-0">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="h-full w-full"
                zoomControl={false}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} zoom={mapZoom} />

                {/* User location */}
                {userLocation && (
                  <>
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={createUserIcon()}
                    />
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={100}
                      pathOptions={{
                        color: '#4285F4',
                        fillColor: '#4285F4',
                        fillOpacity: 0.1,
                        weight: 1,
                      }}
                    />
                  </>
                )}

                {/* Place markers */}
                {places.map(place => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={createEmojiIcon(place.emoji, selectedPlace?.id === place.id)}
                    eventHandlers={{
                      click: () => handlePlaceSelect(place),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <strong>{place.emoji} {place.name}</strong>
                        <br />
                        <span className="text-xs text-muted-foreground">{formatDistance(place.distance)} í burtu</span>
                        <br />
                        <span className="text-xs">{place.description.substring(0, 120)}...</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Bottom sheet with places list */}
            <div className="flex-1 bg-card overflow-y-auto">
              <AnimatePresence mode="wait">
                {selectedPlace ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4"
                  >
                    <button
                      onClick={() => {
                        setSelectedPlace(null)
                        if (userLocation) {
                          setMapCenter([userLocation.lat, userLocation.lng])
                          setMapZoom(14)
                        }
                      }}
                      className="text-sm text-accent font-medium mb-3 flex items-center gap-1"
                    >
                      <ArrowLeft size={14} weight="bold" />
                      Til baka
                    </button>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 text-4xl bg-muted/50 w-16 h-16 rounded-2xl flex items-center justify-center">
                        {selectedPlace.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground">{selectedPlace.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            {formatDistance(selectedPlace.distance)}
                          </span>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {CATEGORY_INFO[selectedPlace.category].emoji} {CATEGORY_INFO[selectedPlace.category].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                      {selectedPlace.description}
                    </p>

                    {selectedPlace.funFact && (
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4">
                        <p className="text-xs font-medium text-primary mb-1">💡 Vissir þú?</p>
                        <p className="text-sm text-foreground/70">{selectedPlace.funFact}</p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                      <MapPin size={12} weight="fill" />
                      {selectedPlace.address}
                    </p>

                    <Button
                      onClick={() => openMaps(selectedPlace.lat, selectedPlace.lng, selectedPlace.name)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-5 rounded-xl text-base font-semibold"
                      size="lg"
                    >
                      <NavigationArrow size={20} weight="fill" className="mr-2" />
                      Fá leiðsögn
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {places.length} staðir fundnir í nágrenni
                    </p>
                    <div className="space-y-2">
                      {places.map(place => (
                        <button
                          key={place.id}
                          onClick={() => handlePlaceSelect(place)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex-shrink-0 text-2xl bg-muted/50 w-11 h-11 rounded-xl flex items-center justify-center">
                            {place.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground truncate">{place.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                          </div>
                          <div className="flex-shrink-0 text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                            {formatDistance(place.distance)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
