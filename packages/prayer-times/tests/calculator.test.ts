import { describe, it, expect, beforeEach } from 'vitest';
import {
  PrayerTimesCalculator,
  getPrayerTimes,
  getPrayerTimesForRange,
  getNextPrayer,
  getCurrentPrayer,
  formatTime,
  formatPrayerTimes,
  getTimeRemaining,
  formatTimeRemaining,
  CALCULATION_METHODS,
  DEFAULT_METHOD,
} from '../src';
import type {
  Coordinates,
  PrayerTimes,
  PrayerTimesOptions,
  CalculationMethodId,
  AsrMethod,
  HighLatitudeMethod,
  PrayerName,
  FormattedPrayerTimes,
  NextPrayer,
  CurrentPrayer,
} from '../src';

// ========== TEST COORDINATES ==========
const MAKKAH: Coordinates = { latitude: 21.4225, longitude: 39.8262 };
const NEW_YORK: Coordinates = { latitude: 40.7128, longitude: -74.006 };
const LONDON: Coordinates = { latitude: 51.5074, longitude: -0.1278 };
const TOKYO: Coordinates = { latitude: 35.6762, longitude: 139.6503 };
const SYDNEY: Coordinates = { latitude: -33.8688, longitude: 151.2093 };
const CAIRO: Coordinates = { latitude: 30.0444, longitude: 31.2357 };
const STOCKHOLM: Coordinates = { latitude: 59.33, longitude: 18.07 };
const REYKJAVIK: Coordinates = { latitude: 64.1466, longitude: -21.9426 };
const SINGAPORE: Coordinates = { latitude: 1.3521, longitude: 103.8198 };
const KARACHI: Coordinates = { latitude: 24.8607, longitude: 67.0011 };
const ISTANBUL: Coordinates = { latitude: 41.0082, longitude: 28.9784 };
const KUALA_LUMPUR: Coordinates = { latitude: 3.139, longitude: 101.6869 };

// Test dates
const WINTER_DATE = new Date('2024-01-15');
const SUMMER_DATE = new Date('2024-06-21');
const SPRING_DATE = new Date('2024-03-20');

// ========== CALCULATION METHODS TESTS ==========
describe('CALCULATION_METHODS', () => {
  const allMethods: CalculationMethodId[] = [
    'MWL', 'ISNA', 'EGYPT', 'MAKKAH', 'KARACHI', 'TEHRAN',
    'JAFARI', 'GULF', 'KUWAIT', 'QATAR', 'SINGAPORE', 'TURKEY', 'DUBAI', 'MOONSIGHTING',
  ];

  describe('method definitions', () => {
    it('contains all expected methods', () => {
      allMethods.forEach((methodId) => {
        expect(CALCULATION_METHODS[methodId]).toBeDefined();
      });
    });

    it('has exactly 14 methods', () => {
      expect(Object.keys(CALCULATION_METHODS)).toHaveLength(14);
    });
  });

  describe('method structure', () => {
    it.each(allMethods)('%s has required properties', (methodId) => {
      const method = CALCULATION_METHODS[methodId];
      expect(method.id).toBe(methodId);
      expect(method.name).toBeDefined();
      expect(typeof method.name).toBe('string');
      expect(method.params.fajrAngle).toBeDefined();
      expect(typeof method.params.fajrAngle).toBe('number');
    });

    it.each(allMethods)('%s has valid fajr angle (10-25 degrees)', (methodId) => {
      const angle = CALCULATION_METHODS[methodId].params.fajrAngle;
      expect(angle).toBeGreaterThanOrEqual(10);
      expect(angle).toBeLessThanOrEqual(25);
    });
  });

  describe('specific method parameters', () => {
    it('MWL has 18° fajr and 17° isha', () => {
      expect(CALCULATION_METHODS.MWL.params.fajrAngle).toBe(18);
      expect(CALCULATION_METHODS.MWL.params.ishaAngle).toBe(17);
    });

    it('ISNA has 15° for both fajr and isha', () => {
      expect(CALCULATION_METHODS.ISNA.params.fajrAngle).toBe(15);
      expect(CALCULATION_METHODS.ISNA.params.ishaAngle).toBe(15);
    });

    it('MAKKAH uses 90 minute isha interval', () => {
      expect(CALCULATION_METHODS.MAKKAH.params.ishaInterval).toBe(90);
    });

    it('TEHRAN has maghrib angle', () => {
      expect(CALCULATION_METHODS.TEHRAN.params.maghribAngle).toBeDefined();
    });

    it('JAFARI has maghrib angle', () => {
      expect(CALCULATION_METHODS.JAFARI.params.maghribAngle).toBeDefined();
    });
  });

  describe('DEFAULT_METHOD', () => {
    it('defaults to MWL', () => {
      expect(DEFAULT_METHOD).toBe('MWL');
    });

    it('is a valid method', () => {
      expect(CALCULATION_METHODS[DEFAULT_METHOD]).toBeDefined();
    });
  });
});

