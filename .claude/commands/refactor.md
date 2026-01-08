# Refactor Code

Safely refactor code to improve readability and maintainability without changing public APIs.

**Target**: $ARGUMENTS

## Arguments

- `qibla` - Refactor @islam-kit/qibla package
- `prayer-times` - Refactor @islam-kit/prayer-times package
- `quran` - Refactor @islam-kit/quran package
- `duplication` - Find and consolidate duplicated code across packages
- `<file-path>` - Refactor specific file

If no argument provided, show this help message.

## Workflow

Execute the following agent pipeline in order:

### Step 1: Code Refactoring (polish-refactor)

Use the `polish-refactor` agent to:

1. **Simplify Complex Code**
   - Break down large functions (>50 lines)
   - Reduce nesting depth (max 3 levels)
   - Replace clever code with readable code

2. **Remove Duplication**
   - Identify repeated patterns
   - Extract common utilities
   - Consolidate similar functions

3. **Improve Readability**
   - Use descriptive names
   - Add clarifying comments (only where needed)
   - Organize imports consistently

4. **Clean Up**
   - Remove commented-out code
   - Replace magic numbers with constants
   - Fix inconsistent formatting

### Critical Constraints

**NEVER change public APIs without explicit approval:**
- Do NOT modify function signatures
- Do NOT rename exported functions/types
- Do NOT change return types
- Do NOT alter behavior

All refactoring must be internal implementation only.

### Step 2: Test Verification (testing-validator)

Use the `testing-validator` agent to:

1. Run all tests: `pnpm test`
2. Verify no tests fail after refactoring
3. Confirm behavior is preserved
4. Check for any regressions

## Red Flags to Address

- Functions over 50 lines
- Nesting deeper than 3 levels
- Duplicated code blocks (3+ occurrences)
- Cryptic variable names
- God objects/functions
- Commented-out code
- Magic numbers

## Package Locations

| Package | Source | Tests |
|---------|--------|-------|
| qibla | packages/qibla/src/ | packages/qibla/tests/ |
| prayer-times | packages/prayer-times/src/ | packages/prayer-times/tests/ |
| quran | packages/quran/src/ | packages/quran/tests/ |

## Output

Provide:
1. Summary of changes made
2. Confirmation of preserved APIs
3. Test results (all must pass)
4. Before/after code snippets for significant changes
5. Recommendations for future improvements

### Report Format
```
## Refactoring Summary

### Changes Made
1. [File] Description of change

### APIs Preserved
- All public exports unchanged
- All function signatures unchanged

### Test Results
- X tests passed
- 0 tests failed

### Future Recommendations
- Areas that could benefit from further attention
```
