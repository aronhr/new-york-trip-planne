export interface McDonalds {
  name: string
  address: string
  lat: number
  lng: number
}

export const mcdonalds: McDonalds[] = [
  {
    name: "McDonald's",
    address: "1528 Broadway, New York, NY 10036",
    lat: 40.75889,
    lng: -73.98513
  },
  {
    name: "McDonald's",
    address: "220 W 42nd St, New York, NY 10036",
    lat: 40.75654,
    lng: -73.98871
  },
  {
    name: "McDonald's",
    address: "10 Columbus Cir, New York, NY 10019",
    lat: 40.76851,
    lng: -73.98298
  },
  {
    name: "McDonald's",
    address: "813 8th Ave, New York, NY 10019",
    lat: 40.76272,
    lng: -73.98567
  },
  {
    name: "McDonald's",
    address: "1356 Broadway, New York, NY 10018",
    lat: 40.75336,
    lng: -73.98778
  },
  {
    name: "McDonald's",
    address: "625 8th Ave, New York, NY 10018",
    lat: 40.75695,
    lng: -73.99072
  },
  {
    name: "McDonald's",
    address: "151 W 34th St, New York, NY 10001",
    lat: 40.75073,
    lng: -73.99093
  },
  {
    name: "McDonald's",
    address: "901 6th Ave, New York, NY 10001",
    lat: 40.74998,
    lng: -73.98894
  },
  {
    name: "McDonald's",
    address: "106 Fulton St, New York, NY 10038",
    lat: 40.71093,
    lng: -74.00661
  },
  {
    name: "McDonald's",
    address: "160 Broadway, New York, NY 10038",
    lat: 40.70932,
    lng: -74.01002
  },
  {
    name: "McDonald's",
    address: "1691 Broadway, New York, NY 10019",
    lat: 40.76274,
    lng: -73.98289
  },
  {
    name: "McDonald's",
    address: "522 5th Ave, New York, NY 10036",
    lat: 40.75443,
    lng: -73.98044
  },
  {
    name: "McDonald's",
    address: "2109 Broadway, New York, NY 10023",
    lat: 40.77869,
    lng: -73.98209
  },
  {
    name: "McDonald's",
    address: "1556 3rd Ave, New York, NY 10128",
    lat: 40.77795,
    lng: -73.95426
  },
  {
    name: "McDonald's",
    address: "1442 2nd Ave, New York, NY 10021",
    lat: 40.77193,
    lng: -73.95694
  },
  {
    name: "McDonald's",
    address: "303 Park Ave S, New York, NY 10010",
    lat: 40.74089,
    lng: -73.98687
  },
  {
    name: "McDonald's",
    address: "160 W 23rd St, New York, NY 10011",
    lat: 40.74426,
    lng: -73.99333
  },
  {
    name: "McDonald's",
    address: "252 1st Ave, New York, NY 10009",
    lat: 40.72997,
    lng: -73.98352
  }
]

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function findNearestMcDonalds(userLat: number, userLng: number): McDonalds | null {
  if (mcdonalds.length === 0) return null
  
  let nearest = mcdonalds[0]
  let minDistance = calculateDistance(userLat, userLng, nearest.lat, nearest.lng)
  
  for (const location of mcdonalds) {
    const distance = calculateDistance(userLat, userLng, location.lat, location.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = location
    }
  }
  
  return nearest
}
