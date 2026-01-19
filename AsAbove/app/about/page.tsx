import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 text-center">
        About AsAbove
      </h1>

      {/* Introduction Section */}
      <section className="mb-12">
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          Bringing the Universe Closer to Home
        </h2>
        <p className="text-white/80 text-lg leading-relaxed mb-4">
          AsAbove is a real-time celestial dashboard that helps you discover which planets and stars
          are visible from your specific location. Whether you're an amateur astronomer, a curious
          stargazer, or simply want to know what's above you right now, we make it easy to explore
          the night sky.
        </p>
        <p className="text-white/70 leading-relaxed">
          Our mission is to make astronomy accessible and educational. By combining your location
          with real-time celestial data, we bridge the gap between the vastness of space and your
          backyard.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="font-display text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              1. Enter Your Pincode
            </h3>
            <p className="text-white/70 leading-relaxed">
              We use your postal code to determine your exact geographic coordinates. This allows
              us to calculate accurate celestial positions specific to your location.
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-display text-xl font-semibold text-white mb-2">2. Geocoding</h3>
            <p className="text-white/70 leading-relaxed">
              Your pincode is converted to latitude and longitude using Zippopotam.us, a free
              geocoding service. We never store this information.
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              3. Celestial Calculations
            </h3>
            <p className="text-white/70 leading-relaxed">
              Using astronomical formulas and real-time data, we calculate the current position of
              planets and stars relative to your location. This includes altitude (how high above
              the horizon), azimuth (compass direction), and visibility status.
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              4. Display Results
            </h3>
            <p className="text-white/70 leading-relaxed">
              You'll see a curated list of celestial objects currently visible from your location,
              complete with visibility status, magnitude, rise/set times, and fascinating facts.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="mb-12">
        <h2 className="font-display text-3xl font-bold text-white mb-6">Technical Details</h2>

        <div className="mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Built With</h3>
          <ul className="list-disc list-inside space-y-2 text-white/70">
            <li>Next.js (App Router) for fast, server-rendered pages</li>
            <li>Tailwind CSS for responsive, space-inspired design</li>
            <li>Lucide React for beautiful, accessible icons</li>
            <li>Client-side calculations for real-time celestial positions</li>
          </ul>
        </div>

        <div className="mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Data Sources</h3>
          <ul className="list-disc list-inside space-y-2 text-white/70">
            <li>Zippopotam.us for geocoding postal codes</li>
            <li>Solar System OpenData API for celestial object positions</li>
            <li>Astronomical calculations (Local Sidereal Time, Altitude, Azimuth)</li>
          </ul>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Privacy</h3>
          <p className="text-white/70 leading-relaxed">
            We respect your privacy. Your pincode is only used to fetch your coordinates—we don't
            store this information, and we never track your searches or location data.
          </p>
        </div>
      </section>

      {/* Future Enhancements Section */}
      <section className="mb-12">
        <h2 className="font-display text-3xl font-bold text-white mb-6">Coming Soon</h2>
        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <ul className="list-disc list-inside space-y-2 text-white/70">
            <li>Constellation identification and visualization</li>
            <li>Star magnitude filtering and sorting</li>
            <li>Detailed rise/set time predictions</li>
            <li>Moon phases and lunar calendar</li>
            <li>Custom date/time selection for historical or future viewing</li>
            <li>Telescope recommendations based on object visibility</li>
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="text-center pt-8 border-t border-white/10">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