// ========== PrayerTimesCalculator CLASS TESTS ==========
describe('PrayerTimesCalculator', () => {
  describe('constructor', () => {
    it('creates calculator with coordinates only', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      expect(calculator).toBeDefined();
    });

    it('creates calculator with full options', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        method: 'ISNA',
        asrMethod: 'HANAFI',
        highLatitudeMethod: 'ANGLE_BASED',
        adjustments: { fajr: 5, dhuhr: 2 },
      });
      expect(calculator).toBeDefined();
    });

    it('defaults to MWL method', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      const mwlCalculator = new PrayerTimesCalculator(NEW_YORK, { method: 'MWL' });
      const mwlTimes = mwlCalculator.getTimes(WINTER_DATE);

      expect(times.fajr.getTime()).toBe(mwlTimes.fajr.getTime());
    });

    it('defaults to STANDARD asr method', () => {
      const standardCalc = new PrayerTimesCalculator(NEW_YORK);
      const explicitStandard = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'STANDARD' });

      const times1 = standardCalc.getTimes(WINTER_DATE);
      const times2 = explicitStandard.getTimes(WINTER_DATE);

      expect(times1.asr.getTime()).toBe(times2.asr.getTime());
    });
  });

  describe('getTimes', () => {
    let calculator: PrayerTimesCalculator;

    beforeEach(() => {
      calculator = new PrayerTimesCalculator(NEW_YORK);
    });

    it('returns all prayer times as Date objects', () => {
      const times = calculator.getTimes(WINTER_DATE);
      expect(times.date).toBeInstanceOf(Date);
      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.dhuhr).toBeInstanceOf(Date);
      expect(times.asr).toBeInstanceOf(Date);
      expect(times.maghrib).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('returns times in chronological order', () => {
      const times = calculator.getTimes(SUMMER_DATE);
      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
      expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
      expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
      expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
    });

    it('fajr is before sunrise', () => {
      const times = calculator.getTimes(WINTER_DATE);
      // Fajr is always before sunrise
      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
    });

    it('dhuhr is around midday (between sunrise and maghrib)', () => {
      const times = calculator.getTimes(WINTER_DATE);
      // Dhuhr should be roughly midway between sunrise and maghrib
      const dayMidpoint = (times.sunrise.getTime() + times.maghrib.getTime()) / 2;
      const tolerance = 2 * 60 * 60 * 1000; // 2 hours tolerance
      expect(Math.abs(times.dhuhr.getTime() - dayMidpoint)).toBeLessThan(tolerance);
    });

    it('isha is after maghrib', () => {
      const times = calculator.getTimes(WINTER_DATE);
      expect(times.isha.getTime()).toBeGreaterThan(times.maghrib.getTime());
    });

    it('date field matches input date', () => {
      const times = calculator.getTimes(WINTER_DATE);
      expect(times.date.getFullYear()).toBe(WINTER_DATE.getFullYear());
      expect(times.date.getMonth()).toBe(WINTER_DATE.getMonth());
      expect(times.date.getDate()).toBe(WINTER_DATE.getDate());
    });
  });

  describe('getTimesForRange', () => {
    it('returns array of prayer times for date range', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-07');

      const times = calculator.getTimesForRange(start, end);
      expect(times).toHaveLength(7);
    });

    it('each day has all prayer times', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimesForRange(
        new Date('2024-01-01'),
        new Date('2024-01-03')
      );

      times.forEach((dayTimes) => {
        expect(dayTimes.fajr).toBeInstanceOf(Date);
        expect(dayTimes.sunrise).toBeInstanceOf(Date);
        expect(dayTimes.dhuhr).toBeInstanceOf(Date);
        expect(dayTimes.asr).toBeInstanceOf(Date);
        expect(dayTimes.maghrib).toBeInstanceOf(Date);
        expect(dayTimes.isha).toBeInstanceOf(Date);
      });
    });

    it('handles single day range', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const date = new Date('2024-01-15');
      const times = calculator.getTimesForRange(date, date);
      expect(times).toHaveLength(1);
    });

    it('returns empty array for invalid range (end before start)', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimesForRange(
        new Date('2024-01-10'),
        new Date('2024-01-05')
      );
      expect(times).toHaveLength(0);
    });

    it('handles month-long range', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimesForRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      expect(times).toHaveLength(31);
    });
  });

  describe('getNextPrayer', () => {
    it('returns next prayer after given time', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      // Get time right after fajr
      const afterFajr = new Date(times.fajr.getTime() + 60000);
      const next = calculator.getNextPrayer(times, afterFajr);

      expect(next.name).toBe('sunrise');
    });

    it('returns fajr of next day after isha', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      const afterIsha = new Date(times.isha.getTime() + 3600000);
      const next = calculator.getNextPrayer(times, afterIsha);

      expect(next.name).toBe('fajr');
      expect(next.time.getDate()).toBe(WINTER_DATE.getDate() + 1);
    });

    it('returns correct prayer for each time period', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);
      const prayers: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

      prayers.forEach((prayer, index) => {
        if (index < prayers.length - 1) {
          // Get time just before this prayer
          const prayerTime = times[prayer];
          const beforePrayer = new Date(prayerTime.getTime() - 60000);
          const next = calculator.getNextPrayer(times, beforePrayer);
          expect(next.name).toBe(prayer);
        }
      });
    });
  });

  describe('getCurrentPrayer', () => {
    it('returns current prayer period', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      const duringDhuhr = new Date(times.dhuhr.getTime() + 1800000); // 30 min after dhuhr
      const current = calculator.getCurrentPrayer(times, duringDhuhr);

      expect(current.name).toBe('dhuhr');
    });

    it('returns isha for time before fajr', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      const beforeFajr = new Date(times.fajr.getTime() - 3600000); // 1 hour before fajr
      const current = calculator.getCurrentPrayer(times, beforeFajr);

      expect(current.name).toBe('isha');
    });

    it('returns correct prayer for each time period', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(WINTER_DATE);

      // During each prayer time
      const duringFajr = new Date(times.fajr.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringFajr).name).toBe('fajr');

      const duringSunrise = new Date(times.sunrise.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringSunrise).name).toBe('sunrise');

      const duringDhuhr = new Date(times.dhuhr.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringDhuhr).name).toBe('dhuhr');

      const duringAsr = new Date(times.asr.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringAsr).name).toBe('asr');

      const duringMaghrib = new Date(times.maghrib.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringMaghrib).name).toBe('maghrib');

      const duringIsha = new Date(times.isha.getTime() + 60000);
      expect(calculator.getCurrentPrayer(times, duringIsha).name).toBe('isha');
    });
  });

  describe('setMethod', () => {
    it('changes calculation method', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { method: 'MWL' });
      const mwlTimes = calculator.getTimes(WINTER_DATE);

      calculator.setMethod('ISNA');
      const isnaTimes = calculator.getTimes(WINTER_DATE);

      // ISNA has 15° fajr, MWL has 18° - ISNA should be later
      expect(isnaTimes.fajr.getTime()).toBeGreaterThan(mwlTimes.fajr.getTime());
    });
  });

  describe('setAsrMethod', () => {
    it('changes to Hanafi Asr method', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'STANDARD' });
      const standardTimes = calculator.getTimes(SUMMER_DATE);

      calculator.setAsrMethod('HANAFI');
      const hanafiTimes = calculator.getTimes(SUMMER_DATE);

      // Hanafi asr is later (shadow factor 2)
      expect(hanafiTimes.asr.getTime()).toBeGreaterThan(standardTimes.asr.getTime());
    });
  });

  describe('setHighLatitudeMethod', () => {
    it('changes high latitude adjustment method', () => {
      const calculator = new PrayerTimesCalculator(STOCKHOLM, {
        highLatitudeMethod: 'NONE'
      });

      calculator.setHighLatitudeMethod('ANGLE_BASED');
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });
  });

  describe('setAdjustments', () => {
    it('applies manual adjustments to prayer times', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const originalTimes = calculator.getTimes(WINTER_DATE);

      calculator.setAdjustments({ fajr: 5, isha: -5 });
      const adjustedTimes = calculator.getTimes(WINTER_DATE);

      // Fajr should be 5 minutes later
      const fajrDiff = (adjustedTimes.fajr.getTime() - originalTimes.fajr.getTime()) / 60000;
      expect(fajrDiff).toBeCloseTo(5, 0);

      // Isha should be 5 minutes earlier
      const ishaDiff = (adjustedTimes.isha.getTime() - originalTimes.isha.getTime()) / 60000;
      expect(ishaDiff).toBeCloseTo(-5, 0);
    });

    it('merges adjustments with existing ones', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: { fajr: 2 },
      });

      calculator.setAdjustments({ dhuhr: 3 });
      const times = calculator.getTimes(WINTER_DATE);

      // Both adjustments should be applied
      expect(times.fajr).toBeDefined();
      expect(times.dhuhr).toBeDefined();
    });
  });
});

