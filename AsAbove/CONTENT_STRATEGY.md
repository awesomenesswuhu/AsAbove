# AsAbove - Content Strategy & Copy Guide

## Home Page Copy

### Hero Section

**Main Heading:**
```
AsAbove
```

**Subheading:**
```
Discover the planets and stars visible from your location tonight.
```

**Description Text:**
```
Enter your pincode to see which celestial objects are currently visible in your night sky. Real-time positions, visibility status, and fascinating facts about our solar system—all tailored to your exact location.
```

**Primary CTA Button:**
```
Explore Sky
```

**Secondary CTA (Optional):**
```
Use Current Location
```

---

### Search Interface

**Input Placeholder:**
```
Enter your 5-digit pincode
```

**Validation Messages:**

*Valid Format:*
```
✓ Valid pincode format
```

*Invalid Format:*
```
Please enter a valid 5-digit pincode
```

**Loading State:**
```
Finding your location...
```

**Geocoding Success:**
```
📍 Viewing from [City Name], [State Abbreviation]
```

**Geocoding Error:**
```
Couldn't find location for that pincode. Please check the number and try again.
```

---

### Results Section

**Section Heading:**
```
Your Night Sky
```

**Empty State (No Objects Visible):**
```
No celestial objects are currently visible from your location. Check back later tonight!
```

**Grouping Headers:**

*Currently Visible:*
```
🔭 Visible Now
```

*Rising Soon:*
```
⏰ Rising Soon (within 2 hours)
```

*Below Horizon:*
```
🌙 Below Horizon
```

**Refresh Button:**
```
Refresh Positions
```

**Last Updated:**
```
Last updated: [HH:MM AM/PM]
```

---

## About Page Copy

### Page Heading

```
About AsAbove
```

### Introduction Section

**Title:**
```
Bringing the Universe Closer to Home
```

**Body:**
```
AsAbove is a real-time celestial dashboard that helps you discover which planets and stars are visible from your specific location. Whether you're an amateur astronomer, a curious stargazer, or simply want to know what's above you right now, we make it easy to explore the night sky.
```

**Mission Statement:**
```
Our mission is to make astronomy accessible and educational. By combining your location with real-time celestial data, we bridge the gap between the vastness of space and your backyard.
```

---

### How It Works Section

**Title:**
```
How It Works
```

**Step 1:**
```
1. Enter Your Pincode
   We use your postal code to determine your exact geographic coordinates. This allows us to calculate accurate celestial positions specific to your location.
```

**Step 2:**
```
2. Geocoding
   Your pincode is converted to latitude and longitude using Zippopotam.us, a free geocoding service. We never store this information.
```

**Step 3:**
```
3. Celestial Calculations
   Using astronomical formulas and real-time data, we calculate the current position of planets and stars relative to your location. This includes altitude (how high above the horizon), azimuth (compass direction), and visibility status.
```

**Step 4:**
```
4. Display Results
   You'll see a curated list of celestial objects currently visible from your location, complete with visibility status, magnitude, rise/set times, and fascinating facts.
```

---

### Technical Details Section

**Title:**
```
Technical Details
```

**Subsection: Built With:**
```
• Next.js (App Router) for fast, server-rendered pages
• Tailwind CSS for responsive, space-inspired design
• Lucide React for beautiful, accessible icons
• Client-side calculations for real-time celestial positions
```

**Subsection: Data Sources:**
```
• Zippopotam.us for geocoding postal codes
• Solar System OpenData API for celestial object positions
• Astronomical calculations (Local Sidereal Time, Altitude, Azimuth)
```

**Subsection: Privacy:**
```
We respect your privacy. Your pincode is only used to fetch your coordinates—we don't store this information, and we never track your searches or location data.
```

---

### Future Enhancements Section

**Title:**
```
Coming Soon
```

