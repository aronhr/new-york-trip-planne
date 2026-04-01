# Planning Guide

A Progressive Web App (PWA) for a couple's New York trip itinerary, April 1-6, 2026, featuring offline access, location mapping, and navigation to attractions.

**Experience Qualities**: 
1. **Effortless** - The app should feel like a helpful travel companion that removes friction from navigating New York, not another thing to manage
2. **Delightful** - Each interaction should spark excitement about the upcoming adventures, with visual design that captures NYC's energy
3. **Reliable** - Must work offline perfectly since travelers may have spotty connection; information should always be accessible

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused travel itinerary app with day-by-day scheduling, location details, map integration, and offline PWA capabilities. It's more than a simple list but doesn't require complex backend systems.

## Essential Features

### Daily Itinerary View
- **Functionality**: Display each day's schedule with checkable items, times, and brief descriptions
- **Purpose**: Give travelers a clear overview of their day without overwhelming detail
- **Trigger**: User navigates to a specific day from the landing page or day selector
- **Progression**: Landing page → Select day → View schedule → Check off completed items
- **Success criteria**: All activities visible with times, items can be checked/unchecked, state persists between sessions

### Activity Detail Modal
- **Functionality**: Show full description, embedded map location, and action button for navigation
- **Purpose**: Provide context about each location before visiting and enable quick navigation
- **Trigger**: User taps on any scheduled activity
- **Progression**: Tap activity → Modal opens with description + map → Tap "Get Directions" → Opens native maps app
- **Success criteria**: Modal displays all info clearly, map shows accurate location, directions button launches correct maps app (Google Maps on Android, Apple Maps on iOS)

### Progressive Web App (PWA)
- **Functionality**: App installs to home screen and works completely offline
- **Purpose**: Ensure travelers can access itinerary without internet connection in NYC
- **Trigger**: User visits app, browser prompts to install
- **Progression**: Visit site → Install prompt → Add to home screen → Works offline
- **Success criteria**: Service worker caches all assets, app launches offline, manifest enables home screen install

### Hotel Information
- **Functionality**: Always-accessible hotel details (Park Central Hotel) with address and map
- **Purpose**: Quick reference for getting back to accommodation
- **Trigger**: Hotel info button/section visible on all pages
- **Progression**: Tap hotel info → See address + map → Get directions if needed
- **Success criteria**: Hotel prominently displayed, easy to find from anywhere in app

### McDonald's Locator
- **Functionality**: Floating action button (FAB) that finds the nearest McDonald's location using geolocation
- **Purpose**: Quick access to find nearest McDonald's for convenient food options during trip
- **Trigger**: User taps floating 🍔 button in bottom-right corner
- **Progression**: Tap FAB → Modal opens → Geolocation detects position → Shows nearest location → Tap "Fá leiðsögn" → Opens native maps
- **Success criteria**: FAB visible on all screens, geolocation works reliably, falls back to hotel location if permission denied, opens correct maps app (Apple/Google)

## Edge Case Handling
- **No internet on landing**: All assets cached, full app functionality available offline
- **Item checked by mistake**: Items can be unchecked (toggle functionality)
- **Wrong location opened in maps**: Clear labeling and confirmation of which location is being opened
- **Day not found**: Graceful fallback to show all available days
- **Small screens**: All content responsive and readable on various phone sizes

## Design Direction
The design should capture the vibrant energy of New York City - bold, confident, and modern. It should feel like opening a beautifully designed travel guide that makes you excited to explore. The interface should be unmistakably NYC with its mix of sophistication and urban edge, using strong typography and a palette inspired by the city's iconic yellow cabs, blue skies, and nighttime lights.

## Color Selection
NYC-inspired palette that feels energetic yet sophisticated:

- **Primary Color**: NYC Taxi Yellow `oklch(0.85 0.15 85)` - Captures the iconic NYC yellow cab, communicates action and optimism
- **Secondary Colors**: 
  - Deep Navy `oklch(0.25 0.08 250)` - Manhattan night sky, sophistication and depth
  - Bright Sky Blue `oklch(0.72 0.12 230)` - Clear NYC day, hope and possibility