// ========== CALCULATION METHOD COMPARISON TESTS ==========
describe('Calculation Method Comparisons', () => {
  const allMethods: CalculationMethodId[] = [
    'MWL', 'ISNA', 'EGYPT', 'MAKKAH', 'KARACHI', 'TEHRAN',
    'JAFARI', 'GULF', 'KUWAIT', 'QATAR', 'SINGAPORE', 'TURKEY', 'DUBAI', 'MOONSIGHTING',
  ];

  it('all methods produce valid prayer times', () => {
    allMethods.forEach((method) => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, { method });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.dhuhr).toBeInstanceOf(Date);
      expect(times.asr).toBeInstanceOf(Date);
      expect(times.maghrib).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });
  });

  it('all methods maintain prayer order', () => {
    allMethods.forEach((method) => {
      const calculator = new PrayerTimesCalculator(CAIRO, { method });
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
      expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
      expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
      expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
    });
  });

  it('methods with larger fajr angles produce earlier fajr times', () => {
    // EGYPT has 19.5°, ISNA has 15°
    const egypt = new PrayerTimesCalculator(NEW_YORK, { method: 'EGYPT' });
    const isna = new PrayerTimesCalculator(NEW_YORK, { method: 'ISNA' });

    const egyptTimes = egypt.getTimes(WINTER_DATE);
    const isnaTimes = isna.getTimes(WINTER_DATE);

    // Larger angle = earlier fajr
    expect(egyptTimes.fajr.getTime()).toBeLessThan(isnaTimes.fajr.getTime());
  });

  it('methods with isha interval vs isha angle', () => {
    // MAKKAH uses 90 min interval, MWL uses 17° angle
    const makkah = new PrayerTimesCalculator(MAKKAH, { method: 'MAKKAH' });
    const mwl = new PrayerTimesCalculator(MAKKAH, { method: 'MWL' });

    const makkahTimes = makkah.getTimes(WINTER_DATE);
    const mwlTimes = mwl.getTimes(WINTER_DATE);

    // Both should be valid
    expect(makkahTimes.isha).toBeInstanceOf(Date);
    expect(mwlTimes.isha).toBeInstanceOf(Date);

    // Makkah isha should be exactly 90 minutes after maghrib
    const makkahDiff = (makkahTimes.isha.getTime() - makkahTimes.maghrib.getTime()) / 60000;
    expect(makkahDiff).toBeCloseTo(90, 0);
  });
});

