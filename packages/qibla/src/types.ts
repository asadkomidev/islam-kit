/**
 * Geographic coordinates (latitude and longitude)
 */
export interface Coordinates {
  /** Latitude in degrees (-90 to 90) */
  latitude: number;
  /** Longitude in degrees (-180 to 180) */
  longitude: number;
}

/**
 * 16-point compass directions
 */
export type CompassPoint =
  | 'N'
  | 'NNE'
  | 'NE'
  | 'ENE'
  | 'E'
  | 'ESE'
  | 'SE'
  | 'SSE'
  | 'S'
  | 'SSW'
  | 'SW'
  | 'WSW'
  | 'W'
  | 'WNW'
  | 'NW'
  | 'NNW';

/**
 * Result of Qibla calculation
 */
export interface QiblaResult {
  /** Direction to Qibla in degrees from True North (0-360) */
  direction: number;
  /** Distance to Kaaba in kilometers */
  distance: number;
  /** Compass point direction (e.g., 'NE', 'SW') */
  compass: CompassPoint;
}
