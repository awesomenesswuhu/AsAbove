/**
 * Manual planetary position lookup table with interpolation
 * Positions are accurate for specific date ranges
 * Update these positions periodically (monthly/quarterly) for accuracy
 */

export interface PlanetaryPosition {
  rightAscension: number; // in hours
  declination: number; // in degrees
  magnitude?: number;
  distance?: number; // in AU
}

/**
 * Planetary positions lookup table
 * Organized by date ranges for accuracy
 * Positions are accurate for the middle of each range
 */
interface PositionEntry {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  positions: Record<string, PlanetaryPosition>;
}

const PLANETARY_POSITIONS: PositionEntry[] = [
  {
    // January 2026 positions
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    positions: {
      Jupiter: {
        // Rises 4:09 PM, Sets 6:27 AM - calculated RA from rise time
        rightAscension: 15.11, // hours - calculated to match 4:09 PM rise
        declination: 18.0, // degrees
        magnitude: -2.5,
        distance: 5.2,
      },
      Saturn: {
        // Rises 9:56 AM, Sets 9:44 PM - calculated RA from rise time
        rightAscension: 8.51, // hours - calculated to match 9:56 AM rise
        declination: 10.5, // degrees
        magnitude: 0.8,
        distance: 9.5,
      },
      Mars: {
        // Rises 6:54 AM, Sets 4:55 PM - calculated RA from rise time
        rightAscension: 5.88, // hours - calculated to match 6:54 AM rise
        declination: 19.0, // degrees
        magnitude: 0.5,
        distance: 1.5,
      },
      Venus: {
        // Rises 7:14 AM, Sets 5:23 PM - calculated RA from rise time
        rightAscension: 6.32, // hours - calculated to match 7:14 AM rise
        declination: 21.0, // degrees
        magnitude: -4.2,
        distance: 0.7,
      },
      Mercury: {
        rightAscension: 11.0, // hours (varies quickly)
        declination: 16.5, // degrees
        magnitude: 0.0,
        distance: 0.4,
      },
    },
  },
  {
    // February 2026 positions
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    positions: {
      Jupiter: {
        rightAscension: 15.3, // Slight drift from January (~0.2h per month)
        declination: 18.2,
        magnitude: -2.5,
        distance: 5.2,
      },
      Saturn: {
        rightAscension: 8.7, // Slight drift from January (~0.2h per month)
        declination: 10.7,
        magnitude: 0.8,
        distance: 9.5,
      },
      Mars: {
        rightAscension: 6.2, // Slight drift from January (~0.3h per month)
        declination: 19.2,
        magnitude: 0.5,
        distance: 1.5,
      },
      Venus: {
        rightAscension: 6.6, // Slight drift from January (~0.3h per month)
        declination: 21.2,
        magnitude: -4.2,
        distance: 0.7,
      },
      Mercury: {
        rightAscension: 11.5,
        declination: 17.0,
        magnitude: 0.0,
        distance: 0.4,
      },
    },
  },
  {
    // March 2026 positions
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    positions: {
      Jupiter: {
        rightAscension: 15.5, // Slight drift from February (~0.2h per month)
        declination: 18.4,
        magnitude: -2.5,
        distance: 5.2,
      },
      Saturn: {
        rightAscension: 8.9, // Slight drift from February (~0.2h per month)
        declination: 10.9,
        magnitude: 0.8,
        distance: 9.5,
      },
      Mars: {
        rightAscension: 6.5, // Slight drift from February (~0.3h per month)
        declination: 19.4,
        magnitude: 0.5,
        distance: 1.5,
      },
      Venus: {
        rightAscension: 6.9, // Slight drift from February (~0.3h per month)
        declination: 21.4,
        magnitude: -4.2,
        distance: 0.7,
      },
      Mercury: {
        rightAscension: 12.0,
        declination: 17.5,
        magnitude: 0.0,
        distance: 0.4,
      },
    },
  },
  // Add more months as needed - positions drift slowly for outer planets
];

/**
 * Parse date string to Date object
 */