**List Items:**
```
• Constellation identification and visualization
• Star magnitude filtering and sorting
• Detailed rise/set time predictions
• Moon phases and lunar calendar
• Custom date/time selection for historical or future viewing
• Telescope recommendations based on object visibility
```

---

## Planet Card Content Templates

### Jupiter

**Card Title:**
```
Jupiter
```

**Type Badge:**
```
Gas Giant Planet
```

**Description:**
```
Jupiter, the largest planet in our solar system, is a gas giant made mostly of hydrogen and helium. Visible to the naked eye, it appears as a bright, steady light in the night sky—brighter than any star. Through binoculars, you can see its four largest moons: Io, Europa, Ganymede, and Callisto. Currently at magnitude [X.XX], it's [one of the brightest/dim] objects in tonight's sky.
```

**Key Facts (Tooltip/Expandable):**
```
• Largest planet in our solar system
• Composition: 75% hydrogen, 24% helium
• Distance from Sun: ~5.2 AU (778 million km)
• Rotation period: ~10 hours
• Notable features: Great Red Spot, 95 known moons
```

---

### Mars

**Card Title:**
```
Mars
```

**Type Badge:**
```
Terrestrial Planet
```

**Description:**
```
Mars, the Red Planet, is named for its reddish appearance caused by iron oxide (rust) on its surface. It's the fourth planet from the Sun and one of the most studied objects in our solar system. When visible, Mars can appear as a bright orange-red star. Currently at magnitude [X.XX], [visibility context].
```

**Key Facts:**
```
• Known as the "Red Planet" due to iron oxide on surface
• Distance from Sun: ~1.5 AU (228 million km)
• Day length: 24 hours 37 minutes (similar to Earth)
• Notable features: Olympus Mons (largest volcano), polar ice caps
```

---

### Venus

**Card Title:**
```
Venus
```

**Type Badge:**
```
Terrestrial Planet
```

**Description:**
```
Venus, named after the Roman goddess of love, is the hottest planet in our solar system despite not being the closest to the Sun. Its thick atmosphere traps heat, creating a greenhouse effect. When visible, Venus is the brightest natural object in the night sky after the Moon. Currently at magnitude [X.XX], [visibility context].
```

**Key Facts:**
```
• Brightest natural object in night sky (after Moon)
• Distance from Sun: ~0.7 AU (108 million km)
• Surface temperature: ~462°C (863°F)
• Notable features: Dense atmosphere, retrograde rotation
```

---

### Saturn

**Card Title:**
```
Saturn
```

**Type Badge:**
```
Gas Giant Planet
```

**Description:**
```
Saturn, famous for its spectacular ring system, is a gas giant made mostly of hydrogen and helium. The rings are visible even through small telescopes. Currently at magnitude [X.XX], [visibility context]. Saturn's rings make it one of the most recognizable objects in the solar system.
```

**Key Facts:**
```
• Famous for its extensive ring system
• Distance from Sun: ~9.5 AU (1.4 billion km)
• Composition: 96% hydrogen, 3% helium
• Notable features: 146 known moons, Cassini Division in rings
```

---

### Mercury

**Card Title:**
```
Mercury
```

**Type Badge:**
```
Terrestrial Planet
```

**Description:**
```
Mercury, the smallest planet in our solar system, is also the closest to the Sun. It's difficult to observe due to its proximity to the Sun and small size. When visible, it appears only during twilight hours near sunrise or sunset. Currently at magnitude [X.XX], [visibility context].
```

**Key Facts:**
```
• Smallest planet in solar system
• Distance from Sun: ~0.4 AU (58 million km)
• Day length: 176 Earth days
• Notable features: Extreme temperature variations, no atmosphere
```

---

### Sirius (Example Star)

**Card Title:**
```
Sirius
```

**Type Badge:**
```
Star (Canis Major)
```

**Description:**
```
Sirius, also known as the Dog Star, is the brightest star in the night sky from Earth. Located in the constellation Canis Major, it's actually a binary star system consisting of Sirius A and Sirius B. With an apparent magnitude of -1.46, it outshines all other stars and many planets. [Visibility context based on current status].
```

