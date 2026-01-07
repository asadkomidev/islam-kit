# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Islam-kit is a Turborepo monorepo containing Islamic utility libraries for JavaScript/TypeScript. All packages have zero runtime dependencies and work universally (Node.js, Browser, React, React Native/Expo, Edge runtimes).

## Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm dev              # Watch mode for all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages

# Single package commands
pnpm --filter @islam-kit/qibla test           # Test specific package
pnpm --filter @islam-kit/prayer-times build   # Build specific package
pnpm --filter @islam-kit/docs dev             # Run docs dev server

# Run single test file
cd packages/qibla && pnpm vitest run tests/qibla.test.ts

# Releases
pnpm changeset        # Create changeset for version bump
pnpm version-packages # Apply changesets to update versions
pnpm release          # Build packages and publish to npm
```

## Architecture

### Workspace Structure
- `packages/qibla` - `@islam-kit/qibla`: Qibla direction calculator (~1KB)
- `packages/prayer-times` - `@islam-kit/prayer-times`: Prayer times calculator with 14 methods (~5KB)
- `packages/quran` - `@islam-kit/quran`: Quran data utilities (~2KB without data)
- `apps/docs` - Nextra documentation site

### Shared Configs
- `packages/typescript-config` - TypeScript configs (`base.json`, `library.json`, `nextjs.json`)
- `packages/eslint-config` - Shared ESLint configuration

### Package Build System
Each library package uses:
- **tsup** for building (ESM + CJS dual output)
- **vitest** for testing
- Exports both functional API (tree-shakeable) and class-based API

### Quran Package Data Strategy
The quran package uses subpath exports for optional data bundling:
```typescript
// Utilities only (~2KB)
import { createQuranClient } from '@islam-kit/quran';

// With bundled data (~800KB)
import { quranData, recitersData } from '@islam-kit/quran/data';
```

### Bundle Size Limits
Enforced via size-limit in root package.json:
- qibla: 1KB
- prayer-times: 5KB
- quran: 2KB (utilities only)

## Key Design Constraints

1. **Zero dependencies** - All packages must have no runtime dependencies
2. **Universal compatibility** - No DOM APIs, no Node-specific APIs (fs, path)
3. **Dual API** - Functional exports for tree-shaking, class exports for stateful use
4. **ESM-first** - `"type": "module"` with CJS fallback via tsup
