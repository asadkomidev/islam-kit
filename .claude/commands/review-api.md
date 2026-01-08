# Review API Design

Review API design for type safety, developer experience, and best practices.

**Target**: $ARGUMENTS

## Arguments

- `all` - Review all packages
- `qibla` - Review @islam-kit/qibla API
- `prayer-times` - Review @islam-kit/prayer-times API
- `quran` - Review @islam-kit/quran API
- `<file-path>` - Review specific file

If no argument provided, default to `all`.

## Workflow

Execute the following agent pipeline in order:

### Step 1: Type Safety Review (typescript-standards)

Use the `typescript-standards` agent to:

1. **Check Type Definitions**
   - All public functions have explicit return types
   - No implicit `any` types
   - Proper use of generics
   - Clean .d.ts output

2. **Validate Exports**
   - Named exports preferred over default
   - No internal types leaked to public API
   - Barrel exports don't break tree-shaking

3. **Check for Breaking Changes**
   - Compare against previous API surface
   - Flag removed or renamed exports
   - Identify signature changes

**Files to review**:
- `qibla`: packages/qibla/src/index.ts, packages/qibla/src/types.ts
- `prayer-times`: packages/prayer-times/src/index.ts, packages/prayer-times/src/types.ts
- `quran`: packages/quran/src/index.ts, packages/quran/src/types.ts

### Step 2: Developer Experience Review (dx-advocate)

Use the `dx-advocate` agent to:

1. **Naming Review**
   - Function names are clear and intuitive
   - Parameter names reveal intent
   - Consistent naming conventions

2. **Defaults Assessment**
   - Sensible defaults for common use cases
   - Zero-config experience where possible
   - Optional parameters are truly optional

3. **Error Message Quality**
   - Errors explain what went wrong
   - Errors suggest how to fix
   - Errors include relevant context

4. **Getting Started Experience**
   - Minimal code for basic use case
   - Copy-paste examples work
   - Import paths are intuitive

## Package API Locations

### @islam-kit/qibla
```
packages/qibla/src/
├── index.ts      # Main exports
├── qibla.ts      # Core calculations
└── types.ts      # Type definitions
```

### @islam-kit/prayer-times
```
packages/prayer-times/src/
├── index.ts      # Main exports
├── calculator.ts # PrayerTimesCalculator class
├── methods.ts    # Calculation methods
└── types.ts      # Type definitions
```

### @islam-kit/quran
```
packages/quran/src/
├── index.ts      # Main exports
├── client.ts     # QuranClient class
├── types.ts      # Type definitions
└── constants.ts  # DATA_URLS, etc.
```

## Output

### Type Safety Report
```
## TypeScript Standards Review

**Status**: APPROVED / CHANGES REQUESTED

### Critical Issues
- [File:Line] Issue description

### Improvements
- Recommendation with code example
```

### DX Review Report
```
## Developer Experience Review

**Overall Score**: Excellent / Good / Needs Improvement

### What's Working Well
- Specific praise

### Recommendations
1. [Priority] Issue → Suggested fix

### Quick Wins
- Small changes with high impact
```
