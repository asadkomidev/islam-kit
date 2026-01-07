/**
 * @islam-kit/quran
 *
 * Quran utilities for querying surahs, ayahs, and reciters.
 * Zero dependencies, works in Node.js, Browser, React Native, and Edge runtimes.
 *
 * Data is NOT bundled to keep package size small (~2KB).
 * Fetch data from CDN or provide your own.
 *
 * @example
 * ```typescript
 * import { createQuranClient, DATA_URLS } from '@islam-kit/quran';
 *
 * // Fetch data from CDN
 * const [quranData, recitersData] = await Promise.all([
 *   fetch(DATA_URLS.quran).then(r => r.json()),
 *   fetch(DATA_URLS.reciters).then(r => r.json()),
 * ]);
 *
 * const quran = createQuranClient({ quran: quranData, reciters: recitersData });
 *
 * // Query surahs
 * const surahs = quran.getSurahs();
 * const fatiha = quran.getSurah(1);
 *
 * // Query reciters
 * const reciters = quran.getReciters();
 * const audioUrl = quran.getAudioUrl('afs', 1);
 * ```
 *
 * @packageDocumentation
 */

/**
 * CDN URLs for Quran and Reciters data
 */
export const DATA_URLS = {
  quran: 'https://raw.githubusercontent.com/asadkomidev/islam-kit/main/packages/quran/data/quran.json',
  reciters: 'https://raw.githubusercontent.com/asadkomidev/islam-kit/main/packages/quran/data/reciters.json',
} as const;

// Main class and factory
export { QuranClient, createQuranClient } from './client';

// Types
export type {
  QuranData,
  QuranMetadata,
  RecitersData,
  Surah,
  SurahMeta,
  Ayah,
  Reciter,
  QuranClientConfig,
  SearchOptions,
  SearchResult,
} from './types';
