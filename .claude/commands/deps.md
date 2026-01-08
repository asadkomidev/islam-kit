# Update Dependencies

Check and update dependencies across all workspaces while ensuring no breaking changes.

**Target**: $ARGUMENTS

## Arguments

- `all` - Full audit and update cycle (default)
- `audit` - Audit only, report current state
- `check` - Check for available updates without applying
- `security` - Security-focused audit only

## Workflow

Use the `dependency-updater` agent to:

1. **Audit Phase**: Catalog all dependencies across workspaces
2. **Analysis Phase**: Use Context7 to check for breaking changes
3. **Categorize**: Safe updates, Review required, Skip
4. **Apply**: Update dependencies systematically
5. **Validate**: Run build, tests, lint, bundle size checks
6. **Report**: Summary with recommendations

## Iteration Loop

**IMPORTANT**: Keep iterating until ALL of the following pass:
- `pnpm build` succeeds
- `pnpm test` passes
- `pnpm lint` passes
- Bundle sizes remain within limits

If any validation fails:
1. Identify the problematic update
2. Revert or fix the issue
3. Re-run validation
4. Continue until all checks pass

Do NOT consider the task complete until all validations succeed.

## Key Constraints

- Never add runtime dependencies to library packages
- Bundle size limits must be maintained (qibla: 1KB, prayer-times: 5KB, quran: 2KB)
- Zero-dependency constraint for library packages

## Output

Summary report including:
- Dependencies updated (with version changes)
- Dependencies skipped (with reasons)
- Validation results (build, test, lint, size) - ALL MUST PASS
- Security advisories addressed
