/**
 * Timezone utilities for converting times to location-specific timezones
 */

/**
 * Get timezone offset in hours from longitude
 * Rough approximation: 1 degree longitude ≈ 4 minutes of time difference
 * UTC offset ≈ longitude / 15
 */
export function getTimezoneOffsetFromLongitude(longitude: number): number {
  // Each 15 degrees of longitude ≈ 1 hour of time difference
  return Math.round(longitude / 15);
}

/**
 * Convert a Date to the local timezone of a location (based on longitude)
 * Returns a new Date adjusted for the timezone
 */
export function convertToLocationTimezone(date: Date, longitude: number): Date {
  // Get UTC time
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  
  // Calculate timezone offset from longitude
  const timezoneOffset = getTimezoneOffsetFromLongitude(longitude);
  
  // Convert to local timezone (offset in hours * milliseconds per hour)
  const localTime = utcTime + timezoneOffset * 3600000;
  
  return new Date(localTime);
}

/**
 * Format time in a specific timezone
 * @param date - The date to format
 * @param timezoneOffset - Timezone offset in hours from UTC
 */
export function formatTimeInTimezone(date: Date, timezoneOffset: number): string {
  // Convert to timezone-specific date
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const localTime = utcTime + timezoneOffset * 3600000;
  const localDate = new Date(localTime);
  
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Get timezone abbreviation or offset string
 */
export function getTimezoneDisplay(longitude: number): string {
  const offset = getTimezoneOffsetFromLongitude(longitude);
  const sign = offset >= 0 ? "+" : "";
  return `UTC${sign}${offset}`;
}
