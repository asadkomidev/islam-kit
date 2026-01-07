import type { PrayerTimes, FormattedPrayerTimes, TimeFormatOptions } from './types';

/**
 * Format a Date object to a time string.
 *
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTime(new Date(), { format: '12h' }); // "5:30 AM"
 * formatTime(new Date(), { format: '24h' }); // "05:30"
 * ```
 */
export function formatTime(date: Date, options?: TimeFormatOptions): string {
  const format = options?.format ?? '24h';
  const locale = options?.locale ?? 'en-US';
  const includeSeconds = options?.includeSeconds ?? false;

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h',
  };

  if (includeSeconds) {
    formatOptions.second = '2-digit';
  }

  return date.toLocaleTimeString(locale, formatOptions);
}

/**
 * Format all prayer times to strings.
 *
 * @param prayerTimes - Prayer times object
 * @param options - Formatting options
 * @returns FormattedPrayerTimes with string values
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), { latitude: 40.7, longitude: -74 });
 * const formatted = formatPrayerTimes(times, { format: '12h' });
 *
 * console.log(formatted.fajr);    // "5:23 AM"
 * console.log(formatted.dhuhr);   // "12:15 PM"
 * ```
 */
export function formatPrayerTimes(
  prayerTimes: PrayerTimes,
  options?: TimeFormatOptions
): FormattedPrayerTimes {
  const locale = options?.locale ?? 'en-US';

  return {
    date: prayerTimes.date.toLocaleDateString(locale),
    fajr: formatTime(prayerTimes.fajr, options),
    sunrise: formatTime(prayerTimes.sunrise, options),
    dhuhr: formatTime(prayerTimes.dhuhr, options),
    asr: formatTime(prayerTimes.asr, options),
    maghrib: formatTime(prayerTimes.maghrib, options),
    isha: formatTime(prayerTimes.isha, options),
  };
}

/**
 * Get time remaining until a prayer.
 *
 * @param prayerTime - The prayer time
 * @param now - Current time (defaults to now)
 * @returns Object with hours, minutes, and seconds remaining
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), { latitude: 40.7, longitude: -74 });
 * const remaining = getTimeRemaining(times.dhuhr);
 * console.log(`${remaining.hours}h ${remaining.minutes}m until Dhuhr`);
 * ```
 */
export function getTimeRemaining(
  prayerTime: Date,
  now?: Date
): { hours: number; minutes: number; seconds: number; totalSeconds: number; isPast: boolean } {
  const currentTime = now ?? new Date();
  const diff = prayerTime.getTime() - currentTime.getTime();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const totalSeconds = Math.floor(absDiff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalSeconds, isPast };
}

/**
 * Format time remaining as a human-readable string.
 *
 * @param prayerTime - The prayer time
 * @param now - Current time (defaults to now)
 * @returns Formatted string like "2h 15m"
 *
 * @example
 * ```typescript
 * const times = getPrayerTimes(new Date(), { latitude: 40.7, longitude: -74 });
 * console.log(formatTimeRemaining(times.dhuhr)); // "2h 15m"
 * ```
 */
export function formatTimeRemaining(prayerTime: Date, now?: Date): string {
  const { hours, minutes, isPast } = getTimeRemaining(prayerTime, now);

  if (isPast) {
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
