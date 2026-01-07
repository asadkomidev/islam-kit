import type { Coordinates, CompassPoint, QiblaResult } from './types';
import { KAABA_COORDINATES, EARTH_RADIUS_KM, DEG_TO_RAD, RAD_TO_DEG } from './constants';

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
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Convert bearing angle to 16-point compass direction
 */
function bearingToCompass(bearing: number): CompassPoint {
  const directions: CompassPoint[] = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(normalizeAngle(bearing) / 22.5) % 16;
  return directions[index]!;
}

/**
 * Calculate the Qibla direction from given coordinates.
 *
 * Uses the forward azimuth formula for great-circle navigation.
 * Reference: https://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param coordinates - The observer's location (latitude and longitude)
 * @returns QiblaResult containing direction, distance, and compass point
 *
 * @example
 * ```typescript
 * const result = calculateQibla({ latitude: 40.7128, longitude: -74.006 });
 * console.log(result.direction); // ~58.48 degrees
 * console.log(result.distance);  // ~10879 km
 * console.log(result.compass);   // 'ENE'
 * ```
 */
export function calculateQibla(coordinates: Coordinates): QiblaResult {
  const direction = getQiblaDirection(coordinates);
  const distance = getDistanceToKaaba(coordinates);
  const compass = bearingToCompass(direction);

  return {
    direction: Math.round(direction * 100) / 100,
    distance: Math.round(distance * 100) / 100,
    compass,
  };
}

/**
 * Calculate only the Qibla direction (bearing) from given coordinates.
 *
 * Uses the forward azimuth formula:
 * θ = atan2(sin(Δλ)·cos(φ2), cos(φ1)·sin(φ2) − sin(φ1)·cos(φ2)·cos(Δλ))
 *
 * @param coordinates - The observer's location
 * @returns Direction in degrees from True North (0-360)
 *
 * @example
 * ```typescript
 * const direction = getQiblaDirection({ latitude: 40.7128, longitude: -74.006 });
 * console.log(direction); // ~58.48
 * ```
 */
export function getQiblaDirection(coordinates: Coordinates): number {
  const lat1 = toRadians(coordinates.latitude);
  const lon1 = toRadians(coordinates.longitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const lon2 = toRadians(KAABA_COORDINATES.longitude);

  const deltaLon = lon2 - lon1;

  const x = Math.sin(deltaLon) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearing = toDegrees(Math.atan2(x, y));

  return normalizeAngle(bearing);
}

/**
 * Calculate the distance to Kaaba from given coordinates.
 *
 * Uses the Haversine formula for great-circle distance:
 * a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)
 * c = 2·atan2(√a, √(1−a))
 * d = R·c
 *
 * @param coordinates - The observer's location
 * @returns Distance in kilometers
 *
 * @example
 * ```typescript
 * const distance = getDistanceToKaaba({ latitude: 40.7128, longitude: -74.006 });
 * console.log(distance); // ~10879 km
 * ```
 */
export function getDistanceToKaaba(coordinates: Coordinates): number {
  const lat1 = toRadians(coordinates.latitude);
  const lon1 = toRadians(coordinates.longitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const lon2 = toRadians(KAABA_COORDINATES.longitude);

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Get the compass direction to Qibla.
 *
 * @param coordinates - The observer's location
 * @returns CompassPoint (e.g., 'N', 'NE', 'E', etc.)
 *
 * @example
 * ```typescript
 * const compass = getQiblaCompass({ latitude: 40.7128, longitude: -74.006 });
 * console.log(compass); // 'ENE'
 * ```
 */
export function getQiblaCompass(coordinates: Coordinates): CompassPoint {
  const direction = getQiblaDirection(coordinates);
  return bearingToCompass(direction);
}
