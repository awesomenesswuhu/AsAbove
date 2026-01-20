"use client";

import { CelestialObject } from "@/lib/astronomy";
import { WeatherData } from "@/lib/weatherApi";

interface SkySummaryProps {
  objects: CelestialObject[];
  weather: WeatherData | null;
  location: {
    city: string;
    stateAbbreviation?: string;
  };
  timezoneOffset?: number;
}

export default function SkySummary({ objects, weather, location, timezoneOffset }: SkySummaryProps) {
  // Count visible objects
  const visiblePlanets = objects.filter(
    obj => obj.type === "planet" && obj.altitude > 0 && obj.name !== "Earth"
  );
  const visibleStars = objects.filter(obj => obj.type === "star" && obj.altitude > 0);
  const activeMeteors = objects.filter(obj => obj.type === "meteor" && obj.isActive);
  const moon = objects.find(obj => obj.type === "moon");

  // Generate simple summary sentence
  const generateSummary = (): string => {
    const parts: string[] = [];
    
    if (weather?.isClear) {
      parts.push("With clear skies overhead");
    } else if (weather) {
      parts.push(`Despite ${weather.cloudCoverage}% cloud coverage`);
    } else {
      parts.push("Tonight");
    }
    
    parts.push(`${location.city}${location.stateAbbreviation ? `, ${location.stateAbbreviation}` : ""} offers`);
    
    if (visiblePlanets.length > 0) {
      parts.push(`${visiblePlanets.length} planet${visiblePlanets.length > 1 ? "s" : ""} visible`);
    }
    
    if (visibleStars.length > 0) {
      parts.push(`${visibleStars.length} bright star${visibleStars.length > 1 ? "s" : ""}`);
    }
    
    if (moon) {
      const moonPhase = moon.moonIllumination! < 25 ? "crescent" : moon.moonIllumination! < 75 ? "gibbous" : "full";
      parts.push(`a ${moonPhase} moon at ${moon.moonIllumination}% illumination`);
    }
    
    if (activeMeteors.length > 0) {
      parts.push(`and ${activeMeteors.length} active meteor shower${activeMeteors.length > 1 ? "s" : ""}`);
    }
    
    return parts.join(", ") + ".";
  };

  return (
    <p className="text-white/60 text-sm text-center mb-8">
      {generateSummary()}
    </p>
  );
}
