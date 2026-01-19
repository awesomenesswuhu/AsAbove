/**
 * Calculate best viewing window for celestial objects
 * Shows when objects are highest in the sky during nighttime hours
 */

/**
 * Calculate approximate sunset time for a given date and location
 * Uses simplified solar position calculation
 */
export function calculateSunset(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Date {
  // Days since J2000.0
  const JD2000 = 2451545.0;
  const now = date.getTime();
  const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);
  
  // Approximate solar declination (simplified)
  const solarDeclination = 23.45 * Math.sin((360 * (daysSinceJ2000 + 284) / 365.25) * Math.PI / 180);
  
  // Hour angle at sunset (when sun is at horizon)
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (solarDeclination * Math.PI) / 180;
  const cosHA = -Math.tan(latRad) * Math.tan(decRad);
  const haHours = Math.acos(cosHA) * 180 / Math.PI / 15;
  
  // Approximate solar RA (simplified - assumes 12h at vernal equinox)
  // RA increases by ~0.9856 degrees per day (or ~4 minutes per day)
  const solarRA = ((daysSinceJ2000 % 365.25) / 365.25 * 24 + 12) % 24;
  
  // Calculate LST at noon
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const noonLocal = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  
  if (timezoneOffset !== undefined) {
    noonLocal.setTime(noonLocal.getTime() - timezoneOffset * 3600000);
  }
  
  const noonTime = noonLocal.getTime();
  const daysSinceJ2000AtNoon = (noonTime - jd2000Time) / (1000 * 60 * 60 * 24);
  const utcHours = noonLocal.getUTCHours();
  const utcMinutes = noonLocal.getUTCMinutes();
  const utcDecimalHours = utcHours + utcMinutes / 60;
  
  let lstDegrees = (100.46 + 0.985647 * daysSinceJ2000AtNoon + longitude + 15 * utcDecimalHours) % 360;
  if (lstDegrees < 0) lstDegrees += 360;
  const lstAtNoon = lstDegrees / 15;
  
  // Sunset occurs when sun's hour angle = -haHours
  // Transit time when LST = solarRA
  let hoursToTransit = (solarRA - lstAtNoon) % 24;
  if (hoursToTransit > 12) hoursToTransit -= 24;
  if (hoursToTransit < -12) hoursToTransit += 24;
  
  const transitTime = new Date(noonLocal);
  transitTime.setTime(transitTime.getTime() + hoursToTransit * 3600000);
  
  // Sunset = transit - haHours
  const sunset = new Date(transitTime);
  sunset.setTime(sunset.getTime() - haHours * 3600000);
  
  if (timezoneOffset !== undefined) {
    sunset.setTime(sunset.getTime() + timezoneOffset * 3600000);
  }
  
  return sunset;
}

/**
 * Calculate approximate sunrise time
 */
export function calculateSunrise(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number
): Date {
  const sunset = calculateSunset(latitude, longitude, date, timezoneOffset);
  // Sunrise is approximately 12 hours before next sunset (simplified)
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextSunset = calculateSunset(latitude, longitude, nextDay, timezoneOffset);
  
  // Approximate: sunrise is roughly symmetric to sunset around noon
  const dayLength = (nextSunset.getTime() - sunset.getTime()) / 2;
  const sunrise = new Date(sunset);
  sunrise.setTime(sunrise.getTime() - dayLength);
  
  return sunrise;
}

/**
 * Calculate best viewing window for a celestial object
 * Returns the time window when object is highest during night hours
 */
