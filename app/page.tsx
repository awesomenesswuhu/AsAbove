"use client";

import { useState, useEffect } from "react";
import SearchInterface from "@/components/SearchInterface";
import PlanetCard from "@/components/PlanetCard";
import SkySummary from "@/components/SkySummary";
import { geocodePincode, GeocodingResult } from "@/lib/geocoding";
import { getMockCelestialObjects, getVisibilityStatus, CelestialObject } from "@/lib/astronomy";
import { fetchWeatherData, WeatherData } from "@/lib/weatherApi";
import { INTRO_PLANET_GIF } from "@/lib/planetImages";
import { RefreshCw, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pincode, setPincode] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasResults = location && objects.length > 0;

  const handleSearch = async (inputPincode: string) => {
    setIsLoading(true);
    setError(null);
    setPincode(inputPincode);
    setLocation(null);
    setObjects([]);
    setWeather(null);

    try {
      // Geocode the pincode
      const geocodeResult = await geocodePincode(inputPincode);

      if (!geocodeResult) {
        setError("Couldn't find location for that pincode. Please check the number and try again.");
        setIsLoading(false);
        return;
      }

      setLocation(geocodeResult);

      // Fetch weather and celestial objects in parallel
      const [celestialObjects, weatherData] = await Promise.all([
        getMockCelestialObjects(
          geocodeResult.latitude,
          geocodeResult.longitude,
          new Date(),
          geocodeResult.timezoneOffset
        ),
        fetchWeatherData(geocodeResult.latitude, geocodeResult.longitude)
      ]);

      setWeather(weatherData);

      // Sort by brightness (magnitude - lower is brighter) for planets
      const sortedObjects = celestialObjects.sort((a, b) => {
        // Earth always first
        if (a.name === "Earth") return -1;
        if (b.name === "Earth") return 1;

        // For planets, sort by magnitude (brightness)
        if (a.type === "planet" && b.type === "planet") {
          const magA = a.magnitude ?? 99;
          const magB = b.magnitude ?? 99;
          return magA - magB; // Lower magnitude = brighter
        }

        // Keep other types in their original order
        return 0;
      });

      setObjects(sortedObjects);
    } catch (err) {
      setError("Something went wrong. Please try again in a moment.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (location) {
      // Recalculate with current location and timezone, and refresh weather
      const [celestialObjects, weatherData] = await Promise.all([
        getMockCelestialObjects(
          location.latitude,
          location.longitude,
          new Date(),
          location.timezoneOffset
        ),
        fetchWeatherData(location.latitude, location.longitude)
      ]);

      setWeather(weatherData);

      // Sort by brightness (magnitude - lower is brighter) for planets
      const sortedObjects = celestialObjects.sort((a, b) => {
        // Earth always first
        if (a.name === "Earth") return -1;
        if (b.name === "Earth") return 1;

        // For planets, sort by magnitude (brightness)
        if (a.type === "planet" && b.type === "planet") {
          const magA = a.magnitude ?? 99;
          const magB = b.magnitude ?? 99;
          return magA - magB; // Lower magnitude = brighter
        }

        // Keep other types in their original order
        return 0;
      });

      setObjects(sortedObjects);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-transparent" style={{ zIndex: 1, position: 'relative' }}>
      {/* Fixed Header - appears when results are shown, hides on scroll down */}
      {hasResults && (
        <div 
          className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-xl bg-black/20 border-b border-white/10 transition-transform duration-300 ${
            isScrolled ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white transition-all duration-500">
              AsAbove
            </h1>
            <div className="flex items-center gap-2">
              <SearchInterface onSearch={handleSearch} isLoading={isLoading} compact={true} />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div
        className={`flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-500 ${
          hasResults 
            ? "min-h-0 opacity-0 pointer-events-none -mt-20" 
            : "min-h-[60vh] sm:min-h-[70vh] opacity-100"
        }`}
      >
        {/* Intro Planet GIF */}
        {!location && (
          <div className="mb-8 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <img
              src={INTRO_PLANET_GIF}
              alt="Planet"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {!hasResults && (
          <>
            <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-4 text-center transition-all duration-500">
              AsAbove
            </h1>
            <p className="text-xl md:text-2xl text-white/80 text-center mb-8 max-w-2xl transition-opacity duration-500">
              Discover the planets and stars visible from your location tonight.
            </p>
            <p className="text-base md:text-lg text-white/60 text-center mb-8 max-w-xl transition-opacity duration-500">
              Enter your pincode to see which celestial objects are currently visible in your night sky.
            </p>
          </>
        )}

        {!hasResults && <SearchInterface onSearch={handleSearch} isLoading={isLoading} />}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center max-w-md">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasResults && (
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full transition-all duration-500 pt-24 sm:pt-20">
          {/* Main Message */}
          <div className="text-center mb-8">
            <p className="font-display text-2xl md:text-3xl text-white/90 mb-4">
              Tonight, these celestial bodies will be visible above you
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
              {location.city}{location.stateAbbreviation ? `, ${location.stateAbbreviation}` : ""}
            </h2>
            {location.country && (
              <p className="text-white/60 text-lg">{location.country}</p>
            )}
          </div>

          {/* Sky Summary - Above Planets Section */}
          <SkySummary
            objects={objects}
            weather={weather}
            location={{
              city: location.city,
              stateAbbreviation: location.stateAbbreviation,
            }}
            timezoneOffset={location.timezoneOffset}
          />

          {/* Group objects by category */}
          {(() => {
            const allCelestialEvents = objects.filter(obj => obj.type === "meteor" || obj.type === "moon");
            
            // Smart sorting: Active first, Moon always first
            const celestialEvents = allCelestialEvents.sort((a, b) => {
              // Moon always comes first
              if (a.type === "moon") return -1;
              if (b.type === "moon") return 1;
              
              // Active meteors come before inactive
              const aActive = a.isActive || false;
              const bActive = b.isActive || false;
              
              if (aActive && !bActive) return -1;
              if (!aActive && bActive) return 1;
              
              // If both same status, maintain original order
              return 0;
            });
            
            // Planets - Sort by brightness (magnitude - lower is brighter)
            const planets = objects.filter(obj => obj.type === "planet");
            const sortedPlanets = [...planets].sort((a, b) => {
              if (a.name === "Earth") return -1;
              if (b.name === "Earth") return 1;
              
              // Sort by magnitude (lower = brighter)
              const magA = a.magnitude ?? 99;
              const magB = b.magnitude ?? 99;
              return magA - magB;
            });
            
            const stars = objects.filter(obj => obj.type === "star");
            const constellations = objects.filter(obj => obj.type === "constellation");
            const galaxies = objects.filter(obj => obj.type === "galaxy");
            let cardIndex = 0;
            
            // Helper function to render Celestial Events section
            const renderCelestialEvents = () => (
              celestialEvents.length > 0 && (
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                    Celestial Events
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {celestialEvents.map((obj) => (
                      <div
                        key={obj.name}
                        style={{ animationDelay: `${cardIndex++ * 150}ms` }}
                        className="animate-slide-up"
                      >
                        <PlanetCard 
                          object={obj} 
                          visibilityStatus={getVisibilityStatus(obj.altitude, obj.riseTime, obj.setTime)} 
                          timezoneOffset={location.timezoneOffset} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
            
            return (
              <div className="space-y-12 mb-12">
                {/* Planets Section */}
                {sortedPlanets.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                      Planets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {sortedPlanets.map((obj) => (
                        <div
                          key={obj.name}
                          style={{ animationDelay: `${cardIndex++ * 150}ms` }}
                          className="animate-slide-up"
                        >
                          <PlanetCard 
                            object={obj} 
                            visibilityStatus={getVisibilityStatus(obj.altitude, obj.riseTime, obj.setTime)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stars Section */}
                {stars.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                      Stars
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {stars.map((obj) => (
                        <div
                          key={obj.name}
                          style={{ animationDelay: `${cardIndex++ * 150}ms` }}
                          className="animate-slide-up"
                        >
                          <PlanetCard 
                            object={obj} 
                            visibilityStatus={getVisibilityStatus(obj.altitude, obj.riseTime, obj.setTime)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constellations Section */}
                {constellations.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                      Constellations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {constellations.map((obj) => (
                        <div
                          key={obj.name}
                          style={{ animationDelay: `${cardIndex++ * 150}ms` }}
                          className="animate-slide-up"
                        >
                          <PlanetCard 
                            object={obj} 
                            visibilityStatus={getVisibilityStatus(obj.altitude, obj.riseTime, obj.setTime)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Galaxies Section */}
                {galaxies.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                      Galaxies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {galaxies.map((obj) => (
                        <div
                          key={obj.name}
                          style={{ animationDelay: `${cardIndex++ * 150}ms` }}
                          className="animate-slide-up"
                        >
                          <PlanetCard 
                            object={obj} 
                            visibilityStatus={getVisibilityStatus(obj.altitude, obj.riseTime, obj.setTime)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Celestial Events Section - Last */}
                {renderCelestialEvents()}
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto px-4 py-8 text-center text-white/60 border-t border-white/10">
        <nav className="mb-4">
          <Link href="/" className="hover:text-white transition-colors mr-4">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </nav>
        <p className="text-sm">
          Data provided by Zippopotam.us and Solar System OpenData API
        </p>
        <p className="text-sm mt-2">
          © 2024 AsAbove. Made for stargazers and curious minds.
        </p>
      </footer>
    </main>
  );
}
