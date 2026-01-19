import { calculateRiseSetTimes } from "./riseSetTimes";
import { calculateBestViewingWindow } from "./viewingTimes";
import { fetchMultipleUsnoRiseSetTimes } from "./usnoApi";
import { fetchMultipleHorizonsRiseSetTimes } from "./horizonsApi";
import { fetchMultiplePlanetaryPositions } from "./planetaryPositions";

export interface ConstellationPattern {
  x: number;
  y: number;
}

export interface CelestialObject {
  name: string;
  type: "planet" | "star" | "moon" | "meteor" | "constellation" | "galaxy";
  altitude: number;
  azimuth: number;
  magnitude: number;
  riseTime?: Date;
  setTime?: Date;
  transitTime?: Date;
  bestViewingStart?: Date;
  bestViewingEnd?: Date;
  rightAscension?: number;
  declination?: number;
  distance?: number;
  moonIllumination?: number;
  constellationPattern?: ConstellationPattern[];
  requiresTelescope?: boolean;
  peakDate?: string;
  hourlyRate?: string;
  isActive?: boolean;
  duration?: number;
}

export interface VisibilityStatus {
  status: "visible" | "rising" | "below" | "daylight";
  badge: string;
  message: string;
  backgroundColor: string;
  borderColor: string;
}

/**
 * Calculate Local Sidereal Time (LST) in hours
 */
export function calculateLocalSiderealTime(longitude: number, date: Date = new Date(), timezoneOffset?: number): number {
  const JD2000 = 2451545.0; // Julian Day for J2000.0
  
  // Convert current date to Julian Day
  const now = date.getTime();
  const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);
  
  // Calculate LST
  let lstHours = (100.46 + 0.985647 * daysSinceJ2000 + longitude + 15 * date.getUTCHours()) % 24;
  
  // Adjust for timezone if provided
  if (timezoneOffset !== undefined) {
    lstHours = (lstHours + timezoneOffset) % 24;
  }
  
  // Convert to 0-24 range
  return lstHours >= 0 ? lstHours : lstHours + 24;
}

/**
 * Calculate altitude (elevation angle) in degrees
 */
export function calculateAltitude(
  declination: number,
  latitude: number,
  hourAngle: number
): number {
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const haRad = (hourAngle * Math.PI) / 180;

  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);

  return (Math.asin(sinAlt) * 180) / Math.PI;
}

/**
 * Calculate azimuth (compass direction) in degrees
 */
export function calculateAzimuth(
  declination: number,
  latitude: number,
  hourAngle: number
): number {
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const haRad = (hourAngle * Math.PI) / 180;

  const cosAz =
    (Math.sin(decRad) - Math.sin(latRad) * Math.sin((calculateAltitude(declination, latitude, hourAngle) * Math.PI) / 180)) /
    (Math.cos(latRad) * Math.cos((calculateAltitude(declination, latitude, hourAngle) * Math.PI) / 180));

  let azimuth = (Math.acos(cosAz) * 180) / Math.PI;

  if (Math.sin(haRad) > 0) {
    azimuth = 360 - azimuth;
  }

  return azimuth;
}

/**
 * Calculate Moon illumination percentage (0-100)
 * Based on accurate lunar phase calculation using Julian Day
 * Reference: New Moon on Jan 6, 2000 18:14 UTC (JD 2451548.26)
 */
export function calculateMoonIllumination(date: Date = new Date()): number {
  // Julian Day for J2000.0 epoch (Jan 1, 2000 12:00 UTC)
  const JD2000 = 2451545.0;
  
  // Convert current date to Julian Day
  const now = date.getTime();
  const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);
  const jd = JD2000 + daysSinceJ2000;
  
  // Synodic month ≈ 29.53058867 days (period of lunar phases)
  const synodicMonth = 29.53058867;
  
  // Reference: Known new moon on Jan 6, 2000 18:14 UTC = JD 2451548.26
  const newMoonReferenceJD = 2451548.26;
  
  // Calculate days since reference new moon
  const daysSinceNewMoon = ((jd - newMoonReferenceJD) % synodicMonth + synodicMonth) % synodicMonth;
  
  // Lunar phase (0 = new moon, 0.5 = full moon, 1.0 = new moon again)
  const lunarPhase = daysSinceNewMoon / synodicMonth;
  
  // Calculate illumination percentage
  // Formula: (1 + cos(2π × phase - π)) / 2
  // At phase 0 (new moon): cos(-π) = -1, so illumination = (1-1)/2 = 0%
  // At phase 0.5 (full moon): cos(0) = 1, so illumination = (1+1)/2 = 100%
  const illumination = (1 + Math.cos(2 * Math.PI * lunarPhase - Math.PI)) / 2;
  
  // Convert to percentage (0-100) and round
  return Math.round(illumination * 100);
}