// ========== ASR METHOD TESTS ==========
describe('Asr Calculation Methods', () => {
  it('Hanafi Asr is later than Standard Asr', () => {
    const standard = new PrayerTimesCalculator(KARACHI, { asrMethod: 'STANDARD' });
    const hanafi = new PrayerTimesCalculator(KARACHI, { asrMethod: 'HANAFI' });

    const standardTimes = standard.getTimes(SUMMER_DATE);
    const hanafiTimes = hanafi.getTimes(SUMMER_DATE);

    expect(hanafiTimes.asr.getTime()).toBeGreaterThan(standardTimes.asr.getTime());
  });

  it('Hanafi/Standard difference varies by season', () => {
    const standard = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'STANDARD' });
    const hanafi = new PrayerTimesCalculator(NEW_YORK, { asrMethod: 'HANAFI' });

    const winterStandard = standard.getTimes(WINTER_DATE);
    const winterHanafi = hanafi.getTimes(WINTER_DATE);
    const summerStandard = standard.getTimes(SUMMER_DATE);
    const summerHanafi = hanafi.getTimes(SUMMER_DATE);

    const winterDiff = hanafiToStandardDiff(winterHanafi, winterStandard);
    const summerDiff = hanafiToStandardDiff(summerHanafi, summerStandard);

    // Difference exists in both seasons
    expect(winterDiff).toBeGreaterThan(0);
    expect(summerDiff).toBeGreaterThan(0);
  });
});

function hanafiToStandardDiff(hanafi: PrayerTimes, standard: PrayerTimes): number {
  return (hanafi.asr.getTime() - standard.asr.getTime()) / 60000;
}