- **Accent Color**: Vibrant Orange `oklch(0.68 0.18 45)` - Sunset over Hudson, energy and warmth for CTAs
- **Foreground/Background Pairings**: 
  - Background White `oklch(0.98 0 0)`: Deep Navy text `oklch(0.25 0.08 250)` - Ratio 12.1:1 ✓
  - Primary Yellow `oklch(0.85 0.15 85)`: Deep Navy text `oklch(0.25 0.08 250)` - Ratio 8.2:1 ✓
  - Accent Orange `oklch(0.68 0.18 45)`: White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓
  - Deep Navy `oklch(0.25 0.08 250)`: White text `oklch(0.98 0 0)` - Ratio 12.1:1 ✓

## Font Selection
Typography should be bold and modern with excellent readability on mobile, evoking NYC's no-nonsense directness and contemporary design sensibility.

- **Primary Font**: Space Grotesk - Modern geometric sans with personality, perfect for headings and the NYC vibe
- **Secondary Font**: Inter - Clean, highly legible for body text and UI elements

- **Typographic Hierarchy**: 
  - H1 (App Title/Landing): Space Grotesk Bold/36px/tight tracking (-0.02em)
  - H2 (Day Headers): Space Grotesk Bold/28px/normal tracking
  - H3 (Activity Titles): Space Grotesk Medium/20px/normal tracking
  - Body (Descriptions): Inter Regular/16px/relaxed leading (1.6)
  - Small (Times/Labels): Inter Medium/14px/normal leading (1.4)

## Animations
Animations should feel snappy and purposeful like the pace of NYC - quick transitions that don't waste time but add personality. Use animations for:
- Modal slide-up from bottom (300ms ease-out) when opening activity details
- Checkbox check animation with slight bounce (200ms) for satisfaction
- Day card hover lift (150ms) with subtle shadow increase
- Page transitions with smooth fade (250ms) between landing and itinerary views
- Loading states fade in/out (200ms) if needed

## Component Selection

- **Components**:
  - **Card**: Activity items in daily schedule, day overview cards on landing
  - **Button**: "Get Directions", day selection, navigation - use bold primary yellow with navy text
  - **Checkbox**: For checking off completed activities - custom styled with NYC colors
  - **Dialog**: Activity detail modal with description and map
  - **Accordion**: Could be used for collapsible day sections if needed
  - **Badge**: Day numbers, time indicators - use sky blue background
  - **Separator**: Between activities and sections

- **Customizations**:
  - Custom landing page hero section with NYC imagery/gradient
  - Custom map embed component for location display
  - Custom day selector/navigation component
  - Persistent hotel info banner/card that's always accessible

- **States**:
  - **Buttons**: Yellow primary with navy text, hover lifts with shadow, active state pressed, disabled state muted
  - **Checkboxes**: Unchecked border navy, checked yellow background with navy checkmark
  - **Cards**: Default white with subtle shadow, hover lifts slightly, active/selected state with yellow left border
  - **Modal**: Slides up from bottom, overlay with backdrop blur

- **Icon Selection**:
  - MapPin (location indicators)
  - Check (completed activities)
  - Calendar (day selection)
  - NavigationArrow (get directions button)
  - Clock (time indicators)
  - Buildings (hotel/landmarks)
  - MapTrifold (maps/navigation)

- **Spacing**:
  - Container padding: p-6 (24px) on mobile, p-8 (32px) on tablet+
  - Card spacing: gap-4 (16px) between cards
  - Section spacing: mb-8 (32px) between major sections
  - Button padding: px-6 py-3 (24px horizontal, 12px vertical)

- **Mobile**:
  - Single column layout for all views
  - Bottom navigation or back button for day-to-day movement
  - Full-width cards with comfortable touch targets (min 44px height)
  - Modal takes full screen on mobile with close button top-right
  - Typography scales down slightly (H1 to 32px, H2 to 24px on small screens)
  - Sticky day header when scrolling through activities