/**
 * Generate constellation star pattern
 */
export function generateConstellationPattern(name: string): ConstellationPattern[] {
  // Realistic patterns for major constellations (scaled to 0-100 viewBox)
  // Based on actual star positions and traditional star maps
  const patterns: Record<string, ConstellationPattern[]> = {
    "Orion": [
      // Belt (three bright stars in a nearly straight line)
      { x: 25, y: 52 },  // Alnitak (left)
      { x: 50, y: 50 },  // Alnilam (center, brightest)
      { x: 75, y: 48 },  // Mintaka (right, slightly offset)
      // Shoulders (above belt)
      { x: 35, y: 20 },  // Betelgeuse (left shoulder, red supergiant)
      { x: 65, y: 25 },  // Bellatrix (right shoulder)
      // Legs (below belt)
      { x: 32, y: 85 },  // Saiph (left leg)
      { x: 68, y: 80 },  // Rigel (right leg, brightest blue-white star)
    ],
    "Big Dipper": [
      // Bowl (4 stars forming the iconic scoop/ladle shape - more pronounced scoop)
      { x: 15, y: 30 },  // Dubhe (top right of bowl - pointer star, brightest)
      { x: 20, y: 50 },  // Merak (bottom right of bowl - pointer star)
      { x: 50, y: 55 },  // Phecda (bottom left of bowl)
      { x: 60, y: 35 },  // Megrez (top left of bowl)
      // Handle (3 stars curving away from bowl - iconic ladle handle)
      { x: 70, y: 40 },  // Alioth (first handle star)
      { x: 80, y: 48 },  // Mizar (middle handle star, with Alcor companion)
      { x: 90, y: 58 },  // Alkaid (end of handle - farthest from bowl)
    ],
    "Cassiopeia": [
      // W or M shape (depending on orientation) - 5 bright stars
      { x: 12, y: 48 },  // Schedar (leftmost, top)
      { x: 32, y: 28 },  // Caph (second from left, bottom of W)
      { x: 50, y: 42 },  // Cih (center, top of W)
      { x: 68, y: 28 },  // Ruchbah (second from right, bottom of W)
      { x: 88, y: 48 },  // Segin (rightmost, top)
    ],
    "Little Dipper": [
      // Smaller, fainter ladle (bowl near top, handle curves down)
      { x: 28, y: 32 },  // Kochab (top right of bowl - brightest after Polaris)
      { x: 34, y: 42 },  // Pherkad (top left of bowl)
      { x: 40, y: 52 },  // Yildun (bottom right of bowl)
      { x: 46, y: 48 },  // Ahfa al Farkadain (bottom left of bowl)
      // Handle curves down and to the right
      { x: 50, y: 62 },  // Handle star 1
      { x: 50, y: 75 },  // Handle star 2
      { x: 50, y: 88 },  // Polaris (North Star, end of handle - at celestial pole)
    ],
  };
  
  return patterns[name] || [
    { x: 30, y: 30 },
    { x: 50, y: 50 },
    { x: 70, y: 40 },
    { x: 40, y: 70 },
    { x: 60, y: 75 },
  ];
}

/**
 * Generate galaxy spiral pattern
 */
export function generateGalaxyPattern(): ConstellationPattern[] {
  // Spiral pattern: cluster in middle, spiraling out
  const pattern: ConstellationPattern[] = [];
  const centerX = 50;
  const centerY = 50;
  
  // Core cluster (8 points)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI;
    const radius = 8 + Math.random() * 4;
    pattern.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }
  
  // Spiral arms
  for (let arm = 0; arm < 2; arm++) {
    for (let i = 0; i < 15; i++) {
      const angle = (arm * Math.PI) + (i / 15) * 4 * Math.PI;
      const radius = 12 + (i / 15) * 35;
      pattern.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }
  }
  
  return pattern;
}

/**
 * Check if meteor shower is currently active
 */
