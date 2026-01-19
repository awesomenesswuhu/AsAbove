/**
 * NASA JPL Horizons API integration for accurate rise/set/transit times
 * Documentation: https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */

export interface HorizonsRiseSetResult {
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
}

/**
 * Map celestial body names to Horizons target IDs
 * Horizons uses specific IDs for solar system bodies
 */
const HORIZONS_TARGETS: Record<string, string> = {
  Sun: "10",           // Sun
  Moon: "301",          // Moon
  Mercury: "199",       // Mercury
  Venus: "299",         // Venus
  Earth: "399",         // Earth
  Mars: "499",          // Mars
  Jupiter: "599",       // Jupiter
  Saturn: "699",        // Saturn
  Uranus: "799",        // Uranus
  Neptune: "899",       // Neptune
};

/**
 * Fetch rise, set, and transit times from NASA JPL Horizons API
 * Uses RTS (Rise-Transit-Set) mode for observer-based calculations
 */
export async function fetchHorizonsRiseSetTimes(
  bodyName: string,
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  elevation: number = 0,
  timezoneOffset?: number
): Promise<HorizonsRiseSetResult> {
  const targetId = HORIZONS_TARGETS[bodyName];
  
  // If it's a star or unknown body, return null
  if (!targetId) {
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }

  try {
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    
    // Horizons API endpoint - using RTS (Rise-Transit-Set) mode
    // Observer coordinates: lat, lon, elevation in meters
    const elevationMeters = elevation * 1000; // Convert km to meters if needed
    
    // Construct the query URL
    // Using the Horizons Web API format
    const baseUrl = "https://ssd-api.jpl.nasa.gov/horizons.api";
    
    // Query parameters for RTS mode
    // Horizons API format based on documentation
    // Format timezone offset for API (e.g., "-08:00" for PST)
    const tzOffset = timezoneOffset !== undefined 
      ? `${timezoneOffset >= 0 ? '+' : ''}${String(timezoneOffset).padStart(2, '0')}:00`
      : '+00:00';
    
    // Try using text format first for better RTS parsing
    const params = new URLSearchParams({
      format: "text",  // Use text format for clearer RTS event markers
      COMMAND: targetId,
      OBJ_DATA: "YES",
      MAKE_EPHEM: "YES",
      EPHEM_TYPE: "OBSERVER",
      CENTER: `coord@399`,
      COORD_TYPE: "GEODETIC",
      SITE_COORD: `${longitude},${latitude},${elevationMeters}`,
      START_TIME: dateStr,
      STOP_TIME: dateStr,
      STEP_SIZE: "1",  // 1 minute steps
      QUANTITIES: "4",  // Request RTS (Rise-Transit-Set) events specifically
      CAL_FORMAT: "CAL",
      TIME_DIGITS: "MINUTES",
    });

    const url = `${baseUrl}?${params.toString()}`;
    
    console.log(`Fetching Horizons data for ${bodyName} from:`, url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Horizons API error for ${bodyName}:`, response.status, response.statusText);
      return {
        riseTime: null,
        setTime: null,
        transitTime: null,
      };
    }

    const responseText = await response.text();
    console.log(`Horizons API response for ${bodyName} (first 500 chars):`, responseText.substring(0, 500));

    // Parse the Horizons response
    // Horizons returns text output with RTS events clearly marked
    let riseTime: Date | null = null;
    let setTime: Date | null = null;
    let transitTime: Date | null = null;

    // Parse text output - look for RTS event markers
    const lines = responseText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for RTS event markers - Horizons marks these clearly
      // Format examples: "Rise 2026-01-19 16:09" or "Date__(UT)__HR:MN" followed by times
      if (line.match(/Rise|rise|RISE/i) && !riseTime) {
        // Try to extract time from this line or next line
        const timeMatch = extractTimeFromLine(line) || extractTimeFromLine(lines[i + 1] || '') || extractTimeFromLine(lines[i + 2] || '');
        if (timeMatch) {
          riseTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
        }
      } else if (line.match(/Transit|transit|TRANSIT|Culmination|culmination/i) && !transitTime) {
        const timeMatch = extractTimeFromLine(line) || extractTimeFromLine(lines[i + 1] || '') || extractTimeFromLine(lines[i + 2] || '');
        if (timeMatch) {
          transitTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
        }
      } else if (line.match(/Set|set|SET/i) && !line.includes('Rise') && !setTime) {
        const timeMatch = extractTimeFromLine(line) || extractTimeFromLine(lines[i + 1] || '') || extractTimeFromLine(lines[i + 2] || '');
        if (timeMatch) {
          setTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
        }
      }
    }

    // If text parsing failed, try parsing as JSON (some endpoints return JSON)
    if (!riseTime && !setTime && !transitTime) {
      try {
        const data = JSON.parse(responseText);
        if (data.result && typeof data.result === 'string') {
          // Re-parse the result text
          const resultLines = data.result.split('\n');
          for (const line of resultLines) {
            if (line.match(/Rise/i) && !riseTime) {
              const timeMatch = extractTimeFromLine(line);
              if (timeMatch) riseTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
            } else if (line.match(/Transit|Culmination/i) && !transitTime) {
              const timeMatch = extractTimeFromLine(line);
              if (timeMatch) transitTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
            } else if (line.match(/Set/i) && !setTime) {
              const timeMatch = extractTimeFromLine(line);
              if (timeMatch) setTime = parseHorizonsTime(timeMatch, date, timezoneOffset);
            }
          }
        }
        // Check for structured JSON fields
        if (!riseTime && data.rise) riseTime = new Date(data.rise);
        if (!setTime && data.set) setTime = new Date(data.set);
        if (!transitTime && (data.transit || data.culmination)) transitTime = new Date(data.transit || data.culmination);
      } catch (e) {
        // Not JSON, that's fine - we already tried text parsing
      }
    }

    return {
      riseTime,
      setTime,
      transitTime,
    };
  } catch (error) {
    console.error(`Error fetching Horizons data for ${bodyName}:`, error);
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}

/**
 * Extract time string from a Horizons output line
 * Horizons formats: "2026-01-19 16:09" or "16:09" or "Jan 19, 2026 16:09"
 */
function extractTimeFromLine(line: string): string | null {
  // Try multiple time patterns
  const timePatterns = [
    /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?/,  // YYYY-MM-DD HH:MM or HH:MM:SS
    /\d{2}:\d{2}:\d{2}/,                            // HH:MM:SS
    /\d{2}:\d{2}/,                                   // HH:MM
    /[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}\s+\d{2}:\d{2}/, // "Jan 19, 2026 16:09"
  ];

  for (const pattern of timePatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

/**
 * Parse Horizons time string and convert to Date
 * Horizons returns times in UTC
 */
function parseHorizonsTime(timeStr: string, referenceDate: Date, timezoneOffset?: number): Date | null {
  try {
    let date: Date;
    
    // If time string includes date, parse it directly
    if (timeStr.includes('-')) {
      // Full date-time format: "YYYY-MM-DD HH:MM"
      const [datePart, timePart] = timeStr.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      date = new Date(Date.UTC(year, month - 1, day, hours, minutes || 0, 0));
    } else {
      // Time only: "HH:MM" - use reference date
      const [hours, minutes] = timeStr.split(':').map(Number);
      date = new Date(referenceDate);
      date.setUTCHours(hours, minutes || 0, 0, 0);
    }

    // Convert UTC to local time if timezone offset provided
    if (timezoneOffset !== undefined) {
      date.setTime(date.getTime() + timezoneOffset * 3600000);
    }

    return date;
  } catch (error) {
    console.error("Error parsing Horizons time:", timeStr, error);
    return null;
  }
}

/**
 * Batch fetch rise/set times for multiple bodies
 */
export async function fetchMultipleHorizonsRiseSetTimes(
  bodyNames: string[],
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  elevation: number = 0,
  timezoneOffset?: number
): Promise<Record<string, HorizonsRiseSetResult>> {
  const results: Record<string, HorizonsRiseSetResult> = {};
  
  // Fetch in parallel (with some delay to respect rate limits)
  const promises = bodyNames.map(async (name, index) => {
    // Add small delay to avoid overwhelming the API
    if (index > 0) {
      await new Promise(resolve => setTimeout(resolve, 200 * index));
    }
    const result = await fetchHorizonsRiseSetTimes(name, latitude, longitude, date, elevation, timezoneOffset);
    return { name, result };
  });

  const fetched = await Promise.all(promises);
  
  fetched.forEach(({ name, result }) => {
    results[name] = result;
  });

  return results;
}