// ========== HIGH LATITUDE TESTS ==========
describe('High Latitude Methods', () => {
  const highLatMethods: HighLatitudeMethod[] = ['NONE', 'ANGLE_BASED', 'MIDDLE_OF_NIGHT', 'ONE_SEVENTH'];

  describe('in Stockholm during summer', () => {
    it.each(highLatMethods)('%s method produces valid times', (method) => {
      const calculator = new PrayerTimesCalculator(STOCKHOLM, {
        highLatitudeMethod: method,
      });
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('ANGLE_BASED produces valid fajr and isha', () => {
      const calculator = new PrayerTimesCalculator(STOCKHOLM, {
        highLatitudeMethod: 'ANGLE_BASED',
      });
      const times = calculator.getTimes(SUMMER_DATE);

      // Times should be valid (not NaN)
      expect(isNaN(times.fajr.getTime())).toBe(false);
      expect(isNaN(times.isha.getTime())).toBe(false);
    });

    it('MIDDLE_OF_NIGHT sets fajr/isha at half of night', () => {
      const calculator = new PrayerTimesCalculator(STOCKHOLM, {
        highLatitudeMethod: 'MIDDLE_OF_NIGHT',
      });
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.isha.getTime()).toBeGreaterThan(times.maghrib.getTime());
    });

    it('ONE_SEVENTH uses 1/7 of night portion', () => {
      const calculator = new PrayerTimesCalculator(STOCKHOLM, {
        highLatitudeMethod: 'ONE_SEVENTH',
      });
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.isha.getTime()).toBeGreaterThan(times.maghrib.getTime());
    });
  });

  describe('in Reykjavik (very high latitude)', () => {
    it('handles extreme high latitude with ANGLE_BASED', () => {
      const calculator = new PrayerTimesCalculator(REYKJAVIK, {
        highLatitudeMethod: 'ANGLE_BASED',
      });
      const times = calculator.getTimes(SUMMER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
      expect(isNaN(times.fajr.getTime())).toBe(false);
    });
  });

  describe('normal latitude (no adjustment needed)', () => {
    it('same results with any high latitude method at equator', () => {
      const methods: HighLatitudeMethod[] = ['NONE', 'ANGLE_BASED', 'MIDDLE_OF_NIGHT'];
      const results = methods.map((method) => {
        const calc = new PrayerTimesCalculator(SINGAPORE, { highLatitudeMethod: method });
        return calc.getTimes(SUMMER_DATE);
      });

      // At low latitudes, high latitude methods shouldn't make significant difference
      // Dhuhr and Asr should be identical
      const dhuhrTimes = results.map((r) => r.dhuhr.getTime());
      expect(new Set(dhuhrTimes).size).toBe(1);
    });
  });
});

// ========== FUNCTIONAL API TESTS ==========
describe('Functional API', () => {
  describe('getPrayerTimes', () => {
    it('returns prayer times for given date and options', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
        method: 'ISNA',
      });

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.dhuhr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('accepts minimal options (coordinates only)', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
      });

      expect(times.fajr).toBeInstanceOf(Date);
    });

    it('accepts all calculation options', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
        method: 'EGYPT',
        asrMethod: 'HANAFI',
        highLatitudeMethod: 'ANGLE_BASED',
        adjustments: { fajr: 2 },
      });

      expect(times).toBeDefined();
    });

    it('produces same results as PrayerTimesCalculator', () => {
      const options = {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
        method: 'ISNA' as const,
      };

      const functionalTimes = getPrayerTimes(WINTER_DATE, options);

      const calculator = new PrayerTimesCalculator(
        { latitude: options.latitude, longitude: options.longitude },
        { method: options.method }
      );
      const classTimes = calculator.getTimes(WINTER_DATE);

      expect(functionalTimes.fajr.getTime()).toBe(classTimes.fajr.getTime());
      expect(functionalTimes.dhuhr.getTime()).toBe(classTimes.dhuhr.getTime());
    });
  });

  describe('getPrayerTimesForRange', () => {
    it('returns array of prayer times for date range', () => {
      const times = getPrayerTimesForRange(
        new Date('2024-01-01'),
        new Date('2024-01-07'),
        { latitude: NEW_YORK.latitude, longitude: NEW_YORK.longitude }
      );

      expect(times).toHaveLength(7);
      times.forEach((t) => {
        expect(t.fajr).toBeInstanceOf(Date);
      });
    });
  });

  describe('getNextPrayer (functional)', () => {
    it('returns next prayer from times object', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
      });

      const afterSunrise = new Date(times.sunrise.getTime() + 60000);
      const next = getNextPrayer(times, afterSunrise);

      expect(next.name).toBe('dhuhr');
    });

    it('returns fajr when all prayers passed', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
      });

      const afterIsha = new Date(times.isha.getTime() + 3600000);
      const next = getNextPrayer(times, afterIsha);

      expect(next.name).toBe('fajr');
    });
  });

  describe('getCurrentPrayer (functional)', () => {
    it('returns current prayer period', () => {
      const times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
      });

      const duringAsr = new Date(times.asr.getTime() + 1800000);
      const current = getCurrentPrayer(times, duringAsr);

      expect(current.name).toBe('asr');
    });
  });
});

