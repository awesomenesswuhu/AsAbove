# AsAbove - Agent Documentation

> **Comprehensive documentation for AI agents and developers working on the AsAbove celestial dashboard application.**

---

## 🎯 Project Overview

AsAbove is a real-time celestial dashboard web application that displays planets, stars, and other celestial objects visible from a user's location based on their postal code. The application provides accurate astronomical data including rise/set times, prime viewing windows, and detailed descriptions.

**Tech Stack:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

---

## 🏗️ Architecture Overview

### Core Components

1. **`app/page.tsx`** - Main page component
   - Handles search, state management, and results display
   - Manages weather data fetching
   - Coordinates celestial object retrieval

2. **`components/SearchInterface.tsx`** - Search input component
   - Postal code validation (international format)
   - Compact mode for header display
   - Frosted glass styling

3. **`components/PlanetCard.tsx`** - Celestial object display card
   - Displays all celestial object information
   - Fixed height (600px minimum) for uniform appearance
   - Clickable to open modal
   - Shows: Rise Time, Set Time, Prime Viewing, Direction
   - Special handling for Saturn (zoomed), meteors, constellations, galaxies

4. **`components/CelestialModal.tsx`** - Detailed modal view
   - Full description of celestial object
   - Key facts and statistics
   - "How to Find It" instructions
   - Frosted glass styling

5. **`components/SkySummary.tsx`** - Summary component
   - Simple text paragraph summarizing tonight's sky
   - Weather conditions included in summary
   - Appears above "Planets" section

### Core Libraries

1. **`lib/astronomy.ts`** - Astronomical calculations
   - Local Sidereal Time (LST) calculation
   - Altitude and azimuth calculations
   - Visibility status determination
   - Constellation pattern generation
   - Moon illumination calculation
   - Meteor shower activity checking

2. **`lib/riseSetTimes.ts`** - Rise/Set time calculations
   - Hour angle at horizon calculation
   - Accurate rise/set/transit time calculations
   - Handles circumpolar objects

3. **`lib/viewingTimes.ts`** - Prime viewing window calculations
   - Sunset/sunrise calculations
   - Best viewing window determination
   - Transit time-based optimal viewing periods

4. **`lib/planetaryPositions.ts`** - Planetary position lookup table
   - Manual RA/Dec lookup table for planets
   - Date-based interpolation
   - Supports January-March 2026 (expandable)
   - Calculated positions for Jupiter, Saturn, Mars, Venus, Mercury

5. **`lib/geocoding.ts`** - Postal code to coordinates
   - Uses Zippopotam.us API
   - International postal code support
   - Returns latitude, longitude, city, state, country

6. **`lib/weatherApi.ts`** - Weather data integration
   - OpenWeatherMap API integration
   - Cloud coverage, temperature, humidity
   - Clear/cloudy sky determination
   - Requires `NEXT_PUBLIC_OPENWEATHER_API_KEY` environment variable

7. **`lib/usnoApi.ts`** - US Naval Observatory API
   - Rise/set/transit times for Sun/Moon/Planets
   - Text-based response parsing
   - Handles AM/PM format with direction indicators

8. **`lib/horizonsApi.ts`** - NASA JPL Horizons API
   - Comprehensive planetary data
   - Rise/Set/Transit (RTS) events
   - Text format parsing
   - Fallback for planets not in USNO

9. **`lib/direction.ts`** - Direction utilities
   - Azimuth to cardinal direction conversion
   - "How to Find It" instruction generation

10. **`lib/planetImages.ts`** - Image URL mapping
    - Maps celestial object names to GIF/image paths
    - Special handling for stars (star.gif)

---

## 🔄 Data Flow

### Search Flow

1. User enters postal code → `SearchInterface`
2. Geocode postal code → `geocoding.ts` (Zippopotam.us API)
3. Fetch weather data → `weatherApi.ts` (OpenWeatherMap API)
4. Calculate/fetch celestial objects → `astronomy.ts`
   - Fetch planetary positions → `planetaryPositions.ts` (or calculated)
   - Try USNO API for rise/set times → `usnoApi.ts`
   - Try Horizons API for missing planets → `horizonsApi.ts`
   - Fallback to local calculations → `riseSetTimes.ts`
   - Calculate prime viewing windows → `viewingTimes.ts`
5. Display results → `PlanetCard` components
6. Click card → `CelestialModal` with full details

### API Fallback Strategy

