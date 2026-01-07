/**
 * @islam-kit/prayer-times
 *
 * Calculate and format daily Islamic prayer times with multiple calculation methods.
 * Zero dependencies, works in Node.js, Browser, React Native, and Edge runtimes.
 *
 * @packageDocumentation
 */

// Main class
export { PrayerTimesCalculator } from './calculator';

// Functional API
export {
  getPrayerTimes,
  getPrayerTimesForRange,
  getNextPrayer,
  getCurrentPrayer,
} from './functional';
export type { GetPrayerTimesOptions } from './functional';

// Formatting
export { formatTime, formatPrayerTimes, getTimeRemaining, formatTimeRemaining } from './format';

// Calculation methods
export { CALCULATION_METHODS, DEFAULT_METHOD } from './methods';

// Types
export type {
  Coordinates,
  CalculationMethodId,
  CalculationMethod,
  MethodParams,
  AsrMethod,
  HighLatitudeMethod,
  PrayerName,
  PrayerAdjustments,
  PrayerTimesOptions,
  PrayerTimes,
  FormattedPrayerTimes,
  TimeFormatOptions,
  NextPrayer,
  CurrentPrayer,
} from './types';
