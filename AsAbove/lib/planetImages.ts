/**
 * Planet and star GIFs from public folder
 * GIFs are named according to the celestial body (e.g., mercury.gif, venus.gif)
 */
export const PLANET_IMAGES: Record<string, string> = {
  Earth: "/earth.gif",
  Mercury: "/mercury.gif",
  Venus: "/venus.gif",
  Mars: "/mars.gif",
  Jupiter: "/jupiter.gif",
  Saturn: "/saturn.gif",
  Uranus: "/uranus.gif",
  Neptune: "/neptune.gif",
  Moon: "/moon.gif",
  Sirius: "/star.gif",
  Polaris: "/star.gif",
};

/**
 * Intro planet GIF for hero section
 */
export const INTRO_PLANET_GIF = "/planet.gif";

/**
 * Get image URL for a planet, moon, star, or meteor
 */
export function getPlanetImageUrl(name: string): string | null {
  // Return exact match first
  if (PLANET_IMAGES[name]) {
    return PLANET_IMAGES[name];
  }
  
  // Convert name to lowercase to match GIF filename for fallback
  const normalizedName = name.toLowerCase();
  return `/${normalizedName}.gif`;
}