```
Planet/Moon Rise-Set Times:
  Primary: USNO API (fast, reliable for Sun/Moon)
    ↓ (if missing)
  Secondary: Horizons API (comprehensive for all planets)
    ↓ (if both fail)
  Fallback: Local calculations (from RA/Dec lookup table)
```

---

## 🎨 UI/UX Features

### Design Elements

- **Frosted Glass Effect**: All cards and modals use `backdrop-filter: blur(20px)` with `saturate(180%)`
- **Starfield Background**: Static stars via CSS `radial-gradient`
- **Fixed Card Heights**: All cards minimum 600px for uniform grid
- **Smooth Transitions**: 500ms transitions for hero section, header, and cards
- **Responsive Design**: Mobile-first with breakpoints at `sm:`, `md:`, `lg:`

### Component States

- **Hero Section**: Visible when no results, fades out with `opacity-0 pointer-events-none` when results appear
- **Fixed Header**: Appears when results shown, hides on scroll down (`-translate-y-full`)
- **Compact Search**: Smaller search box and button in header mode
- **Loading States**: Shows spinner and "Finding your location..." message

### Sorting & Display

- **Planets**: Sorted by brightness (magnitude - lower = brighter), Earth always first
- **Celestial Events**: Moon first, then active meteors before inactive
- **Cards**: Uniform height, consistent spacing

---

## 📊 Celestial Object Data Structure

### CelestialObject Interface

```typescript
interface CelestialObject {
  name: string;
  type: "planet" | "star" | "moon" | "meteor" | "constellation" | "galaxy";
  altitude: number; // degrees above horizon
  azimuth: number; // degrees (0-360, 0 = North)
  magnitude: number; // apparent magnitude (lower = brighter)
  rightAscension?: number; // hours (0-24)
  declination?: number; // degrees (-90 to 90)
  riseTime?: Date;
  setTime?: Date;
  transitTime?: Date;
  bestViewingStart?: Date;
  bestViewingEnd?: Date;
  moonIllumination?: number; // 0-100%
  distance?: number; // AU or light-years
  constellationPattern?: ConstellationPattern[];
  requiresTelescope?: boolean;
  peakDate?: string; // for meteors
  hourlyRate?: string; // for meteors
  isActive?: boolean; // for meteors
}
```

### Visibility Status

```typescript
type VisibilityStatus = {
  status: "visible" | "rising" | "below" | "daylight";
  badge: string;
  message: string;
  backgroundColor: string;
  borderColor: string;
};
```

---

## 🔑 Environment Variables

### Required

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

**Get API Key:**
- Sign up at https://openweathermap.org/api
- Free tier includes current weather data

### Optional

No other environment variables required. USNO and Horizons APIs are public and don't require keys.

---

## 📝 Key Implementation Details

### Planetary Position Lookup Table

The `planetaryPositions.ts` file contains manually calculated positions for:
- **January 2026**: Calculated from rise/set times provided by user
- **February 2026**: Interpolated positions
- **March 2026**: Interpolated positions

**Calculated RA Values (January 2026, California reference):**
- Jupiter: 15.11h (rises 4:09 PM)
- Saturn: 8.51h (rises 9:56 AM)
- Mars: 5.88h (rises 6:54 AM)
- Venus: 6.32h (rises 7:14 AM)

**Note:** These positions are accurate for the specified date ranges. For dates outside these ranges, the system will interpolate between the nearest entries.

### Prime Viewing Window Logic

Prime viewing windows are calculated based on transit time:
- **Evening transits (6 PM - midnight)**: 1 hour before transit to 1.5 hours after transit
- **Morning transits (midnight - 6 AM)**: 1.5 hours before transit to 1 hour after transit
- **Daytime transits**: 30 minutes before sunset to 2 hours after sunset

### Special Image Handling

- **Saturn**: Zoomed 1.26x with `overflow: hidden`, frame size `planetSize * 0.9`
- **Stars**: Use `/star.gif` instead of icons
- **Meteors**: Use `/meteor.gif` from public folder
- **Constellations/Galaxies**: SVG pattern visualizations

### Card Uniformity

- All cards have `minHeight: '600px'` with `flex flex-col` layout
- "How to Find It" moved to modal (clickable card)
- Card shows "Click for finding instructions" text at bottom
- Sky summary appears as simple paragraph above Planets section

---

## 🔧 API Integration Details

### USNO API (`lib/usnoApi.ts`)

**Endpoint:** `https://aa.usno.navy.mil/api/rstt/oneday`

**Parameters:**
- `date`: YYYY-MM-DD format
- `coords`: `latitude,longitude`
- `body`: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune

