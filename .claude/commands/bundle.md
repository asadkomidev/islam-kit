# Analyze Bundle Size

Analyze and optimize bundle sizes for islam-kit packages.

**Target**: $ARGUMENTS

## Arguments

- `all` - Check all packages
- `qibla` - Check @islam-kit/qibla (limit: 1KB)
- `prayer-times` - Check @islam-kit/prayer-times (limit: 5KB)
- `quran` - Check @islam-kit/quran (limit: 2KB)
- `optimize` - Analyze and suggest optimizations
- `report` - Generate detailed size report

If no argument provided, default to `all`.

## Workflow

Use the `bundle-optimizer` agent to analyze bundle sizes.

### Step 1: Build Packages

```bash
# Build all packages
pnpm build

# Or specific package
pnpm --filter @islam-kit/<package> build
```

### Step 2: Check Size Limits

```bash
npx size-limit
```

### Size Limits

| Package | Limit | Location |
|---------|-------|----------|
| @islam-kit/qibla | 1KB | packages/qibla/dist/ |
| @islam-kit/prayer-times | 5KB | packages/prayer-times/dist/ |
| @islam-kit/quran | 2KB | packages/quran/dist/ |

### Step 3: Analysis

Analyze the built output:

1. **Current Sizes**
   - ESM bundle size
   - CJS bundle size
   - Minified + gzipped size

2. **Size Breakdown**
   - Identify largest contributors
   - Check for unnecessary code
   - Verify tree-shaking works

3. **Optimization Opportunities** (if `optimize` argument)
   - Dead code elimination
   - Import optimization
   - Data structure efficiency
   - Lazy loading candidates

### Step 4: Recommendations

If sizes are approaching limits, suggest:
- Code splitting strategies
- Import path optimization
- Constant inlining
- Algorithm simplifications

## Key Constraints

- Zero runtime dependencies must be maintained
- Dual API pattern (functional + class) must be preserved
- All optimizations must maintain correctness
- ESM-first with CJS fallback

## Output

Provide:
1. Current size vs limit for each package
2. Status: OK / WARNING (>80%) / EXCEEDED
3. Top contributors to bundle size
4. Specific optimization recommendations (if applicable)

### Report Format

```
## Bundle Size Report

| Package | Current | Limit | Status |
|---------|---------|-------|--------|
| qibla | 0.8KB | 1KB | OK |
| prayer-times | 4.2KB | 5KB | WARNING |
| quran | 1.5KB | 2KB | OK |

### Recommendations
1. [Specific optimization with expected savings]
```