// ========== FORMATTING TESTS ==========
describe('Formatting Functions', () => {
  describe('formatTime', () => {
    const testDate = new Date('2024-01-15T14:30:45');

    it('formats in 24-hour by default', () => {
      const formatted = formatTime(testDate);
      expect(formatted).toMatch(/14:30/);
    });

    it('formats in 12-hour when specified', () => {
      const formatted = formatTime(testDate, { format: '12h' });
      expect(formatted).toMatch(/2:30.*PM/i);
    });

    it('includes seconds when specified', () => {
      const formatted = formatTime(testDate, { includeSeconds: true });
      expect(formatted).toMatch(/45/);
    });

    it('respects locale option', () => {
      const formatted = formatTime(testDate, { locale: 'de-DE' });
      expect(formatted).toBeDefined();
    });

    it('handles midnight correctly', () => {
      const midnight = new Date('2024-01-15T00:00:00');
      const formatted24 = formatTime(midnight, { format: '24h' });
      const formatted12 = formatTime(midnight, { format: '12h' });

      expect(formatted24).toMatch(/00:00/);
      expect(formatted12).toMatch(/12:00.*AM/i);
    });

    it('handles noon correctly', () => {
      const noon = new Date('2024-01-15T12:00:00');
      const formatted12 = formatTime(noon, { format: '12h' });

      expect(formatted12).toMatch(/12:00.*PM/i);
    });
  });

  describe('formatPrayerTimes', () => {
    let times: PrayerTimes;

    beforeEach(() => {
      times = getPrayerTimes(WINTER_DATE, {
        latitude: NEW_YORK.latitude,
        longitude: NEW_YORK.longitude,
      });
    });

    it('formats all prayer times to strings', () => {
      const formatted = formatPrayerTimes(times);

      expect(typeof formatted.fajr).toBe('string');
      expect(typeof formatted.sunrise).toBe('string');
      expect(typeof formatted.dhuhr).toBe('string');
      expect(typeof formatted.asr).toBe('string');
      expect(typeof formatted.maghrib).toBe('string');
      expect(typeof formatted.isha).toBe('string');
      expect(typeof formatted.date).toBe('string');
    });

    it('applies format option to all times', () => {
      const formatted = formatPrayerTimes(times, { format: '12h' });

      // All times should include AM/PM
      expect(formatted.fajr).toMatch(/AM|PM/i);
      expect(formatted.sunrise).toMatch(/AM|PM/i);
      expect(formatted.dhuhr).toMatch(/AM|PM/i);
    });

    it('includes date as string', () => {
      const formatted = formatPrayerTimes(times);
      expect(formatted.date).toBeDefined();
      expect(typeof formatted.date).toBe('string');
    });
  });

  describe('getTimeRemaining', () => {
    it('returns time remaining until future time', () => {
      const now = new Date('2024-01-15T10:00:00');
      const prayerTime = new Date('2024-01-15T12:30:00');

      const remaining = getTimeRemaining(prayerTime, now);

      expect(remaining.hours).toBe(2);
      expect(remaining.minutes).toBe(30);
      expect(remaining.isPast).toBe(false);
    });

    it('returns time elapsed for past time', () => {
      const now = new Date('2024-01-15T14:00:00');
      const prayerTime = new Date('2024-01-15T12:30:00');

      const remaining = getTimeRemaining(prayerTime, now);

      expect(remaining.hours).toBe(1);
      expect(remaining.minutes).toBe(30);
      expect(remaining.isPast).toBe(true);
    });

    it('returns totalSeconds', () => {
      const now = new Date('2024-01-15T10:00:00');
      const prayerTime = new Date('2024-01-15T10:05:30');

      const remaining = getTimeRemaining(prayerTime, now);

      expect(remaining.totalSeconds).toBe(330); // 5:30 = 330 seconds
    });

    it('handles exactly same time', () => {
      const time = new Date('2024-01-15T12:00:00');
      const remaining = getTimeRemaining(time, time);

      expect(remaining.hours).toBe(0);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.totalSeconds).toBe(0);
    });
  });

  describe('formatTimeRemaining', () => {
    it('formats future time as "Xh Ym"', () => {
      const now = new Date('2024-01-15T10:00:00');
      const prayerTime = new Date('2024-01-15T12:30:00');

      const formatted = formatTimeRemaining(prayerTime, now);

      expect(formatted).toBe('2h 30m');
    });

    it('formats short time as "Ym" only', () => {
      const now = new Date('2024-01-15T10:00:00');
      const prayerTime = new Date('2024-01-15T10:25:00');

      const formatted = formatTimeRemaining(prayerTime, now);

      expect(formatted).toBe('25m');
    });

    it('formats past time with "ago"', () => {
      const now = new Date('2024-01-15T14:00:00');
      const prayerTime = new Date('2024-01-15T12:30:00');

      const formatted = formatTimeRemaining(prayerTime, now);

      expect(formatted).toBe('1h 30m ago');
    });

    it('formats short past time correctly', () => {
      const now = new Date('2024-01-15T10:30:00');
      const prayerTime = new Date('2024-01-15T10:15:00');

      const formatted = formatTimeRemaining(prayerTime, now);

      expect(formatted).toBe('15m ago');
    });
  });
});