**Response Format:**
- Times in format: "HH:MM A.M. DIRECTION" or "HH:MM P.M. DIRECTION"
- Example: "6:27 A.M. NW" or "4:09 P.M. SE"
- Times are in local time for the location

**Limitations:**
- Primarily works for Sun and Moon
- Planetary support varies
- May not return data for all planets

### Horizons API (`lib/horizonsApi.ts`)

**Endpoint:** `https://ssd-api.jpl.nasa.gov/horizons.api`

**Parameters:**
- `format`: "text" (for better RTS parsing)
- `COMMAND`: Body ID (199=Mercury, 299=Venus, 499=Mars, 599=Jupiter, 699=Saturn, etc.)
- `EPHEM_TYPE`: "OBSERVER"
- `CENTER`: "coord@399" (Earth coordinates)
- `SITE_COORD`: `longitude,latitude,elevation` (in meters)
- `START_TIME`: YYYY-MM-DD
- `STOP_TIME`: YYYY-MM-DD
- `QUANTITIES`: "4" (requests RTS events)

**Response Format:**
- Text-based output with RTS event markers
- Parses lines containing "Rise", "Transit", "Set" keywords
- Extracts time patterns: "YYYY-MM-DD HH:MM" or "HH:MM"

**Strengths:**
- Comprehensive planetary coverage
- Highly accurate calculations
- Includes atmospheric refraction corrections

---

## 🐛 Known Issues & Limitations

1. **USNO API**: May not return planetary data reliably - Horizons is fallback
2. **Horizons API**: Text parsing can be fragile if API format changes
3. **Position Lookup Table**: Only covers January-March 2026 - needs periodic updates
4. **Timezone Calculation**: Uses longitude-based approximation (`longitude / 15`) - may not match actual timezone perfectly
5. **Weather API**: Requires API key - gracefully degrades if unavailable

---

## 🚀 Future Improvements

### Recommended Enhancements

1. **Expand Position Lookup Table**
   - Add more months (April-December 2026)
   - Create quarterly updates process
   - Consider using Swiss Ephemeris library for automatic calculations

2. **Improve Timezone Handling**
   - Use proper timezone database (IANA Time Zone Database)
   - Integrate with geocoding API that provides timezone
   - Handle DST automatically

3. **Enhanced Error Handling**
   - Better fallback messages when APIs fail
   - Retry logic with exponential backoff
   - User-facing error explanations

4. **Performance Optimizations**
   - Cache API responses (Redis/Memory)
   - Debounce search input
   - Lazy load images

5. **Additional Features**
   - Night mode toggle (though already dark-themed)
   - Export/share functionality
   - Calendar view for future dates
   - Favorite locations

---

## 📁 File Structure

```
AsAbove/
├── app/
│   ├── page.tsx              # Main page component
│   ├── layout.tsx            # Root layout with starfield
│   └── globals.css           # Global styles, starfield animation
├── components/
│   ├── SearchInterface.tsx   # Search input component
│   ├── PlanetCard.tsx        # Celestial object card
│   ├── CelestialModal.tsx    # Detailed modal view
│   └── SkySummary.tsx        # Summary paragraph component
├── lib/
│   ├── astronomy.ts          # Core astronomical calculations
│   ├── riseSetTimes.ts       # Rise/set time calculations
│   ├── viewingTimes.ts       # Prime viewing window calculations
│   ├── planetaryPositions.ts # RA/Dec lookup table
│   ├── geocoding.ts          # Postal code geocoding
│   ├── weatherApi.ts         # Weather data integration
│   ├── usnoApi.ts            # USNO API integration
│   ├── horizonsApi.ts        # JPL Horizons API integration
│   ├── direction.ts          # Direction utilities
│   ├── planetImages.ts       # Image URL mapping
│   ├── planetData.ts         # Planet descriptions and facts
│   └── timezone.ts           # Timezone utilities
└── public/
    ├── *.gif                 # Planet/star GIFs
    └── meteor.gif            # Meteor animation
```

---

## 🧪 Testing Recommendations

### Manual Testing Checklist

1. **Search Functionality**
   - [ ] Test various postal codes (US, UK, Canada, etc.)
   - [ ] Test invalid postal codes
   - [ ] Test empty input
   - [ ] Test loading states

2. **API Fallbacks**
   - [ ] Test with weather API disabled
   - [ ] Test with USNO API failing
   - [ ] Test with Horizons API failing
   - [ ] Verify local calculations work

