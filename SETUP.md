# AsAbove - Setup Guide

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

## Project Structure

```
AsAbove/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and space effects
│   ├── page.tsx           # Home page with search and results
│   ├── about/             # About page
│   │   └── page.tsx
│   └── globals.css        # Global styles and space effects
├── components/            # React components
│   ├── SearchInterface.tsx
│   └── PlanetCard.tsx
├── lib/                   # Utilities and services
│   ├── geocoding.ts       # Zippopotam.us integration
│   ├── astronomy.ts       # Celestial calculations
│   └── planetData.ts      # Planet descriptions
└── package.json
```

## Features

- ✅ Real-time geocoding with Zippopotam.us
- ✅ Celestial position calculations (LST, Altitude, Azimuth)
- ✅ Planet cards with visibility status
- ✅ Immersive space effects (starfield, nebula, parallax)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features (keyboard navigation, ARIA labels)

## Notes

- Currently uses mock celestial data for demonstration
- To integrate real celestial data, update `getMockCelestialObjects` in `lib/astronomy.ts`
- Space effects use pure CSS for optimal performance
- All animations respect `prefers-reduced-motion`

## Testing

Try searching with valid US pincodes such as:
- `10001` (New York, NY)
- `90210` (Beverly Hills, CA)
- `60601` (Chicago, IL)
- `33101` (Miami, FL)
