export interface GeocodingResult {
  city: string;
  state: string;
  stateAbbreviation: string;
  latitude: number;
  longitude: number;
  country: string;
  timezoneOffset?: number; // Timezone offset in hours from UTC
}

export interface ZippopotamResponse {
  "post code": string;
  country: string;
  "country abbreviation": string;
  places: Array<{
    "place name": string;
    state?: string;
    "state abbreviation"?: string;
    latitude: string;
    longitude: string;
  }>;
}

// List of countries supported by Zippopotam.us API
// Format: [countryCode, countryName]
const SUPPORTED_COUNTRIES = [
  ["us", "United States"],
  ["ca", "Canada"],
  ["gb", "United Kingdom"],
  ["au", "Australia"],
  ["de", "Germany"],
  ["fr", "France"],
  ["es", "Spain"],
  ["it", "Italy"],
  ["nl", "Netherlands"],
  ["be", "Belgium"],
  ["at", "Austria"],
  ["ch", "Switzerland"],
  ["se", "Sweden"],
  ["no", "Norway"],
  ["dk", "Denmark"],
  ["fi", "Finland"],
  ["pl", "Poland"],
  ["cz", "Czech Republic"],
  ["ie", "Ireland"],
  ["pt", "Portugal"],
  ["br", "Brazil"],
  ["mx", "Mexico"],
  ["ar", "Argentina"],
  ["in", "India"],
  ["jp", "Japan"],
  ["kr", "South Korea"],
  ["cn", "China"],
  ["za", "South Africa"],
  ["nz", "New Zealand"],
] as const;

async function tryGeocodeForCountry(
  countryCode: string,
  postalCode: string
): Promise<GeocodingResult | null> {
  try {
    const url = `https://api.zippopotam.us/${countryCode}/${postalCode}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data: ZippopotamResponse = await response.json();

    if (!data.places || data.places.length === 0) {
      return null;
    }

    const place = data.places[0];

    return {
      city: place["place name"],
      state: place.state || "",
      stateAbbreviation: place["state abbreviation"] || "",
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
      country: data.country,
    };
  } catch (error) {
    return null;
  }
}

export async function geocodePincode(postalCode: string): Promise<GeocodingResult | null> {
  // Try each country until one succeeds
  for (const [countryCode] of SUPPORTED_COUNTRIES) {
    const result = await tryGeocodeForCountry(countryCode, postalCode);
    if (result) {
      // Calculate timezone offset from longitude
      const { getTimezoneOffsetFromLongitude } = await import("./timezone");
      const timezoneOffset = getTimezoneOffsetFromLongitude(result.longitude);
      
      console.log(`Geocoding success for ${countryCode}:`, result);
      return {
        ...result,
        timezoneOffset,
      };
    }
  }

  console.error("No geocoding result found for postal code:", postalCode);
  return null;
}
