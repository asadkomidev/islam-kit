/**
 * @islam-kit/quran
 *
 * Quran utilities for querying surahs, ayahs, and reciters.
 * Zero dependencies, works in Node.js, Browser, React Native, and Edge runtimes.
 *
 * @example
 * ```typescript
 * // With bundled data
 * import { createQuranClient } from '@islam-kit/quran';
 * import { quranData, recitersData } from '@islam-kit/quran/data';
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
