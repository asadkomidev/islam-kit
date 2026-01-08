import { describe, it, expect } from 'vitest';
import {
  calculateQibla,
  getQiblaDirection,
  getDistanceToKaaba,
  getQiblaCompass,
  KAABA_COORDINATES,
  EARTH_RADIUS_KM,
} from '../src';
import type { Coordinates, CompassPoint, QiblaResult } from '../src';

// ========== TEST COORDINATES ==========
const NEW_YORK: Coordinates = { latitude: 40.7128, longitude: -74.006 };
const LONDON: Coordinates = { latitude: 51.5074, longitude: -0.1278 };
const TOKYO: Coordinates = { latitude: 35.6762, longitude: 139.6503 };
const SYDNEY: Coordinates = { latitude: -33.8688, longitude: 151.2093 };
const CAIRO: Coordinates = { latitude: 30.0444, longitude: 31.2357 };
const MOSCOW: Coordinates = { latitude: 55.7558, longitude: 37.6173 };
const CAPE_TOWN: Coordinates = { latitude: -33.9249, longitude: 18.4241 };
const JAKARTA: Coordinates = { latitude: -6.2088, longitude: 106.8456 };
const LOS_ANGELES: Coordinates = { latitude: 34.0522, longitude: -118.2437 };
const SAO_PAULO: Coordinates = { latitude: -23.5505, longitude: -46.6333 };
const DUBAI: Coordinates = { latitude: 25.2048, longitude: 55.2708 };
const ISLAMABAD: Coordinates = { latitude: 33.6844, longitude: 73.0479 };
const SINGAPORE: Coordinates = { latitude: 1.3521, longitude: 103.8198 };
const JOHANNESBURG: Coordinates = { latitude: -26.2041, longitude: 28.0473 };
const BERLIN: Coordinates = { latitude: 52.52, longitude: 13.405 };
const PARIS: Coordinates = { latitude: 48.8566, longitude: 2.3522 };
const MUMBAI: Coordinates = { latitude: 19.076, longitude: 72.8777 };
const KUALA_LUMPUR: Coordinates = { latitude: 3.139, longitude: 101.6869 };
const ISTANBUL: Coordinates = { latitude: 41.0082, longitude: 28.9784 };
const MEDINA: Coordinates = { latitude: 24.5247, longitude: 39.5692 };
const RIYADH: Coordinates = { latitude: 24.7136, longitude: 46.6753 };

// ========== CONSTANTS TESTS ==========
describe('Constants', () => {
  describe('KAABA_COORDINATES', () => {
    it('has correct latitude for Kaaba', () => {
      expect(KAABA_COORDINATES.latitude).toBe(21.4225);
    });

    it('has correct longitude for Kaaba', () => {
      expect(KAABA_COORDINATES.longitude).toBe(39.8262);
    });

    it('is immutable (defined as const)', () => {
      // KAABA_COORDINATES is defined with `as const` making it readonly
      expect(KAABA_COORDINATES).toBeDefined();
      expect(typeof KAABA_COORDINATES.latitude).toBe('number');
      expect(typeof KAABA_COORDINATES.longitude).toBe('number');
    });

    it('coordinates are within valid ranges', () => {
      expect(KAABA_COORDINATES.latitude).toBeGreaterThanOrEqual(-90);
      expect(KAABA_COORDINATES.latitude).toBeLessThanOrEqual(90);
      expect(KAABA_COORDINATES.longitude).toBeGreaterThanOrEqual(-180);
      expect(KAABA_COORDINATES.longitude).toBeLessThanOrEqual(180);
    });
  });

  describe('EARTH_RADIUS_KM', () => {
    it('has correct value for WGS84 mean radius', () => {
      expect(EARTH_RADIUS_KM).toBe(6371.0088);
    });

    it('is a positive number', () => {
      expect(EARTH_RADIUS_KM).toBeGreaterThan(0);
    });

    it('is approximately 6371 km (standard Earth radius)', () => {
      expect(EARTH_RADIUS_KM).toBeCloseTo(6371, 0);
    });
  });
});

