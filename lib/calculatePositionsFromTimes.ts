/**
 * Helper function to calculate planetary positions from known rise/set times
 * This helps us work backwards to find the correct RA/Dec
 */

/**
 * Calculate what RA would produce a given transit time
 * Transit occurs when LST = RA
 */
export function calculateRAFromTransitTime(
  transitTime: Date, // Local time
  longitude: number,
  timezoneOffset?: number
): number {
  // Convert transit time to UTC
  const transitUTC = new Date(transitTime);
  if (timezoneOffset !== undefined) {
    transitUTC.setTime(transitUTC.getTime() - timezoneOffset * 3600000);
  }

  // Calculate LST at transit time
  const JD2000 = 2451545.0;
  const now = transitUTC.getTime();
  const jd2000Time = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (now - jd2000Time) / (1000 * 60 * 60 * 24);

  const utcHours = transitUTC.getUTCHours();
  const utcMinutes = transitUTC.getUTCMinutes();
  const utcSeconds = transitUTC.getUTCSeconds();
  const utcDecimalHours = utcHours + utcMinutes / 60 + utcSeconds / 3600;

  // Calculate LST in degrees
  let lstDegrees = (100.46 + 0.985647 * daysSinceJ2000 + longitude + 15 * utcDecimalHours) % 360;
  if (lstDegrees < 0) lstDegrees += 360;

  // Convert to hours - this is the RA
  let raHours = lstDegrees / 15;
  if (raHours < 0) raHours += 24;
  if (raHours >= 24) raHours -= 24;

  return raHours;
}

/**
 * Calculate transit time from rise and set times
 */
export function calculateTransitFromRiseSet(riseTime: Date, setTime: Date): Date {
  // Handle case where set time is next day
  let set = new Date(setTime);
  if (set < riseTime) {
    set.setTime(set.getTime() + 24 * 3600000); // Add 24 hours
  }

  // Transit is halfway between rise and set
  const midTime = (riseTime.getTime() + set.getTime()) / 2;
  return new Date(midTime);
}
