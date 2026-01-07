import type {
  Coordinates,
  PrayerTimes,
  PrayerTimesOptions,
  CalculationMethodId,
  AsrMethod,
  HighLatitudeMethod,
  PrayerAdjustments,
  PrayerName,
  NextPrayer,
  CurrentPrayer,
} from './types';
import { CALCULATION_METHODS, DEFAULT_METHOD } from './methods';
import { julianDate, midDay, timeForAngle, asrTime, SUNRISE_SUNSET_ANGLE } from './solar';

/**
 * Convert decimal hours to a Date object
 */
function hoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  result.setHours(h, m, 0, 0);
  return result;
}

/**
 * Apply adjustments to prayer time (in minutes)
 */
function applyAdjustment(hours: number, adjustment: number | undefined): number {
  if (!adjustment) return hours;
  return hours + adjustment / 60;
}

/**
 * PrayerTimesCalculator - Main class for calculating Islamic prayer times
 *
 * @example
 * ```typescript
 * const calculator = new PrayerTimesCalculator(
 *   { latitude: 40.7128, longitude: -74.006 },
 *   { method: 'ISNA' }
 * );
 *
 * const times = calculator.getTimes(new Date());
 * console.log(times.fajr); // Date object
 * ```
 */
export class PrayerTimesCalculator {
  private coordinates: Coordinates;
  private method: CalculationMethodId;
  private asrMethod: AsrMethod;
  private highLatitudeMethod: HighLatitudeMethod;
  private adjustments: PrayerAdjustments;

  constructor(coordinates: Coordinates, options?: PrayerTimesOptions) {
    this.coordinates = coordinates;
    this.method = options?.method ?? DEFAULT_METHOD;
    this.asrMethod = options?.asrMethod ?? 'STANDARD';
    this.highLatitudeMethod = options?.highLatitudeMethod ?? 'ANGLE_BASED';
    this.adjustments = options?.adjustments ?? {};
  }

  /**
   * Calculate prayer times for a specific date
   */
  getTimes(date: Date): PrayerTimes {
    const { latitude, longitude } = this.coordinates;
    const method = CALCULATION_METHODS[this.method];
    const { fajrAngle, ishaAngle, ishaInterval, maghribAngle } = method.params;

    // Calculate Julian Date at midnight local time
    const jd = julianDate(date);

    // Calculate prayer times in decimal hours
    let fajr = timeForAngle(jd, fajrAngle, latitude, longitude, 'ccw');
    let sunrise = timeForAngle(jd, SUNRISE_SUNSET_ANGLE, latitude, longitude, 'ccw');
    const dhuhr = midDay(jd, longitude);
    let asr = asrTime(jd, this.asrMethod === 'HANAFI' ? 2 : 1, latitude, longitude);
    let maghrib = timeForAngle(jd, SUNRISE_SUNSET_ANGLE, latitude, longitude, 'cw');

    // Calculate Isha
    let isha: number;
    if (ishaInterval !== undefined) {
      // Use interval after Maghrib
      isha = maghrib + ishaInterval / 60;
    } else if (ishaAngle !== undefined) {
      // Use angle
      isha = timeForAngle(jd, ishaAngle, latitude, longitude, 'cw');
    } else {
      // Fallback to 17 degrees
      isha = timeForAngle(jd, 17, latitude, longitude, 'cw');
    }

    // Handle Maghrib angle (Tehran/Jafari methods)
    if (maghribAngle !== undefined) {
      maghrib = timeForAngle(jd, maghribAngle, latitude, longitude, 'cw');
    }

    // Apply high latitude adjustments if needed
    if (this.highLatitudeMethod !== 'NONE') {
      const adjusted = this.adjustHighLatitude(fajr, sunrise, dhuhr, maghrib, isha);
      fajr = adjusted.fajr;
      isha = adjusted.isha;
    }

    // Apply manual adjustments
    fajr = applyAdjustment(fajr, this.adjustments.fajr);
    sunrise = applyAdjustment(sunrise, this.adjustments.sunrise);
    const dhuhrAdj = applyAdjustment(dhuhr, this.adjustments.dhuhr);
    asr = applyAdjustment(asr, this.adjustments.asr);
    maghrib = applyAdjustment(maghrib, this.adjustments.maghrib);
    isha = applyAdjustment(isha, this.adjustments.isha);

    return {
      date: new Date(date),
      fajr: hoursToDate(date, fajr),
      sunrise: hoursToDate(date, sunrise),
      dhuhr: hoursToDate(date, dhuhrAdj),
      asr: hoursToDate(date, asr),
      maghrib: hoursToDate(date, maghrib),
      isha: hoursToDate(date, isha),
    };
  }

