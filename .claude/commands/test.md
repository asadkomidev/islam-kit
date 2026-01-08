# Run & Validate Tests

Run tests and validate coverage for islam-kit packages.

**Target**: $ARGUMENTS

## Arguments

- `all` - Run all tests across all packages
- `qibla` - Run @islam-kit/qibla tests only (108 tests)
- `prayer-times` - Run @islam-kit/prayer-times tests only (129 tests)
- `quran` - Run @islam-kit/quran tests only (149 tests)
- `coverage` - Run all tests with coverage report
- `watch` - Run tests in watch mode

If no argument provided, default to `all`.

## Workflow

Use the `testing-validator` agent to execute and validate tests.

### Commands by Argument

```bash
# all
pnpm test

# qibla
pnpm --filter @islam-kit/qibla test

# prayer-times
pnpm --filter @islam-kit/prayer-times test

# quran
pnpm --filter @islam-kit/quran test

# coverage
pnpm test -- --coverage

# watch
pnpm test -- --watch
```

### Test Analysis

After running tests, analyze:

1. **Pass/Fail Summary**
   - Total tests run
   - Passed vs failed count
   - Any skipped tests

2. **Coverage Analysis** (if coverage argument)
   - Line coverage percentage
   - Branch coverage percentage
   - Uncovered lines/functions

3. **Test Quality Review**
   - Edge cases covered (poles, equator, date line, etc.)
   - Mathematical accuracy tests present
   - API surface fully tested
   - Error handling tested

4. **Gap Identification**
   - Missing test cases
   - Untested edge cases
   - Suggestions for additional tests

## Package Test Details

### @islam-kit/qibla (108 tests)
- Location: `packages/qibla/tests/qibla.test.ts`
- Key areas: direction calculations, distance, compass points, edge cases

### @islam-kit/prayer-times (129 tests)
- Location: `packages/prayer-times/tests/calculator.test.ts`
- Key areas: 14 calculation methods, Asr methods, high latitude, formatting

### @islam-kit/quran (149 tests)
- Location: `packages/quran/tests/`
- Key areas: client API, types, integration, search

## Output

Provide:
1. Test execution results
2. Any failures with details
3. Coverage summary (if requested)
4. Recommendations for improving test coverage
