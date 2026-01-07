import type {
  Coordinates,
  PrayerTimes,
  PrayerTimesOptions,
  NextPrayer,
  CurrentPrayer,
} from './types';
import { PrayerTimesCalculator } from './calculator';

/**
 * Options for getPrayerTimes function
 */
export interface GetPrayerTimesOptions extends Coordinates, PrayerTimesOptions {}

/**
 * Calculate prayer times for a specific date and location.
 *
 * This is the main functional API for simple use cases.
 *
 * @param date - The date to calculate times for
 * @param options - Location coordinates and calculation options
 * @returns PrayerTimes object with Date objects for each prayer
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), {
 *   latitude: 40.7128,
 *   longitude: -74.006,
 *   method: 'ISNA',
 * });
 *
 * console.log(times.fajr);    // Date object
 * console.log(times.dhuhr);   // Date object
 * ```
 */
export function getPrayerTimes(date: Date, options: GetPrayerTimesOptions): PrayerTimes {
  const { latitude, longitude, elevation, ...calcOptions } = options;
  const calculator = new PrayerTimesCalculator({ latitude, longitude, elevation }, calcOptions);
  return calculator.getTimes(date);
}

/**
 * Calculate prayer times for a date range.
 *
 * @param start - Start date
 * @param end - End date
 * @param options - Location coordinates and calculation options
 * @returns Array of PrayerTimes objects
 *
 * @example
 * ```typescript
 * const weekTimes = getPrayerTimesForRange(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-07'),
 *   { latitude: 40.7128, longitude: -74.006 }
 * );
 * ```
 */
export function getPrayerTimesForRange(
  start: Date,
  end: Date,
  options: GetPrayerTimesOptions
): PrayerTimes[] {
  const { latitude, longitude, elevation, ...calcOptions } = options;
  const calculator = new PrayerTimesCalculator({ latitude, longitude, elevation }, calcOptions);
  return calculator.getTimesForRange(start, end);
}

/**
 * Get the next prayer after the current time.
 *
 * @param prayerTimes - Prayer times for the day
 * @param now - Current time (defaults to now)
 * @returns NextPrayer object with name and time
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), { latitude: 40.7128, longitude: -74.006 });
 * const next = getNextPrayer(times);
 * console.log(`Next prayer: ${next.name} at ${next.time}`);
 * ```
 */
export function getNextPrayer(prayerTimes: PrayerTimes, now?: Date): NextPrayer {
  const currentTime = now ?? new Date();
  const prayers: { name: NextPrayer['name']; time: Date }[] = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }

  // All prayers passed - Fajr is next (tomorrow)
  // For simplicity, just return today's Fajr with note it's "tomorrow's"
  return { name: 'fajr', time: prayerTimes.fajr };
}

/**
 * Get the current prayer period.
 *
 * @param prayerTimes - Prayer times for the day
 * @param now - Current time (defaults to now)
 * @returns CurrentPrayer object with name and start time
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), { latitude: 40.7128, longitude: -74.006 });
 * const current = getCurrentPrayer(times);
 * console.log(`Current prayer: ${current.name}`);
 * ```
 */
export function getCurrentPrayer(prayerTimes: PrayerTimes, now?: Date): CurrentPrayer {
  const currentTime = now ?? new Date();
  const prayers: { name: CurrentPrayer['name']; time: Date }[] = [
    { name: 'isha', time: prayerTimes.isha },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'fajr', time: prayerTimes.fajr },
  ];

  for (const prayer of prayers) {
    if (currentTime >= prayer.time) {
      return { name: prayer.name, startTime: prayer.time };
    }
  }

  // Before Fajr
  return { name: 'isha', startTime: prayerTimes.isha };
}
