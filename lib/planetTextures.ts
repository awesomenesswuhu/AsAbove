/**
 * High-resolution planet texture URLs
 * Using Solar System Scope textures and NASA imagery
 */
export const PLANET_TEXTURES: Record<string, {
  map: string;
  normalMap?: string;
  specularMap?: string;
  atmosphere?: boolean;
  glowColor?: string;
}> = {
  Mercury: {
    map: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
    normalMap: "https://www.solarsystemscope.com/textures/download/2k_mercury_normal.jpg",
  },
  Venus: {
    map: "https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
    atmosphere: true,
    glowColor: "#FFB347", // Orange-yellow glow
  },
  Mars: {
    map: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
    normalMap: "https://www.solarsystemscope.com/textures/download/2k_mars_normal.jpg",
  },
  Jupiter: {
    map: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
    normalMap: "https://www.solarsystemscope.com/textures/download/2k_jupiter_normal.jpg",
  },
  Saturn: {
    map: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
    normalMap: "https://www.solarsystemscope.com/textures/download/2k_saturn_normal.jpg",
  },
  Moon: {
    map: "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
    normalMap: "https://www.solarsystemscope.com/textures/download/2k_moon_normal.jpg",
  },
};

/**
 * Fallback to Wikimedia Commons if Solar System Scope is unavailable
 */
export const PLANET_TEXTURES_FALLBACK: Record<string, {
  map: string;
  atmosphere?: boolean;
  glowColor?: string;
}> = {
  Mercury: {
    map: "https://upload.wikimedia.org/wikipedia/commons/3/30/Mercury_in_color_-_Prockter07_centered.jpg",
  },
  Venus: {
    map: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    atmosphere: true,
    glowColor: "#FFB347",
  },
  Mars: {
    map: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  },
  Jupiter: {
    map: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
  },
  Saturn: {
    map: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
  },
  Moon: {
    map: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg",
  },
};

export function getPlanetTexture(name: string): {
  map: string;
  normalMap?: string;
  specularMap?: string;
  atmosphere?: boolean;
  glowColor?: string;
} | null {
  return PLANET_TEXTURES[name] || PLANET_TEXTURES_FALLBACK[name] || null;
}
