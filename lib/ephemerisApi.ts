/**
 * Ephemeris.fyi API integration
 * API: https://ephemeris.fyi
 * Provides ephemeris data including rise/set times
 */

export interface EphemerisRiseSetResult {
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
}

/**
 * Map celestial body names to Ephemeris.fyi identifiers
 */
const EPHEMERIS_BODIES: Record<string, string> = {
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
 * Fetch rise/set times from Ephemeris.fyi API
 */
export async function fetchEphemerisRiseSetTimes(
  bodyName: string,
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Promise<EphemerisRiseSetResult> {
  const bodyId = EPHEMERIS_BODIES[bodyName];
  
  if (!bodyId) {
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }

  try {
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    
    // Ephemeris.fyi API endpoint
    // Format may vary - trying common patterns
    const url = `https://api.ephemeris.fyi/v1/rts?body=${bodyId}&lat=${latitude}&lon=${longitude}&date=${dateStr}`;
    
    console.log(`Fetching Ephemeris.fyi data for ${bodyName} from:`, url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Ephemeris.fyi API error for ${bodyName}:`, response.status, response.statusText);
      // Try alternative endpoint format
      const altUrl = `https://ephemeris.fyi/api/rts/${bodyId}?lat=${latitude}&lon=${longitude}&date=${dateStr}`;
      console.log(`Trying alternative endpoint:`, altUrl);
      
      const altResponse = await fetch(altUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!altResponse.ok) {
        return {
          riseTime: null,
          setTime: null,
          transitTime: null,
        };
      }

      const altData = await altResponse.json();
      console.log(`Ephemeris.fyi alternative response for ${bodyName}:`, altData);
      return parseEphemerisResponse(altData, date, timezoneOffset);
    }

    const data = await response.json();
    console.log(`Ephemeris.fyi API response for ${bodyName}:`, data);

    return parseEphemerisResponse(data, date, timezoneOffset);
  } catch (error) {
    console.error(`Error fetching Ephemeris.fyi data for ${bodyName}:`, error);
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}

/**
 * Parse Ephemeris.fyi API response
 */
function parseEphemerisResponse(
  data: any,
  date: Date,
  timezoneOffset?: number
): EphemerisRiseSetResult {
  let riseTime: Date | null = null;
  let setTime: Date | null = null;
  let transitTime: Date | null = null;

  // Try different possible response structures
  const riseValue = data.rise || data.riseTime || data.rising || data.properties?.rise;
  const setValue = data.set || data.setTime || data.setting || data.properties?.set;
  const transitValue = data.transit || data.culmination || data.peak || data.properties?.transit;

  if (riseValue) {
    riseTime = parseTimeString(riseValue, date, timezoneOffset);
  }
  if (setValue) {
    setTime = parseTimeString(setValue, date, timezoneOffset);
  }
  if (transitValue) {
    transitTime = parseTimeString(transitValue, date, timezoneOffset);
  }

  return {
    riseTime,
    setTime,
    transitTime,
  };
}

/**
 * Parse time string from API response
 */
function parseTimeString(
  timeStr: string | number,
  referenceDate: Date,
  timezoneOffset?: number
): Date | null {
  try {
    if (typeof timeStr === 'number') {
      // Unix timestamp
      const date = new Date(timeStr * 1000);
      if (timezoneOffset !== undefined) {
        date.setTime(date.getTime() + timezoneOffset * 3600000);
      }
      return date;
    }

    // Try parsing as ISO string or other formats
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      return null;
    }

    if (timezoneOffset !== undefined) {
      date.setTime(date.getTime() + timezoneOffset * 3600000);
    }

    return date;
  } catch (error) {
    console.error("Error parsing time string:", timeStr, error);
    return null;
  }
}

/**
 * Batch fetch rise/set times for multiple bodies
 */
export async function fetchMultipleEphemerisRiseSetTimes(
  bodyNames: string[],
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Promise<Record<string, EphemerisRiseSetResult>> {
  const results: Record<string, EphemerisRiseSetResult> = {};
  
  // Fetch in parallel with small delays
  const promises = bodyNames.map(async (name, index) => {
    if (index > 0) {
      await new Promise(resolve => setTimeout(resolve, 200 * index));
    }
    const result = await fetchEphemerisRiseSetTimes(name, latitude, longitude, date, timezoneOffset);
    return { name, result };
  });

  const fetched = await Promise.all(promises);
  
  fetched.forEach(({ name, result }) => {
    results[name] = result;
  });

  return results;
}
