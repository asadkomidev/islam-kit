/**
 * Geographic coordinates
 */
export interface Coordinates {
  /** Latitude in degrees (-90 to 90) */
  latitude: number;
  /** Longitude in degrees (-180 to 180) */
  longitude: number;
  /** Elevation in meters (optional) */
  elevation?: number;
}

/**
 * Calculation method identifiers
 */
export type CalculationMethodId =
  | 'MWL'
  | 'ISNA'
  | 'EGYPT'
  | 'MAKKAH'
  | 'KARACHI'
  | 'TEHRAN'
  | 'JAFARI'
  | 'GULF'
  | 'KUWAIT'
  | 'QATAR'
  | 'SINGAPORE'
  | 'TURKEY'
  | 'DUBAI'
  | 'MOONSIGHTING';

/**
 * Asr calculation method (Madhab)
 */
export type AsrMethod = 'STANDARD' | 'HANAFI';

/**
 * High latitude adjustment methods
 */
export type HighLatitudeMethod = 'NONE' | 'ANGLE_BASED' | 'MIDDLE_OF_NIGHT' | 'ONE_SEVENTH';

/**
 * Prayer names
 */
export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/**
 * Calculation method parameters
 */
export interface MethodParams {
  /** Fajr angle below horizon */
  fajrAngle: number;
  /** Isha angle below horizon (if using angle) */
  ishaAngle?: number;
  /** Isha minutes after Maghrib (if using interval) */
  ishaInterval?: number;
  /** Maghrib angle (for Tehran method) */
  maghribAngle?: number;
}

/**
 * Calculation method configuration
 */
export interface CalculationMethod {
  id: CalculationMethodId;
  name: string;
  params: MethodParams;
}

/**
 * Manual time adjustments in minutes
 */
export interface PrayerAdjustments {
  fajr?: number;
  sunrise?: number;
  dhuhr?: number;
  asr?: number;
  maghrib?: number;
  isha?: number;
}

/**
 * Configuration options for prayer time calculations
 */
export interface PrayerTimesOptions {
  /** Calculation method */
  method?: CalculationMethodId;
  /** Asr calculation method */
  asrMethod?: AsrMethod;
  /** High latitude adjustment method */
  highLatitudeMethod?: HighLatitudeMethod;
  /** Manual adjustments in minutes */
  adjustments?: PrayerAdjustments;
}

/**
 * Calculated prayer times for a single day
 */
export interface PrayerTimes {
  /** The date these times are for */
  date: Date;
  /** Fajr (dawn) prayer time */
  fajr: Date;
  /** Sunrise time */
  sunrise: Date;
  /** Dhuhr (noon) prayer time */
  dhuhr: Date;
  /** Asr (afternoon) prayer time */
  asr: Date;
  /** Maghrib (sunset) prayer time */
  maghrib: Date;
  /** Isha (night) prayer time */
  isha: Date;
}

/**
 * Formatted prayer times as strings
 */
export interface FormattedPrayerTimes {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Time format options
 */
export interface TimeFormatOptions {
  /** 12-hour or 24-hour format */
  format?: '12h' | '24h';
  /** Locale for formatting */
  locale?: string;
  /** Include seconds */
  includeSeconds?: boolean;
}

/**
 * Next prayer result
 */
export interface NextPrayer {
  name: PrayerName;
  time: Date;
}

/**
 * Current prayer result
 */
export interface CurrentPrayer {
  name: PrayerName;
  startTime: Date;
}
