"use client";

import { CelestialObject } from "@/lib/astronomy";
import { getPlanetDescription, formatTime, PlanetDescription } from "@/lib/planetData";
import { azimuthToDirection, getHowToFind } from "@/lib/direction";
import { X } from "lucide-react";

interface CelestialModalProps {
  object: CelestialObject;
  timezoneOffset?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CelestialModal({ object, timezoneOffset, isOpen, onClose }: CelestialModalProps) {
  if (!isOpen) return null;

  const description = getPlanetDescription(object.name);

  // Get description based on type
  const getDescription = (): string => {
    if (description) {
      return description.description;
    }
    
    // Fallback descriptions for types without specific entries
    switch (object.type) {
      case "planet":
        return `Learn more about ${object.name}, a fascinating planet in our solar system.`;
      case "star":
        if (object.name === "Sirius") {
          return "Sirius, also known as the Dog Star, is the brightest star in the night sky from Earth. Located in the constellation Canis Major, it's actually a binary star system. With an apparent magnitude of -1.46, it outshines all other stars and many planets.";
        }
        if (object.name === "Polaris") {
          return "Polaris, the North Star, is famous for marking true north in the sky. Located at the end of the Little Dipper's handle, it appears nearly fixed in the northern sky. At magnitude 1.98, it's moderately bright and always visible in the northern hemisphere.";
        }
        return `The star ${object.name} is visible in tonight's sky. With a magnitude of ${object.magnitude?.toFixed(2) || 'unknown'}, it appears as a bright point of light.`;
      
      case "constellation":
        return `${object.name} is one of the most recognizable patterns in the night sky. Look for its distinctive star pattern and use it as a guide to navigate the celestial sphere.`;
      
      case "galaxy":
        if (object.requiresTelescope) {
          return `The ${object.name} is a distant galaxy ${object.distance || 'millions of'} million light-years away. Best viewed with binoculars or a telescope from dark skies away from city lights.`;
        }
        return `The ${object.name} is visible in dark skies and is one of the nearest galaxies to our own Milky Way, located approximately ${object.distance || 'millions of'} million light-years away.`;
      
      case "meteor":
        const isActive = object.isActive || false;
        const activeText = isActive ? "is currently active" : "has passed for this year";
        return `The ${object.name} meteor shower ${activeText}. Meteor showers occur when Earth passes through debris left by comets or asteroids. During peak activity, you can see ${object.hourlyRate || 'multiple'} meteors per hour streaking across the sky.`;
      
      case "moon":
        return "The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It appears in phases as it orbits Earth, ranging from new moon (0% illuminated) to full moon (100% illuminated).";
      
      default:
        return `Learn more about ${object.name} and how to observe it in tonight's sky.`;
    }
  };

  const getKeyFacts = (): string[] => {
    if (description?.keyFacts) {
      return description.keyFacts;
    }
    
    // Fallback key facts
    const facts: string[] = [];
    if (object.magnitude !== undefined) {
      facts.push(`Apparent magnitude: ${object.magnitude.toFixed(2)}`);
    }
    if (object.distance) {
      if (object.type === "galaxy") {
        facts.push(`Distance: ~${object.distance} million light-years`);
      } else if (object.distance < 1) {
        facts.push(`Distance: ~${(object.distance * 149.6).toFixed(1)} million km`);
      } else {
        facts.push(`Distance: ~${object.distance} AU`);
      }
    }
    if (object.altitude !== undefined) {
      facts.push(`Current altitude: ~${object.altitude.toFixed(1)}°`);
    }
    return facts;
  };

  const isActive = object.type === "meteor" ? object.isActive : object.type === "moon" ? true : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 bg-white/10 border border-white/30 rounded-full"
          aria-label="Close"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 pr-10">{object.name}</h2>
        {description?.type && (
          <p className="text-white/60 text-sm mb-4">{description.type}</p>
        )}

        {/* Status Badge for Meteors/Moon */}
        {(object.type === "meteor" || object.type === "moon") && (
          <div className="mb-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isActive ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-red-500/30 text-red-300 border border-red-500/50"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )}

        {/* Moon Special Message */}
        {object.type === "moon" && (
          <div className="mb-6 p-4 rounded-lg bg-purple-900/30 border border-purple-700/50">
            <p className="text-purple-200 text-center italic">
              Yes we think seeing the moon this close is an absolute celestial event
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="text-white/80 leading-relaxed">{getDescription()}</p>
        </div>

        {/* Key Facts */}
        {getKeyFacts().length > 0 && (
          <div className="mb-6">
            <h3 className="text-white/90 font-semibold mb-3 text-lg">Key Facts</h3>
            <ul className="list-disc list-inside space-y-1">
              {getKeyFacts().map((fact, index) => (
                <li key={index} className="text-sm text-white/70">{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {/* How to Find It */}
        <div className="mb-6 pt-6 border-t border-white/10">
          <h3 className="text-white/90 font-semibold mb-3 text-lg">How to Find It</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {getHowToFind(object.name, azimuthToDirection(object.azimuth), object.altitude)}
          </p>
        </div>
      </div>
    </div>
  );
}
