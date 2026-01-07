import { describe, it, expect } from 'vitest';
import {
  calculateQibla,
  getQiblaDirection,
  getDistanceToKaaba,
  getQiblaCompass,
  KAABA_COORDINATES,
} from '../src';

describe('calculateQibla', () => {
  it('returns correct direction for New York', () => {
    const result = calculateQibla({ latitude: 40.7128, longitude: -74.006 });
    // Direction should be roughly NE (~58-59 degrees)
    expect(result.direction).toBeGreaterThan(55);
    expect(result.direction).toBeLessThan(65);
    expect(result.compass).toBe('ENE');
  });

  it('returns correct direction for London', () => {
    const result = calculateQibla({ latitude: 51.5074, longitude: -0.1278 });
    // Direction should be roughly SE (~118-120 degrees)
    expect(result.direction).toBeGreaterThan(115);
    expect(result.direction).toBeLessThan(125);
    expect(result.compass).toBe('ESE');
  });

  it('returns correct direction for Tokyo', () => {
    const result = calculateQibla({ latitude: 35.6762, longitude: 139.6503 });
    // Direction should be roughly WNW (~288-295 degrees)
    expect(result.direction).toBeGreaterThan(285);
    expect(result.direction).toBeLessThan(300);
    expect(result.compass).toBe('WNW');
  });

  it('returns correct direction for Sydney', () => {
    const result = calculateQibla({ latitude: -33.8688, longitude: 151.2093 });
    // Direction should be roughly W (~275-280 degrees)
    expect(result.direction).toBeGreaterThan(273);
    expect(result.direction).toBeLessThan(285);
    expect(result.compass).toBe('W');
  });

  it('returns correct direction for Cairo', () => {
    const result = calculateQibla({ latitude: 30.0444, longitude: 31.2357 });
    // Direction should be roughly SE (~133-140 degrees)
    expect(result.direction).toBeGreaterThan(130);
    expect(result.direction).toBeLessThan(145);
    expect(result.compass).toBe('SE');
  });

  it('returns 0 distance when at Kaaba', () => {
    const result = calculateQibla(KAABA_COORDINATES);
    expect(result.distance).toBeCloseTo(0, 0);
  });
});

describe('getQiblaDirection', () => {
  it('returns direction in degrees from True North', () => {
    const direction = getQiblaDirection({ latitude: 40.7128, longitude: -74.006 });
    expect(direction).toBeGreaterThanOrEqual(0);
    expect(direction).toBeLessThan(360);
    // New York direction should be ~58-60 degrees
    expect(direction).toBeGreaterThan(55);
    expect(direction).toBeLessThan(65);
  });

  it('handles locations north of Kaaba', () => {
    // Moscow is north of Kaaba
    const direction = getQiblaDirection({ latitude: 55.7558, longitude: 37.6173 });
    expect(direction).toBeGreaterThan(90);
    expect(direction).toBeLessThan(270);
  });

  it('handles locations south of Kaaba', () => {
    // Cape Town is south of Kaaba
    const direction = getQiblaDirection({ latitude: -33.9249, longitude: 18.4241 });
    expect(direction).toBeGreaterThan(0);
    expect(direction).toBeLessThan(90);
  });

  it('handles locations east of Kaaba', () => {
    // Jakarta is east of Kaaba
    const direction = getQiblaDirection({ latitude: -6.2088, longitude: 106.8456 });
    expect(direction).toBeGreaterThan(270);
    expect(direction).toBeLessThan(360);
  });

  it('handles locations west of Kaaba', () => {
    // New York is west of Kaaba
    const direction = getQiblaDirection({ latitude: 40.7128, longitude: -74.006 });
    expect(direction).toBeGreaterThan(0);
    expect(direction).toBeLessThan(90);
  });
});

describe('getDistanceToKaaba', () => {
  it('returns distance in kilometers', () => {
    const distance = getDistanceToKaaba({ latitude: 40.7128, longitude: -74.006 });
    // New York to Kaaba is approximately 10,000-11,000 km
    expect(distance).toBeGreaterThan(10000);
    expect(distance).toBeLessThan(11000);
  });

  it('returns 0 for Kaaba location', () => {
    const distance = getDistanceToKaaba(KAABA_COORDINATES);
    expect(distance).toBeCloseTo(0, 5);
  });

  it('calculates correct distance from London', () => {
    const distance = getDistanceToKaaba({ latitude: 51.5074, longitude: -0.1278 });
    // London to Kaaba is approximately 4,500-5,000 km
    expect(distance).toBeGreaterThan(4500);
    expect(distance).toBeLessThan(5000);
  });

  it('calculates correct distance from Tokyo', () => {
    const distance = getDistanceToKaaba({ latitude: 35.6762, longitude: 139.6503 });
    // Tokyo to Kaaba is approximately 9,000-10,000 km
    expect(distance).toBeGreaterThan(9000);
    expect(distance).toBeLessThan(10000);
  });

  it('calculates correct distance from Sydney', () => {
    const distance = getDistanceToKaaba({ latitude: -33.8688, longitude: 151.2093 });
    // Sydney to Kaaba is approximately 12,000-14,000 km
    expect(distance).toBeGreaterThan(12000);
    expect(distance).toBeLessThan(14000);
  });
});

describe('getQiblaCompass', () => {
  it('returns correct compass point', () => {
    const compass = getQiblaCompass({ latitude: 40.7128, longitude: -74.006 });
    expect(compass).toBe('ENE');
  });

  it('returns N for direction close to 0', () => {
    // A location where Qibla is nearly due North
    const compass = getQiblaCompass({ latitude: -25, longitude: 39.8262 });
    expect(compass).toBe('N');
  });

  it('returns S for direction close to 180', () => {
    // A location where Qibla is nearly due South
    const compass = getQiblaCompass({ latitude: 60, longitude: 39.8262 });
    expect(compass).toBe('S');
  });
});

describe('edge cases', () => {
  it('handles equator coordinates', () => {
    const result = calculateQibla({ latitude: 0, longitude: 0 });
    expect(result.direction).toBeGreaterThanOrEqual(0);
    expect(result.direction).toBeLessThan(360);
    expect(result.distance).toBeGreaterThan(0);
  });

  it('handles international date line', () => {
    const result = calculateQibla({ latitude: 0, longitude: 180 });
    expect(result.direction).toBeGreaterThanOrEqual(0);
    expect(result.direction).toBeLessThan(360);
    expect(result.distance).toBeGreaterThan(0);
  });

  it('handles negative international date line', () => {
    const result = calculateQibla({ latitude: 0, longitude: -180 });
    expect(result.direction).toBeGreaterThanOrEqual(0);
    expect(result.direction).toBeLessThan(360);
  });

  it('handles Arctic location', () => {
    const result = calculateQibla({ latitude: 89, longitude: 0 });
    expect(result.direction).toBeGreaterThanOrEqual(0);
    expect(result.direction).toBeLessThan(360);
  });

  it('handles Antarctic location', () => {
    const result = calculateQibla({ latitude: -89, longitude: 0 });
    expect(result.direction).toBeGreaterThanOrEqual(0);
    expect(result.direction).toBeLessThan(360);
  });

  it('rounds direction to 2 decimal places', () => {
    const result = calculateQibla({ latitude: 40.7128, longitude: -74.006 });
    const decimalPlaces = (result.direction.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });

  it('rounds distance to 2 decimal places', () => {
    const result = calculateQibla({ latitude: 40.7128, longitude: -74.006 });
    const decimalPlaces = (result.distance.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});
