# AsAbove - Project Overview

> A realistic, immersive, and factual night-sky dashboard based on a user's pincode. Discover which planets and stars are visible from your location tonight.

---

## 📋 Project Documentation

This project includes comprehensive planning documents organized into the following structure:

### 1. [ARCHITECTURE.md](./ARCHITECTURE.md)
**Complete technical architecture and system design**

Includes:
- **Site Map**: Detailed structure for Home and About pages
- **Data Schema**: Complete data models and API structures
- **Technical Architecture**: Data flow, calculations, and error handling
- **Immersive Elements**: 3 CSS-based space effects (starfield, nebula, parallax)
- **Calculation Logic**: Astronomy formulas (LST, Altitude, Azimuth)

### 2. [CONTENT_STRATEGY.md](./CONTENT_STRATEGY.md)
**Copy, templates, and content guidelines**

Includes:
- **Page Copy**: All text content for Home and About pages
- **Planet Card Templates**: Factual descriptions for planets and stars
- **Visibility Status Messages**: Copy for all status states
- **Error Messages**: User-friendly error handling copy
- **Accessibility Labels**: ARIA labels and screen reader content

### 3. [UI_UX_FLOW.md](./UI_UX_FLOW.md)
**Interaction patterns, transitions, and user experience design**

Includes:
- **State Transitions**: Complete flow from landing to results
- **Animations**: Timing, easing, and sequence details
- **Card Interactions**: Hover, focus, and active states
- **Keyboard Navigation**: Tab order and shortcuts
- **Performance Guidelines**: Animation optimization strategies

---

## 🎯 Project Goals

1. **Real-time Celestial Data**: Display accurate planet and star positions based on user location
2. **Immersive Experience**: Space-inspired design with smooth animations and visual effects
3. **Educational Value**: Provide factual information about celestial objects
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Performance**: Optimized for Vercel Free Tier deployment

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings), Sans-serif (data)
- **APIs**: 
  - Zippopotam.us (geocoding)
  - Solar System OpenData API (celestial positions)
- **Deployment**: Vercel (Free Tier)

---

## 🚀 Key Features

### Search Experience
- Real-time pincode validation
- Smooth loading states with space-themed animations
- Location resolution with geocoding
- Error handling with clear user feedback

### Results Display
- Grouped by visibility status (Visible → Rising → Below Horizon)
- Real-time position updates every 5 minutes
- Responsive card layout (1/2/3 columns)
- Smooth animations and transitions

### Educational Content
- Factual planet and star descriptions
- Current visibility status and timing
- Astronomical data (magnitude, altitude, azimuth)
- Rise/set times and visibility windows

### Immersive Elements
1. **Animated Starfield Background**: CSS-based twinkling stars
2. **Nebula Gradient Overlay**: Shifting color washes (purples, blues)
3. **Parallax Card Effects**: 3D depth perception on scroll/hover

---

## 📊 Data Flow

```
User Input (Pincode)
    ↓
Geocoding (Zippopotam.us) → {latitude, longitude, city}
    ↓
Calculate Local Sidereal Time (LST)
    ↓
Fetch Celestial Data (Solar System OpenData API)
    ↓
Calculate Altitude/Azimuth (client-side)
    ↓
Filter & Sort by Visibility
    ↓
Render Planet Cards
```

---

## 🎨 Design Philosophy

### Visual Style
- **Clean**: Minimal UI with clear hierarchy
- **Space-Inspired**: Dark backgrounds with subtle cosmic effects
- **Educational**: Factual content with engaging presentation

### Typography
- **Headings**: Playfair Display (elegant, readable)
- **Body/Data**: Clean sans-serif (highly legible, modern)

### Color Palette
- **Status Colors**: Green (visible), Amber (rising), Gray (below horizon)
- **Accents**: Deep purples, blues (space theme)
- **Text**: High contrast for readability

---

## 📐 Core Calculations

### Local Sidereal Time (LST)
```
LST = 100.46 + 0.985647 * d + longitude + 15 * UTC_hours
```
Where `d` is days since J2000.0

### Altitude
```
Altitude = arcsin(sin(Dec) * sin(Lat) + cos(Dec) * cos(Lat) * cos(HA))
```

### Azimuth
```
Azimuth = arctan2(sin(HA), cos(HA) * sin(Lat) - tan(Dec) * cos(Lat))
```

---

## 🔄 Implementation Phases

### Phase 1: Core Functionality
- Geocoding integration
- Basic celestial data fetching
- Simple card layout

### Phase 2: Calculations
- Implement LST calculations
- Altitude/Azimuth transformations
- Visibility status logic

### Phase 3: Polish
- Immersive CSS effects
- Smooth transitions
- Responsive design refinements

### Phase 4: Enhancement
- Constellation lines
- Star catalog expansion
- Time-of-day predictions

---

## 🎯 Next Steps

1. **Review Documentation**: Read through all planning documents
2. **Set Up Project**: Initialize Next.js project with App Router
3. **Implement Phase 1**: Build core functionality
4. **Add Calculations**: Integrate astronomy formulas
5. **Polish UI/UX**: Implement animations and effects
6. **Test & Deploy**: Final testing and Vercel deployment

---

## 📚 Additional Resources

### APIs
- [Zippopotam.us Documentation](https://zippopotam.us/)
- [Solar System OpenData API](https://api.le-systeme-solaire.net/)

### Astronomy References
- Spherical Astronomy calculations
- Local Sidereal Time formulas
- Coordinate transformations

---

## 📝 Notes

- All documentation is organized and ready for implementation
- No code has been written yet—focus is on architecture and planning
- Calculations should be implemented client-side for real-time updates
- Privacy-first: No data storage, calculations performed on-device

---

**Status**: Planning Complete, Ready for Implementation  
**Version**: 1.0  
**Last Updated**: Initial Planning Phase
