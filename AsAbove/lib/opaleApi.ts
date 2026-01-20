/**
 * IMCCE OPALE API integration for accurate rise/set/transit times
 * Documentation: https://opale.imcce.fr/webservices/rise/
 */

export interface OpaleRiseSetResult {
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
}

/**
 * Convert UTC time to local time using timezone offset
 */
function convertToLocalTime(utcDate: Date | null, timezoneOffset?: number): Date | null {
  if (!utcDate || !timezoneOffset) return utcDate;
  
  // OPALE returns UTC, convert to local by adding timezone offset
  const localTime = new Date(utcDate);
  localTime.setTime(localTime.getTime() + timezoneOffset * 3600000);
  return localTime;
}

/**
 * Map celestial body names to IMCCE OPALE body IDs
 * Standard Minor Planet Center (MPC) designations:
 * 10 = Sun, 301 = Moon, 199 = Mercury, 299 = Venus, 399 = Earth, 499 = Mars,
 * 599 = Jupiter, 699 = Saturn, 799 = Uranus, 899 = Neptune
 */
const BODY_IDS: Record<string, number> = {
  Sun: 10,
  Moon: 301,
  Mercury: 199,
  Venus: 299,
  Earth: 399,
  Mars: 499,
  Jupiter: 599,
  Saturn: 699,
  Uranus: 799,
  Neptune: 899,
};

/**
 * Map star names to their approximate coordinates (OPALE may not support all stars directly)
 * For stars, we'll need to use their coordinates or a different approach
 */
const STAR_COORDINATES: Record<string, { ra: number; dec: number }> = {
  Sirius: { ra: 6.7525, dec: -16.7161 },
  Polaris: { ra: 2.5303, dec: 89.2641 },
};

/**
 * Fetch rise, set, and transit times from IMCCE OPALE API
 */
export async function fetchRiseSetTimes(
  bodyName: string,
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  elevation: number = 0,
  timezoneOffset?: number
): Promise<OpaleRiseSetResult> {
  const bodyId = BODY_IDS[bodyName];
  
  // If it's a star or unknown body, return null (we'll use calculations for those)
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
    
    // OPALE API endpoint
    const url = `https://opale.imcce.fr/webservices/rise/?body=${bodyId}&date=${dateStr}&lat=${latitude}&lon=${longitude}&elevation=${elevation}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`OPALE API error for ${bodyName}:`, response.status, response.statusText);
      return {
        riseTime: null,
        setTime: null,
        transitTime: null,
      };
    }

    const data = await response.json();
    console.log(`OPALE API response for ${bodyName}:`, data);
    
    // Parse the response - OPALE returns times in UTC
    // Response format can vary, try multiple possible field names
    let riseTime: Date | null = null;
    let setTime: Date | null = null;
    let transitTime: Date | null = null;

    // OPALE response structure may vary, but typically includes:
    // - rise, rise_time, or riseTime: rise time
    // - set, set_time, or setTime: set time
    // - transit, transit_time, culmination, or transitTime: transit time
    const riseValue = data.rise || data.rise_time || data.riseTime || data.rising;
    const setValue = data.set || data.set_time || data.setTime || data.setting;
    const transitValue = data.transit || data.transit_time || data.transitTime || data.culmination || data.upper_culmination;

    if (riseValue) {
      const parsed = new Date(riseValue);
      if (!isNaN(parsed.getTime())) {
        riseTime = parsed;
      }
    }
    if (setValue) {
      const parsed = new Date(setValue);
      if (!isNaN(parsed.getTime())) {
        setTime = parsed;
      }
    }
    if (transitValue) {
      const parsed = new Date(transitValue);
      if (!isNaN(parsed.getTime())) {
        transitTime = parsed;
      }
    }
    
    // If response is an array or has a results field, try that
    if (!riseTime && !setTime && !transitTime) {
      const results = Array.isArray(data) ? data : (data.results || data.data || []);
      if (results.length > 0) {
        const first = results[0];
        if (first.rise) riseTime = new Date(first.rise);
        if (first.set) setTime = new Date(first.set);
        if (first.transit || first.culmination) transitTime = new Date(first.transit || first.culmination);
      }
    }

    // Convert UTC times to local time if timezone offset provided
    return {
      riseTime: convertToLocalTime(riseTime, timezoneOffset),
      setTime: convertToLocalTime(setTime, timezoneOffset),
      transitTime: convertToLocalTime(transitTime, timezoneOffset),
    };
  } catch (error) {
    console.error(`Error fetching OPALE data for ${bodyName}:`, error);
    return {
      riseTime: null,
      setTime: null,
      transitTime: null,
    };
  }
}

/**
 * Batch fetch rise/set times for multiple bodies
 * Returns a map of body name to rise/set times
 */
export async function fetchMultipleRiseSetTimes(
  bodyNames: string[],
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  elevation: number = 0,
  timezoneOffset?: number
): Promise<Record<string, OpaleRiseSetResult>> {
  const results: Record<string, OpaleRiseSetResult> = {};
  
  // Fetch in parallel with rate limiting (OPALE may have rate limits)
  const promises = bodyNames.map(async (name) => {
    const result = await fetchRiseSetTimes(name, latitude, longitude, date, elevation, timezoneOffset);
    return { name, result };
  });

  const fetched = await Promise.all(promises);
  
  fetched.forEach(({ name, result }) => {
    results[name] = result;
  });

  return results;
}
