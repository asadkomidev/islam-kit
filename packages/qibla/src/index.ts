/**
 * @islam-kit/qibla
 *
 * Calculate Qibla direction and distance to Kaaba from GPS coordinates.
 * Zero dependencies, works in Node.js, Browser, React Native, and Edge runtimes.
 *
 * @packageDocumentation
 */

// Main functions
export { calculateQibla, getQiblaDirection, getDistanceToKaaba, getQiblaCompass } from './qibla';

// Constants
export { KAABA_COORDINATES, EARTH_RADIUS_KM } from './constants';

// Types
export type { Coordinates, CompassPoint, QiblaResult } from './types';
