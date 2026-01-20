"use client";

import { useState } from "react";
import { CelestialObject, VisibilityStatus } from "@/lib/astronomy";
import { getPlanetDescription, formatTime } from "@/lib/planetData";
import { getPlanetImageUrl } from "@/lib/planetImages";
import { azimuthToDirection, getHowToFind } from "@/lib/direction";
import { Globe, Star, Compass, CheckCircle } from "lucide-react";
import CelestialModal from "./CelestialModal";

interface PlanetCardProps {
  object: CelestialObject;
  visibilityStatus: VisibilityStatus;
  timezoneOffset?: number;
}

export default function PlanetCard({ object, visibilityStatus, timezoneOffset }: PlanetCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const imageUrl = getPlanetImageUrl(object.name);
  const direction = azimuthToDirection(object.azimuth);
  const howToFind = getHowToFind(object.name, direction, object.altitude);

  // Determine planet size based on type
  const planetSizes: Record<string, number> = {
    Jupiter: 180,
    Saturn: 187, // Increased from 170 to make GIF 1x bigger
    Neptune: 140,
    Uranus: 130,
    Venus: 120,
    Earth: 125,
    Mars: 110,
    Mercury: 100,
    Moon: 140,
    Sirius: 120,
    Polaris: 120,
  };

  const planetSize = planetSizes[object.name] || 120;
  const displayName = object.name === "Earth" ? "Home Planet, Earth" : object.name;
  const isEarth = object.name === "Earth";
  const isCelestialEvent = object.type === "meteor" || object.type === "moon";
  const isActive = object.type === "meteor" ? object.isActive : object.type === "moon" ? true : false;

  return (
    <>
    <div
      className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-6 sm:p-8 transition-all hover:shadow-2xl hover:scale-105 group mx-auto cursor-pointer flex flex-col`}
      onClick={() => setIsModalOpen(true)}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        minHeight: '600px', // Fixed minimum height for all cards
      }}
    >
      {/* Image Section */}
      <div
        className="flex items-center justify-center mb-6 relative"
        style={{
          height: object.name === "Saturn" ? "240px" : object.type === "constellation" || object.type === "galaxy" ? "200px" : "192px",
          minHeight: object.name === "Saturn" ? "240px" : object.type === "constellation" || object.type === "galaxy" ? "200px" : "192px"
        }}
      >
        {object.type === "meteor" ? (
          // Meteor GIF from public folder
          <div className="relative shadow-2xl">
            <img
              src="/meteor.gif"
              alt={object.name}
              className="object-contain w-full h-full"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ) : object.type === "galaxy" && object.constellationPattern ? (
          // Galaxy spiral pattern visualization
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            >
              {object.constellationPattern.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={index < 8 ? "1.5" : "0.8"} // Larger dots in center, smaller in spiral arms
                  fill="white"
                  className="drop-shadow-lg"
                  style={{ 
                    filter: index < 8 ? "drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))" : "drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))",
                    opacity: index < 8 ? 1 : 0.7 // Brighter core
                  }}
                />
              ))}
            </svg>
          </div>
        ) : object.type === "constellation" && object.constellationPattern ? (
          // Constellation star pattern visualization
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            >
              {object.constellationPattern.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  fill="white"
                  className="drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
                />
              ))}
              {/* Connect stars with lines */}
              {object.constellationPattern.map((point, index) => {
                if (index === object.constellationPattern!.length - 1) return null;
                const nextPoint = object.constellationPattern![index + 1];
                return (
                  <line
                    key={`line-${index}`}
                    x1={point.x}
                    y1={point.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>
          </div>
        ) : imageUrl && (object.type === "planet" || object.type === "moon" || object.type === "star") ? (
          <div 
            className="relative shadow-2xl"
            style={{ 
              width: object.name === "Saturn" ? planetSize * 0.9 : object.type === "star" ? planetSize : planetSize,
              height: object.name === "Saturn" ? planetSize * 0.9 : object.type === "star" ? planetSize : planetSize,
              borderRadius: "50%", // Circular frame for all
              overflow: object.name === "Saturn" ? "hidden" : "visible"
            }}
          >
            <img
              src={imageUrl}
              alt={object.name}
              className={object.name === "Saturn" ? "object-contain w-full h-full rounded-full" : object.type === "star" ? "object-contain w-full h-full rounded-full" : "object-cover rounded-full w-full h-full"}
              style={{
                borderRadius: "50%",
                transform: object.name === "Saturn" ? "scale(1.26)" : "none"
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            {/* Atmospheric glow effect for Venus */}
            {object.name === "Venus" && (
              <div 
                className="absolute inset-0 rounded-full opacity-40 blur-xl"
                style={{
                  background: "radial-gradient(circle, #FFB347 0%, transparent 70%)",
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {object.type === "planet" || object.type === "moon" ? (
              <Globe size={80} className="text-white/60" />
            ) : object.type === "star" ? (
              // Star fallback with glow effect
              <div className="relative">
                <Star size={100} className="text-yellow-300 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 100, 0.8))' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl" />
                </div>
              </div>
            ) : (
              <Star size={80} className="text-white/60" />
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 text-center">
        {displayName}
      </h3>

      {/* Status Badge for Celestial Events */}
      {isCelestialEvent && (
        <div className="mb-4 text-center">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isActive ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-red-500/30 text-red-300 border border-red-500/50"
            }`}
          >
            Status: {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      )}

      {/* Information Grid - Centered */}
      <div className="space-y-4 mb-6">
        {/* Rise Time */}
        {object.name !== "Earth" && object.riseTime && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Rise Time</span>
            <span className="text-white font-bold text-lg">{formatTime(object.riseTime, timezoneOffset)}</span>
          </div>
        )}

        {/* Set Time */}
        {object.name !== "Earth" && object.setTime && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Set Time</span>
            <span className="text-white font-bold text-lg">{formatTime(object.setTime, timezoneOffset)}</span>
          </div>
        )}

        {/* Prime Viewing */}
        {object.name !== "Earth" && object.bestViewingStart && object.bestViewingEnd && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Prime Viewing</span>
            <span className="text-white font-bold text-lg">
              {formatTime(object.bestViewingStart, timezoneOffset)} - {formatTime(object.bestViewingEnd, timezoneOffset)}
            </span>
          </div>
        )}

        {/* Circumpolar / Always Visible indicator */}
        {object.name !== "Earth" && !object.bestViewingStart && !object.bestViewingEnd && object.altitude > 0 && (object.type === "star" || object.type === "planet" || object.type === "constellation") && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Visibility</span>
            <span className="text-white font-bold text-lg text-green-400">🌟 Always Visible</span>
          </div>
        )}

        {/* Direction */}
        {object.name !== "Earth" && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-white/60" />
              <span className="text-white/70 font-medium">Direction</span>
            </div>
            <span className="text-white font-bold text-lg">{direction}</span>
          </div>
        )}

        {/* Moon Illumination (if applicable) */}
        {object.type === "moon" && object.moonIllumination !== undefined && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Illumination</span>
            <span className="text-white font-bold text-lg">{object.moonIllumination}%</span>
          </div>
        )}

        {/* Meteor Shower Peak Date and Hourly Rate */}
        {object.type === "meteor" && object.peakDate && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Peak Date</span>
            <span className="text-white font-bold text-lg">{object.peakDate}</span>
          </div>
        )}
        {object.type === "meteor" && object.hourlyRate && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-medium">Meteors/Hour</span>
            <span className="text-white font-bold text-lg">{object.hourlyRate}</span>
          </div>
        )}
      </div>

      {/* Galaxy Visibility Warning */}
      {object.type === "galaxy" && object.requiresTelescope && (
        <div className="mb-4 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50">
          <p className="text-xs text-amber-200 text-center">
            ⭐ Best viewed with binoculars or telescope from dark skies
          </p>
        </div>
      )}

      {/* Click for finding instructions - Spacer to push to bottom */}
      <div className="flex-1 flex items-end justify-center pt-4">
        <p className="text-white/60 text-sm text-center italic">
          Click for finding instructions
        </p>
      </div>
    </div>

    {/* Modal */}
    <CelestialModal
      object={object}
      timezoneOffset={timezoneOffset}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
}