**Key Facts:**
```
• Brightest star in night sky (apparent magnitude: -1.46)
• Distance: 8.6 light-years
• Binary star system
• Location: Constellation Canis Major
• Color: White-blue
```

---

### Polaris (Example Star)

**Card Title:**
```
Polaris (North Star)
```

**Type Badge:**
```
Star (Ursa Minor)
```

**Description:**
```
Polaris, the North Star, is famous for marking the north celestial pole. While it appears relatively bright, it's actually the 50th brightest star in the sky. It remains almost stationary in the northern sky, making it an important navigational reference. Currently at magnitude [X.XX], [visibility context].
```

**Key Facts:**
```
• Marks the north celestial pole
• Distance: ~433 light-years
• Location: Constellation Ursa Minor
• Useful for navigation
• Triple star system
```

---

## Visibility Status Messages

### Currently Visible
```
🔭 Visible Now
This object is currently above the horizon and visible from your location. Look toward [Azimuth Direction] at an altitude of [Altitude]°.
```

### Rising Soon
```
⏰ Rising at [HH:MM AM/PM]
This object will rise above the horizon in [X] hours and [Y] minutes. It will be visible for approximately [Z] hours.
```

### Setting Soon
```
🌅 Setting at [HH:MM AM/PM]
This object is currently visible but will set below the horizon in [X] hours and [Y] minutes.
```

### Below Horizon
```
🌙 Below Horizon
This object is currently below the horizon and not visible. It will rise at [HH:MM AM/PM] on [Date].
```

### Not Visible Today
```
☀️ Daylight Only
This object is only visible during daylight hours. It's currently [visible/not visible] in your daytime sky.
```

---

## Error Messages

### Generic Error
```
Something went wrong. Please try again in a moment.
```

### Network Error
```
Unable to connect. Please check your internet connection and try again.
```

### API Rate Limit
```
Too many requests. Please wait a moment before searching again.
```

### Invalid Location
```
We couldn't find a location for that pincode. Please check the number and try again, or use a different postal code format.
```

### Calculation Error
```
Unable to calculate celestial positions. Please try again or check back later.
```

---

## Footer Copy

### Links Section

**Navigation:**
```
Home | About
```

**Attribution:**
```
Data provided by Zippopotam.us and Solar System OpenData API
```

**Built With:**
```
Built with Next.js and Tailwind CSS
```

**Copyright:**
```
© 2024 AsAbove. Made for stargazers and curious minds.
```

---

## Accessibility Labels (ARIA)

### Search Input
```
aria-label: "Enter your 5-digit pincode"
aria-describedby: "pincode-help"
```

### Explore Button
```
aria-label: "Explore sky for entered pincode"
```

### Planet Cards
```
aria-label: "[Planet Name], [Status], visible at [Azimuth] degrees, altitude [Altitude] degrees"
```

### Status Badges
```
aria-label: "[Status text], for screen readers"
```

### Refresh Button
```
aria-label: "Refresh celestial positions"
```

---

## Microcopy Guidelines

### Tone
- **Friendly but factual**: Approachable language without dumbing down scientific accuracy
- **Encouraging**: Inspire curiosity and exploration
- **Clear**: Avoid jargon, explain when necessary
- **Concise**: Get to the point, but provide context

### Style
- Use present tense for current visibility
- Use active voice ("Mars is visible" not "Mars can be seen")
- Include specific numbers when helpful (magnitude, altitude)
- Provide direction when applicable ("Look toward the northeast")

### Examples

**Good:**
```
"Jupiter is currently visible. Look toward the southeast at an altitude of 45°."
```

**Avoid:**
```
"Jupiter might be visible somewhere in the sky, perhaps around 45 degrees up."
```

---

**Document Version:** 1.0  
**Last Updated:** Initial Content Strategy  
**Status:** Ready for Implementation
