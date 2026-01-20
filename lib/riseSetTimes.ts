/**
 * Calculate accurate rise and set times for celestial objects
 * Based on astronomical formulas for horizon crossing
 */

/**
 * Calculate hour angle at horizon crossing
 * Returns null if object never rises/sets (circumpolar)
 */
export function calculateHourAngleAtHorizon(
  declination: number,
  latitude: number
): number | null {
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  
  // Calculate cos(hour angle) at horizon
  const cosHA = -Math.tan(latRad) * Math.tan(decRad);
  
  // If |cosHA| > 1, object never rises/sets (circumpolar)
  if (Math.abs(cosHA) > 1) {
    return null; // Object is circumpolar
  }
  
  return Math.acos(cosHA) * 180 / Math.PI; // Convert to degrees
}

/**
 * Calculate rise and set times for a celestial object
 */
export function calculateRiseSetTimes(
  rightAscension: number, // in hours
  declination: number, // in degrees
  latitude: number, // in degrees
  longitude: number, // in degrees
  date: Date = new Date(),
  timezoneOffset?: number
): { riseTime: Date | null; setTime: Date | null; transitTime: Date } {
  // Use noon (12:00) local time as reference point for today's calculations
  // This ensures we calculate rise/set for TODAY, not "next occurrence from now"
  const referenceDate = new Date(date);
  
  // Get date components (year, month, day) for reference
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const day = referenceDate.getDate();
  
  // Set to noon local time (we'll calculate in local time, then convert)
  const noonLocal = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  
  // Adjust for timezone offset (convert local noon to UTC)
  if (timezoneOffset !== undefined) {
    noonLocal.setTime(noonLocal.getTime() - timezoneOffset * 3600000);
  }
  
  // Calculate Local Sidereal Time at noon
  const JD2000 = 2451545.0;
  const now = noonLocal.getTime();
  const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);
  
  // Get UTC time components at noon
  const utcHours = noonLocal.getUTCHours();
  const utcMinutes = noonLocal.getUTCMinutes();
  const utcSeconds = noonLocal.getUTCSeconds();
  const utcDecimalHours = utcHours + utcMinutes / 60 + utcSeconds / 3600;
  
  // Calculate LST in degrees at noon
  // Formula: LST = 100.46° + 0.985647° × D + longitude + 15° × UTC_hours
  let lstDegrees = (100.46 + 0.985647 * daysSinceJ2000 + longitude + 15 * utcDecimalHours) % 360;
  if (lstDegrees < 0) lstDegrees += 360;
  
  // Convert degrees to hours (360° = 24 hours)
  let lstAtNoon = lstDegrees / 15;
  if (lstAtNoon < 0) lstAtNoon += 24;
  
  // Calculate hour angle at horizon
  const hourAngleAtHorizon = calculateHourAngleAtHorizon(declination, latitude);
  
  if (hourAngleAtHorizon === null) {
    // Object is circumpolar - never rises or sets
    return {
      riseTime: null,
      setTime: null,
      transitTime: new Date(noonLocal),
    };
  }
  
  // Hour angle in hours (convert from degrees)
  const haHours = hourAngleAtHorizon / 15;
  
  // Calculate transit time (when hour angle = 0, i.e., when LST = RA)
  const raHours = rightAscension;
  
  // Find when transit occurs: when LST = RA
  let hoursToTransit = (raHours - lstAtNoon) % 24;
  if (hoursToTransit > 12) hoursToTransit -= 24;
  if (hoursToTransit < -12) hoursToTransit += 24;
  
  // Transit time = noon + hoursToTransit (in local time)
  const transitTime = new Date(noonLocal);
  transitTime.setTime(transitTime.getTime() + hoursToTransit * 3600000);
  
  // Rise time = transit time - hour angle at horizon
  const riseTime = new Date(transitTime);
  riseTime.setTime(riseTime.getTime() - haHours * 3600000);
  
  // Set time = transit time + hour angle at horizon
  const setTime = new Date(transitTime);
  setTime.setTime(setTime.getTime() + haHours * 3600000);
  
  // Adjust for timezone display (convert back to local time)
  if (timezoneOffset !== undefined) {
    riseTime.setTime(riseTime.getTime() + timezoneOffset * 3600000);
    setTime.setTime(setTime.getTime() + timezoneOffset * 3600000);
    transitTime.setTime(transitTime.getTime() + timezoneOffset * 3600000);
  }
  
  return {
    riseTime,
    setTime,
    transitTime,
  };
}
