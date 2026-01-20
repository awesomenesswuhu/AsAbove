/**
 * Convert azimuth (degrees) to cardinal direction
 */
export function azimuthToDirection(azimuth: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(azimuth / 45) % 8;
  return directions[index];
}

/**
 * Get "How to Find" instructions for celestial objects
 */
export function getHowToFind(objectName: string, direction: string, altitude: number): string {
  const directionText = direction === "N" ? "north" : 
                       direction === "NE" ? "northeast" :
                       direction === "E" ? "east" :
                       direction === "SE" ? "southeast" :
                       direction === "S" ? "south" :
                       direction === "SW" ? "southwest" :
                       direction === "W" ? "west" : "northwest";
  
  const altitudeText = altitude > 60 ? "high overhead" :
                       altitude > 30 ? "high in the sky" :
                       altitude > 10 ? "moderately elevated" :
                       "low on the horizon";
  
  if (objectName === "Jupiter") {
    return `Look ${directionText} at ${altitudeText}. Jupiter appears as a bright, steady light—brighter than any star. It's visible to the naked eye and spectacular through binoculars.`;
  }
  
  if (objectName === "Mars") {
    return `Look toward the ${directionText} at ${altitudeText}. Mars appears as a bright orange-red star. It's easily visible to the naked eye when it's in the night sky.`;
  }
  
  if (objectName === "Venus") {
    return `Look ${directionText} at ${altitudeText}. Venus is the brightest natural object in the night sky after the Moon. It shines like a brilliant star and is impossible to miss.`;
  }
  
  if (objectName === "Saturn") {
    return `Look ${directionText} at ${altitudeText}. Saturn appears as a bright, steady golden light. Through a small telescope, you can see its spectacular rings.`;
  }
  
  if (objectName === "Earth") {
    return `You're already here! Earth is our home planet, the beautiful blue marble we call home. From space, Earth appears as a vibrant sphere of blue oceans, green continents, and swirling white clouds—the only known planet in the universe teeming with life.`;
  }
  
  if (objectName === "Moon") {
    return `Look ${directionText} at ${altitudeText}. The Moon is the brightest object in the night sky. Even with the naked eye, you can see its craters and surface features.`;
  }
  
  if (objectName === "Sirius") {
    return `Look ${directionText} at ${altitudeText}. Sirius is the brightest star in the night sky—you can't miss it! It appears as a brilliant white-blue star in the constellation Canis Major.`;
  }
  
  if (objectName === "Polaris") {
    return `Look ${directionText} at ${altitudeText}. Polaris, the North Star, is always visible in the Northern Hemisphere—it never sets! It's not the brightest star, but it marks true north and is perfect for navigation. At your latitude, it appears at approximately ${Math.round(altitude)}° above the horizon and rotates around the north celestial pole.`;
  }
  
  // Constellations
  if (objectName === "Orion") {
    return `Look ${directionText} at ${altitudeText}. Orion is one of the most recognizable constellations, shaped like a hunter with a distinctive belt of three bright stars. Look for the three stars in a line—they're hard to miss!`;
  }
  
  if (objectName === "Big Dipper") {
    return `Look ${directionText} at ${altitudeText}. The Big Dipper (part of Ursa Major) is one of the easiest constellations to spot. It looks like a ladle or saucepan in the sky, with seven bright stars forming the bowl and handle.`;
  }
  
  if (objectName === "Cassiopeia") {
    return `Look ${directionText} at ${altitudeText}. Cassiopeia is easily recognized by its distinctive "W" or "M" shape, depending on its position in the sky. It's made of five bright stars and is visible year-round in the Northern Hemisphere.`;
  }
  
  if (objectName === "Little Dipper") {
    return `Look ${directionText} at ${altitudeText}. The Little Dipper (Ursa Minor) contains Polaris, the North Star, at the end of its handle. It's smaller and fainter than the Big Dipper, but Polaris makes it easy to find.`;
  }
  
  // Galaxies
  if (objectName === "Andromeda Galaxy") {
    return `Look ${directionText} at ${altitudeText}. The Andromeda Galaxy (M31) is the most distant object visible to the naked eye from Earth—2.5 million light-years away! From dark locations, it appears as a faint, elongated smudge of light. Best viewed on moonless nights away from city lights.`;
  }
  
  if (objectName === "Triangulum Galaxy") {
    return `Look ${directionText} at ${altitudeText}. The Triangulum Galaxy (M33) is a spiral galaxy about 3 million light-years away. It's visible with binoculars or a small telescope from dark skies. This faint, diffuse object requires a clear, moonless night away from light pollution.`;
  }
  
  if (objectName === "Whirlpool Galaxy") {
    return `Look ${directionText} at ${altitudeText}. The Whirlpool Galaxy (M51) is a beautiful face-on spiral galaxy 31 million light-years away. It requires a telescope to see its distinctive spiral arms and companion galaxy. Best observed from dark sky locations with clear conditions.`;
  }
  
  // Meteor Showers
  if (objectName === "Perseids") {
    return `The Perseids meteor shower is one of the best meteor showers of the year, peaking around August 12-13. Meteors appear to radiate from the constellation Perseus but can be seen anywhere in the sky. Best viewed after midnight in dark locations away from city lights. Look toward any part of the sky—the meteors will streak across randomly!`;
  }
  
  if (objectName === "Geminids") {
    return `The Geminids meteor shower is one of the most reliable and active meteor showers, peaking around December 13-14. Meteors appear to radiate from the constellation Gemini but can be seen anywhere in the sky. This shower is visible even from light-polluted areas and produces bright, colorful meteors. Best viewed after midnight.`;
  }
  
  if (objectName === "Leonids") {
    return `The Leonids meteor shower peaks around November 17-18. Meteors appear to radiate from the constellation Leo but can be seen anywhere in the sky. While typically producing 15-20 meteors per hour, the Leonids are famous for occasional meteor storms with hundreds of meteors per hour. Best viewed after midnight from dark locations.`;
  }
  
  if (objectName === "Lyrids") {
    return `The Lyrids meteor shower peaks around April 22-23. Meteors appear to radiate from the constellation Lyra but can be seen anywhere in the sky. One of the oldest known meteor showers, visible since 687 BCE. Best viewed after midnight from dark locations away from city lights.`;
  }
  
  return `Look toward the ${directionText} at ${altitudeText}. This celestial object is visible in tonight's sky.`;
}
