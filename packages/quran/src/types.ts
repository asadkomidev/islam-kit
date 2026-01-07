/**
 * Quran data structure (matches quran.json)
 */
export interface QuranData {
  metadata: QuranMetadata;
  surahs: Surah[];
}

/**
 * Quran metadata
 */
export interface QuranMetadata {
  version: string;
  lastUpdated: string;
  totalSurahs: number;
  totalAyahs: number;
}

/**
 * Surah (chapter) data
 */
export interface Surah {
  /** Surah number (1-114) */
  number: number;
  /** Arabic name */
  name: string;
  /** Transliterated name (e.g., "Al-Fatiha") */
  nameTransliterated: string;
  /** Translated name */
  nameTranslated: { en: string };
  /** Number of ayahs */
  numberOfAyahs: number;
  /** Revelation type */
  revelationType: 'meccan' | 'medinan';
  /** Full text of surah (concatenated) */
  fullText: string;
  /** Array of ayahs */
  ayahs: Ayah[];
}

/**
 * Surah metadata (without ayahs, for listing)
 */
export interface SurahMeta {
  number: number;
  name: string;
  nameTransliterated: string;
  nameTranslated: { en: string };
  numberOfAyahs: number;
  revelationType: 'meccan' | 'medinan';
}

/**
 * Ayah (verse) data
 */
export interface Ayah {
  /** Ayah number within surah */
  number: number;
  /** Arabic text */
  text: string;
  /** Translations */
  translations: { en: string };
}

/**
 * Reciters data structure (matches reciters.json)
 */
export interface RecitersData {
  reciters: Reciter[];
}

/**
 * Reciter data
 */
export interface Reciter {
  /** Unique identifier */
  id: string;
  /** English name */
  name: string;
  /** Arabic name */
  nameArabic: string;
  /** Audio format */
  audioFormat: string;
  /** Base URL for audio files */
  audioBaseUrl: string;
  /** Language */
  language: string;
  /** URL name segment */
  urlName: string;
  /** Available surah numbers */
  surahs: number[];
}

/**
 * Search options
 */
export interface SearchOptions {
  /** Maximum number of results */
  limit?: number;
  /** Case sensitive search */
  caseSensitive?: boolean;
}

/**
 * Search result
 */
export interface SearchResult {
  /** Surah number */
  surah: number;
  /** Ayah number */
  ayah: number;
  /** Full text */
  text: string;
  /** Matched portion */
  matchedText: string;
}

/**
 * Configuration for QuranClient
 */
export interface QuranClientConfig {
  quran: QuranData;
  reciters?: RecitersData;
}