function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * Interpolate between two positions
 * Handles RA wrapping (0-24 hours)
 */
function interpolatePosition(
  pos1: PlanetaryPosition,
  pos2: PlanetaryPosition,
  factor: number // 0 = pos1, 1 = pos2
): PlanetaryPosition {
  // Interpolate declination (straightforward)
  const dec = pos1.declination + (pos2.declination - pos1.declination) * factor;
  
  // Interpolate RA (handle wrapping)
  let ra1 = pos1.rightAscension;
  let ra2 = pos2.rightAscension;
  
  // Handle RA wrapping - choose shortest path
  if (Math.abs(ra2 - ra1) > 12) {
    if (ra2 > ra1) {
      ra2 -= 24;
    } else {
      ra1 -= 24;
    }
  }
  
  let ra = ra1 + (ra2 - ra1) * factor;
  if (ra < 0) ra += 24;
  if (ra >= 24) ra -= 24;
  
  // Interpolate magnitude and distance if present
  const magnitude = pos1.magnitude !== undefined && pos2.magnitude !== undefined
    ? pos1.magnitude + (pos2.magnitude - pos1.magnitude) * factor
    : pos1.magnitude ?? pos2.magnitude;
    
  const distance = pos1.distance !== undefined && pos2.distance !== undefined
    ? pos1.distance + (pos2.distance - pos1.distance) * factor
    : pos1.distance ?? pos2.distance;
  
  return {
    rightAscension: ra,
    declination: dec,
    magnitude,
    distance,
  };
}

/**
 * Get planetary position from lookup table with interpolation
 * Returns interpolated position between date ranges for smooth transitions
 */
export async function fetchPlanetaryPosition(
  planetName: string,
  date: Date = new Date()
): Promise<PlanetaryPosition | null> {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const targetDate = parseDate(dateStr);
  
  // Find the position entry that contains this date
  for (let i = 0; i < PLANETARY_POSITIONS.length; i++) {
    const entry = PLANETARY_POSITIONS[i];
    const startDate = parseDate(entry.startDate);
    const endDate = parseDate(entry.endDate);
    
    if (targetDate >= startDate && targetDate <= endDate) {
      const position = entry.positions[planetName];
      if (position) {
        // If there's a next entry, interpolate for smoother transitions
        if (i < PLANETARY_POSITIONS.length - 1) {
          const nextEntry = PLANETARY_POSITIONS[i + 1];
          const nextStartDate = parseDate(nextEntry.startDate);
          const nextPosition = nextEntry.positions[planetName];
          
          if (nextPosition) {
            // Calculate interpolation factor based on position within current range
            const totalDays = daysBetween(startDate, endDate);
            const daysFromStart = daysBetween(startDate, targetDate);
            const factor = totalDays > 0 ? daysFromStart / totalDays : 0;
            
            // Interpolate between current and next position
            return interpolatePosition(position, nextPosition, factor);
          }
        }
        
        return position;
      }
    }
  }
  
  // If date is before first entry, use first entry
  if (PLANETARY_POSITIONS.length > 0) {
    const firstEntry = PLANETARY_POSITIONS[0];
    if (targetDate < parseDate(firstEntry.startDate)) {
      return firstEntry.positions[planetName] || null;
    }
  }
  
  // If date is after last entry, use last entry
  if (PLANETARY_POSITIONS.length > 0) {
    const lastEntry = PLANETARY_POSITIONS[PLANETARY_POSITIONS.length - 1];
    if (targetDate > parseDate(lastEntry.endDate)) {
      return lastEntry.positions[planetName] || null;
    }
  }
  
  return null;
}

/**
 * Fetch multiple planetary positions
 */
export async function fetchMultiplePlanetaryPositions(
  planetNames: string[],
  date: Date = new Date()
): Promise<Record<string, PlanetaryPosition>> {
  const results: Record<string, PlanetaryPosition> = {};
  
  for (const name of planetNames) {
    const position = await fetchPlanetaryPosition(name, date);
    if (position) {
      results[name] = position;
    }
  }

  return results;
}
