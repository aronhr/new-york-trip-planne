export interface McDonalds {
  name: string
  address: string
  lat: number
  lng: number
}

export const mcdonalds: McDonalds[] = [
  {
    name: "McDonald's - Times Square",
    address: "1528 Broadway, New York, NY 10036",
    lat: 40.7589,
    lng: -73.9851
  },
  {
    name: "McDonald's - Herald Square",
    address: "1460 Broadway, New York, NY 10036",
    lat: 40.7546,
    lng: -73.9877
  },
  {
    name: "McDonald's - 42nd Street",
    address: "220 W 42nd St, New York, NY 10036",
    lat: 40.7565,
    lng: -73.9887
  },
  {
    name: "McDonald's - 5th Avenue",
    address: "10 W 34th St, New York, NY 10001",
    lat: 40.7505,
    lng: -73.9860
  },
  {
    name: "McDonald's - Penn Station",
    address: "460 8th Ave, New York, NY 10001",
    lat: 40.7511,
    lng: -73.9926
  },
  {
    name: "McDonald's - Columbus Circle",
    address: "10 Columbus Cir, New York, NY 10019",
    lat: 40.7685,
    lng: -73.9830
  },
  {
    name: "McDonald's - Central Park South",
    address: "160 W 56th St, New York, NY 10019",
    lat: 40.7647,
    lng: -73.9791
  },
  {
    name: "McDonald's - 8th Avenue",
    address: "813 8th Ave, New York, NY 10019",
    lat: 40.7628,
    lng: -73.9857
  },
  {
    name: "McDonald's - Financial District",
    address: "160 Broadway, New York, NY 10038",
    lat: 40.7093,
    lng: -74.0100
  },
  {
    name: "McDonald's - Wall Street",
    address: "39 Broadway, New York, NY 10006",
    lat: 40.7069,
    lng: -74.0131
  },
  {
    name: "McDonald's - Union Square",
    address: "7 E 14th St, New York, NY 10003",
    lat: 40.7350,
    lng: -73.9907
  },
  {
    name: "McDonald's - East Village",
    address: "524 6th Ave, New York, NY 10011",
    lat: 40.7387,
    lng: -73.9964
  },
  {
    name: "McDonald's - Chelsea",
    address: "605 8th Ave, New York, NY 10018",
    lat: 40.7559,
    lng: -73.9907
  },
  {
    name: "McDonald's - Rockefeller Center",
    address: "1371 6th Ave, New York, NY 10019",
    lat: 40.7614,
    lng: -73.9776
  },
  {
    name: "McDonald's - Upper West Side",
    address: "2129 Broadway, New York, NY 10023",
    lat: 40.7782,
    lng: -73.9816
  },
  {
    name: "McDonald's - Upper East Side",
    address: "1422 3rd Ave, New York, NY 10028",
    lat: 40.7749,
    lng: -73.9569
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
