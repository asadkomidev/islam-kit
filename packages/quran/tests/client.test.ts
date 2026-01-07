import { describe, it, expect, beforeEach } from 'vitest';
import { QuranClient, createQuranClient } from '../src/client';
import { testQuranData, testRecitersData } from './fixtures/test-data';

describe('QuranClient', () => {
  let client: QuranClient;

  beforeEach(() => {
    client = createQuranClient({
      quran: testQuranData,
      reciters: testRecitersData,
    });
  });

  describe('createQuranClient', () => {
    it('creates a QuranClient instance', () => {
      const quran = createQuranClient({ quran: testQuranData });
      expect(quran).toBeInstanceOf(QuranClient);
    });

    it('works without reciters data', () => {
      const quran = createQuranClient({ quran: testQuranData });
      expect(quran.getReciters()).toEqual([]);
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
  });

  describe('getSurah', () => {
    it('returns a surah by number with ayahs', () => {
      const surah = client.getSurah(1);
      expect(surah).toBeDefined();
      expect(surah?.number).toBe(1);
      expect(surah?.name).toBe('الفاتحة');
      expect(surah?.ayahs).toHaveLength(7);
    });

    it('returns undefined for non-existent surah', () => {
      const surah = client.getSurah(999);
      expect(surah).toBeUndefined();
    });

    it('returns undefined for surah 0', () => {
      const surah = client.getSurah(0);
      expect(surah).toBeUndefined();
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

    it('finds surah by transliterated name with spaces instead of hyphens', () => {
      const surah = client.getSurahByName('al fatiha');
      expect(surah?.number).toBe(1);
    });

    it('returns undefined for non-existent name', () => {
      const surah = client.getSurahByName('Unknown Surah');
      expect(surah).toBeUndefined();
    });
  });

  describe('getMeccanSurahs', () => {
    it('returns only Meccan surahs', () => {
      const meccan = client.getMeccanSurahs();
      expect(meccan).toHaveLength(2);
      expect(meccan.every((s) => s.revelationType === 'meccan')).toBe(true);
      expect(meccan.map((s) => s.number)).toEqual([1, 114]);
    });
  });

  describe('getMedinanSurahs', () => {
    it('returns only Medinan surahs', () => {
      const medinan = client.getMedinanSurahs();
      expect(medinan).toHaveLength(1);
      expect(medinan[0]?.revelationType).toBe('medinan');
      expect(medinan[0]?.number).toBe(2);
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
  });

  // ========== AYAH METHODS ==========

  describe('getAyah', () => {
    it('returns a specific ayah', () => {
      const ayah = client.getAyah(1, 1);
      expect(ayah).toBeDefined();
      expect(ayah?.number).toBe(1);
      expect(ayah?.text).toBe('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ');
    });

    it('returns undefined for non-existent surah', () => {
      const ayah = client.getAyah(999, 1);
      expect(ayah).toBeUndefined();
    });

    it('returns undefined for non-existent ayah', () => {
      const ayah = client.getAyah(1, 100);
      expect(ayah).toBeUndefined();
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

    it('returns empty for invalid range', () => {
      const ayahs = client.getAyahRange(1, 10, 5);
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

    it('returns undefined for non-existent reciter', () => {
      const url = client.getAudioUrl('unknown', 1);
      expect(url).toBeUndefined();
    });

    it('returns undefined if reciter does not have surah', () => {
      const url = client.getAudioUrl('basit', 114);
      expect(url).toBeUndefined();
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
  });
});
