import { describe, it, expectTypeOf } from 'vitest';
import {
  QuranClient,
  createQuranClient,
  type QuranData,
  type RecitersData,
  type Surah,
  type SurahMeta,
  type Ayah,
  type Reciter,
  type SearchResult,
  type QuranClientConfig,
  type SearchOptions,
  type QuranMetadata,
} from '../src';

describe('Type definitions', () => {
  describe('QuranClient', () => {
    it('createQuranClient returns QuranClient', () => {
      expectTypeOf(createQuranClient).returns.toMatchTypeOf<QuranClient>();
    });

    it('getSurahs returns SurahMeta[]', () => {
      expectTypeOf<QuranClient['getSurahs']>().returns.toMatchTypeOf<SurahMeta[]>();
    });

    it('getSurah returns Surah | undefined', () => {
      expectTypeOf<QuranClient['getSurah']>().returns.toMatchTypeOf<Surah | undefined>();
    });

    it('getAyah returns Ayah | undefined', () => {
      expectTypeOf<QuranClient['getAyah']>().returns.toMatchTypeOf<Ayah | undefined>();
    });

    it('getReciters returns Reciter[]', () => {
      expectTypeOf<QuranClient['getReciters']>().returns.toMatchTypeOf<Reciter[]>();
    });

    it('search returns SearchResult[]', () => {
      expectTypeOf<QuranClient['search']>().returns.toMatchTypeOf<SearchResult[]>();
    });

    it('getMetadata returns QuranMetadata', () => {
      expectTypeOf<QuranClient['getMetadata']>().returns.toMatchTypeOf<QuranMetadata>();
    });
  });

  describe('Data types', () => {
    it('QuranData has correct structure', () => {
      expectTypeOf<QuranData>().toHaveProperty('metadata');
      expectTypeOf<QuranData>().toHaveProperty('surahs');
    });

    it('RecitersData has correct structure', () => {
      expectTypeOf<RecitersData>().toHaveProperty('reciters');
    });

    it('Surah has required properties', () => {
      expectTypeOf<Surah>().toHaveProperty('number');
      expectTypeOf<Surah>().toHaveProperty('name');
      expectTypeOf<Surah>().toHaveProperty('nameTransliterated');
      expectTypeOf<Surah>().toHaveProperty('ayahs');
      expectTypeOf<Surah>().toHaveProperty('revelationType');
    });

    it('Ayah has required properties', () => {
      expectTypeOf<Ayah>().toHaveProperty('number');
      expectTypeOf<Ayah>().toHaveProperty('text');
      expectTypeOf<Ayah>().toHaveProperty('translations');
    });

    it('Reciter has required properties', () => {
      expectTypeOf<Reciter>().toHaveProperty('id');
      expectTypeOf<Reciter>().toHaveProperty('name');
      expectTypeOf<Reciter>().toHaveProperty('nameArabic');
      expectTypeOf<Reciter>().toHaveProperty('audioBaseUrl');
      expectTypeOf<Reciter>().toHaveProperty('surahs');
    });

    it('SearchResult has required properties', () => {
      expectTypeOf<SearchResult>().toHaveProperty('surah');
      expectTypeOf<SearchResult>().toHaveProperty('ayah');
      expectTypeOf<SearchResult>().toHaveProperty('text');
      expectTypeOf<SearchResult>().toHaveProperty('matchedText');
    });
  });

  describe('Config types', () => {
    it('QuranClientConfig requires quran', () => {
      expectTypeOf<QuranClientConfig>().toHaveProperty('quran');
    });

    it('QuranClientConfig has optional reciters', () => {
      type RecitersProperty = QuranClientConfig['reciters'];
      expectTypeOf<RecitersProperty>().toMatchTypeOf<RecitersData | undefined>();
    });

    it('SearchOptions has optional properties', () => {
      type LimitProperty = SearchOptions['limit'];
      type CaseSensitiveProperty = SearchOptions['caseSensitive'];
      expectTypeOf<LimitProperty>().toMatchTypeOf<number | undefined>();
      expectTypeOf<CaseSensitiveProperty>().toMatchTypeOf<boolean | undefined>();
    });
  });
});
