import type { QuranData, RecitersData } from '../../src/types';

/**
 * Minimal test fixture for Quran data
 */
export const testQuranData: QuranData = {
  metadata: {
    version: '1.0.0',
    lastUpdated: '2024-01-01',
    totalSurahs: 3,
    totalAyahs: 10,
  },
  surahs: [
    {
      number: 1,
      name: 'الفاتحة',
      nameTransliterated: 'Al-Fatiha',
      nameTranslated: { en: 'The Opening' },
      numberOfAyahs: 7,
      revelationType: 'meccan',
      fullText:
        'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ',
      ayahs: [
        {
          number: 1,
          text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
          translations: { en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
        },
        {
          number: 2,
          text: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ',
          translations: { en: 'All praise is due to Allah, Lord of the worlds.' },
        },
        {
          number: 3,
          text: 'ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
          translations: { en: 'The Entirely Merciful, the Especially Merciful.' },
        },
        {
          number: 4,
          text: 'مَٰلِكِ يَوۡمِ ٱلدِّينِ',
          translations: { en: 'Sovereign of the Day of Recompense.' },
        },
        {
          number: 5,
          text: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ',
          translations: { en: 'It is You we worship and You we ask for help.' },
        },
        {
          number: 6,
          text: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ',
          translations: { en: 'Guide us to the straight path.' },
        },
        {
          number: 7,
          text: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ',
          translations: {
            en: 'The path of those upon whom You have bestowed favor, not of those who have earned anger or of those who are astray.',
          },
        },
      ],
    },
    {
      number: 2,
      name: 'البقرة',
      nameTransliterated: 'Al-Baqarah',
      nameTranslated: { en: 'The Cow' },
      numberOfAyahs: 2,
      revelationType: 'medinan',
      fullText: 'الٓمٓ ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ فِيهِۛ هُدٗى لِّلۡمُتَّقِينَ',
      ayahs: [
        {
          number: 1,
          text: 'الٓمٓ',
          translations: { en: 'Alif, Lam, Meem.' },
        },
        {
          number: 2,
          text: 'ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ فِيهِۛ هُدٗى لِّلۡمُتَّقِينَ',
          translations: {
            en: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
          },
        },
      ],
    },
    {
      number: 114,
      name: 'الناس',
      nameTransliterated: 'An-Nas',
      nameTranslated: { en: 'Mankind' },
      numberOfAyahs: 1,
      revelationType: 'meccan',
      fullText: 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
      ayahs: [
        {
          number: 1,
          text: 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
          translations: { en: 'Say, "I seek refuge in the Lord of mankind."' },
        },
      ],
    },
  ],
};

/**
 * Minimal test fixture for Reciters data
 */
export const testRecitersData: RecitersData = {
  reciters: [
    {
      id: 'afs',
      name: 'Mishary Alafasi',
      nameArabic: 'مشاري العفاسي',
      audioFormat: 'mp3',
      audioBaseUrl: 'https://www.mp3quran.net',
      language: 'ar',
      urlName: 'afs',
      surahs: [1, 2, 114],
    },
    {
      id: 'basit',
      name: 'Abdulbasit Abdulsamad',
      nameArabic: 'عبد الباسط عبد الصمد',
      audioFormat: 'mp3',
      audioBaseUrl: 'https://www.mp3quran.net',
      language: 'ar',
      urlName: 'basit',
      surahs: [1, 2],
    },
    {
      id: 'sds',
      name: 'Abdulrahman Alsudaes',
      nameArabic: 'عبد الرحمن السديس',
      audioFormat: 'mp3',
      audioBaseUrl: 'https://www.mp3quran.net',
      language: 'ar',
      urlName: 'sds',
      surahs: [1],
    },
  ],
};