  /**
   * Calculate prayer times for a date range
   */
  getTimesForRange(start: Date, end: Date): PrayerTimes[] {
    const results: PrayerTimes[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    while (current <= endDate) {
      results.push(this.getTimes(new Date(current)));
      current.setDate(current.getDate() + 1);
    }

    return results;
  }

  /**
   * Get the next prayer after the current time
   */
  getNextPrayer(prayerTimes: PrayerTimes, now?: Date): NextPrayer {
    const currentTime = now ?? new Date();
    const prayers: { name: PrayerName; time: Date }[] = [
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

    // If all prayers have passed, return Fajr of next day
    const nextDay = new Date(prayerTimes.date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayTimes = this.getTimes(nextDay);
    return { name: 'fajr', time: nextDayTimes.fajr };
  }

  /**
   * Get the current prayer period
   */
  getCurrentPrayer(prayerTimes: PrayerTimes, now?: Date): CurrentPrayer {
    const currentTime = now ?? new Date();
    const prayers: { name: PrayerName; time: Date }[] = [
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

    // Before Fajr - we're in previous day's Isha
    const prevDay = new Date(prayerTimes.date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayTimes = this.getTimes(prevDay);
    return { name: 'isha', startTime: prevDayTimes.isha };
  }

  /**
   * Adjust times for high latitudes
   */
  private adjustHighLatitude(
    fajr: number,
    sunrise: number,
    dhuhr: number,
    maghrib: number,
    isha: number
  ): { fajr: number; isha: number } {
    const nightTime = sunrise + 24 - maghrib;

    let adjustedFajr = fajr;
    let adjustedIsha = isha;

    // Adjust Fajr
    if (isNaN(fajr) || fajr > sunrise) {
      const fajrPortion = this.getNightPortion('fajr');
      const fajrDiff = fajrPortion * nightTime;
      adjustedFajr = sunrise - fajrDiff;
    }

    // Adjust Isha
    if (isNaN(isha) || isha < maghrib) {
      const ishaPortion = this.getNightPortion('isha');
      const ishaDiff = ishaPortion * nightTime;
      adjustedIsha = maghrib + ishaDiff;
    }

    return { fajr: adjustedFajr, isha: adjustedIsha };
  }

  /**
   * Get the portion of night for high latitude adjustment
   */
  private getNightPortion(prayer: 'fajr' | 'isha'): number {
    const method = CALCULATION_METHODS[this.method];
    const angle = prayer === 'fajr' ? method.params.fajrAngle : (method.params.ishaAngle ?? 17);

    switch (this.highLatitudeMethod) {
      case 'ANGLE_BASED':
        return angle / 60;
      case 'MIDDLE_OF_NIGHT':
        return 0.5;
      case 'ONE_SEVENTH':
        return 1 / 7;
      default:
        return 0;
    }
  }

  /**
   * Set calculation method
   */
  setMethod(method: CalculationMethodId): void {
    this.method = method;
  }

  /**
   * Set Asr calculation method
   */
  setAsrMethod(asrMethod: AsrMethod): void {
    this.asrMethod = asrMethod;
  }

  /**
   * Set high latitude adjustment method
   */
  setHighLatitudeMethod(method: HighLatitudeMethod): void {
    this.highLatitudeMethod = method;
  }

  /**
   * Set manual adjustments
   */
  setAdjustments(adjustments: PrayerAdjustments): void {
    this.adjustments = { ...this.adjustments, ...adjustments };
  }
}
