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
Data is NOT bundled in npm package to keep it small (~7KB). Users fetch from CDN:
```typescript
import { createQuranClient, DATA_URLS } from '@islam-kit/quran';

const [quranData, recitersData] = await Promise.all([
  fetch(DATA_URLS.quran).then(r => r.json()),
  fetch(DATA_URLS.reciters).then(r => r.json()),
]);

const quran = createQuranClient({ quran: quranData, reciters: recitersData });
```

### Bundle Size Limits
Enforced via size-limit in root package.json:
- qibla: 1KB
- prayer-times: 5KB
- quran: 2KB (utilities only)

## Test Coverage

All packages have comprehensive test suites using vitest:

### @islam-kit/qibla Tests (108 tests)
- `packages/qibla/tests/qibla.test.ts`
- Constants (KAABA_COORDINATES, EARTH_RADIUS_KM)
- Direction calculations for 20+ cities worldwide
- Distance calculations with accuracy verification
- Compass point conversions (16-point)
- Edge cases: poles, equator, date line, near Kaaba
- Type safety tests

### @islam-kit/prayer-times Tests (129 tests)
- `packages/prayer-times/tests/calculator.test.ts`
- All 14 calculation methods (MWL, ISNA, EGYPT, MAKKAH, etc.)
- PrayerTimesCalculator class and functional API
- Asr methods (Standard vs Hanafi)
- High latitude methods (ANGLE_BASED, MIDDLE_OF_NIGHT, ONE_SEVENTH)
- Time formatting (12h/24h, locale support)
- Seasonal variations and edge cases
- Location tests (Northern/Southern hemisphere, equator)

### @islam-kit/quran Tests (149 tests)
- `packages/quran/tests/client.test.ts` - QuranClient API
- `packages/quran/tests/types.test.ts` - Type definitions
- `packages/quran/tests/integration.test.ts` - Real data integration
- Surah/Ayah retrieval and search
- Reciter management and audio URLs
- Meccan/Medinan filtering
- Search (Arabic text and English translations)
- Edge cases and performance tests

## Key Design Constraints

1. **Zero dependencies** - All packages must have no runtime dependencies
2. **Universal compatibility** - No DOM APIs, no Node-specific APIs (fs, path)
3. **Dual API** - Functional exports for tree-shaking, class exports for stateful use
4. **ESM-first** - `"type": "module"` with CJS fallback via tsup

## Agent Coordination Rules

This section defines how agents in `.claude/agents/` work together without conflicts.

### Agent Categories

| Category | Agents | Exclusive Scope |
|----------|--------|-----------------|
| **Domain Experts** | `prayer-times-domain`, `qibla-domain-expert`, `quran-data-api` | ONE package each |
| **Quality Gates** | `typescript-standards`, `testing-validator`, `dx-advocate`, `bundle-optimizer` | Cross-cutting reviews |
| **Infrastructure** | `monorepo-architect`, `release-versioning`, `dependency-updater` | Repo structure, publishing & dependencies |
| **Documentation** | `docs-architect`, `open-source-steward` | Tech docs vs community docs |
| **Code Quality** | `polish-refactor` | Internal refactoring only |
| **Design** | `design-system-analyzer`, `ui-ux-reviewer` | Design analysis & docs site UI/UX |

### Conflict Resolution Rules

#### 1. Domain Expert Exclusivity
Each domain expert owns ONE package exclusively:
- `prayer-times-domain` → ONLY `packages/prayer-times`
- `qibla-domain-expert` → ONLY `packages/qibla`
- `quran-data-api` → ONLY `packages/quran`

**Rule**: Never invoke two domain experts for the same task.

#### 2. Documentation Split
- `docs-architect` → Technical docs in `apps/docs/content/`
- `open-source-steward` → README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, Islamic content accuracy

**Rule**: If both needed, `open-source-steward` reviews AFTER `docs-architect` writes.

#### 3. API Review Chain (Sequential)
- `typescript-standards` → Type safety, .d.ts quality
- `dx-advocate` → Naming, ergonomics, error messages

**Rule**: Run `typescript-standards` first, then `dx-advocate`.

#### 4. Testing Ownership
- Domain experts CAN write tests for their package
- `testing-validator` VALIDATES and reviews test coverage

**Rule**: `testing-validator` has veto power on test quality.

#### 5. Bundle Size Authority
- `bundle-optimizer` has final say on size-related decisions

