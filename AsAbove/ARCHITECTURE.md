# AsAbove - Architecture & Planning Document

## Project Overview

**Application Name:** AsAbove  
**Purpose:** Realistic, immersive, and factual night-sky dashboard based on user's pincode  
**Aesthetic:** Clean, space-inspired, educational  
**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide React  
**Typography:** Playfair Display (headings), Clean sans-serif (data)  
**APIs:** Zippopotam.us (geocoding), Solar System OpenData API (celestial positions)  
**Deployment:** Vercel (Free Tier)

---

## Site Map

### Home Page (`/`)
**Purpose:** Primary entry point for location-based celestial discovery

**Structure:**
1. **Hero Section**
   - Application title: "AsAbove"
   - Subheading: "Discover the planets and stars visible from your location"
   - Primary CTA: "Enter Your Pincode"

2. **Search Interface**
   - Pincode input field with validation
   - "Explore Sky" button
   - Optional: "Use Current Location" (browser geolocation fallback)

3. **Results Section** (Conditional render after search)
   - Location context header (city, state from geocoding)
   - Current time/date display
   - Celestial objects grid/library

4. **Quick Info Footer**
   - Link to About page
   - Attribution for APIs/data sources

---

### About Page (`/about`)
**Purpose:** Educational context and technical transparency

**Structure:**
1. **Introduction**
   - What AsAbove is
   - Why we built it (educational, accessible astronomy)

2. **How It Works**
   - Step 1: Enter your pincode
   - Step 2: We geocode to get your coordinates
   - Step 3: We calculate celestial positions based on time and location
   - Step 4: Display visible objects with their current status

3. **Data Sources**
   - Zippopotam.us for geocoding
   - Solar System OpenData API for celestial data
   - Astronomical calculations (Local Sidereal Time, Altitude, Azimuth)

4. **Technical Details**
   - Built with Next.js, Tailwind CSS
   - Client-side calculations for real-time positions
   - Privacy-focused (no data stored, calculations on-device when possible)

5. **Future Enhancements**
   - Constellation identification
   - Star magnitude filtering
   - Time-of-day predictions (rise/set times)

---

## UI/UX Logic: Search Experience

### Initial State (Pre-Search)
- Clean, centered layout with hero section
- Pincode input prominently displayed
- Subtle space-themed background effects (see Immersive Elements)
- Input placeholder: "Enter your 5-digit pincode"
- Real-time validation feedback (green checkmark for valid format)

### Transition Flow

#### Step 1: Input & Validation
- User types pincode
- Real-time format validation (5 digits, numeric)
- Visual feedback: input border color changes (gray → blue → green)
- Error state: Red border + message "Please enter a valid 5-digit pincode"

#### Step 2: Geocoding (Loading State)
- User clicks "Explore Sky" or presses Enter
- Button transforms to loading spinner
- Subtle fade-out of hero section
- Loading message: "Finding your location..."
- Spinner with space theme (orbiting dots or stars)

#### Step 3: Location Resolution
- If geocoding succeeds:
  - Display location context banner: "🌍 Viewing from [City, State]"
  - Smooth scroll to results section
  - Animate results in with staggered fade-in (0.1s delay between cards)
- If geocoding fails:
  - Error message: "Couldn't find location for that pincode. Please try again."
  - Return to input state
  - Highlight input field for re-attempt

#### Step 4: Results Display
- Grid layout (responsive: 1 column mobile, 2 tablet, 3 desktop)
- Each planet/star as a card (see Planet Card template)
- Cards organized by visibility status:
  1. Currently Visible (top of grid)
  2. Rising Soon (within 2 hours)
  3. Below Horizon (not visible)

#### Step 5: Ongoing Updates
- Real-time visibility status updates every 5 minutes
- Subtle pulse animation on cards that change status
- Optional: "Refresh" button to manually recalculate

### Accessibility Considerations
- Keyboard navigation support (Tab through cards)
- Screen reader announcements for status changes
- High contrast mode support
- Focus indicators on all interactive elements

---

## Data Schema

### Geocoding Response (Zippopotam.us)
```typescript
{
  "post code": string,
  "country": string,
  "country abbreviation": string,
  "places": [{
    "place name": string,      // City name
    "state": string,            // State abbreviation
    "state abbreviation": string,
    "latitude": number,         // CRITICAL: For calculations
    "longitude": number,        // CRITICAL: For calculations
  }]
}
```

### Celestial Object Data Points
Each planet/star requires:

