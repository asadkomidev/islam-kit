/**
 * Solar position calculations based on astronomical algorithms.
 *
 * References:
 * - "Astronomical Algorithms" by Jean Meeus
 * - https://praytimes.org/manual
 * - https://aa.usno.navy.mil/faq/sun_approx
 */

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * RAD_TO_DEG;
}

/**
 * Fix angle to be within 0-360 range
 */
function fixAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Fix hour to be within 0-24 range
 */
function fixHour(hour: number): number {
  return ((hour % 24) + 24) % 24;
}

/**
 * Calculate Julian Date from a JavaScript Date
 */
export function julianDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/**
 * Calculate the sun's equation of time and declination
 */
export function sunPosition(jd: number): { declination: number; equationOfTime: number } {
  // Days since J2000.0
  const d = jd - 2451545.0;

  // Mean anomaly of the Sun
  const g = fixAngle(357.529 + 0.98560028 * d);

  // Mean longitude of the Sun
  const q = fixAngle(280.459 + 0.98564736 * d);

  // Geocentric apparent ecliptic longitude
  const l = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g)));

  // Mean obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Declination
  const declination = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(l))));

  // Right ascension
  const ra =
    toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(l)), Math.cos(toRadians(l)))) /
    15;

  // Equation of time (in minutes)
  const equationOfTime = (q / 15 - fixHour(ra)) * 60;

  return { declination, equationOfTime };
}

/**
 * Calculate the time at which the sun reaches a specific angle below the horizon
 *
 * @param angle - Angle below horizon in degrees
 * @param latitude - Observer's latitude
 * @param declination - Sun's declination
 * @param direction - 'ccw' for morning (before noon), 'cw' for evening (after noon)
 * @returns Hour angle in hours, or NaN if sun doesn't reach this angle
 */
export function sunAngleTime(
  angle: number,
  latitude: number,
  declination: number,
  direction: 'ccw' | 'cw'
): number {
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);

  // Hour angle formula
  const cosHA =
    (-Math.sin(toRadians(angle)) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  // Check if angle is achievable
  if (cosHA > 1 || cosHA < -1) {
    return NaN;
  }

  const hourAngle = toDegrees(Math.acos(cosHA)) / 15;

  return direction === 'ccw' ? -hourAngle : hourAngle;
}

/**
 * Calculate mid-day (solar noon) time
 */
export function midDay(jd: number, longitude: number): number {
  const { equationOfTime } = sunPosition(jd);
  return fixHour(12 - equationOfTime / 60 - longitude / 15);
}

/**
 * Calculate the time for a given angle
 */
export function timeForAngle(
  jd: number,
  angle: number,
  latitude: number,
  longitude: number,
  direction: 'ccw' | 'cw'
): number {
  const { declination } = sunPosition(jd);
  const noon = midDay(jd, longitude);
  const hourAngle = sunAngleTime(angle, latitude, declination, direction);

  if (isNaN(hourAngle)) {
    return NaN;
  }

  return noon + hourAngle;
}

/**
 * Calculate Asr time using shadow length formula
 *
 * @param shadowFactor - 1 for Shafi/Maliki/Hanbali, 2 for Hanafi
 */
export function asrTime(
  jd: number,
  shadowFactor: number,
  latitude: number,
  longitude: number
): number {
  const { declination } = sunPosition(jd);
  const noon = midDay(jd, longitude);

  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);

  // Calculate Asr angle based on shadow factor
  const angle = -toDegrees(
    Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))))
  );

  const hourAngle = sunAngleTime(angle, latitude, declination, 'cw');

  if (isNaN(hourAngle)) {
    return NaN;
  }

  return noon + hourAngle;
}

/**
 * Sunrise/sunset angle accounting for atmospheric refraction and sun's apparent radius
 */
export const SUNRISE_SUNSET_ANGLE = 0.833;