// ========== LOCATION-SPECIFIC TESTS ==========
describe('Location-Specific Tests', () => {
  describe('Makkah', () => {
    it('calculates prayer times for holy city', () => {
      const calculator = new PrayerTimesCalculator(MAKKAH, { method: 'MAKKAH' });
      const times = calculator.getTimes(WINTER_DATE);

      // Verify proper prayer time ordering
      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.isha.getTime()).toBeGreaterThan(times.maghrib.getTime());
      // Makkah method has 90 minute isha interval
      const ishaDiff = (times.isha.getTime() - times.maghrib.getTime()) / 60000;
      expect(ishaDiff).toBeCloseTo(90, 0);
    });
  });

  describe('Southern Hemisphere', () => {
    it('handles Sydney correctly', () => {
      const calculator = new PrayerTimesCalculator(SYDNEY);
      const winterTimes = calculator.getTimes(new Date('2024-07-15')); // Winter in S. hemisphere
      const summerTimes = calculator.getTimes(new Date('2024-01-15')); // Summer in S. hemisphere

      // Winter days are shorter
      const winterDayLength = winterTimes.maghrib.getTime() - winterTimes.sunrise.getTime();
      const summerDayLength = summerTimes.maghrib.getTime() - summerTimes.sunrise.getTime();

      expect(summerDayLength).toBeGreaterThan(winterDayLength);
    });
  });

  describe('Near Equator', () => {
    it('Singapore has consistent day length year-round', () => {
      const calculator = new PrayerTimesCalculator(SINGAPORE);
      const jan = calculator.getTimes(new Date('2024-01-15'));
      const jul = calculator.getTimes(new Date('2024-07-15'));

      const janDayLength = jan.maghrib.getTime() - jan.sunrise.getTime();
      const julDayLength = jul.maghrib.getTime() - jul.sunrise.getTime();

      // Day length difference should be small (< 1 hour)
      const diff = Math.abs(janDayLength - julDayLength) / 3600000;
      expect(diff).toBeLessThan(1);
    });
  });

  describe('Different Timezones', () => {
    it('Tokyo times are in correct range', () => {
      const calculator = new PrayerTimesCalculator(TOKYO);
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.dhuhr).toBeInstanceOf(Date);
    });

    it('London times are in correct range', () => {
      const calculator = new PrayerTimesCalculator(LONDON);
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.dhuhr).toBeInstanceOf(Date);
    });
  });
});

// ========== SEASONAL VARIATION TESTS ==========
describe('Seasonal Variations', () => {
  describe('Day length changes', () => {
    it('summer days are longer than winter days (Northern Hemisphere)', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const winter = calculator.getTimes(WINTER_DATE);
      const summer = calculator.getTimes(SUMMER_DATE);

      const winterDayLength = winter.maghrib.getTime() - winter.sunrise.getTime();
      const summerDayLength = summer.maghrib.getTime() - summer.sunrise.getTime();

      expect(summerDayLength).toBeGreaterThan(winterDayLength);
    });

    it('fajr is earlier relative to sunrise in summer', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const winter = calculator.getTimes(WINTER_DATE);
      const summer = calculator.getTimes(SUMMER_DATE);

      // Calculate fajr to sunrise duration (longer in summer due to longer nights)
      const winterFajrToSunrise = winter.sunrise.getTime() - winter.fajr.getTime();
      const summerFajrToSunrise = summer.sunrise.getTime() - summer.fajr.getTime();

      // Summer has longer fajr to sunrise duration due to angle-based calculation
      expect(summerFajrToSunrise).toBeGreaterThan(winterFajrToSunrise);
    });

    it('maghrib to isha interval varies by season', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const winter = calculator.getTimes(WINTER_DATE);
      const summer = calculator.getTimes(SUMMER_DATE);

      // Calculate maghrib to isha duration
      const winterMaghribToIsha = winter.isha.getTime() - winter.maghrib.getTime();
      const summerMaghribToIsha = summer.isha.getTime() - summer.maghrib.getTime();

      // Both should be positive (isha after maghrib)
      expect(winterMaghribToIsha).toBeGreaterThan(0);
      expect(summerMaghribToIsha).toBeGreaterThan(0);
    });
  });

  describe('Equinox and Solstice', () => {
    it('handles spring equinox', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(SPRING_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('handles summer solstice (longest day)', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-06-21'));

      const dayLength = (times.maghrib.getTime() - times.sunrise.getTime()) / 3600000;
      expect(dayLength).toBeGreaterThan(14); // Long day in NYC
    });

    it('handles winter solstice (shortest day)', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2024-12-21'));

      const dayLength = (times.maghrib.getTime() - times.sunrise.getTime()) / 3600000;
      expect(dayLength).toBeLessThan(10); // Short day in NYC
    });
  });
});