3. **Display Accuracy**
   - [ ] Verify rise/set times match expected values
   - [ ] Check prime viewing windows are reasonable
   - [ ] Confirm sorting by brightness works
   - [ ] Test different time zones

4. **UI/UX**
   - [ ] Test responsive design (mobile, tablet, desktop)
   - [ ] Verify card uniform heights
   - [ ] Test modal interactions
   - [ ] Check scroll behavior (header hide/show)

---

## 📚 Key Concepts

### Local Sidereal Time (LST)

LST represents the hour angle of the vernal equinox at a specific location. It's calculated as:

```
LST = 100.46° + 0.985647° × daysSinceJ2000 + longitude + 15° × UTC_hours
```

Used to convert between celestial coordinates (RA/Dec) and local sky positions (altitude/azimuth).

### Hour Angle

The angle between an object's current position and the meridian (local north-south line). Calculated as:

```
Hour Angle = LST - Right Ascension
```

### Altitude & Azimuth

- **Altitude**: Angle above horizon (0-90°)
- **Azimuth**: Compass direction (0° = North, 90° = East, 180° = South, 270° = West)

Calculated using spherical trigonometry formulas involving latitude, declination, and hour angle.

### Rise/Set Times

Calculated by finding when an object's altitude crosses 0°. Requires:
1. Hour angle at horizon crossing
2. Transit time (when object is highest)
3. Rise = Transit - Hour Angle
4. Set = Transit + Hour Angle

---

## 🤝 Contributing Guidelines

### Code Style

- Use TypeScript with strict typing
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Keep components focused and modular
- Add comments for complex calculations

### Adding New Features

1. **New Celestial Object Type**:
   - Add to `CelestialObject` type in `astronomy.ts`
   - Add image mapping in `planetImages.ts`
   - Add description in `planetData.ts`
   - Update `getMockCelestialObjects` function

2. **New API Integration**:
   - Create new file in `lib/`
   - Follow existing API pattern (error handling, parsing)
   - Add to fallback chain in `astronomy.ts`
   - Document in this file

3. **UI Changes**:
   - Maintain frosted glass aesthetic
   - Ensure responsive design
   - Test on mobile devices
   - Update this documentation

---

## 📞 Support & Resources

### External APIs

- **Zippopotam.us**: https://zippopotam.us/ (Geocoding)
- **OpenWeatherMap**: https://openweathermap.org/api (Weather)
- **USNO API**: https://aa.usno.navy.mil/data/docs/api.php (Astronomy)
- **JPL Horizons**: https://ssd-api.jpl.nasa.gov/doc/horizons.html (Ephemeris)

### Documentation References

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Astronomical Calculations**: Meeus, J. "Astronomical Algorithms"

---

## 📝 Version History

### Current Version: 2.0

**Recent Changes:**
- ✅ Integrated USNO and JPL Horizons APIs with fallback strategy
- ✅ Added weather API integration
- ✅ Implemented prime viewing window calculations
- ✅ Added sky summary component
- ✅ Made all cards uniform height (600px)
- ✅ Moved "How to Find It" to modal
- ✅ Sorted planets by brightness
- ✅ Improved planetary position accuracy with lookup table
- ✅ Removed rise/set times, then re-added them
- ✅ Added weather conditions to summary

**Previous Versions:**
- v1.0: Initial implementation with local calculations only

---

## 🎓 For AI Agents

### Common Tasks

1. **Updating Planetary Positions**:
   - Edit `lib/planetaryPositions.ts`
   - Add new date ranges to `PLANETARY_POSITIONS` array
   - Interpolation happens automatically

2. **Adding New Celestial Objects**:
   - Update `getMockCelestialObjects` in `astronomy.ts`
   - Add image to `public/` folder
   - Update `planetImages.ts` mapping
   - Add description to `planetData.ts`

3. **Fixing API Issues**:
   - Check console logs for API responses
   - Verify API endpoint URLs
   - Check response parsing logic
   - Ensure proper error handling

4. **Styling Changes**:
   - Maintain `backdrop-filter` for frosted glass
   - Keep card heights uniform
   - Preserve responsive breakpoints
   - Test on multiple screen sizes

### Important Notes

- **DO NOT** hardcode API keys in code
- **DO NOT** remove fallback strategies
- **DO** maintain uniform card heights
- **DO** keep frosted glass aesthetic consistent
- **DO** test API failures gracefully

---

**Last Updated:** 2026-01-19  
**Maintained By:** AI Agent Team  
**Project Status:** Active Development
