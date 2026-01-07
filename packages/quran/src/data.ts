/**
 * Bundled Quran and Reciters data
 *
 * Import from '@islam-kit/quran/data' to include the JSON data in your bundle.
 * For smaller bundles, import data separately and pass to createQuranClient.
 *
 * @packageDocumentation
 */

import quranJson from '../data/quran.json';
import recitersJson from '../data/reciters.json';
import type { QuranData, RecitersData } from './types';

/**
 * Pre-bundled Quran data (114 surahs, 6236 ayahs with English translations)
 */
export const quranData: QuranData = quranJson as QuranData;

/**
 * Pre-bundled reciters data (10 popular reciters with audio URLs)
 */
export const recitersData: RecitersData = recitersJson as RecitersData;