**Rule**: Can block features exceeding limits (qibla: 1KB, prayer-times: 5KB, quran: 2KB).

### Workflow Pipelines

#### Feature Development Pipeline
```
┌─────────────────┐
│  Domain Expert  │  ← Implements feature (one of three)
└────────┬────────┘
         ▼
┌─────────────────┐     ┌─────────────────────┐
│testing-validator│ ──► │typescript-standards │  ← Can run in parallel
└────────┬────────┘     └──────────┬──────────┘
         └───────────┬─────────────┘
                     ▼
              ┌─────────────┐
              │ dx-advocate │  ← Reviews API ergonomics
              └──────┬──────┘
                     ▼
            ┌────────────────┐
            │bundle-optimizer│  ← Verifies size limits
            └───────┬────────┘
                    ▼
             ┌─────────────┐
             │docs-architect│  ← Updates documentation
             └─────────────┘
```

#### Refactoring Pipeline
```
┌────────────────┐
│ polish-refactor│  ← Internal refactoring only
└───────┬────────┘
        ▼
┌─────────────────┐     ┌────────────────┐
│testing-validator│ ──► │bundle-optimizer│  ← Parallel verification
└─────────────────┘     └────────────────┘
```

#### Release Pipeline
```
┌─────────────────┐
│testing-validator│  ← Pre-release quality gate
└────────┬────────┘
         ▼
┌────────────────┐
│bundle-optimizer│  ← Verify size limits
└───────┬────────┘
        ▼
┌──────────────────┐
│release-versioning│  ← Version bump, changelog
└──────────────────┘
```

#### New Package Pipeline
```
┌──────────────────┐
│monorepo-architect│  ← Sets up package structure
└────────┬─────────┘
         ▼
┌─────────────────┐
│  Domain Expert  │  ← Implements business logic
└────────┬────────┘
         ▼
  [Feature Pipeline]
         ▼
┌────────────────────┐
│ open-source-steward│  ← README, CONTRIBUTING
└────────────────────┘
```

#### Documentation Pipeline
```
┌─────────────┐
│docs-architect│  ← Creates/updates technical docs
└──────┬──────┘
       ▼
┌────────────────────┐
│ open-source-steward│  ← Reviews Islamic content accuracy
└────────────────────┘
```

### Agent Compatibility Matrix

| Agent | Can Run PARALLEL With | Must Run AFTER |
|-------|----------------------|----------------|
| prayer-times-domain | - | - |
| qibla-domain-expert | - | - |
| quran-data-api | - | - |
| testing-validator | typescript-standards | domain experts |
| typescript-standards | testing-validator | domain experts |
| dx-advocate | - | typescript-standards |
| bundle-optimizer | - | dx-advocate |
| docs-architect | - | bundle-optimizer |
| open-source-steward | - | docs-architect |
| polish-refactor | - | - |
| monorepo-architect | - | - |
| release-versioning | - | bundle-optimizer, testing-validator |
| dependency-updater | testing-validator, bundle-optimizer | - |
| design-system-analyzer | - | - (standalone, before ui-ux-reviewer) |
| ui-ux-reviewer | - | design-system-analyzer (if redesigning) |

### Forbidden Combinations

Never invoke together:
- Two domain experts (prayer-times + qibla + quran)
- `polish-refactor` + any domain expert
- `release-versioning` + domain experts (release only after features complete)

### Quick Reference

| Task | Primary Agent | Supporting Agents |
|------|--------------|-------------------|
| Add prayer time feature | `prayer-times-domain` | testing-validator, typescript-standards, bundle-optimizer |
| Add Qibla feature | `qibla-domain-expert` | testing-validator, typescript-standards, bundle-optimizer |
| Add Quran feature | `quran-data-api` | testing-validator, typescript-standards, bundle-optimizer |
| Refactor code | `polish-refactor` | testing-validator |
| Create new package | `monorepo-architect` | domain expert, open-source-steward |
| Prepare release | `release-versioning` | testing-validator, bundle-optimizer |
| Write technical docs | `docs-architect` | open-source-steward |
| Update README | `open-source-steward` | - |
| Review API design | `dx-advocate` | typescript-standards |
| Check bundle size | `bundle-optimizer` | - |
| Update dependencies | `dependency-updater` | testing-validator, bundle-optimizer |
| Analyze design system | `design-system-analyzer` | ui-ux-reviewer |
| Review docs site UI | `ui-ux-reviewer` | design-system-analyzer |
