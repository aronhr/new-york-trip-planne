export interface Activity {
  id: string
  time?: string
  title: string
  description?: string
  location?: {
    name: string
    address: string
    lat: number
    lng: number
  }
  notes?: string
}

export interface Weather {
  temp: number
  condition: string
  icon: string
  high: number
  low: number
  humidity: number
  windSpeed: number
}

export interface Day {
  id: string
  date: string
  dayName: string
  title: string
  emoji: string
  summary: string
  activities: Activity[]
  weather: Weather
}

export const HOTEL = {
  name: "Park Central Hotel",
  address: "870 7th Ave, New York, NY 10019",
  lat: 40.7614,
  lng: -73.9776
}

export const itinerary: Day[] = [
  {
    id: "day1",
    date: "April 1",
    dayName: "Miðvikudagur",
    title: "Komudagur",
    emoji: "✈️",
    summary: "Engin dagskrá, bara koma sér fyrir",
    weather: {
      temp: 14,
      condition: "Partly Cloudy",
      icon: "⛅",
      high: 16,
      low: 9,
      humidity: 65,
      windSpeed: 15
    },
    activities: [
      {
        id: "day1-1",
        time: "19:30",
        title: "Lending í New York",
        description: "Komið til New York! Farið í gegnum tollinn og sækið farangur."
      },
      {
        id: "day1-2",
        time: "21:00",
        title: "Koma á Park Central Hotel",
        description: "Check-in á hótelið og setjast að.",
        location: HOTEL
      },
      {
        id: "day1-3",
        title: "Létt kvöldmatur nálægt hótelinu + Time Square rölt",
        description: "Finna sér eitthvað gott að borða nálægt hótelinu og taka fyrstu skrefin í NYC! Times Square er í göngufæri.",
        location: {
          name: "Times Square",
          address: "Manhattan, NY 10036",
          lat: 40.7580,
          lng: -73.9855
        }
      }
    ]
  },
  {
    id: "day2",
    date: "April 2",
    dayName: "Fimmtudagur",
    title: "Broadway kvöld",
    emoji: "🎭",
    summary: "Léttur dagur – orka fyrir sýninguna",
    weather: {
      temp: 13,
      condition: "Sunny",
      icon: "☀️",
      high: 17,
      low: 10,
      humidity: 55,
      windSpeed: 12
    },
    activities: [
      {
        id: "day2-1",
        title: "Morgunkaffi + róleg ganga",
        description: "Byrjið daginn rólega með góðu kaffi og léttu morgunverði."
      },
      {
        id: "day2-2",
        title: "Central Park",
        description: "Stutt rölt eða láta hjóla með okkur í 1 klst? Njótið fallegra útsýna og náttúrunnar í hjarta borgarinnar.",
        location: {
          name: "Central Park",
          address: "Central Park, New York, NY",
          lat: 40.7829,
          lng: -73.9654
        }
      },
      {
        id: "day2-3",
        title: "Búðarrölt (Fifth Ave / Times Square)",
        description: "Frjáls tími til að skoða búðir á Fifth Avenue og Times Square svæðinu.",
        location: {
          name: "Fifth Avenue",
          address: "5th Ave, New York, NY",
          lat: 40.7638,
          lng: -73.9729
        }
      },
      {
        id: "day2-4",
        time: "17:00",
        title: "Borða á Wagamama",
        description: "Asísk tilboð á Wagamama fyrir Broadway kvöldið.",
        location: {
          name: "Wagamama",
          address: "161 W 56th St, New York, NY 10019",
          lat: 40.7650,
          lng: -73.9790
        }
      },
      {
        id: "day2-5",
        time: "19:00",
        title: "Moulin Rouge (Broadway)",
        description: "Njótið glæsilegrar Broadway sýningar! Munið miðana og komið tímanlega.",
        location: {
          name: "Al Hirschfeld Theatre",
          address: "302 W 45th St, New York, NY 10036",
          lat: 40.7595,
          lng: -73.9880
        }
      }
    ]
  },
  {
    id: "day3",
    date: "April 3",
    dayName: "Föstudagur",
    title: "Downtown dagur",
    emoji: "🗽",
    summary: "Þetta passar allt á sama svæði",
    weather: {
      temp: 15,
      condition: "Cloudy",
      icon: "☁️",
      high: 18,
      low: 11,
      humidity: 70,
      windSpeed: 18
    },
    activities: [
      {
        id: "day3-1",
        title: "Hop on Hop off (Downtown leið)",
        description: "Farið í Hop on Hop off rútuna og skoðið Downtown Manhattan.",
        notes: "Þetta passar allt á sama svæði"
      },
      {
        id: "day3-2",
        time: "13:00",
        title: "9/11 safnið – World Trade Center",
        description: "Heimsókn á 9/11 Memorial & Museum. Búið að bóka miða fyrir kl. 13:00.",
        location: {
          name: "9/11 Memorial & Museum",
          address: "180 Greenwich St, New York, NY 10007",
          lat: 40.7115,
          lng: -74.0134
        }
      },
      {
        id: "day3-3",
        title: "Frelsistyttan / Century 21",
        description: "Skoða Frelsistyttuna (úr fjarska eða fara nær ef tími gefst) og Century 21 fyrir góð tilboð.",
        location: {
          name: "Statue of Liberty",
          address: "Liberty Island, New York, NY 10004",
          lat: 40.6892,
          lng: -74.0445
        }
      },
      {
        id: "day3-4",
        title: "Skyndibiti í kvöldmatinn",
        description: "Finna sér skyndibita í Downtown svæðinu."
      },
      {
        id: "day3-5",
        title: "Rólegt kvöld",
        description: "Taka það rólega og hvíla sig eftir langan dag."
      }
    ]
  },
  {
    id: "day4",
    date: "April 4",
    dayName: "Laugardagur",
    title: "Skemmtun + Broadway",
    emoji: "🎬",
    summary: "Bara ein rútuferð þennan dag 👍",
    weather: {
      temp: 16,
      condition: "Light Rain",
      icon: "🌧️",
      high: 17,
      low: 12,
      humidity: 80,
      windSpeed: 20
    },
    activities: [
      {
        id: "day4-1",
        title: "Morgunn rólegur (sofa út / kaffi)",
        description: "Sofið ykkur út og njótið rólega morguns með góðu kaffi."
      },
      {
        id: "day4-2",
        time: "9:00-12:00",
        title: "NYC TV & Movie Bus Tour",
        description: "Rútuferð um fræga kvikmyndatökustaði í NYC. EFTIR AÐ PANTA!",
        notes: "Muna að panta þessa ferð"
      },
      {
        id: "day4-3",
        title: "Frjáls tími / hvíld",
        description: "Hvílið ykkur og náið ykkur eftir rútuferðina og fyrir kvöldið."
      },
      {
        id: "day4-4",
        time: "18:00",
        title: "Finna veitingarstað",
        description: "Finnum góðan veitingastað fyrir Broadway kvöldið."
      },
      {
        id: "day4-5",
        time: "20:00",
        title: "MJ The Musical (Broadway)",
        description: "Stórkostleg Michael Jackson sýning á Broadway!",
        location: {
          name: "MJ The Musical - Neil Simon Theatre",
          address: "250 W 52nd St, New York, NY 10019",
          lat: 40.7619,
          lng: -73.9832
        }
      }
    ]
  },
  {
    id: "day5",
    date: "April 5",
    dayName: "Sunnudagur",
    title: "Klassísk NYC upplifun",
    emoji: "🌆",
    summary: "Afslappaður sunnudagur",
    weather: {
      temp: 14,
      condition: "Partly Cloudy",
      icon: "⛅",
      high: 16,
      low: 10,
      humidity: 60,
      windSpeed: 14
    },
    activities: [
      {
        id: "day5-1",
        title: "Hop on Hop off (Midtown / Uptown)",
        description: "Skoðið Midtown og Uptown á Hop on Hop off rútunni."
      },
      {
        id: "day5-2",
        title: "Frjáls tími",
        description: "Frjáls tími til að skoða hvað ykkur langar."
      },
      {
        id: "day5-3",
        title: "High Line",
        description: "Róleg ganga eftir High Line - falleg upphækkuð garðgata með útsýni yfir borgina.",
        location: {
          name: "High Line",
          address: "New York, NY 10011",
          lat: 40.7480,
          lng: -74.0048
        }
      },
      {
        id: "day5-4",
        title: "Edge við sólsetur",
        description: "Observation deck með ótrúlegu útsýni! EFTIR AÐ PANTA.",
        location: {
          name: "Edge at Hudson Yards",
          address: "30 Hudson Yards, New York, NY 10001",
          lat: 40.7538,
          lng: -74.0011
        },
        notes: "Muna að panta miða"
      },
      {
        id: "day5-5",
        title: "Kvöldrölt / skyndibiti",
        description: "Síðasta kvöld í NYC - njótið stemningarinnar!"
      }
    ]
  },
  {
    id: "day6",
    date: "April 6",
    dayName: "Mánudagur",
    title: "Heimferðardagur",
    emoji: "🏠",
    summary: "Síðasti dagurinn",
    weather: {
      temp: 13,
      condition: "Sunny",
      icon: "☀️",
      high: 15,
      low: 9,
      humidity: 50,
      windSpeed: 10
    },
    activities: [
      {
        id: "day6-1",
        title: "Morgunkaffi + síðasta rölt",
        description: "Njótið síðasta morgunsins í NYC með kaffi og léttri göngu."
      },
      {
        id: "day6-2",
        title: "Vaxmyndasafnið",
        description: "Heimsókn á Madame Tussauds vaxmyndasafnið.",
        location: {
          name: "Madame Tussauds New York",
          address: "234 W 42nd St, New York, NY 10036",
          lat: 40.7567,
          lng: -73.9900
        }
      },
      {
        id: "day6-3",
        title: "Sækja töskur",
        description: "Check out úr hótelinu og sækja farangur."
      },
      {
        id: "day6-4",
        title: "Halda á flugvöll",
        description: "Farið í tæka tíð á flugvöllinn fyrir heimferðina."
      },
      {
        id: "day6-5",
        time: "20:30",
        title: "Heimflug ✈️",
        description: "Bless New York! Sjáumst á Íslandi. 🇮🇸"
      }
    ]
  }
]
