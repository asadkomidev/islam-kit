import { describe, it, expect } from 'vitest';
import { PrayerTimesCalculator, CALCULATION_METHODS } from '../src';

// Test coordinates
const MAKKAH = { latitude: 21.4225, longitude: 39.8262 };
const NEW_YORK = { latitude: 40.7128, longitude: -74.006 };
const LONDON = { latitude: 51.5074, longitude: -0.1278 };
const TOKYO = { latitude: 35.6762, longitude: 139.6503 };

describe('PrayerTimesCalculator', () => {
  describe('constructor', () => {
    it('creates calculator with default options', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-01-15'));
      expect(times).toBeDefined();
      expect(times.fajr).toBeInstanceOf(Date);
    });

    it('creates calculator with custom method', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { method: 'ISNA' });
      const times = calculator.getTimes(new Date('2024-01-15'));
      expect(times.fajr).toBeInstanceOf(Date);
    });
  });

  describe('getTimes', () => {
    it('returns all prayer times as Date objects', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { method: 'ISNA' });
      const times = calculator.getTimes(new Date('2024-01-15'));

      expect(times.date).toBeInstanceOf(Date);
      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.dhuhr).toBeInstanceOf(Date);
      expect(times.asr).toBeInstanceOf(Date);
      expect(times.maghrib).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('returns times in correct order', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-06-15'));

      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
      expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
      expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
      expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
    });

    it('calculates different times for different methods', () => {
      const mwl = new PrayerTimesCalculator(NEW_YORK, { method: 'MWL' });
      const isna = new PrayerTimesCalculator(NEW_YORK, { method: 'ISNA' });

      const mwlTimes = mwl.getTimes(new Date('2024-01-15'));
      const isnaTimes = isna.getTimes(new Date('2024-01-15'));

      // ISNA has 15° angle for Fajr, MWL has 18°
      // So ISNA Fajr should be later (closer to sunrise)
      expect(isnaTimes.fajr.getTime()).toBeGreaterThan(mwlTimes.fajr.getTime());
    });

    it('handles Hanafi Asr method', () => {
      const shafi = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'STANDARD' });
      const hanafi = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'HANAFI' });

      const shafiTimes = shafi.getTimes(new Date('2024-06-15'));
      const hanafiTimes = hanafi.getTimes(new Date('2024-06-15'));

      // Hanafi Asr is later (shadow factor 2 vs 1)
      expect(hanafiTimes.asr.getTime()).toBeGreaterThan(shafiTimes.asr.getTime());
    });
  });

  describe('getTimesForRange', () => {
    it('returns times for multiple days', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimesForRange(
        new Date('2024-01-01'),
        new Date('2024-01-07')
      );

      expect(times).toHaveLength(7);
      times.forEach((t) => {
        expect(t.fajr).toBeInstanceOf(Date);
      });
    });
  });

  describe('getNextPrayer', () => {
    it('returns the next prayer', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-01-15'));

      // Test with a time that is definitely before Dhuhr (use sunrise + 1 hour)
      const afterSunrise = new Date(times.sunrise.getTime() + 60 * 60 * 1000);
      const next = calculator.getNextPrayer(times, afterSunrise);

      // Next prayer after sunrise should be Dhuhr
      expect(next.name).toBe('dhuhr');
    });

    it('returns Fajr if all prayers have passed', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-01-15'));

      // Set time to after Isha - all prayers passed
      const afterIsha = new Date(times.isha.getTime() + 60 * 60 * 1000);
      const next = calculator.getNextPrayer(times, afterIsha);

      expect(next.name).toBe('fajr');
    });
  });

  describe('getCurrentPrayer', () => {
    it('returns the current prayer period', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-01-15'));

      // Test with a time between Dhuhr and Asr
      const duringDhuhr = new Date(times.dhuhr.getTime() + 30 * 60 * 1000);
      const current = calculator.getCurrentPrayer(times, duringDhuhr);

      expect(current.name).toBe('dhuhr');
    });
  });

  describe('setMethod', () => {
    it('changes calculation method', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { method: 'MWL' });
      const mwlTimes = calculator.getTimes(new Date('2024-01-15'));

      calculator.setMethod('ISNA');
      const isnaTimes = calculator.getTimes(new Date('2024-01-15'));

      expect(isnaTimes.fajr.getTime()).not.toBe(mwlTimes.fajr.getTime());
    });
  });

  describe('adjustments', () => {
    it('applies manual adjustments', () => {
      const withoutAdj = new PrayerTimesCalculator(NEW_YORK);
      const withAdj = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: { fajr: 5 }, // Add 5 minutes
      });

      const times1 = withoutAdj.getTimes(new Date('2024-01-15'));
      const times2 = withAdj.getTimes(new Date('2024-01-15'));

      const diff = (times2.fajr.getTime() - times1.fajr.getTime()) / 60000;
      expect(diff).toBeCloseTo(5, 0);
    });
  });
});

describe('calculation methods', () => {
  it('has all expected methods', () => {
    expect(CALCULATION_METHODS.MWL).toBeDefined();
    expect(CALCULATION_METHODS.ISNA).toBeDefined();
    expect(CALCULATION_METHODS.EGYPT).toBeDefined();
    expect(CALCULATION_METHODS.MAKKAH).toBeDefined();
    expect(CALCULATION_METHODS.KARACHI).toBeDefined();
    expect(CALCULATION_METHODS.TEHRAN).toBeDefined();
    expect(CALCULATION_METHODS.JAFARI).toBeDefined();
    expect(CALCULATION_METHODS.GULF).toBeDefined();
    expect(CALCULATION_METHODS.KUWAIT).toBeDefined();
    expect(CALCULATION_METHODS.QATAR).toBeDefined();
    expect(CALCULATION_METHODS.SINGAPORE).toBeDefined();
    expect(CALCULATION_METHODS.TURKEY).toBeDefined();
    expect(CALCULATION_METHODS.DUBAI).toBeDefined();
    expect(CALCULATION_METHODS.MOONSIGHTING).toBeDefined();
  });

  it('each method has required params', () => {
    Object.values(CALCULATION_METHODS).forEach((method) => {
      expect(method.id).toBeDefined();
      expect(method.name).toBeDefined();
      expect(method.params.fajrAngle).toBeDefined();
    });
  });
});

describe('edge cases', () => {
  it('handles equator location', () => {
    const calculator = new PrayerTimesCalculator({ latitude: 0, longitude: 0 });
    const times = calculator.getTimes(new Date('2024-06-21'));

    expect(times.fajr).toBeInstanceOf(Date);
    expect(times.isha).toBeInstanceOf(Date);
  });

  it('handles location near poles with high latitude adjustment', () => {
    // Stockholm in summer
    const calculator = new PrayerTimesCalculator(
      { latitude: 59.33, longitude: 18.07 },
      { highLatitudeMethod: 'ANGLE_BASED' }
    );

    const times = calculator.getTimes(new Date('2024-06-21'));
    expect(times.fajr).toBeInstanceOf(Date);
    expect(times.isha).toBeInstanceOf(Date);
  });

  it('handles different timezones via date', () => {
    const calculator = new PrayerTimesCalculator(TOKYO);
    const times = calculator.getTimes(new Date('2024-01-15'));

    // Tokyo is ~14-15 hours ahead of EST
    expect(times.dhuhr).toBeInstanceOf(Date);
  });
});
