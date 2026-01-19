import { CelestialObject, VisibilityStatus } from "./astronomy";

export interface PlanetDescription {
  name: string;
  type: string;
  description: string;
  keyFacts: string[];
}

const planetDescriptions: Record<string, PlanetDescription> = {
  Jupiter: {
    name: "Jupiter",
    type: "Gas Giant Planet",
    description:
      "Jupiter, the largest planet in our solar system, is a gas giant made mostly of hydrogen and helium. Visible to the naked eye, it appears as a bright, steady light in the night sky—brighter than any star. Through binoculars, you can see its four largest moons: Io, Europa, Ganymede, and Callisto.",
    keyFacts: [
      "Largest planet in our solar system",
      "Composition: 75% hydrogen, 24% helium",
      "Distance from Sun: ~5.2 AU (778 million km)",
      "Rotation period: ~10 hours",
      "Notable features: Great Red Spot, 95 known moons",
    ],
  },
  Mars: {
    name: "Mars",
    type: "Terrestrial Planet",
    description:
      "Mars, the Red Planet, is named for its reddish appearance caused by iron oxide (rust) on its surface. It's the fourth planet from the Sun and one of the most studied objects in our solar system. When visible, Mars can appear as a bright orange-red star.",
    keyFacts: [
      "Known as the 'Red Planet' due to iron oxide on surface",
      "Distance from Sun: ~1.5 AU (228 million km)",
      "Day length: 24 hours 37 minutes (similar to Earth)",
      "Notable features: Olympus Mons (largest volcano), polar ice caps",
    ],
  },
  Venus: {
    name: "Venus",
    type: "Terrestrial Planet",
    description:
      "Venus, named after the Roman goddess of love, is the hottest planet in our solar system despite not being the closest to the Sun. Its thick atmosphere traps heat, creating a greenhouse effect. When visible, Venus is the brightest natural object in the night sky after the Moon.",
    keyFacts: [
      "Brightest natural object in night sky (after Moon)",
      "Distance from Sun: ~0.7 AU (108 million km)",
      "Surface temperature: ~462°C (863°F)",
      "Notable features: Dense atmosphere, retrograde rotation",
    ],
  },
  Saturn: {
    name: "Saturn",
    type: "Gas Giant Planet",
    description:
      "Saturn, famous for its spectacular ring system, is a gas giant made mostly of hydrogen and helium. The rings are visible even through small telescopes. Saturn's rings make it one of the most recognizable objects in the solar system.",
    keyFacts: [
      "Famous for its extensive ring system",
      "Distance from Sun: ~9.5 AU (1.4 billion km)",
      "Composition: 96% hydrogen, 3% helium",
      "Notable features: 146 known moons, Cassini Division in rings",
    ],
  },
  Mercury: {
    name: "Mercury",
    type: "Terrestrial Planet",
    description:
      "Mercury, the smallest planet in our solar system, is also the closest to the Sun. It's difficult to observe due to its proximity to the Sun and small size. When visible, it appears only during twilight hours near sunrise or sunset.",
    keyFacts: [
      "Smallest planet in solar system",
      "Distance from Sun: ~0.4 AU (58 million km)",
      "Day length: 176 Earth days",
      "Notable features: Extreme temperature variations, no atmosphere",
    ],
  },
  Moon: {
    name: "Moon",
    type: "Natural Satellite",
    description:
      "The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It appears in phases as it orbits Earth, ranging from new moon (0% illuminated) to full moon (100% illuminated). The Moon influences Earth's tides and has been a source of wonder and navigation for millennia.",
    keyFacts: [
      "Earth's only natural satellite",
      "Distance from Earth: ~384,400 km (0.00257 AU)",
      "Orbital period: ~27.3 days",
      "Surface: Heavily cratered with dark maria (volcanic plains)",
    ],
  },
};

export function getPlanetDescription(name: string): PlanetDescription | null {
  return planetDescriptions[name] || null;
}

export function formatTime(date: Date, timezoneOffset?: number): string {
  let hours: number;
  let minutes: number;
  
  if (timezoneOffset !== undefined) {
    // Convert to timezone-specific time
    // Date is already in UTC, just adjust for display
    const utcTime = date.getTime() - (date.getTimezoneOffset() * 60000);
    const localTime = utcTime + (timezoneOffset * 3600000);
    const localDate = new Date(localTime);
    
    hours = localDate.getUTCHours();
    minutes = localDate.getUTCMinutes();
  } else {
    // Fallback to local timezone
    hours = date.getHours();
    minutes = date.getMinutes();
  }
  
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export function formatVisibilityMessage(
  object: CelestialObject,
  visibilityStatus: VisibilityStatus
): string {
  const desc = getPlanetDescription(object.name);
  if (!desc) return visibilityStatus.message;

  const magnitudeText =
    object.magnitude < 0 ? "one of the brightest" : object.magnitude < 2 ? "bright" : "visible";

  return `${desc.description} Currently at magnitude ${object.magnitude.toFixed(2)}, it's ${magnitudeText} objects in tonight's sky.`;
}