#### Required for Display
- **Name**: string (e.g., "Jupiter", "Mars", "Venus")
- **Type**: "planet" | "star" | "moon"
- **Current Altitude**: number (degrees, -90 to 90)
- **Current Azimuth**: number (degrees, 0 to 360)
- **Is Visible**: boolean (Altitude > 0 && isNightTime)
- **Magnitude**: number (apparent magnitude, lower = brighter)
- **Rise Time**: Date/ISO string (when object rises above horizon)
- **Set Time**: Date/ISO string (when object sets below horizon)
- **Transit Time**: Date/ISO string (highest point in sky)

#### Calculated On-Client
- **Local Sidereal Time (LST)**: number (hours, calculated from longitude and current UTC time)
- **Hour Angle**: number (degrees, calculated from LST and RA)
- **Distance from Zenith**: number (degrees, 90 - Altitude)
- **Visibility Window**: string (e.g., "Rises at 8:23 PM, visible for 6h 12m")

#### Optional/Enhanced Data
- **Constellation**: string (if applicable)
- **Right Ascension (RA)**: number (hours, for calculations)
- **Declination (Dec)**: number (degrees, for calculations)
- **Distance**: number (AU or light-years)
- **Angular Size**: number (arcseconds)

### API Response Structure (Solar System OpenData or custom)
```typescript
{
  "timestamp": string,           // ISO 8601
  "location": {
    "latitude": number,
    "longitude": number,
    "timezone": string
  },
  "objects": [{
    "name": string,
    "type": "planet" | "star",
    "altitude": number,
    "azimuth": number,
    "magnitude": number,
    "riseTime": string,
    "setTime": string,
    "transitTime": string,
    "rightAscension": number,
    "declination": number,
    "distance": number,
    "angularSize": number
  }]
}
```

---

## Content Strategy: Planet Card Template

### Card Structure

**Visual Layout:**
```
┌─────────────────────────────────┐
│  [Planet Icon/Image Placeholder]│
│                                  │
│  Planet Name                     │
│  Type Badge                      │
├─────────────────────────────────┤
│  Visibility Status               │
│  (Color-coded indicator)         │
├─────────────────────────────────┤
│  Facts:                          │
│  • Magnitude: X.XX               │
│  • Altitude: XX°                 │
│  • Azimuth: XXX°                 │
│                                  │
│  Timing:                         │
│  Rise: HH:MM AM/PM               │
│  Set: HH:MM AM/PM                │
│  Visible for: X hours            │
├─────────────────────────────────┤
│  [Factual Description]           │
└─────────────────────────────────┘
```

### Status Indicator States

1. **Currently Visible** (Green)
   - Badge: "🔭 Visible Now"
   - Background: Subtle green tint
   - Description emphasizes current viewing opportunity

2. **Rising Soon** (Yellow/Orange)
   - Badge: "⏰ Rises at [TIME]"
   - Background: Subtle amber tint
   - Description includes wait time

3. **Below Horizon** (Gray)
   - Badge: "🌙 Below Horizon"
   - Background: Subtle gray tint
   - Description focuses on next visible window

4. **Not Visible Today** (Blue)
   - Badge: "☀️ Daylight Only"
   - Background: Subtle blue tint (for objects only visible during day)

### Factual Description Template

**For Planets (e.g., Jupiter):**
> "Jupiter, the largest planet in our solar system, is a gas giant made mostly of hydrogen and helium. Visible to the naked eye, it appears as a bright, steady light in the night sky. Through binoculars, you can see its four largest moons: Io, Europa, Ganymede, and Callisto. Currently at magnitude [X.XX], it's [one of the brightest/dim] objects in tonight's sky."

**For Stars (e.g., Sirius):**
> "Sirius, also known as the Dog Star, is the brightest star in the night sky from Earth. Located in the constellation Canis Major, it's actually a binary star system. With an apparent magnitude of [X.XX], it outshines all other stars and many planets. [Visibility context based on current status]."

**Variation Rules:**
- Lead with the object's most distinctive feature
- Include current magnitude in context
- Mention visibility tools needed (naked eye, binoculars, telescope)
- End with current visibility status

### Visual Placeholders

**Initial Implementation:**
- SVG icons from Lucide React (planet shapes, star icons)
- Gradient backgrounds matching planet colors:
  - Jupiter: Orange-yellow gradient
  - Mars: Red-orange gradient
  - Venus: White-yellow gradient
  - Saturn: Pale yellow gradient

**Future Enhancement:**
- Low-resolution planetary images (optimized WebP)
- Constellation line drawings (SVG paths)

---

## Immersive Elements: CSS-Based Space Effects

### 1. Animated Starfield Background
**Technique:** CSS gradients + pseudo-elements + keyframe animations  
**Implementation:** Multiple layers of tiny dots (box-shadow technique) animated at different speeds  
**Performance:** Pure CSS, no JavaScript, minimal repaints  
**Visual:** Subtle twinkling stars that drift slowly  
**Code Approach:**
- Use `::before` and `::after` pseudo-elements for layers
- Create stars using `box-shadow` with many points
- Animate `transform: translateY()` for slow drift
- Vary animation duration (20s, 30s, 40s) for parallax effect
- Opacity variations (0.3 to 0.8) for depth

