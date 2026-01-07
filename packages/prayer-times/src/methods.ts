import type { CalculationMethod, CalculationMethodId } from './types';

/**
 * Pre-defined calculation methods from various Islamic organizations.
 *
 * Reference: https://aladhan.com/calculation-methods
 */
export const CALCULATION_METHODS: Record<CalculationMethodId, CalculationMethod> = {
  MWL: {
    id: 'MWL',
    name: 'Muslim World League',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
  ISNA: {
    id: 'ISNA',
    name: 'Islamic Society of North America',
    params: { fajrAngle: 15, ishaAngle: 15 },
  },
  EGYPT: {
    id: 'EGYPT',
    name: 'Egyptian General Authority of Survey',
    params: { fajrAngle: 19.5, ishaAngle: 17.5 },
  },
  MAKKAH: {
    id: 'MAKKAH',
    name: 'Umm Al-Qura University, Makkah',
    params: { fajrAngle: 18.5, ishaInterval: 90 },
  },
  KARACHI: {
    id: 'KARACHI',
    name: 'University of Islamic Sciences, Karachi',
    params: { fajrAngle: 18, ishaAngle: 18 },
  },
  TEHRAN: {
    id: 'TEHRAN',
    name: 'Institute of Geophysics, Tehran',
    params: { fajrAngle: 17.7, maghribAngle: 4.5, ishaAngle: 14 },
  },
  JAFARI: {
    id: 'JAFARI',
    name: 'Shia Ithna-Ashari, Leva Institute, Qum',
    params: { fajrAngle: 16, maghribAngle: 4, ishaAngle: 14 },
  },
  GULF: {
    id: 'GULF',
    name: 'Gulf Region',
    params: { fajrAngle: 19.5, ishaInterval: 90 },
  },
  KUWAIT: {
    id: 'KUWAIT',
    name: 'Kuwait',
    params: { fajrAngle: 18, ishaAngle: 17.5 },
  },
  QATAR: {
    id: 'QATAR',
    name: 'Qatar',
    params: { fajrAngle: 18, ishaInterval: 90 },
  },
  SINGAPORE: {
    id: 'SINGAPORE',
    name: 'Majlis Ugama Islam Singapura, Singapore',
    params: { fajrAngle: 20, ishaAngle: 18 },
  },
  TURKEY: {
    id: 'TURKEY',
    name: 'Diyanet İşleri Başkanlığı, Turkey',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
  DUBAI: {
    id: 'DUBAI',
    name: 'Dubai',
    params: { fajrAngle: 18.2, ishaAngle: 18.2 },
  },
  MOONSIGHTING: {
    id: 'MOONSIGHTING',
    name: 'Moonsighting Committee Worldwide',
    params: { fajrAngle: 18, ishaAngle: 18 },
  },
};

/**
 * Default calculation method
 */
export const DEFAULT_METHOD: CalculationMethodId = 'MWL';
