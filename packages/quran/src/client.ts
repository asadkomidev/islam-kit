import type {
  QuranData,
  RecitersData,
  Surah,
  SurahMeta,
  Ayah,
  Reciter,
  QuranClientConfig,
  SearchOptions,
  SearchResult,
} from './types';

/**
 * QuranClient - Main class for querying Quran data
 *
 * @example
 * ```typescript
 * import { createQuranClient } from '@islam-kit/quran';
 * import { quranData, recitersData } from '@islam-kit/quran/data';
 *
 * const quran = createQuranClient({ quran: quranData, reciters: recitersData });
 *
 * const surah = quran.getSurah(1);
 * const reciters = quran.getReciters();
 * ```
 */
export class QuranClient {
  private quranData: QuranData;
  private recitersData: RecitersData | null;
  private surahsMap: Map<number, Surah>;
  private recitersMap: Map<string, Reciter>;

  constructor(config: QuranClientConfig) {
    this.quranData = config.quran;
    this.recitersData = config.reciters ?? null;

    // Build lookup maps
    this.surahsMap = new Map(this.quranData.surahs.map((s) => [s.number, s]));
    this.recitersMap = new Map(
      this.recitersData?.reciters.map((r) => [r.id, r]) ?? []
    );
  }

  // ========== SURAH METHODS ==========

  /**
   * Get all surahs metadata (without ayahs)
   */
  getSurahs(): SurahMeta[] {
    return this.quranData.surahs.map(
      ({ number, name, nameTransliterated, nameTranslated, numberOfAyahs, revelationType }) => ({
        number,
        name,
        nameTransliterated,
        nameTranslated,
        numberOfAyahs,
        revelationType,
      })
    );
  }

  /**
   * Get a specific surah by number (with ayahs)
   */
  getSurah(number: number): Surah | undefined {
    return this.surahsMap.get(number);
  }

  /**
   * Get surah by name (Arabic or transliterated)
   */
  getSurahByName(name: string): Surah | undefined {
    const normalizedName = name.toLowerCase();
    return this.quranData.surahs.find(
      (s) =>
        s.name === name ||
        s.nameTransliterated.toLowerCase() === normalizedName ||
        s.nameTransliterated.toLowerCase().replace(/-/g, ' ') === normalizedName
    );
  }

  /**
   * Get all Meccan surahs
   */
  getMeccanSurahs(): SurahMeta[] {
    return this.getSurahs().filter((s) => s.revelationType === 'meccan');
  }

  /**
   * Get all Medinan surahs
   */
  getMedinanSurahs(): SurahMeta[] {
    return this.getSurahs().filter((s) => s.revelationType === 'medinan');
  }

  /**
   * Get full text of a surah (pre-concatenated)
   */
  getSurahFullText(surahNumber: number): string | undefined {
    return this.surahsMap.get(surahNumber)?.fullText;
  }

  // ========== AYAH METHODS ==========

