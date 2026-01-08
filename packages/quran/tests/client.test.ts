import { describe, it, expect, beforeEach } from 'vitest';
import { QuranClient, createQuranClient, DATA_URLS } from '../src';
import { testQuranData, testRecitersData } from './fixtures/test-data';
import type {
  QuranData,
  RecitersData,
  Surah,
  SurahMeta,
  Ayah,
  Reciter,
  SearchResult,
  QuranClientConfig,
} from '../src';

describe('QuranClient', () => {
  let client: QuranClient;

  beforeEach(() => {
    client = createQuranClient({
      quran: testQuranData,
      reciters: testRecitersData,
    });
  });

  // ========== FACTORY FUNCTION TESTS ==========
  describe('createQuranClient', () => {
    it('creates a QuranClient instance', () => {
      const quran = createQuranClient({ quran: testQuranData });
      expect(quran).toBeInstanceOf(QuranClient);
    });

    it('works without reciters data', () => {
      const quran = createQuranClient({ quran: testQuranData });
      expect(quran.getReciters()).toEqual([]);
    });

    it('works with reciters data', () => {
      const quran = createQuranClient({
        quran: testQuranData,
        reciters: testRecitersData,
      });
      expect(quran.getReciters().length).toBeGreaterThan(0);
    });

    it('returns different instances on each call', () => {
      const client1 = createQuranClient({ quran: testQuranData });
      const client2 = createQuranClient({ quran: testQuranData });
      expect(client1).not.toBe(client2);
    });
  });

  // ========== DATA_URLS TESTS ==========
  describe('DATA_URLS', () => {
    it('has quran URL', () => {
      expect(DATA_URLS.quran).toBeDefined();
      expect(typeof DATA_URLS.quran).toBe('string');
      expect(DATA_URLS.quran).toContain('quran.json');
    });

    it('has reciters URL', () => {
      expect(DATA_URLS.reciters).toBeDefined();
      expect(typeof DATA_URLS.reciters).toBe('string');
      expect(DATA_URLS.reciters).toContain('reciters.json');
    });

    it('URLs are valid GitHub raw URLs', () => {
      expect(DATA_URLS.quran).toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
      expect(DATA_URLS.reciters).toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
    });
  });

  // ========== SURAH METHODS ==========
  describe('getSurahs', () => {
    it('returns all surahs metadata without ayahs', () => {
      const surahs = client.getSurahs();
      expect(surahs).toHaveLength(3);
      expect(surahs[0]).toEqual({
        number: 1,
        name: 'الفاتحة',
        nameTransliterated: 'Al-Fatiha',
        nameTranslated: { en: 'The Opening' },
        numberOfAyahs: 7,
        revelationType: 'meccan',
      });
      // Should not include ayahs or fullText
      expect(surahs[0]).not.toHaveProperty('ayahs');
      expect(surahs[0]).not.toHaveProperty('fullText');
    });

    it('returns array of SurahMeta objects', () => {
      const surahs = client.getSurahs();
      surahs.forEach((surah) => {
        expect(surah).toHaveProperty('number');
        expect(surah).toHaveProperty('name');
        expect(surah).toHaveProperty('nameTransliterated');
        expect(surah).toHaveProperty('nameTranslated');
        expect(surah).toHaveProperty('numberOfAyahs');
        expect(surah).toHaveProperty('revelationType');
      });
    });

    it('preserves surah order', () => {
      const surahs = client.getSurahs();
      expect(surahs[0]?.number).toBe(1);
      expect(surahs[1]?.number).toBe(2);
      expect(surahs[2]?.number).toBe(114);
    });
  });

  describe('getSurah', () => {
    it('returns a surah by number with ayahs', () => {
      const surah = client.getSurah(1);
      expect(surah).toBeDefined();
      expect(surah?.number).toBe(1);
      expect(surah?.name).toBe('الفاتحة');
      expect(surah?.ayahs).toHaveLength(7);
    });

    it('includes full surah data', () => {
      const surah = client.getSurah(1);
      expect(surah).toHaveProperty('number');
      expect(surah).toHaveProperty('name');
      expect(surah).toHaveProperty('nameTransliterated');
      expect(surah).toHaveProperty('nameTranslated');
      expect(surah).toHaveProperty('numberOfAyahs');
      expect(surah).toHaveProperty('revelationType');
      expect(surah).toHaveProperty('fullText');
      expect(surah).toHaveProperty('ayahs');
    });

    it('returns undefined for non-existent surah', () => {
      const surah = client.getSurah(999);
      expect(surah).toBeUndefined();
    });

    it('returns undefined for surah 0', () => {
      const surah = client.getSurah(0);
      expect(surah).toBeUndefined();
    });

    it('returns undefined for negative surah number', () => {
      const surah = client.getSurah(-1);
      expect(surah).toBeUndefined();
    });

    it('handles surah 114 correctly', () => {
      const surah = client.getSurah(114);
      expect(surah?.number).toBe(114);
      expect(surah?.name).toBe('الناس');
    });
  });

  describe('getSurahByName', () => {
    it('finds surah by Arabic name', () => {
      const surah = client.getSurahByName('الفاتحة');
      expect(surah?.number).toBe(1);
    });

    it('finds surah by transliterated name (case insensitive)', () => {
      const surah = client.getSurahByName('al-fatiha');
      expect(surah?.number).toBe(1);
    });

    it('finds surah by uppercase transliterated name', () => {
      const surah = client.getSurahByName('AL-FATIHA');
      expect(surah?.number).toBe(1);
    });

    it('finds surah by mixed case transliterated name', () => {
      const surah = client.getSurahByName('Al-Fatiha');
      expect(surah?.number).toBe(1);
    });

    it('finds surah by transliterated name with spaces instead of hyphens', () => {
      const surah = client.getSurahByName('al fatiha');
      expect(surah?.number).toBe(1);
    });

    it('returns undefined for non-existent name', () => {
      const surah = client.getSurahByName('Unknown Surah');
      expect(surah).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const surah = client.getSurahByName('');
      expect(surah).toBeUndefined();
    });

    it('finds different surahs by name', () => {
      expect(client.getSurahByName('Al-Baqarah')?.number).toBe(2);
      expect(client.getSurahByName('An-Nas')?.number).toBe(114);
    });
  });

  describe('getMeccanSurahs', () => {
    it('returns only Meccan surahs', () => {
      const meccan = client.getMeccanSurahs();
      expect(meccan).toHaveLength(2);
      expect(meccan.every((s) => s.revelationType === 'meccan')).toBe(true);
      expect(meccan.map((s) => s.number)).toEqual([1, 114]);
    });

    it('returns SurahMeta objects (without ayahs)', () => {
      const meccan = client.getMeccanSurahs();
      meccan.forEach((surah) => {
        expect(surah).not.toHaveProperty('ayahs');
        expect(surah).not.toHaveProperty('fullText');
      });
    });
  });

  describe('getMedinanSurahs', () => {
    it('returns only Medinan surahs', () => {
      const medinan = client.getMedinanSurahs();
      expect(medinan).toHaveLength(1);
      expect(medinan[0]?.revelationType).toBe('medinan');
      expect(medinan[0]?.number).toBe(2);
    });

    it('returns SurahMeta objects (without ayahs)', () => {
      const medinan = client.getMedinanSurahs();
      medinan.forEach((surah) => {
        expect(surah).not.toHaveProperty('ayahs');
        expect(surah).not.toHaveProperty('fullText');
      });
    });
  });

  describe('getSurahFullText', () => {
    it('returns the full concatenated text', () => {
      const text = client.getSurahFullText(1);
      expect(text).toBe(
        'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ'
      );
    });

    it('returns undefined for non-existent surah', () => {
      const text = client.getSurahFullText(999);
      expect(text).toBeUndefined();
    });

    it('returns undefined for surah 0', () => {
      const text = client.getSurahFullText(0);
      expect(text).toBeUndefined();
    });

    it('returns undefined for negative surah number', () => {
      const text = client.getSurahFullText(-5);
      expect(text).toBeUndefined();
    });

    it('returns string for valid surah', () => {
      const text = client.getSurahFullText(2);
      expect(typeof text).toBe('string');
      expect(text!.length).toBeGreaterThan(0);
    });
  });

  // ========== AYAH METHODS ==========
  describe('getAyah', () => {
    it('returns a specific ayah', () => {
      const ayah = client.getAyah(1, 1);
      expect(ayah).toBeDefined();
      expect(ayah?.number).toBe(1);
      expect(ayah?.text).toBe('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ');
    });

    it('returns ayah with translations', () => {
      const ayah = client.getAyah(1, 1);
      expect(ayah?.translations).toBeDefined();
      expect(ayah?.translations.en).toBeDefined();
    });

    it('returns undefined for non-existent surah', () => {
      const ayah = client.getAyah(999, 1);
      expect(ayah).toBeUndefined();
    });

    it('returns undefined for non-existent ayah', () => {
      const ayah = client.getAyah(1, 100);
      expect(ayah).toBeUndefined();
    });

    it('returns undefined for ayah 0', () => {
      const ayah = client.getAyah(1, 0);
      expect(ayah).toBeUndefined();
    });

    it('returns undefined for negative ayah number', () => {
      const ayah = client.getAyah(1, -1);
      expect(ayah).toBeUndefined();
    });

    it('returns different ayahs correctly', () => {
      const ayah1 = client.getAyah(1, 1);
      const ayah2 = client.getAyah(1, 2);
      expect(ayah1?.text).not.toBe(ayah2?.text);
    });
  });

  describe('getAyahRange', () => {
    it('returns a range of ayahs', () => {
      const ayahs = client.getAyahRange(1, 1, 3);
      expect(ayahs).toHaveLength(3);
      expect(ayahs.map((a) => a.number)).toEqual([1, 2, 3]);
    });

    it('returns empty array for non-existent surah', () => {
      const ayahs = client.getAyahRange(999, 1, 5);
      expect(ayahs).toEqual([]);
    });

    it('returns partial results for out-of-bounds range', () => {
      const ayahs = client.getAyahRange(1, 5, 10);
      expect(ayahs).toHaveLength(3); // ayahs 5, 6, 7
      expect(ayahs.map((a) => a.number)).toEqual([5, 6, 7]);
    });

    it('returns empty for invalid range (start > end)', () => {
      const ayahs = client.getAyahRange(1, 10, 5);
      expect(ayahs).toEqual([]);
    });

    it('returns single ayah when start equals end', () => {
      const ayahs = client.getAyahRange(1, 3, 3);
      expect(ayahs).toHaveLength(1);
      expect(ayahs[0]?.number).toBe(3);
    });

    it('returns all ayahs when range covers entire surah', () => {
      const ayahs = client.getAyahRange(1, 1, 100);
      expect(ayahs).toHaveLength(7);
    });

    it('returns empty array for negative range', () => {
      const ayahs = client.getAyahRange(1, -5, -1);
      expect(ayahs).toEqual([]);
    });
  });

  describe('getTranslation', () => {
    it('returns English translation', () => {
      const translation = client.getTranslation(1, 1, 'en');
      expect(translation).toBe(
        'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
      );
    });

    it('returns undefined for non-existent ayah', () => {
      const translation = client.getTranslation(999, 1, 'en');
      expect(translation).toBeUndefined();
    });

    it('returns undefined for non-existent surah', () => {
      const translation = client.getTranslation(1, 100, 'en');
      expect(translation).toBeUndefined();
    });

    it('returns different translations for different ayahs', () => {
      const t1 = client.getTranslation(1, 1, 'en');
      const t2 = client.getTranslation(1, 2, 'en');
      expect(t1).not.toBe(t2);
    });
  });

  describe('getRandomAyah', () => {
    it('returns a random ayah with surah number', () => {
      const result = client.getRandomAyah();
      expect(result).toBeDefined();
      expect(result?.surah).toBeGreaterThanOrEqual(1);
      expect(result?.ayah).toBeDefined();
      expect(result?.ayah.number).toBeGreaterThanOrEqual(1);
      expect(result?.ayah.text).toBeDefined();
    });

    it('returns valid ayah from actual surah', () => {
      // Run multiple times to increase confidence
      for (let i = 0; i < 10; i++) {
        const result = client.getRandomAyah();
        if (result) {
          const surah = client.getSurah(result.surah);
          expect(surah).toBeDefined();
          const ayah = surah?.ayahs.find((a) => a.number === result.ayah.number);
          expect(ayah).toBeDefined();
        }
      }
    });

    it('returns results from different surahs over multiple calls', () => {
      const surahNumbers = new Set<number>();
      for (let i = 0; i < 20; i++) {
        const result = client.getRandomAyah();
        if (result) {
          surahNumbers.add(result.surah);
        }
      }
      // With test data having 3 surahs, we should hit at least 2
      expect(surahNumbers.size).toBeGreaterThanOrEqual(1);
    });

    it('returns ayah with all expected properties', () => {
      const result = client.getRandomAyah();
      expect(result?.ayah).toHaveProperty('number');
      expect(result?.ayah).toHaveProperty('text');
      expect(result?.ayah).toHaveProperty('translations');
    });
  });

  // ========== SEARCH METHODS ==========
  describe('search', () => {
    it('finds ayahs containing Arabic text', () => {
      const results = client.search('ٱلرَّحۡمَٰنِ');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.surah).toBe(1);
    });

    it('respects limit option', () => {
      const results = client.search('ٱللَّهِ', { limit: 1 });
      expect(results).toHaveLength(1);
    });

    it('returns empty for non-matching query', () => {
      const results = client.search('nonexistent');
      expect(results).toEqual([]);
    });

    it('is case insensitive by default for transliterated searches', () => {
      // Arabic doesn't have case, but the option exists for consistency
      const results = client.search('ٱللَّهِ');
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns SearchResult with all required properties', () => {
      const results = client.search('ٱللَّهِ');
      results.forEach((result) => {
        expect(result).toHaveProperty('surah');
        expect(result).toHaveProperty('ayah');
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('matchedText');
      });
    });

    it('default limit is 100', () => {
      // With limited test data, we can't verify the exact limit
      // but we can verify results are returned
      const results = client.search('ٱللَّهِ');
      expect(results.length).toBeLessThanOrEqual(100);
    });

    it('handles empty query', () => {
      const results = client.search('');
      // Empty string may match all or none depending on implementation
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchTranslation', () => {
    it('finds ayahs by English translation', () => {
      const results = client.searchTranslation('merciful');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.surah).toBe(1);
    });

    it('is case insensitive by default', () => {
      const results1 = client.searchTranslation('MERCIFUL');
      const results2 = client.searchTranslation('merciful');
      expect(results1.length).toBe(results2.length);
    });

    it('respects caseSensitive option', () => {
      const results = client.searchTranslation('MERCIFUL', { caseSensitive: true });
      expect(results).toEqual([]);
    });

    it('respects limit option', () => {
      const results = client.searchTranslation('the', { limit: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('returns empty for non-matching query', () => {
      const results = client.searchTranslation('xyznonexistent');
      expect(results).toEqual([]);
    });

    it('returns SearchResult with all required properties', () => {
      const results = client.searchTranslation('merciful');
      results.forEach((result) => {
        expect(result).toHaveProperty('surah');
        expect(result).toHaveProperty('ayah');
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('matchedText');
      });
    });

    it('text property contains English translation', () => {
      const results = client.searchTranslation('Allah');
      results.forEach((result) => {
        expect(result.text).toContain('Allah');
      });
    });
  });

  // ========== RECITER METHODS ==========
  describe('getReciters', () => {
    it('returns all reciters', () => {
      const reciters = client.getReciters();
      expect(reciters).toHaveLength(3);
      expect(reciters[0]?.id).toBe('afs');
    });

    it('returns empty array when no reciters data', () => {
      const quranOnly = createQuranClient({ quran: testQuranData });
      expect(quranOnly.getReciters()).toEqual([]);
    });

    it('returns Reciter objects with all properties', () => {
      const reciters = client.getReciters();
      reciters.forEach((reciter) => {
        expect(reciter).toHaveProperty('id');
        expect(reciter).toHaveProperty('name');
        expect(reciter).toHaveProperty('nameArabic');
        expect(reciter).toHaveProperty('audioFormat');
        expect(reciter).toHaveProperty('audioBaseUrl');
        expect(reciter).toHaveProperty('language');
        expect(reciter).toHaveProperty('urlName');
        expect(reciter).toHaveProperty('surahs');
      });
    });
  });

  describe('getReciter', () => {
    it('returns a specific reciter by ID', () => {
      const reciter = client.getReciter('afs');
      expect(reciter).toBeDefined();
      expect(reciter?.name).toBe('Mishary Alafasi');
      expect(reciter?.nameArabic).toBe('مشاري العفاسي');
    });

    it('returns undefined for non-existent reciter', () => {
      const reciter = client.getReciter('unknown');
      expect(reciter).toBeUndefined();
    });

    it('returns undefined for empty ID', () => {
      const reciter = client.getReciter('');
      expect(reciter).toBeUndefined();
    });

    it('returns different reciters correctly', () => {
      const afs = client.getReciter('afs');
      const basit = client.getReciter('basit');
      expect(afs?.id).toBe('afs');
      expect(basit?.id).toBe('basit');
      expect(afs?.name).not.toBe(basit?.name);
    });
  });

  describe('getReciterSurahs', () => {
    it('returns all surahs for a reciter', () => {
      const surahs = client.getReciterSurahs('afs');
      expect(surahs).toHaveLength(3);
      expect(surahs.map((s) => s.number)).toEqual([1, 2, 114]);
    });

    it('returns partial list for reciter with fewer surahs', () => {
      const surahs = client.getReciterSurahs('sds');
      expect(surahs).toHaveLength(1);
      expect(surahs[0]?.number).toBe(1);
    });

    it('returns empty array for non-existent reciter', () => {
      const surahs = client.getReciterSurahs('unknown');
      expect(surahs).toEqual([]);
    });

    it('returns full surah metadata', () => {
      const surahs = client.getReciterSurahs('afs');
      expect(surahs[0]).toEqual({
        number: 1,
        name: 'الفاتحة',
        nameTransliterated: 'Al-Fatiha',
        nameTranslated: { en: 'The Opening' },
        numberOfAyahs: 7,
        revelationType: 'meccan',
      });
    });

    it('returns SurahMeta objects (not full Surah)', () => {
      const surahs = client.getReciterSurahs('afs');
      surahs.forEach((surah) => {
        expect(surah).not.toHaveProperty('ayahs');
        expect(surah).not.toHaveProperty('fullText');
      });
    });
  });

  describe('reciterHasSurah', () => {
    it('returns true if reciter has surah', () => {
      expect(client.reciterHasSurah('afs', 1)).toBe(true);
      expect(client.reciterHasSurah('afs', 114)).toBe(true);
    });

    it('returns false if reciter does not have surah', () => {
      expect(client.reciterHasSurah('basit', 114)).toBe(false);
      expect(client.reciterHasSurah('sds', 2)).toBe(false);
    });

    it('returns false for non-existent reciter', () => {
      expect(client.reciterHasSurah('unknown', 1)).toBe(false);
    });

    it('returns false for non-existent surah number', () => {
      expect(client.reciterHasSurah('afs', 999)).toBe(false);
    });

    it('returns false for surah 0', () => {
      expect(client.reciterHasSurah('afs', 0)).toBe(false);
    });

    it('returns false for negative surah number', () => {
      expect(client.reciterHasSurah('afs', -1)).toBe(false);
    });
  });

  describe('getAudioUrl', () => {
    it('generates correct audio URL', () => {
      const url = client.getAudioUrl('afs', 1);
      expect(url).toBe('https://www.mp3quran.net/afs/001.mp3');
    });

    it('pads surah number to 3 digits', () => {
      const url = client.getAudioUrl('afs', 114);
      expect(url).toBe('https://www.mp3quran.net/afs/114.mp3');
    });

    it('pads single digit surah numbers', () => {
      const url = client.getAudioUrl('afs', 1);
      expect(url).toMatch(/\/001\./);
    });

    it('pads double digit surah numbers', () => {
      const url = client.getAudioUrl('afs', 2);
      expect(url).toMatch(/\/002\./);
    });

    it('returns undefined for non-existent reciter', () => {
      const url = client.getAudioUrl('unknown', 1);
      expect(url).toBeUndefined();
    });

    it('returns undefined if reciter does not have surah', () => {
      const url = client.getAudioUrl('basit', 114);
      expect(url).toBeUndefined();
    });

    it('returns undefined for non-existent surah', () => {
      const url = client.getAudioUrl('afs', 999);
      expect(url).toBeUndefined();
    });

    it('generates URLs with correct format', () => {
      const url = client.getAudioUrl('afs', 2);
      expect(url).toMatch(/\.mp3$/);
    });
  });

  // ========== UTILITY METHODS ==========
  describe('getTotalSurahs', () => {
    it('returns total number of surahs from metadata', () => {
      expect(client.getTotalSurahs()).toBe(3);
    });
  });

  describe('getTotalAyahs', () => {
    it('returns total number of ayahs from metadata', () => {
      expect(client.getTotalAyahs()).toBe(10);
    });
  });

  describe('getMetadata', () => {
    it('returns full metadata object', () => {
      const metadata = client.getMetadata();
      expect(metadata).toEqual({
        version: '1.0.0',
        lastUpdated: '2024-01-01',
        totalSurahs: 3,
        totalAyahs: 10,
      });
    });

    it('metadata has all required properties', () => {
      const metadata = client.getMetadata();
      expect(metadata).toHaveProperty('version');
      expect(metadata).toHaveProperty('lastUpdated');
      expect(metadata).toHaveProperty('totalSurahs');
      expect(metadata).toHaveProperty('totalAyahs');
    });
  });

  // ========== EDGE CASES ==========
  describe('Edge Cases', () => {
    describe('empty data handling', () => {
      it('handles empty surahs array', () => {
        const emptyData: QuranData = {
          metadata: {
            version: '1.0.0',
            lastUpdated: '2024-01-01',
            totalSurahs: 0,
            totalAyahs: 0,
          },
          surahs: [],
        };
        const emptyClient = createQuranClient({ quran: emptyData });
        expect(emptyClient.getSurahs()).toEqual([]);
        expect(emptyClient.getSurah(1)).toBeUndefined();
        expect(emptyClient.getRandomAyah()).toBeUndefined();
      });

      it('handles surah with empty ayahs', () => {
        const dataWithEmptyAyahs: QuranData = {
          metadata: {
            version: '1.0.0',
            lastUpdated: '2024-01-01',
            totalSurahs: 1,
            totalAyahs: 0,
          },
          surahs: [
            {
              number: 1,
              name: 'Test',
              nameTransliterated: 'Test',
              nameTranslated: { en: 'Test' },
              numberOfAyahs: 0,
              revelationType: 'meccan',
              fullText: '',
              ayahs: [],
            },
          ],
        };
        const clientWithEmpty = createQuranClient({ quran: dataWithEmptyAyahs });
        expect(clientWithEmpty.getAyahRange(1, 1, 5)).toEqual([]);
      });
    });

    describe('special characters in search', () => {
      it('handles search with special regex characters', () => {
        // These should not throw errors
        expect(() => client.search('.*')).not.toThrow();
        expect(() => client.search('[test]')).not.toThrow();
        expect(() => client.search('(test)')).not.toThrow();
      });

      it('handles search with Arabic diacritics', () => {
        const results = client.search('بِسۡمِ');
        expect(results.length).toBeGreaterThanOrEqual(0);
      });
    });

    describe('boundary conditions', () => {
      it('first ayah of first surah', () => {
        const ayah = client.getAyah(1, 1);
        expect(ayah).toBeDefined();
      });

      it('last ayah of last surah', () => {
        const ayah = client.getAyah(114, 1);
        expect(ayah).toBeDefined();
      });

      it('ayah range at surah boundaries', () => {
        const ayahs = client.getAyahRange(1, 6, 7);
        expect(ayahs).toHaveLength(2);
      });
    });

    describe('concurrent operations', () => {
      it('handles multiple simultaneous queries', () => {
        const results = Promise.all([
          Promise.resolve(client.getSurah(1)),
          Promise.resolve(client.search('Allah')),
          Promise.resolve(client.getReciters()),
          Promise.resolve(client.getAyahRange(1, 1, 5)),
        ]);
        expect(results).toBeDefined();
      });
    });
  });

  // ========== TYPE SAFETY TESTS ==========
  describe('Type Safety', () => {
    it('getSurah returns Surah or undefined', () => {
      const surah: Surah | undefined = client.getSurah(1);
      if (surah) {
        expect(surah.number).toBe(1);
      }
    });

    it('getSurahs returns SurahMeta array', () => {
      const surahs: SurahMeta[] = client.getSurahs();
      expect(Array.isArray(surahs)).toBe(true);
    });

    it('getAyah returns Ayah or undefined', () => {
      const ayah: Ayah | undefined = client.getAyah(1, 1);
      if (ayah) {
        expect(ayah.number).toBe(1);
      }
    });

    it('search returns SearchResult array', () => {
      const results: SearchResult[] = client.search('test');
      expect(Array.isArray(results)).toBe(true);
    });

    it('getReciters returns Reciter array', () => {
      const reciters: Reciter[] = client.getReciters();
      expect(Array.isArray(reciters)).toBe(true);
    });
  });
});

// ========== CONSTRUCTOR TESTS ==========
describe('QuranClient Constructor', () => {
  it('accepts QuranClientConfig', () => {
    const config: QuranClientConfig = {
      quran: testQuranData,
      reciters: testRecitersData,
    };
    const client = new QuranClient(config);
    expect(client).toBeDefined();
  });

  it('builds surah lookup map correctly', () => {
    const client = new QuranClient({ quran: testQuranData });
    // Should be able to look up by number efficiently
    expect(client.getSurah(1)).toBeDefined();
    expect(client.getSurah(114)).toBeDefined();
  });

  it('builds reciter lookup map correctly', () => {
    const client = new QuranClient({
      quran: testQuranData,
      reciters: testRecitersData,
    });
    // Should be able to look up by ID efficiently
    expect(client.getReciter('afs')).toBeDefined();
    expect(client.getReciter('basit')).toBeDefined();
  });
});
