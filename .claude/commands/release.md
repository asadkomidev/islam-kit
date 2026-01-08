# Prepare a Release

Run pre-release checks and prepare packages for npm publishing.

**Arguments**: $ARGUMENTS

## Arguments

- `check` - Run pre-release checks only (no version bump)
- `patch` - Prepare patch release (bug fixes)
- `minor` - Prepare minor release (new features)
- `major` - Prepare major release (breaking changes)
- `qibla` - Release @islam-kit/qibla only
- `prayer-times` - Release @islam-kit/prayer-times only
- `quran` - Release @islam-kit/quran only

If no argument provided, default to `check`.

## Workflow

Execute the following agent pipeline in order:

### Step 1: Test Validation (testing-validator)

Use the `testing-validator` agent to:
1. Run full test suite: `pnpm test`
2. Verify all tests pass (386+ tests across packages)
3. Check test coverage meets requirements
4. Identify any missing test cases for recent changes
5. Block release if tests fail

**Package-specific testing**:
- `qibla`: `pnpm --filter @islam-kit/qibla test`
- `prayer-times`: `pnpm --filter @islam-kit/prayer-times test`
- `quran`: `pnpm --filter @islam-kit/quran test`

### Step 2: Bundle Size Verification (bundle-optimizer)

Use the `bundle-optimizer` agent to:
1. Build all packages: `pnpm build`
2. Check bundle sizes against limits:
   - qibla: 1KB max
   - prayer-times: 5KB max
   - quran: 2KB max (utilities only)
3. Run size-limit: `npx size-limit`
4. Block release if size limits exceeded
5. Suggest optimizations if close to limits

### Step 3: Version Management (release-versioning)

If argument is `patch`, `minor`, or `major`:

Use the `release-versioning` agent to:
1. Analyze recent commits and changes
2. Verify changeset exists for all changes
3. If no changeset, create one: `pnpm changeset`
4. Apply version bump: `pnpm version-packages`
5. Review generated changelog entries
6. Ensure breaking changes are documented (for major)

**Do NOT run this step if argument is `check`.**

## Pre-Release Checklist

Before any release, verify:
- [ ] All tests pass
- [ ] Bundle size limits respected
- [ ] Changesets created for all changes
- [ ] Breaking changes documented (major only)
- [ ] Dependencies are up to date
- [ ] No uncommitted changes

## Output

Provide a summary of:
1. Test results (pass/fail count)
2. Bundle sizes (current vs limit)
3. Changes included in release
4. Next steps (if check) or version numbers (if release)

## Publishing

After version bump is complete, remind user to:
```bash
pnpm release  # Build and publish to npm
```

Do NOT automatically publish - let user review and confirm first.