  /**
   * Get a specific ayah
   */
  getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
    const surah = this.surahsMap.get(surahNumber);
    return surah?.ayahs.find((a) => a.number === ayahNumber);
  }

  /**
   * Get a range of ayahs from a surah
   */
  getAyahRange(surahNumber: number, start: number, end: number): Ayah[] {
    const surah = this.surahsMap.get(surahNumber);
    if (!surah) return [];
    return surah.ayahs.filter((a) => a.number >= start && a.number <= end);
  }

  /**
   * Get English translation for an ayah
   */
  getTranslation(surahNumber: number, ayahNumber: number, lang: 'en' = 'en'): string | undefined {
    const ayah = this.getAyah(surahNumber, ayahNumber);
    return ayah?.translations[lang];
  }

  /**
   * Get a random ayah
   */
  getRandomAyah(): { surah: number; ayah: Ayah } | undefined {
    const surahs = this.quranData.surahs;
    if (surahs.length === 0) return undefined;

    const surahIndex = Math.floor(Math.random() * surahs.length);
    const surah = surahs[surahIndex];
    if (!surah || surah.ayahs.length === 0) return undefined;

    const ayahIndex = Math.floor(Math.random() * surah.ayahs.length);
    const ayah = surah.ayahs[ayahIndex];
    if (!ayah) return undefined;

    return { surah: surah.number, ayah };
  }

  // ========== SEARCH METHODS ==========

  /**
   * Search Arabic text
   */
  search(query: string, options?: SearchOptions): SearchResult[] {
    const results: SearchResult[] = [];
    const limit = options?.limit ?? 100;
    const caseSensitive = options?.caseSensitive ?? false;

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    for (const surah of this.quranData.surahs) {
      for (const ayah of surah.ayahs) {
        const text = caseSensitive ? ayah.text : ayah.text.toLowerCase();

        if (text.includes(searchQuery)) {
          results.push({
            surah: surah.number,
            ayah: ayah.number,
            text: ayah.text,
            matchedText: query,
          });

          if (results.length >= limit) {
            return results;
          }
        }
      }
    }

    return results;
  }

  /**
   * Search English translations
   */
  searchTranslation(query: string, options?: SearchOptions): SearchResult[] {
    const results: SearchResult[] = [];
    const limit = options?.limit ?? 100;
    const caseSensitive = options?.caseSensitive ?? false;

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    for (const surah of this.quranData.surahs) {
      for (const ayah of surah.ayahs) {
        const translation = ayah.translations.en;
        const text = caseSensitive ? translation : translation.toLowerCase();

        if (text.includes(searchQuery)) {
          results.push({
            surah: surah.number,
            ayah: ayah.number,
            text: translation,
            matchedText: query,
          });

          if (results.length >= limit) {
            return results;
          }
        }
      }
    }

    return results;
  }

  // ========== RECITER METHODS ==========

  /**
   * Get all reciters
   */
  getReciters(): Reciter[] {
    return this.recitersData?.reciters ?? [];
  }

  /**
   * Get a specific reciter by ID
   */
  getReciter(id: string): Reciter | undefined {
    return this.recitersMap.get(id);
  }

  /**
   * Get all surahs available for a reciter
   */
  getReciterSurahs(reciterId: string): SurahMeta[] {
    const reciter = this.recitersMap.get(reciterId);
    if (!reciter) return [];

    return reciter.surahs
      .map((num) => {
        const surah = this.surahsMap.get(num);
        if (!surah) return null;
        return {
          number: surah.number,
          name: surah.name,
          nameTransliterated: surah.nameTransliterated,
          nameTranslated: surah.nameTranslated,
          numberOfAyahs: surah.numberOfAyahs,
          revelationType: surah.revelationType,
        };
      })
      .filter((s): s is SurahMeta => s !== null);
  }

  /**
   * Check if a reciter has a specific surah
   */
  reciterHasSurah(reciterId: string, surahNumber: number): boolean {
    const reciter = this.recitersMap.get(reciterId);
    return reciter?.surahs.includes(surahNumber) ?? false;
  }

  /**
   * Get audio URL for a surah from a reciter
   */
  getAudioUrl(reciterId: string, surahNumber: number): string | undefined {
    const reciter = this.recitersMap.get(reciterId);
    if (!reciter || !reciter.surahs.includes(surahNumber)) {
      return undefined;
    }

    const paddedSurah = String(surahNumber).padStart(3, '0');
    return `${reciter.audioBaseUrl}/${reciter.urlName}/${paddedSurah}.${reciter.audioFormat}`;
  }

  // ========== UTILITY METHODS ==========

  /**
   * Get total number of surahs
   */
  getTotalSurahs(): number {
    return this.quranData.metadata.totalSurahs;
  }

  /**
   * Get total number of ayahs
   */
  getTotalAyahs(): number {
    return this.quranData.metadata.totalAyahs;
  }

  /**
   * Get Quran metadata
   */
  getMetadata(): QuranData['metadata'] {
    return this.quranData.metadata;
  }
}

/**
 * Create a QuranClient instance
 *
 * @example
 * ```typescript
 * import { createQuranClient } from '@islam-kit/quran';
 * import { quranData, recitersData } from '@islam-kit/quran/data';
 *
 * const quran = createQuranClient({ quran: quranData, reciters: recitersData });
 * ```
 */
export function createQuranClient(config: QuranClientConfig): QuranClient {
  return new QuranClient(config);
}
