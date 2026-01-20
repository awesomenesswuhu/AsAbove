/**
 * Weather API integration for sky conditions
 * Uses OpenWeatherMap API (free tier available)
 */

export interface WeatherData {
  isClear: boolean;
  cloudCoverage: number; // 0-100
  description: string;
  temperature?: number;
  humidity?: number;
}

/**
 * Fetch weather data for a location
 * Requires NEXT_PUBLIC_OPENWEATHER_API_KEY environment variable
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn("OpenWeatherMap API key not found. Weather data will not be available.");
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn("Weather API error:", response.status);
      return null;
    }

    const data = await response.json();
    
    const cloudCoverage = data.clouds?.all || 0;
    const isClear = cloudCoverage < 30; // Clear if less than 30% cloud coverage
    
    return {
      isClear,
      cloudCoverage,
      description: data.weather?.[0]?.description || "Unknown",
      temperature: data.main?.temp,
      humidity: data.main?.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