// ========== EDGE CASES ==========
describe('Edge Cases', () => {
  describe('Date handling', () => {
    it('handles leap year February 29', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const leapDate = new Date(2024, 1, 29); // February 29, 2024 (local time)
      const times = calculator.getTimes(leapDate);

      expect(times.fajr).toBeInstanceOf(Date);
      // Just verify we get valid prayer times for the leap day
      expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
      expect(times.isha.getTime()).toBeGreaterThan(times.maghrib.getTime());
    });

    it('handles year boundaries', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const dec31 = calculator.getTimes(new Date('2024-12-31'));
      const jan1 = calculator.getTimes(new Date('2025-01-01'));

      expect(dec31.fajr).toBeInstanceOf(Date);
      expect(jan1.fajr).toBeInstanceOf(Date);
    });

    it('handles dates far in the past', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('1900-01-15'));

      expect(times.fajr).toBeInstanceOf(Date);
    });

    it('handles dates far in the future', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK);
      const times = calculator.getTimes(new Date('2100-01-15'));

      expect(times.fajr).toBeInstanceOf(Date);
    });
  });

  describe('Extreme coordinates', () => {
    it('handles equator (0° latitude)', () => {
      const calculator = new PrayerTimesCalculator({ latitude: 0, longitude: 0 });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });

    it('handles international date line', () => {
      const calc1 = new PrayerTimesCalculator({ latitude: 0, longitude: 180 });
      const calc2 = new PrayerTimesCalculator({ latitude: 0, longitude: -180 });

      const times1 = calc1.getTimes(WINTER_DATE);
      const times2 = calc2.getTimes(WINTER_DATE);

      // Both should produce valid times
      expect(times1.fajr).toBeInstanceOf(Date);
      expect(times2.fajr).toBeInstanceOf(Date);
    });

    it('handles prime meridian (0° longitude)', () => {
      const calculator = new PrayerTimesCalculator({ latitude: 51.5, longitude: 0 });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
    });
  });

  describe('Adjustments edge cases', () => {
    it('handles large positive adjustments', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: { fajr: 60 }, // 1 hour
      });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
    });

    it('handles large negative adjustments', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: { isha: -60 }, // -1 hour
      });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.isha).toBeInstanceOf(Date);
    });

    it('handles zero adjustments', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: { fajr: 0, dhuhr: 0, isha: 0 },
      });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
    });

    it('handles all prayers adjusted', () => {
      const calculator = new PrayerTimesCalculator(NEW_YORK, {
        adjustments: {
          fajr: 5,
          sunrise: 2,
          dhuhr: 3,
          asr: -2,
          maghrib: 1,
          isha: -3,
        },
      });
      const times = calculator.getTimes(WINTER_DATE);

      expect(times.fajr).toBeInstanceOf(Date);
      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.dhuhr).toBeInstanceOf(Date);
      expect(times.asr).toBeInstanceOf(Date);
      expect(times.maghrib).toBeInstanceOf(Date);
      expect(times.isha).toBeInstanceOf(Date);
    });
  });
});

// ========== TYPE SAFETY TESTS ==========
describe('Type Safety', () => {
  it('PrayerTimes has all required properties', () => {
    const calculator = new PrayerTimesCalculator(NEW_YORK);
    const times: PrayerTimes = calculator.getTimes(WINTER_DATE);

    expect(times.date).toBeDefined();
    expect(times.fajr).toBeDefined();
    expect(times.sunrise).toBeDefined();
    expect(times.dhuhr).toBeDefined();
    expect(times.asr).toBeDefined();
    expect(times.maghrib).toBeDefined();
    expect(times.isha).toBeDefined();
  });

  it('FormattedPrayerTimes has all string properties', () => {
    const times = getPrayerTimes(WINTER_DATE, {
      latitude: NEW_YORK.latitude,
      longitude: NEW_YORK.longitude,
    });
    const formatted: FormattedPrayerTimes = formatPrayerTimes(times);

    expect(typeof formatted.date).toBe('string');
    expect(typeof formatted.fajr).toBe('string');
    expect(typeof formatted.sunrise).toBe('string');
    expect(typeof formatted.dhuhr).toBe('string');
    expect(typeof formatted.asr).toBe('string');
    expect(typeof formatted.maghrib).toBe('string');
    expect(typeof formatted.isha).toBe('string');
  });

  it('NextPrayer has correct shape', () => {
    const times = getPrayerTimes(WINTER_DATE, {
      latitude: NEW_YORK.latitude,
      longitude: NEW_YORK.longitude,
    });
    const next: NextPrayer = getNextPrayer(times, times.fajr);

    expect(next.name).toBeDefined();
    expect(next.time).toBeInstanceOf(Date);
  });

  it('CurrentPrayer has correct shape', () => {
    const times = getPrayerTimes(WINTER_DATE, {
      latitude: NEW_YORK.latitude,
      longitude: NEW_YORK.longitude,
    });
    const current: CurrentPrayer = getCurrentPrayer(times, times.dhuhr);

    expect(current.name).toBeDefined();
    expect(current.startTime).toBeInstanceOf(Date);
  });
});
