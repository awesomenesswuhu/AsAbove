/**
 * USNO (U.S. Naval Observatory) API integration for accurate rise/set/transit times
 * Documentation: https://aa.usno.navy.mil/data/mrst
 * 
 * This API provides rise, set, and transit times for major solar system bodies
 * and bright stars for any location on Earth.
 */

export interface UsnoRiseSetResult {
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
}

/**
 * Map celestial body names to USNO body codes
 * USNO uses specific codes for celestial bodies
 */
const USNO_BODY_CODES: Record<string, string> = {
  Sun: "sun",
  Moon: "moon",
  Mercury: "mercury",
  Venus: "venus",
  Mars: "mars",
  Jupiter: "jupiter",
  Saturn: "saturn",
  Uranus: "uranus",
  Neptune: "neptune",
};

/**
 * Fetch rise, set, and transit times from USNO API
 * USNO API accepts latitude, longitude, and date
 */
export async function fetchUsnoRiseSetTimes(
  bodyName: string,
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Promise<UsnoRiseSetResult> {
  const bodyCode = USNO_BODY_CODES[bodyName];
  
  // If it's a star or unknown body, return null
  if (!bodyCode) {
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }

  try {
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    const [year, month, day] = dateStr.split('-');
    
    // USNO API endpoint - try multiple possible formats
    // The USNO service might use different endpoints
    // Try the web service format first
    const baseUrl = "https://aa.usno.navy.mil/api/rstt/oneday";
    
    const params = new URLSearchParams({
      date: dateStr,
      coords: `${latitude},${longitude}`, // lat, lon
      body: bodyCode,
    });
    
    // Alternative: try the web form endpoint that returns HTML/text
    // https://aa.usno.navy.mil/data/mrst

    const url = `${baseUrl}?${params.toString()}`;
    
    console.log(`Fetching USNO data for ${bodyName} from:`, url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`USNO API error for ${bodyName}:`, response.status, response.statusText);
      const text = await response.text();
      console.warn("Response:", text);
      return {
        riseTime: null,
        setTime: null,
        transitTime: null,
      };
    }

    const data = await response.json();
    console.log(`USNO API response for ${bodyName}:`, data);
    console.log(`USNO API properties for ${bodyName}:`, data.properties);
    if (data.properties?.data) {
      console.log(`USNO API data object for ${bodyName}:`, data.properties.data);
      // Log all keys in the data object to see what's available
      console.log(`USNO API data keys for ${bodyName}:`, Object.keys(data.properties.data));
    }
    if (data.properties?.data) {
      console.log(`USNO API data object for ${bodyName}:`, data.properties.data);
      // Log all keys in the data object to see what's available
      console.log(`USNO API data keys for ${bodyName}:`, Object.keys(data.properties.data));
    }

    // Parse the USNO response
    // USNO returns GeoJSON Feature format with properties object
    let riseTime: Date | null = null;
    let setTime: Date | null = null;
    let transitTime: Date | null = null;

    // Check properties object for rise/set/transit times
    if (data.properties) {
      const props = data.properties;
      
      // USNO properties might have fields like:
      // - rise, set, transit
      // - risetime, settime, transittime
      // - riseTime, setTime, transitTime
      // - or formatted strings like "6:27 A.M. NW"
      const riseValue = props.rise || props.risetime || props.riseTime || props.rising;
      const setValue = props.set || props.settime || props.setTime || props.setting;
      const transitValue = props.transit || props.transittime || props.transitTime || props.culmination || props.peak;

      if (riseValue) {
        riseTime = parseUsnoTime(riseValue, date, timezoneOffset);
      }
      if (setValue) {
        setTime = parseUsnoTime(setValue, date, timezoneOffset);
      }
      if (transitValue) {
        transitTime = parseUsnoTime(transitValue, date, timezoneOffset);
      }
    }

    // Fallback: check top-level data structure
    if (!riseTime && !setTime && !transitTime) {
      const riseValue = data.rise || data.risetime || data.riseTime;
      const setValue = data.set || data.settime || data.setTime;
      const transitValue = data.transit || data.transittime || data.transitTime || data.culmination;

      if (riseValue) {
        riseTime = parseUsnoTime(riseValue, date, timezoneOffset);
      }
      if (setValue) {
        setTime = parseUsnoTime(setValue, date, timezoneOffset);
      }
      if (transitValue) {
        transitTime = parseUsnoTime(transitValue, date, timezoneOffset);
      }
    }

    return {
      riseTime,
      setTime,
      transitTime,
    };
  } catch (error) {
    console.error(`Error fetching USNO data for ${bodyName}:`, error);
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}

/**
 * Parse USNO time string (format: "HH:MM A.M./P.M. DIRECTION" or "HH:MM")
 * USNO returns times in local time for the location
 */
function parseUsnoTime(timeStr: string, referenceDate: Date, timezoneOffset?: number): Date | null {
  try {
    if (!timeStr || typeof timeStr !== 'string') {
      return null;
    }

    // USNO format: "HH:MM A.M./P.M. DIRECTION" or "HH:MM"
    // Remove direction and clean up
    let cleanTime = timeStr.trim()
      .replace(/\s+[NSEW]{1,2}$/i, '') // Remove direction (e.g., "NE", "NW")
      .replace(/\./g, ''); // Remove periods in "A.M." -> "AM"
    
    // Parse 12-hour format with AM/PM
    const match = cleanTime.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
    if (!match) {
      // Try 24-hour format as fallback
      const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          return null;
        }
        const date = new Date(referenceDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
      return null;
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const amPm = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (amPm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (amPm === 'AM' && hours === 12) {
      hours = 0;
    }
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    // Create date using reference date with the parsed time
    const date = new Date(referenceDate);
    date.setHours(hours, minutes, 0, 0);
    
    // USNO returns local time, so no conversion needed
    return date;
  } catch (error) {
    console.error("Error parsing USNO time:", timeStr, error);
    return null;
  }
}

/**
 * Batch fetch rise/set times for multiple bodies
 */
export async function fetchMultipleUsnoRiseSetTimes(
  bodyNames: string[],
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Promise<Record<string, UsnoRiseSetResult>> {
  const results: Record<string, UsnoRiseSetResult> = {};
  
  // Fetch in parallel with small delays to respect rate limits
  const promises = bodyNames.map(async (name, index) => {
    // Add small delay to avoid overwhelming the API
    if (index > 0) {
      await new Promise(resolve => setTimeout(resolve, 300 * index));
    }
    const result = await fetchUsnoRiseSetTimes(name, latitude, longitude, date, timezoneOffset);
    return { name, result };
  });

  const fetched = await Promise.all(promises);
  
  fetched.forEach(({ name, result }) => {
    results[name] = result;
  });

  return results;
}