### 2. Nebula Gradient Overlay
**Technique:** CSS radial gradients with blend modes  
**Implementation:** Semi-transparent gradient overlays using `background-blend-mode: multiply`  
**Performance:** Single layer, GPU-accelerated  
**Visual:** Soft, shifting color washes (deep purples, blues, subtle pinks)  
**Code Approach:**
- Base gradient: `radial-gradient(circle at 30% 50%, rgba(138, 43, 226, 0.1), transparent)`
- Multiple overlapping gradients
- Animate gradient position with `background-position` keyframes
- Use `mix-blend-mode: multiply` for depth
- Low opacity (0.05-0.15) to avoid overwhelming content

### 3. Parallax Scroll Effect on Cards
**Technique:** CSS `transform: translateZ()` and `perspective`  
**Implementation:** Subtle 3D transform on scroll (via Intersection Observer if needed, or pure CSS scroll-triggered)  
**Performance:** Hardware-accelerated transforms  
**Visual:** Cards appear to float at different depths, creating depth perception  
**Code Approach:**
- Container with `perspective: 1000px`
- Cards with `transform-style: preserve-3d`
- Vary `translateZ()` values slightly (-10px to 10px)
- Optional: Scroll-triggered with Intersection Observer for dynamic effect
- Subtle hover effects: `scale(1.02)` with smooth transition

**Alternative (Pure CSS):**
- Use `@media (prefers-reduced-motion: reduce)` to disable animations
- Fallback to static gradients if JavaScript disabled

### Performance Optimizations
- Use `will-change` property sparingly (only on animated elements)
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Limit animation to viewport-visible elements
- Use `contain` CSS property for layout isolation
- Debounce scroll listeners if using JavaScript

---

## Technical Architecture: Data Flow

### 1. User Input Flow
```
User enters pincode
    ↓
Validate format (client-side)
    ↓
Call Zippopotam.us API → Get {latitude, longitude, city}
    ↓
Calculate Local Sidereal Time (LST) from longitude + UTC time
    ↓
Call Solar System OpenData API (or calculate client-side) → Get celestial positions
    ↓
Filter & sort by visibility status
    ↓
Render Planet Cards
```

### 2. Real-Time Updates
- Use `setInterval` for visibility status checks (every 5 minutes)
- Recalculate altitude/azimuth based on current time
- Update card badges/colors when status changes
- Smooth transitions for status changes

### 3. Calculation Logic (Client-Side)
Since we need real-time positions:
- Use astronomical formulas for:
  - Local Sidereal Time (LST) calculation
  - Altitude/Azimuth from RA/Dec
  - Rise/Set time calculations
- Or: Use an API that accepts lat/lng + timestamp
- Cache calculations for 1 minute to reduce API calls

---

## Error Handling Strategy

### Geocoding Failures
- Display: "Couldn't find that location. Please check your pincode."
- Provide examples: "Try formats like 10001, 90210"
- Fallback: Offer manual lat/lng input (advanced mode)

### API Failures
- Display: "Unable to fetch celestial data. Please try again in a moment."
- Show cached results if available (from previous successful call)
- Retry mechanism with exponential backoff

### Network Issues
- Offline detection
- Message: "No internet connection. Please check your network."

---

## Next Steps for Implementation

1. **Phase 1: Core Functionality**
   - Geocoding integration
   - Basic celestial data fetching
   - Simple card layout

2. **Phase 2: Calculations**
   - Implement LST calculations
   - Altitude/Azimuth transformations
   - Visibility status logic

3. **Phase 3: Polish**
   - Immersive CSS effects
   - Smooth transitions
   - Responsive design refinements

4. **Phase 4: Enhancement**
   - Constellation lines
   - Star catalog expansion
   - Time-of-day predictions

---

## Notes on Astronomy Calculations

**Local Sidereal Time (LST) Formula:**
```
LST = 100.46 + 0.985647 * d + longitude + 15 * UTC_hours
```
Where `d` is days since J2000.0

**Altitude Calculation:**
```
Altitude = arcsin(sin(Dec) * sin(Lat) + cos(Dec) * cos(Lat) * cos(HA))
```

**Azimuth Calculation:**
```
Azimuth = arctan2(sin(HA), cos(HA) * sin(Lat) - tan(Dec) * cos(Lat))
```

These calculations should be implemented client-side or via a specialized astronomy API that accepts lat/lng/timestamp.

---

**Document Version:** 1.0  
**Last Updated:** Initial Architecture  
**Status:** Ready for Implementation