export function calculateBestViewingWindow(
  rightAscension: number, // in hours
  declination: number, // in degrees
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezoneOffset?: number,
  transitTimeOverride?: Date // Optional: use externally provided transit time for better accuracy
): { startTime: Date | null; endTime: Date | null; peakTime: Date | null } {
  // Get sunset and sunrise for this location/date
  const sunset = calculateSunset(latitude, longitude, date, timezoneOffset);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const sunrise = calculateSunrise(latitude, longitude, nextDay, timezoneOffset);
  
  // Use provided transit time if available, otherwise calculate it
  let transitTime: Date;
  
  if (transitTimeOverride) {
    transitTime = new Date(transitTimeOverride);
  } else {
    // Calculate when object reaches transit (highest point)
    const JD2000 = 2451545.0;
    const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const noonLocal = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
    
    if (timezoneOffset !== undefined) {
      noonLocal.setTime(noonLocal.getTime() - timezoneOffset * 3600000);
    }
    
    const now = noonLocal.getTime();
    const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);
    const utcHours = noonLocal.getUTCHours();
    const utcMinutes = noonLocal.getUTCMinutes();
    const utcDecimalHours = utcHours + utcMinutes / 60;
    
    let lstDegrees = (100.46 + 0.985647 * daysSinceJ2000 + longitude + 15 * utcDecimalHours) % 360;
    if (lstDegrees < 0) lstDegrees += 360;
    const lstAtNoon = lstDegrees / 15;
    
    // Find transit time (when LST = RA)
    const raHours = rightAscension;
    let hoursToTransit = (raHours - lstAtNoon) % 24;
    if (hoursToTransit > 12) hoursToTransit -= 24;
    if (hoursToTransit < -12) hoursToTransit += 24;
    
    transitTime = new Date(noonLocal);
    transitTime.setTime(transitTime.getTime() + hoursToTransit * 3600000);
    
    if (timezoneOffset !== undefined) {
      transitTime.setTime(transitTime.getTime() + timezoneOffset * 3600000);
    }
  }
  
  // Best viewing window:
  // Start: Later of sunset or when object is 15° above horizon
  // End: Earlier of sunrise or when object gets too low
  
  // For objects that transit in evening (before midnight), best viewing is from sunset to midnight
  // For objects that transit after midnight, best viewing is from midnight to sunrise
  // For objects that transit during day, show "visible all night" or from sunset to sunrise
  
  const transitHour = transitTime.getHours();
  let startTime: Date;
  let endTime: Date;
  
  if (transitHour >= 18 && transitHour <= 23) {
    // Transits in evening - prime viewing: 1 hour before transit to 1.5 hours after transit
    startTime = new Date(transitTime);
    startTime.setTime(startTime.getTime() - 1 * 3600000); // 1 hour before transit
    if (startTime < sunset) startTime = new Date(sunset);
    endTime = new Date(transitTime);
    endTime.setTime(endTime.getTime() + 1.5 * 3600000); // 1.5 hours after transit
    if (endTime > sunrise) endTime = new Date(sunrise);
  } else if (transitHour >= 0 && transitHour <= 6) {
    // Transits early morning - prime viewing: 1.5 hours before transit to 1 hour after transit
    startTime = new Date(transitTime);
    startTime.setTime(startTime.getTime() - 1.5 * 3600000); // 1.5 hours before transit
    if (startTime < sunset) startTime = new Date(sunset);
    endTime = new Date(transitTime);
    endTime.setTime(endTime.getTime() + 1 * 3600000); // 1 hour after transit
    if (endTime > sunrise) endTime = new Date(sunrise);
  } else {
    // Transits during day - prime viewing: 1 hour before sunset to 1 hour after sunset
    // Or if transit is close to sunset, center around transit
    startTime = new Date(sunset);
    startTime.setTime(startTime.getTime() - 0.5 * 3600000); // 30 min before sunset
    endTime = new Date(sunset);
    endTime.setTime(endTime.getTime() + 2 * 3600000); // 2 hours after sunset
    if (endTime > sunrise) endTime = new Date(sunrise);
  }
  
  // Ensure times are within today/tonight
  if (startTime < sunset) startTime = new Date(sunset);
  if (endTime > sunrise) endTime = new Date(sunrise);
  
  return {
    startTime,
    endTime,
    peakTime: transitTime,
  };
}
