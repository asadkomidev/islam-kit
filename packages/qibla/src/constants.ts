import type { Coordinates } from './types';

/**
 * Coordinates of the Kaaba in Mecca, Saudi Arabia
 */
export const KAABA_COORDINATES: Readonly<Coordinates> = {
  latitude: 21.4225,
  longitude: 39.8262,
} as const;

/**
 * Earth's mean radius in kilometers (WGS84 spherical approximation)
 */
export const EARTH_RADIUS_KM = 6371.0088;

/**
 * Conversion factor from degrees to radians
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Conversion factor from radians to degrees
 */
export const RAD_TO_DEG = 180 / Math.PI;