export function isMeteorShowerActive(name: string, date: Date = new Date()): boolean {
  const meteorShowers: Record<string, { startMonth: number; startDay: number; endMonth: number; endDay: number }> = {
    "Perseids": { startMonth: 7, startDay: 17, endMonth: 8, endDay: 24 },
    "Geminids": { startMonth: 11, startDay: 4, endMonth: 12, endDay: 17 },
    "Leonids": { startMonth: 11, startDay: 6, endMonth: 11, endDay: 30 },
    "Lyrids": { startMonth: 4, startDay: 16, endMonth: 4, endDay: 25 },
  };
  
  const shower = meteorShowers[name];
  if (!shower) return false;
  
  const currentMonth = date.getMonth() + 1; // getMonth() is 0-based
  const currentDay = date.getDate();
  
  // Check if current date falls within the shower period
  if (currentMonth === shower.startMonth && currentDay >= shower.startDay) return true;
  if (currentMonth === shower.endMonth && currentDay <= shower.endDay) return true;
  if (currentMonth > shower.startMonth && currentMonth < shower.endMonth) return true;
  
  return false;
}

/**
 * Get visibility status for a celestial object
 */
export function getVisibilityStatus(
  altitude: number,
  riseTime?: Date,
  setTime?: Date,
  currentTime: Date = new Date()
): VisibilityStatus {
  const isNightTime = currentTime.getHours() < 6 || currentTime.getHours() >= 18;
  
  if (altitude > 0 && isNightTime) {
    return {
      status: "visible",
      badge: "🔭 Visible Now",
      message: "This object is currently visible.",
      backgroundColor: "rgba(34, 197, 94, 0.05)",
      borderColor: "#22c55e",
    };
  }

  if (riseTime && currentTime < riseTime) {
    const hoursUntilRise = (riseTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    if (hoursUntilRise <= 2) {
      return {
        status: "rising",
        badge: `⏰ Rises at ${formatTime(riseTime)}`,
        message: `This object will rise in ${Math.round(hoursUntilRise * 60)} minutes.`,
        backgroundColor: "rgba(245, 158, 11, 0.05)",
        borderColor: "#f59e0b",
      };
    }
  }

  if (altitude <= 0) {
    return {
      status: "below",
      badge: "🌙 Below Horizon",
      message: riseTime ? `Rises at ${formatTime(riseTime)}` : "Currently below the horizon.",
      backgroundColor: "rgba(107, 114, 128, 0.05)",
      borderColor: "#6b7280",
    };
  }

  return {
    status: "daylight",
    badge: "☀️ Daylight Only",
    message: "This object is only visible during daylight hours.",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderColor: "#3b82f6",
  };
}

/**
 * Format time as HH:MM AM/PM
 */
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Get celestial objects with accurate rise/set times from OPALE API
 * Falls back to calculations if API fails
 */
export async function getMockCelestialObjects(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Promise<CelestialObject[]> {
  const lst = calculateLocalSiderealTime(longitude, date, timezoneOffset);
  
  // Fetch current planetary positions for accurate calculations
  const planetsForPosition = ["Jupiter", "Saturn", "Mars", "Venus", "Mercury"];
  const planetaryPositions = await fetchMultiplePlanetaryPositions(planetsForPosition, date);
  
  // Create celestial objects with fetched positions
  const objects: CelestialObject[] = [
    // Planets
    {
      name: "Earth",
      type: "planet",
      rightAscension: 0.0,
      declination: 0.0,
      altitude: 90.0, // Always overhead (we're on it!)
      azimuth: 0.0,
      magnitude: -26.7,
      distance: 0.0,
    },
    {
      name: "Jupiter",
      type: "planet",
      rightAscension: planetaryPositions.Jupiter?.rightAscension ?? 3.2,
      declination: planetaryPositions.Jupiter?.declination ?? 17.0,
      altitude: calculateAltitude(planetaryPositions.Jupiter?.declination ?? 17.0, latitude, (lst - (planetaryPositions.Jupiter?.rightAscension ?? 3.2)) * 15),
      azimuth: calculateAzimuth(planetaryPositions.Jupiter?.declination ?? 17.0, latitude, (lst - (planetaryPositions.Jupiter?.rightAscension ?? 3.2)) * 15),
      magnitude: planetaryPositions.Jupiter?.magnitude ?? -2.5,
      distance: planetaryPositions.Jupiter?.distance ?? 5.2,
    },
    {
      name: "Mars",
      type: "planet",
      rightAscension: planetaryPositions.Mars?.rightAscension ?? 12.5,
      declination: planetaryPositions.Mars?.declination ?? 18.0,
      altitude: calculateAltitude(planetaryPositions.Mars?.declination ?? 18.0, latitude, (lst - (planetaryPositions.Mars?.rightAscension ?? 12.5)) * 15),
      azimuth: calculateAzimuth(planetaryPositions.Mars?.declination ?? 18.0, latitude, (lst - (planetaryPositions.Mars?.rightAscension ?? 12.5)) * 15),
      magnitude: planetaryPositions.Mars?.magnitude ?? 0.5,
      distance: planetaryPositions.Mars?.distance ?? 1.5,
    },
    {
      name: "Venus",
      type: "planet",
      rightAscension: planetaryPositions.Venus?.rightAscension ?? 6.5,
      declination: planetaryPositions.Venus?.declination ?? 20.0,
      altitude: calculateAltitude(planetaryPositions.Venus?.declination ?? 20.0, latitude, (lst - (planetaryPositions.Venus?.rightAscension ?? 6.5)) * 15),
      azimuth: calculateAzimuth(planetaryPositions.Venus?.declination ?? 20.0, latitude, (lst - (planetaryPositions.Venus?.rightAscension ?? 6.5)) * 15),
      magnitude: planetaryPositions.Venus?.magnitude ?? -4.2,
      distance: planetaryPositions.Venus?.distance ?? 0.7,
    },
    {
      name: "Saturn",
      type: "planet",
      rightAscension: planetaryPositions.Saturn?.rightAscension ?? 0.8,
      declination: planetaryPositions.Saturn?.declination ?? 9.0,
      altitude: calculateAltitude(planetaryPositions.Saturn?.declination ?? 9.0, latitude, (lst - (planetaryPositions.Saturn?.rightAscension ?? 0.8)) * 15),
      azimuth: calculateAzimuth(planetaryPositions.Saturn?.declination ?? 9.0, latitude, (lst - (planetaryPositions.Saturn?.rightAscension ?? 0.8)) * 15),
      magnitude: planetaryPositions.Saturn?.magnitude ?? 0.8,
      distance: planetaryPositions.Saturn?.distance ?? 9.5,
    },
    // Moon
    {
      name: "Moon",
      type: "moon",
      rightAscension: 8.5,
      declination: 15.0,
      altitude: calculateAltitude(15.0, latitude, (lst - 8.5) * 15),
      azimuth: calculateAzimuth(15.0, latitude, (lst - 8.5) * 15),
      magnitude: -12.6,
      distance: 0.00257,
      moonIllumination: calculateMoonIllumination(date),
    },
    // Stars
    {
      name: "Sirius",
      type: "star",
      rightAscension: 6.75,
      declination: -16.7,
      altitude: calculateAltitude(-16.7, latitude, (lst - 6.75) * 15),
      azimuth: calculateAzimuth(-16.7, latitude, (lst - 6.75) * 15),
      magnitude: -1.46,
      distance: 8.6, // light-years
    },
    {
      name: "Polaris",
      type: "star",
      rightAscension: 2.53,
      declination: 89.3, // Near north celestial pole
      altitude: latitude > 0 ? latitude : 0, // For Northern Hemisphere, altitude ≈ latitude
      azimuth: 0,
      magnitude: 1.98,
      distance: 433, // light-years
      // No rise/set time for circumpolar stars
    },
    // Constellations
    {
      name: "Orion",
      type: "constellation",
      rightAscension: 5.5,
      declination: 5.0,
      altitude: calculateAltitude(5.0, latitude, (lst - 5.5) * 15),
      azimuth: calculateAzimuth(5.0, latitude, (lst - 5.5) * 15),
      magnitude: -1.0,
      constellationPattern: generateConstellationPattern("Orion"),
    },
    {
      name: "Big Dipper",
      type: "constellation",
      rightAscension: 11.0,
      declination: 60.0,
      altitude: calculateAltitude(60.0, latitude, (lst - 11.0) * 15),
      azimuth: calculateAzimuth(60.0, latitude, (lst - 11.0) * 15),
      magnitude: 1.8,
      constellationPattern: generateConstellationPattern("Big Dipper"),
    },
    {
      name: "Cassiopeia",
      type: "constellation",
      rightAscension: 1.0,
      declination: 60.0,
      altitude: calculateAltitude(60.0, latitude, (lst - 1.0) * 15),
      azimuth: calculateAzimuth(60.0, latitude, (lst - 1.0) * 15),
      magnitude: 2.2,
      constellationPattern: generateConstellationPattern("Cassiopeia"),
    },
    {
      name: "Little Dipper",
      type: "constellation",
      rightAscension: 15.0,
      declination: 75.0,
      altitude: calculateAltitude(75.0, latitude, (lst - 15.0) * 15),
      azimuth: calculateAzimuth(75.0, latitude, (lst - 15.0) * 15),
      magnitude: 2.0,
      constellationPattern: generateConstellationPattern("Little Dipper"),
    },
    // Galaxies
    {
      name: "Andromeda Galaxy",
      type: "galaxy",
      rightAscension: 0.67,
      declination: 41.3,
      altitude: calculateAltitude(41.3, latitude, (lst - 0.67) * 15),
      azimuth: calculateAzimuth(41.3, latitude, (lst - 0.67) * 15),
      magnitude: 3.4,
      distance: 2500, // million light-years
      requiresTelescope: false,
      constellationPattern: generateGalaxyPattern(),
    },
    {
      name: "Triangulum Galaxy",
      type: "galaxy",
      rightAscension: 1.33,
      declination: 30.65,
      altitude: calculateAltitude(30.65, latitude, (lst - 1.33) * 15),
      azimuth: calculateAzimuth(30.65, latitude, (lst - 1.33) * 15),
      magnitude: 5.7,
      distance: 3000,
      requiresTelescope: true,
      constellationPattern: generateGalaxyPattern(),
    },
    {
      name: "Whirlpool Galaxy",
      type: "galaxy",
      rightAscension: 13.5,
      declination: 47.2,
      altitude: calculateAltitude(47.2, latitude, (lst - 13.5) * 15),
      azimuth: calculateAzimuth(47.2, latitude, (lst - 13.5) * 15),
      magnitude: 8.4,
      distance: 31000,
      requiresTelescope: true,
      constellationPattern: generateGalaxyPattern(),
    },
    // Meteor Showers
    {
      name: "Perseids",
      type: "meteor",
      rightAscension: 3.2,
      declination: 58.0,
      altitude: calculateAltitude(58.0, latitude, (lst - 3.2) * 15),
      azimuth: calculateAzimuth(58.0, latitude, (lst - 3.2) * 15),
      magnitude: 0,
      peakDate: "August 12-13",
      hourlyRate: "100+",
      isActive: isMeteorShowerActive("Perseids", date),
    },
    {
      name: "Geminids",
      type: "meteor",
      rightAscension: 7.5,
      declination: 32.0,
      altitude: calculateAltitude(32.0, latitude, (lst - 7.5) * 15),
      azimuth: calculateAzimuth(32.0, latitude, (lst - 7.5) * 15),
      magnitude: 0,
      peakDate: "December 13-14",
      hourlyRate: "120+",
      isActive: isMeteorShowerActive("Geminids", date),
    },
    {
      name: "Leonids",
      type: "meteor",
      rightAscension: 10.2,
      declination: 22.0,
      altitude: calculateAltitude(22.0, latitude, (lst - 10.2) * 15),
      azimuth: calculateAzimuth(22.0, latitude, (lst - 10.2) * 15),
      magnitude: 0,
      peakDate: "November 17-18",
      hourlyRate: "15-20",
      isActive: isMeteorShowerActive("Leonids", date),
    },
    {
      name: "Lyrids",
      type: "meteor",
      rightAscension: 18.1,
      declination: 32.0,
      altitude: calculateAltitude(32.0, latitude, (lst - 18.1) * 15),
      azimuth: calculateAzimuth(32.0, latitude, (lst - 18.1) * 15),
      magnitude: 0,
      peakDate: "April 22-23",
      hourlyRate: "10-20",
      isActive: isMeteorShowerActive("Lyrids", date),
    },
  ];

  // Try fetching from USNO API first (best for Sun/Moon, may work for planets)
  // Then try Horizons API (comprehensive for all planets)
  const planetNames = objects
    .filter(obj => (obj.type === "planet" || obj.type === "moon") && obj.name !== "Earth")
    .map(obj => obj.name);
  
  let apiResults: Record<string, { riseTime: Date | null; setTime: Date | null; transitTime: Date | null }> = {};
  
  if (planetNames.length > 0) {
    try {
      // Try USNO API first (fast, reliable for Sun/Moon)
      const usnoResults = await fetchMultipleUsnoRiseSetTimes(
        planetNames, 
        latitude, 
        longitude, 
        date, 
        timezoneOffset
      );
      
      // Convert USNO results
      Object.keys(usnoResults).forEach(name => {
        if (usnoResults[name].riseTime || usnoResults[name].setTime || usnoResults[name].transitTime) {
          apiResults[name] = {
            riseTime: usnoResults[name].riseTime,
            setTime: usnoResults[name].setTime,
            transitTime: usnoResults[name].transitTime,
          };
        }
      });
      
      // For planets not found in USNO, try Horizons API
      const missingPlanets = planetNames.filter(name => !apiResults[name] || (!apiResults[name].riseTime && !apiResults[name].setTime && !apiResults[name].transitTime));
      if (missingPlanets.length > 0) {
        try {
          const horizonsResults = await fetchMultipleHorizonsRiseSetTimes(
            missingPlanets,
            latitude,
            longitude,
            date,
            0, // elevation in meters
            timezoneOffset
          );
          
          // Merge Horizons results
          Object.keys(horizonsResults).forEach(name => {
            if (horizonsResults[name].riseTime || horizonsResults[name].setTime || horizonsResults[name].transitTime) {
              apiResults[name] = {
                riseTime: horizonsResults[name].riseTime,
                setTime: horizonsResults[name].setTime,
                transitTime: horizonsResults[name].transitTime,
              };
            }
          });
        } catch (error) {
          console.warn("Horizons API fetch failed, falling back to calculations:", error);
        }
      }
    } catch (error) {
      console.warn("USNO API fetch failed, trying Horizons API:", error);
      
      // If USNO fails completely, try Horizons for all planets
      try {
        const horizonsResults = await fetchMultipleHorizonsRiseSetTimes(
          planetNames,
          latitude,
          longitude,
          date,
          0,
          timezoneOffset
        );
        
        Object.keys(horizonsResults).forEach(name => {
          apiResults[name] = {
            riseTime: horizonsResults[name].riseTime,
            setTime: horizonsResults[name].setTime,
            transitTime: horizonsResults[name].transitTime,
          };
        });
      } catch (horizonsError) {
        console.warn("Both USNO and Horizons APIs failed, using local calculations:", horizonsError);
      }
    }
  }

  // Calculate rise/set times for objects that can rise/set
  // Use OPALE API data if available, otherwise fall back to calculations
  return objects.map((obj) => {
    // Skip rise/set calculation for circumpolar objects (like Polaris) or meteors
    if (obj.name === "Polaris" || obj.declination === undefined || obj.type === "meteor") {
      return obj;
    }
    
    // For circumpolar objects, check if they never rise/set
    const declination = obj.declination || 0;
    const isCircumpolar = Math.abs(declination) > (90 - Math.abs(latitude));
    if (isCircumpolar && declination > 0) {
      // Northern circumpolar - always visible (no rise/set times)
      return {
        ...obj,
        // No rise/set times
      };
    }
    
    // Try to use API data first (for planets and moon)
    const apiData = apiResults[obj.name];
    
    if (apiData && (apiData.riseTime || apiData.setTime || apiData.transitTime)) {
      // Use API data, but still calculate prime viewing window
      const rightAscension = obj.rightAscension || 0;
      const viewingWindow = calculateBestViewingWindow(
        rightAscension,
        declination,
        latitude,
        longitude,
        date,
        timezoneOffset,
        apiData.transitTime || undefined // Use API transit time for better accuracy (convert null to undefined)
      );
      
      return {
        ...obj,
        riseTime: apiData.riseTime || undefined,
        setTime: apiData.setTime || undefined,
        transitTime: apiData.transitTime || undefined,
        bestViewingStart: viewingWindow.startTime || undefined,
        bestViewingEnd: viewingWindow.endTime || undefined,
      };
    }
    
    // Fall back to calculations if API data not available
    const rightAscension = obj.rightAscension || 0;
    const riseSetResult = calculateRiseSetTimes(
      rightAscension,
      declination,
      latitude,
      longitude,
      date,
      timezoneOffset
    );
    
    // Calculate prime viewing window
    const viewingWindow = calculateBestViewingWindow(
      rightAscension,
      declination,
      latitude,
      longitude,
      date,
      timezoneOffset
    );
    
    return {
      ...obj,
      riseTime: riseSetResult.riseTime || undefined,
      setTime: riseSetResult.setTime || undefined,
      transitTime: riseSetResult.transitTime,
      bestViewingStart: viewingWindow.startTime || undefined,
      bestViewingEnd: viewingWindow.endTime || undefined,
    };
  });
}
