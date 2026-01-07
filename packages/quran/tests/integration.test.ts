import { describe, it, expect } from 'vitest';
import { createQuranClient } from '../src/client';
import { quranData, recitersData } from '../src/data';

/**
 * Integration tests using the actual bundled Quran and Reciters data
 */
describe('Integration with real data', () => {
  const client = createQuranClient({
    quran: quranData,
    reciters: recitersData,
  });

  describe('Quran data structure', () => {
    it('has 114 surahs', () => {
      const surahs = client.getSurahs();
      expect(surahs).toHaveLength(114);
    });

    it('has 6236 total ayahs', () => {
      expect(client.getTotalAyahs()).toBe(6236);
    });

    it('has correct surah 1 (Al-Fatiha)', () => {
      const surah = client.getSurah(1);
      expect(surah?.name).toBe('الفاتحة');
      expect(surah?.nameTransliterated).toBe('Al-Fatiha');
      expect(surah?.numberOfAyahs).toBe(7);
      expect(surah?.revelationType).toBe('meccan');
      expect(surah?.ayahs).toHaveLength(7);
    });

    it('has correct surah 114 (An-Nas)', () => {
      const surah = client.getSurah(114);
      expect(surah?.name).toBe('الناس');
      expect(surah?.nameTransliterated).toBe('An-Nas');
      expect(surah?.revelationType).toBe('meccan');
    });

    it('has correct surah 2 (Al-Baqarah) - longest surah', () => {
      const surah = client.getSurah(2);
      expect(surah?.name).toBe('البقرة');
      expect(surah?.numberOfAyahs).toBe(286);
      expect(surah?.revelationType).toBe('medinan');
    });
  });

  describe('Ayah al-Kursi (2:255)', () => {
    it('can retrieve Ayah al-Kursi', () => {
      const ayah = client.getAyah(2, 255);
      expect(ayah).toBeDefined();
      // Check the ayah contains "Allah" - the key identifier (different Unicode variants exist)
      expect(ayah?.text).toContain('ٱلل');
      // Should be a long verse
      expect(ayah?.text.length).toBeGreaterThan(100);
    });
  });

  describe('Revelation types', () => {
    it('categorizes surahs correctly', () => {
      const meccan = client.getMeccanSurahs();
      const medinan = client.getMedinanSurahs();

      expect(meccan.length + medinan.length).toBe(114);

      // Al-Fatiha is Meccan
      expect(meccan.find((s) => s.number === 1)).toBeDefined();

      // Al-Baqarah is Medinan
      expect(medinan.find((s) => s.number === 2)).toBeDefined();
    });
  });

  describe('Search functionality', () => {
    it('finds Arabic text in Quran using actual data', () => {
      // Get actual text from surah 1, ayah 1 to search for
      const firstAyah = client.getAyah(1, 1);
      expect(firstAyah).toBeDefined();

      // Search for a substring from the actual data
      const searchTerm = firstAyah!.text.substring(0, 10);
      const results = client.search(searchTerm, { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
      // Should find in Al-Fatiha
      expect(results.some((r) => r.surah === 1)).toBe(true);
    });

    it('finds "guidance" in English translations', () => {
      const results = client.searchTranslation('guidance', { limit: 10 });
      expect(results.length).toBeGreaterThan(0);
    });

    it('finds "straight path" in English translations', () => {
      const results = client.searchTranslation('straight path', { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
      // Should include Al-Fatiha verse 6
      expect(results.some((r) => r.surah === 1)).toBe(true);
    });
  });

  describe('Reciters', () => {
    it('has multiple reciters', () => {
      const reciters = client.getReciters();
      expect(reciters.length).toBeGreaterThan(0);
    });

    it('all reciters have required fields', () => {
      const reciters = client.getReciters();
      for (const reciter of reciters) {
        expect(reciter.id).toBeDefined();
        expect(reciter.name).toBeDefined();
        expect(reciter.nameArabic).toBeDefined();
        expect(reciter.audioFormat).toBeDefined();
        expect(reciter.audioBaseUrl).toBeDefined();
        expect(reciter.surahs).toBeDefined();
        expect(Array.isArray(reciter.surahs)).toBe(true);
      }
    });

    it('generates valid audio URLs', () => {
      const reciters = client.getReciters();
      if (reciters.length > 0) {
        const reciter = reciters[0];
        if (reciter && reciter.surahs.length > 0) {
          const url = client.getAudioUrl(reciter.id, reciter.surahs[0]!);
          expect(url).toBeDefined();
          expect(url).toMatch(/^https?:\/\/.+\.(mp3|ogg|wav)$/);
        }
      }
    });
  });

  describe('Edge cases', () => {
    it('handles surah lookup by various name formats', () => {
      // By Arabic
      expect(client.getSurahByName('الفاتحة')?.number).toBe(1);

      // By transliterated with hyphen
      expect(client.getSurahByName('Al-Fatiha')?.number).toBe(1);

      // Case insensitive
      expect(client.getSurahByName('al-fatiha')?.number).toBe(1);

      // With spaces instead of hyphens
      expect(client.getSurahByName('al fatiha')?.number).toBe(1);
    });

    it('returns correct ayah ranges', () => {
      // First 5 ayahs of Al-Baqarah
      const ayahs = client.getAyahRange(2, 1, 5);
      expect(ayahs).toHaveLength(5);
      expect(ayahs[0]?.number).toBe(1);
      expect(ayahs[4]?.number).toBe(5);
    });

    it('handles out-of-bounds ayah range gracefully', () => {
      // Surah 1 only has 7 ayahs
      const ayahs = client.getAyahRange(1, 1, 100);
      expect(ayahs).toHaveLength(7);
    });
  });

  describe('Performance', () => {
    it('builds lookup maps efficiently', () => {
      const start = performance.now();
      const newClient = createQuranClient({
        quran: quranData,
        reciters: recitersData,
      });
      const duration = performance.now() - start;

      // Should initialize in under 100ms
      expect(duration).toBeLessThan(100);

      // Verify it works
      expect(newClient.getSurah(1)).toBeDefined();
    });

    it('searches efficiently', () => {
      const start = performance.now();
      client.search('ٱللَّهِ', { limit: 100 });
      const duration = performance.now() - start;

      // Search should complete in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
