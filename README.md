# islam-kit

A collection of Islamic utility libraries for JavaScript/TypeScript.

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [@islam-kit/prayer-times](./packages/prayer-times) | Calculate Islamic prayer times | ~5KB |
| [@islam-kit/qibla](./packages/qibla) | Calculate Qibla direction | ~1KB |
| [@islam-kit/quran](./packages/quran) | Query Quran data and reciters | ~2KB |

## Features

- Zero runtime dependencies
- TypeScript-first with full type safety
- Tree-shakeable ESM + CommonJS
- Works everywhere: Node.js, Browser, React, React Native/Expo

## Quick Start

```bash
npm install @islam-kit/prayer-times @islam-kit/qibla @islam-kit/quran
```

```typescript
import { getPrayerTimes } from '@islam-kit/prayer-times';
import { getQiblaDirection } from '@islam-kit/qibla';

const coords = { latitude: 40.7128, longitude: -74.006 };

// Get prayer times
const times = getPrayerTimes(new Date(), coords);
console.log(times.fajr); // Date object

// Get Qibla direction
const qibla = getQiblaDirection(coords);
console.log(qibla); // 58.48 degrees
```

## Documentation

Visit [islam-kit.vercel.app](https://islam-kit.vercel.app) for full documentation.

## License

MIT