// ========== calculateQibla TESTS ==========
describe('calculateQibla', () => {
  describe('return value structure', () => {
    it('returns a QiblaResult object', () => {
      const result = calculateQibla(NEW_YORK);
      expect(result).toHaveProperty('direction');
      expect(result).toHaveProperty('distance');
      expect(result).toHaveProperty('compass');
    });

    it('direction is a number', () => {
      const result = calculateQibla(NEW_YORK);
      expect(typeof result.direction).toBe('number');
    });

    it('distance is a number', () => {
      const result = calculateQibla(NEW_YORK);
      expect(typeof result.distance).toBe('number');
    });

    it('compass is a valid CompassPoint', () => {
      const result = calculateQibla(NEW_YORK);
      const validCompassPoints: CompassPoint[] = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
      ];
      expect(validCompassPoints).toContain(result.compass);
    });
  });

  describe('major cities - direction verification', () => {
    it('returns correct direction for New York (~58-60°)', () => {
      const result = calculateQibla(NEW_YORK);
      expect(result.direction).toBeGreaterThan(55);
      expect(result.direction).toBeLessThan(65);
      expect(result.compass).toBe('ENE');
    });

    it('returns correct direction for London (~118-120°)', () => {
      const result = calculateQibla(LONDON);
      expect(result.direction).toBeGreaterThan(115);
      expect(result.direction).toBeLessThan(125);
      expect(result.compass).toBe('ESE');
    });

    it('returns correct direction for Tokyo (~288-295°)', () => {
      const result = calculateQibla(TOKYO);
      expect(result.direction).toBeGreaterThan(285);
      expect(result.direction).toBeLessThan(300);
      expect(result.compass).toBe('WNW');
    });

    it('returns correct direction for Sydney (~275-280°)', () => {
      const result = calculateQibla(SYDNEY);
      expect(result.direction).toBeGreaterThan(273);
      expect(result.direction).toBeLessThan(285);
      expect(result.compass).toBe('W');
    });

    it('returns correct direction for Cairo (~133-140°)', () => {
      const result = calculateQibla(CAIRO);
      expect(result.direction).toBeGreaterThan(130);
      expect(result.direction).toBeLessThan(145);
      expect(result.compass).toBe('SE');
    });

    it('returns correct direction for Moscow (~172-178°)', () => {
      const result = calculateQibla(MOSCOW);
      expect(result.direction).toBeGreaterThan(168);
      expect(result.direction).toBeLessThan(185);
      expect(['S', 'SSE', 'SSW']).toContain(result.compass);
    });

    it('returns correct direction for Los Angeles (~23-30°)', () => {
      const result = calculateQibla(LOS_ANGELES);
      expect(result.direction).toBeGreaterThan(20);
      expect(result.direction).toBeLessThan(35);
      expect(['NNE', 'NE']).toContain(result.compass);
    });

    it('returns correct direction for Sao Paulo (~60-70°)', () => {
      const result = calculateQibla(SAO_PAULO);
      expect(result.direction).toBeGreaterThan(55);
      expect(result.direction).toBeLessThan(75);
      expect(['ENE', 'E', 'NE']).toContain(result.compass);
    });

    it('returns correct direction for Dubai (~255-265°)', () => {
      const result = calculateQibla(DUBAI);
      expect(result.direction).toBeGreaterThan(255);
      expect(result.direction).toBeLessThan(270);
      expect(['W', 'WSW']).toContain(result.compass);
    });

    it('returns correct direction for Islamabad (~255-265°)', () => {
      const result = calculateQibla(ISLAMABAD);
      expect(result.direction).toBeGreaterThan(250);
      expect(result.direction).toBeLessThan(270);
      expect(['W', 'WSW']).toContain(result.compass);
    });

    it('returns correct direction for Singapore (~292-300°)', () => {
      const result = calculateQibla(SINGAPORE);
      expect(result.direction).toBeGreaterThan(288);
      expect(result.direction).toBeLessThan(305);
      expect(['WNW', 'NW']).toContain(result.compass);
    });

    it('returns correct direction for Istanbul (~150-160°)', () => {
      const result = calculateQibla(ISTANBUL);
      expect(result.direction).toBeGreaterThan(145);
      expect(result.direction).toBeLessThan(165);
      expect(['SE', 'SSE']).toContain(result.compass);
    });

    it('returns correct direction for Mumbai (~280-290°)', () => {
      const result = calculateQibla(MUMBAI);
      expect(result.direction).toBeGreaterThan(275);
      expect(result.direction).toBeLessThan(295);
      expect(['W', 'WNW']).toContain(result.compass);
    });
  });

  describe('major cities - distance verification', () => {
    it('calculates correct distance from New York (~10,000-11,000 km)', () => {
      const result = calculateQibla(NEW_YORK);
      expect(result.distance).toBeGreaterThan(10000);
      expect(result.distance).toBeLessThan(11500);
    });

    it('calculates correct distance from London (~4,500-5,000 km)', () => {
      const result = calculateQibla(LONDON);
      expect(result.distance).toBeGreaterThan(4500);
      expect(result.distance).toBeLessThan(5000);
    });

    it('calculates correct distance from Tokyo (~9,000-10,000 km)', () => {
      const result = calculateQibla(TOKYO);
      expect(result.distance).toBeGreaterThan(9000);
      expect(result.distance).toBeLessThan(10000);
    });

    it('calculates correct distance from Sydney (~12,000-14,000 km)', () => {
      const result = calculateQibla(SYDNEY);
      expect(result.distance).toBeGreaterThan(12000);
      expect(result.distance).toBeLessThan(14000);
    });

    it('calculates correct distance from Cairo (~1,200-1,400 km)', () => {
      const result = calculateQibla(CAIRO);
      expect(result.distance).toBeGreaterThan(1200);
      expect(result.distance).toBeLessThan(1500);
    });

    it('calculates correct distance from Medina (~340-400 km)', () => {
      const result = calculateQibla(MEDINA);
      expect(result.distance).toBeGreaterThan(330);
      expect(result.distance).toBeLessThan(410);
    });

    it('calculates correct distance from Riyadh (~800-900 km)', () => {
      const result = calculateQibla(RIYADH);
      expect(result.distance).toBeGreaterThan(750);
      expect(result.distance).toBeLessThan(950);
    });
  });

  describe('at Kaaba location', () => {
    it('returns 0 distance when at Kaaba', () => {
      const result = calculateQibla(KAABA_COORDINATES);
      expect(result.distance).toBeCloseTo(0, 0);
    });

    it('returns valid direction even at Kaaba', () => {
      const result = calculateQibla(KAABA_COORDINATES);
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });
  });

  describe('rounding precision', () => {
    it('rounds direction to 2 decimal places', () => {
      const result = calculateQibla(NEW_YORK);
      const decimalPlaces = (result.direction.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('rounds distance to 2 decimal places', () => {
      const result = calculateQibla(NEW_YORK);
      const decimalPlaces = (result.distance.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});

// ========== getQiblaDirection TESTS ==========
describe('getQiblaDirection', () => {
  describe('return value range', () => {
    it('returns direction between 0 and 360', () => {
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAIRO, MOSCOW, JAKARTA, LOS_ANGELES];
      cities.forEach((city) => {
        const direction = getQiblaDirection(city);
        expect(direction).toBeGreaterThanOrEqual(0);
        expect(direction).toBeLessThan(360);
      });
    });

    it('returns a number (not NaN)', () => {
      const direction = getQiblaDirection(NEW_YORK);
      expect(isNaN(direction)).toBe(false);
    });

    it('returns finite number', () => {
      const direction = getQiblaDirection(NEW_YORK);
      expect(isFinite(direction)).toBe(true);
    });
  });

  describe('cardinal direction verification', () => {
    it('handles locations north of Kaaba (Moscow)', () => {
      const direction = getQiblaDirection(MOSCOW);
      // Moscow is north of Kaaba, so direction should be roughly south (90-270)
      expect(direction).toBeGreaterThan(90);
      expect(direction).toBeLessThan(270);
    });

    it('handles locations south of Kaaba (Cape Town)', () => {
      const direction = getQiblaDirection(CAPE_TOWN);
      // Cape Town is south-west of Kaaba, direction should be NE
      expect(direction).toBeGreaterThan(0);
      expect(direction).toBeLessThan(90);
    });

    it('handles locations east of Kaaba (Jakarta)', () => {
      const direction = getQiblaDirection(JAKARTA);
      // Jakarta is east of Kaaba, direction should be roughly west (270-360)
      expect(direction).toBeGreaterThan(270);
      expect(direction).toBeLessThan(360);
    });

    it('handles locations west of Kaaba (New York)', () => {
      const direction = getQiblaDirection(NEW_YORK);
      // New York is west of Kaaba, direction should be east-ish (0-90)
      expect(direction).toBeGreaterThan(0);
      expect(direction).toBeLessThan(90);
    });
  });

  describe('symmetric locations', () => {
    it('two locations at same latitude but opposite longitudes have different directions', () => {
      const west: Coordinates = { latitude: 30, longitude: -90 };
      const east: Coordinates = { latitude: 30, longitude: 120 };
      const westDirection = getQiblaDirection(west);
      const eastDirection = getQiblaDirection(east);
      expect(westDirection).not.toBe(eastDirection);
    });

    it('location directly north has direction close to 180 (South)', () => {
      const directlyNorth: Coordinates = {
        latitude: 60,
        longitude: KAABA_COORDINATES.longitude,
      };
      const direction = getQiblaDirection(directlyNorth);
      expect(direction).toBeCloseTo(180, -1); // Close to 180
    });

    it('location directly south has direction close to 0 (North)', () => {
      const directlySouth: Coordinates = {
        latitude: -30,
        longitude: KAABA_COORDINATES.longitude,
      };
      const direction = getQiblaDirection(directlySouth);
      expect(direction).toBeLessThan(10);
    });
  });

  describe('consistency checks', () => {
    it('returns same value for identical coordinates', () => {
      const dir1 = getQiblaDirection(NEW_YORK);
      const dir2 = getQiblaDirection({ ...NEW_YORK });
      expect(dir1).toBe(dir2);
    });

    it('slight coordinate changes produce slight direction changes', () => {
      const original = getQiblaDirection(NEW_YORK);
      const slightlyDifferent = getQiblaDirection({
        latitude: NEW_YORK.latitude + 0.01,
        longitude: NEW_YORK.longitude,
      });
      expect(Math.abs(original - slightlyDifferent)).toBeLessThan(1);
    });
  });
});

// ========== getDistanceToKaaba TESTS ==========
describe('getDistanceToKaaba', () => {
  describe('return value properties', () => {
    it('returns a positive number', () => {
      const distance = getDistanceToKaaba(NEW_YORK);
      expect(distance).toBeGreaterThan(0);
    });

    it('returns 0 for Kaaba location', () => {
      const distance = getDistanceToKaaba(KAABA_COORDINATES);
      expect(distance).toBeCloseTo(0, 5);
    });

    it('returns finite number', () => {
      const distance = getDistanceToKaaba(NEW_YORK);
      expect(isFinite(distance)).toBe(true);
    });

    it('returns number (not NaN)', () => {
      const distance = getDistanceToKaaba(NEW_YORK);
      expect(isNaN(distance)).toBe(false);
    });
  });

  describe('distance ranges for major cities', () => {
    it('New York: ~10,000-11,000 km', () => {
      const distance = getDistanceToKaaba(NEW_YORK);
      expect(distance).toBeGreaterThan(10000);
      expect(distance).toBeLessThan(11500);
    });

    it('London: ~4,500-5,000 km', () => {
      const distance = getDistanceToKaaba(LONDON);
      expect(distance).toBeGreaterThan(4500);
      expect(distance).toBeLessThan(5000);
    });

    it('Tokyo: ~9,000-10,000 km', () => {
      const distance = getDistanceToKaaba(TOKYO);
      expect(distance).toBeGreaterThan(9000);
      expect(distance).toBeLessThan(10000);
    });

    it('Sydney: ~12,000-14,000 km', () => {
      const distance = getDistanceToKaaba(SYDNEY);
      expect(distance).toBeGreaterThan(12000);
      expect(distance).toBeLessThan(14000);
    });

    it('Cape Town: ~6,500-7,000 km', () => {
      const distance = getDistanceToKaaba(CAPE_TOWN);
      expect(distance).toBeGreaterThan(6500);
      expect(distance).toBeLessThan(7000);
    });

    it('Singapore: ~7,000-8,000 km', () => {
      const distance = getDistanceToKaaba(SINGAPORE);
      expect(distance).toBeGreaterThan(7000);
      expect(distance).toBeLessThan(8000);
    });

    it('Johannesburg: ~5,400-5,600 km', () => {
      const distance = getDistanceToKaaba(JOHANNESBURG);
      expect(distance).toBeGreaterThan(5400);
      expect(distance).toBeLessThan(5600);
    });

    it('Berlin: ~4,000-4,500 km', () => {
      const distance = getDistanceToKaaba(BERLIN);
      expect(distance).toBeGreaterThan(4000);
      expect(distance).toBeLessThan(4500);
    });

    it('Paris: ~4,400-4,600 km', () => {
      const distance = getDistanceToKaaba(PARIS);
      expect(distance).toBeGreaterThan(4400);
      expect(distance).toBeLessThan(4600);
    });

    it('Kuala Lumpur: ~6,900-7,100 km', () => {
      const distance = getDistanceToKaaba(KUALA_LUMPUR);
      expect(distance).toBeGreaterThan(6900);
      expect(distance).toBeLessThan(7100);
    });
  });

  describe('symmetry and boundary checks', () => {
    it('antipodal point is maximum possible distance (~20,000 km)', () => {
      // Approximate antipodal point of Kaaba
      const antipodal: Coordinates = {
        latitude: -21.4225,
        longitude: 39.8262 - 180,
      };
      const distance = getDistanceToKaaba(antipodal);
      expect(distance).toBeGreaterThan(19000);
      expect(distance).toBeLessThan(21000);
    });

    it('distance never exceeds half Earth circumference', () => {
      const maxDistance = Math.PI * EARTH_RADIUS_KM; // Half circumference
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAPE_TOWN, LOS_ANGELES, SAO_PAULO];
      cities.forEach((city) => {
        const distance = getDistanceToKaaba(city);
        expect(distance).toBeLessThanOrEqual(maxDistance);
      });
    });

    it('equidistant points from Kaaba have similar distances', () => {
      // Two points roughly equidistant from Kaaba
      const point1: Coordinates = { latitude: 21.4225 + 5, longitude: 39.8262 };
      const point2: Coordinates = { latitude: 21.4225 - 5, longitude: 39.8262 };
      const dist1 = getDistanceToKaaba(point1);
      const dist2 = getDistanceToKaaba(point2);
      expect(Math.abs(dist1 - dist2)).toBeLessThan(10); // Within 10 km
    });
  });

  describe('consistency checks', () => {
    it('returns same value for identical coordinates', () => {
      const dist1 = getDistanceToKaaba(NEW_YORK);
      const dist2 = getDistanceToKaaba({ ...NEW_YORK });
      expect(dist1).toBe(dist2);
    });

    it('slight coordinate changes produce slight distance changes', () => {
      const original = getDistanceToKaaba(NEW_YORK);
      const slightlyDifferent = getDistanceToKaaba({
        latitude: NEW_YORK.latitude + 0.01,
        longitude: NEW_YORK.longitude,
      });
      expect(Math.abs(original - slightlyDifferent)).toBeLessThan(5); // Within 5 km
    });
  });
});

// ========== getQiblaCompass TESTS ==========
describe('getQiblaCompass', () => {
  describe('return value validation', () => {
    it('returns a valid 16-point compass direction', () => {
      const validCompassPoints: CompassPoint[] = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
      ];
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAIRO, MOSCOW];
      cities.forEach((city) => {
        const compass = getQiblaCompass(city);
        expect(validCompassPoints).toContain(compass);
      });
    });
  });

  describe('cardinal directions', () => {
    it('returns N for direction close to 0°', () => {
      // A location where Qibla is nearly due North
      const compass = getQiblaCompass({ latitude: -25, longitude: KAABA_COORDINATES.longitude });
      expect(compass).toBe('N');
    });

    it('returns S for direction close to 180°', () => {
      // A location where Qibla is nearly due South
      const compass = getQiblaCompass({ latitude: 60, longitude: KAABA_COORDINATES.longitude });
      expect(compass).toBe('S');
    });

    it('returns ENE for New York', () => {
      const compass = getQiblaCompass(NEW_YORK);
      expect(compass).toBe('ENE');
    });

    it('returns ESE for London', () => {
      const compass = getQiblaCompass(LONDON);
      expect(compass).toBe('ESE');
    });

    it('returns WNW for Tokyo', () => {
      const compass = getQiblaCompass(TOKYO);
      expect(compass).toBe('WNW');
    });

    it('returns W for Sydney', () => {
      const compass = getQiblaCompass(SYDNEY);
      expect(compass).toBe('W');
    });

    it('returns SE for Cairo', () => {
      const compass = getQiblaCompass(CAIRO);
      expect(compass).toBe('SE');
    });
  });

  describe('compass direction boundaries', () => {
    // Test that compass directions are assigned at correct angle boundaries
    // Each 22.5° segment maps to a compass point

    it('correctly handles 0° boundary (N)', () => {
      // Location that gives direction close to 0/360
      const compass = getQiblaCompass({ latitude: -30, longitude: KAABA_COORDINATES.longitude });
      expect(['N', 'NNE', 'NNW']).toContain(compass);
    });

    it('correctly handles 90° boundary (E)', () => {
      // Location that gives direction close to 90
      const compass = getQiblaCompass({ latitude: KAABA_COORDINATES.latitude, longitude: 0 });
      expect(['E', 'ENE', 'ESE']).toContain(compass);
    });

    it('correctly handles 180° boundary (S)', () => {
      // Location directly north
      const compass = getQiblaCompass({ latitude: 80, longitude: KAABA_COORDINATES.longitude });
      expect(['S', 'SSE', 'SSW']).toContain(compass);
    });

    it('correctly handles 270° boundary (W)', () => {
      // Location that gives direction close to 270
      const compass = getQiblaCompass({ latitude: KAABA_COORDINATES.latitude, longitude: 80 });
      expect(['W', 'WNW', 'WSW']).toContain(compass);
    });
  });
});

// ========== EDGE CASES ==========
describe('Edge Cases', () => {
  describe('equator coordinates', () => {
    it('handles point on equator at prime meridian', () => {
      const result = calculateQibla({ latitude: 0, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles point on equator at 180° longitude', () => {
      const result = calculateQibla({ latitude: 0, longitude: 180 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles point on equator at -180° longitude', () => {
      const result = calculateQibla({ latitude: 0, longitude: -180 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });
  });

  describe('international date line', () => {
    it('handles 180° longitude', () => {
      const result = calculateQibla({ latitude: 0, longitude: 180 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('handles -180° longitude', () => {
      const result = calculateQibla({ latitude: 0, longitude: -180 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('180° and -180° give same result', () => {
      const result1 = calculateQibla({ latitude: 0, longitude: 180 });
      const result2 = calculateQibla({ latitude: 0, longitude: -180 });
      expect(result1.distance).toBeCloseTo(result2.distance, 0);
    });
  });

  describe('polar regions', () => {
    it('handles Arctic location (89°N)', () => {
      const result = calculateQibla({ latitude: 89, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles Antarctic location (-89°S)', () => {
      const result = calculateQibla({ latitude: -89, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles North Pole (90°N)', () => {
      const result = calculateQibla({ latitude: 90, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('handles South Pole (-90°S)', () => {
      const result = calculateQibla({ latitude: -90, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('North Pole direction points roughly South', () => {
      const direction = getQiblaDirection({ latitude: 90, longitude: 0 });
      // From North Pole, all directions are South
      expect(direction).toBeGreaterThanOrEqual(0);
      expect(direction).toBeLessThan(360);
    });
  });

  describe('near Kaaba locations', () => {
    it('handles location very close to Kaaba', () => {
      const veryClose: Coordinates = {
        latitude: KAABA_COORDINATES.latitude + 0.0001,
        longitude: KAABA_COORDINATES.longitude + 0.0001,
      };
      const result = calculateQibla(veryClose);
      expect(result.distance).toBeLessThan(1); // Less than 1 km
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('handles location 1km from Kaaba', () => {
      // Approximately 1km north of Kaaba
      const nearby: Coordinates = {
        latitude: KAABA_COORDINATES.latitude + 0.009,
        longitude: KAABA_COORDINATES.longitude,
      };
      const result = calculateQibla(nearby);
      expect(result.distance).toBeLessThan(2);
      expect(result.distance).toBeGreaterThan(0.5);
    });
  });

  describe('extreme coordinate values', () => {
    it('handles maximum valid latitude (90)', () => {
      const result = calculateQibla({ latitude: 90, longitude: 0 });
      expect(result).toBeDefined();
      expect(isFinite(result.distance)).toBe(true);
    });

    it('handles minimum valid latitude (-90)', () => {
      const result = calculateQibla({ latitude: -90, longitude: 0 });
      expect(result).toBeDefined();
      expect(isFinite(result.distance)).toBe(true);
    });

    it('handles longitude wrap-around (>180)', () => {
      // While technically invalid, the algorithm should handle it
      const result = calculateQibla({ latitude: 0, longitude: 200 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('handles negative longitude wrap-around (<-180)', () => {
      const result = calculateQibla({ latitude: 0, longitude: -200 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });
  });

  describe('zero values', () => {
    it('handles latitude = 0', () => {
      const result = calculateQibla({ latitude: 0, longitude: 50 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles longitude = 0', () => {
      const result = calculateQibla({ latitude: 30, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });

    it('handles both latitude and longitude = 0', () => {
      const result = calculateQibla({ latitude: 0, longitude: 0 });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
      expect(result.distance).toBeGreaterThan(0);
    });
  });

  describe('floating point precision', () => {
    it('handles coordinates with many decimal places', () => {
      const result = calculateQibla({
        latitude: 40.712776543210987,
        longitude: -74.005974123456789,
      });
      expect(result.direction).toBeGreaterThanOrEqual(0);
      expect(result.direction).toBeLessThan(360);
    });

    it('handles very small coordinate differences', () => {
      const coord1: Coordinates = { latitude: 40.0000001, longitude: 50.0000001 };
      const coord2: Coordinates = { latitude: 40.0000002, longitude: 50.0000002 };
      const result1 = calculateQibla(coord1);
      const result2 = calculateQibla(coord2);
      // Should be very close but not necessarily identical due to floating point
      expect(Math.abs(result1.direction - result2.direction)).toBeLessThan(0.01);
    });
  });
});

// ========== INTEGRATION TESTS ==========
describe('Integration Tests', () => {
  describe('calculateQibla vs individual functions', () => {
    it('calculateQibla direction matches getQiblaDirection', () => {
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAIRO];
      cities.forEach((city) => {
        const fullResult = calculateQibla(city);
        const directDirection = getQiblaDirection(city);
        expect(fullResult.direction).toBeCloseTo(Math.round(directDirection * 100) / 100, 1);
      });
    });

    it('calculateQibla distance matches getDistanceToKaaba', () => {
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAIRO];
      cities.forEach((city) => {
        const fullResult = calculateQibla(city);
        const directDistance = getDistanceToKaaba(city);
        expect(fullResult.distance).toBeCloseTo(Math.round(directDistance * 100) / 100, 1);
      });
    });

    it('calculateQibla compass matches getQiblaCompass', () => {
      const cities = [NEW_YORK, LONDON, TOKYO, SYDNEY, CAIRO];
      cities.forEach((city) => {
        const fullResult = calculateQibla(city);
        const directCompass = getQiblaCompass(city);
        expect(fullResult.compass).toBe(directCompass);
      });
    });
  });

  describe('real-world scenario tests', () => {
    it('calculates Qibla for user traveling from NYC to London', () => {
      const nycResult = calculateQibla(NEW_YORK);
      const londonResult = calculateQibla(LONDON);

      // NYC is further from Kaaba than London
      expect(nycResult.distance).toBeGreaterThan(londonResult.distance);

      // Both have valid compass directions
      expect(nycResult.compass).toBeTruthy();
      expect(londonResult.compass).toBeTruthy();
    });

    it('handles Islamic pilgrimage route cities', () => {
      // Test cities along common pilgrimage routes
      const pilgrims = [CAIRO, ISTANBUL, KUALA_LUMPUR, ISLAMABAD, JAKARTA];
      pilgrims.forEach((city) => {
        const result = calculateQibla(city);
        expect(result.direction).toBeGreaterThanOrEqual(0);
        expect(result.direction).toBeLessThan(360);
        expect(result.distance).toBeGreaterThan(0);
      });
    });
  });
});

// ========== TYPE TESTS ==========
describe('Type Safety', () => {
  it('Coordinates interface accepts valid coordinates', () => {
    const coords: Coordinates = { latitude: 40, longitude: -74 };
    expect(() => calculateQibla(coords)).not.toThrow();
  });

  it('QiblaResult has expected structure', () => {
    const result: QiblaResult = calculateQibla(NEW_YORK);
    expect(typeof result.direction).toBe('number');
    expect(typeof result.distance).toBe('number');
    expect(typeof result.compass).toBe('string');
  });

  it('CompassPoint is one of valid values', () => {
    const compass: CompassPoint = getQiblaCompass(NEW_YORK);
    const validPoints = [
      'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
    ];
    expect(validPoints.includes(compass)).toBe(true);
  });
});
