# Review & Fix Documentation Site

Review and improve the islam-kit documentation site UI/UX, content quality, and Islamic accuracy.

**Target**: $ARGUMENTS

## Arguments

- `all` - Full site review (home page + all docs)
- `home` - Landing page only (apps/docs/app/page.tsx)
- `getting-started` - Getting started guide
- `prayer-times` - Prayer times documentation section
- `qibla` - Qibla direction documentation section
- `quran` - Quran package documentation section
- `components` - UI components only (apps/docs/components/)

If no argument provided, default to `all`.

## Workflow

Execute the following agent pipeline in order:

### Step 1: UI/UX Review (ui-ux-reviewer)

First, start the docs dev server if not running:
```bash
pnpm --filter @islam-kit/docs dev
```

Then use the `ui-ux-reviewer` agent to:
1. Navigate to http://localhost:3000 (or the appropriate page based on argument)
2. Capture screenshots at multiple viewport sizes (desktop, tablet, mobile)
3. Analyze visual design, accessibility, and user experience
4. Identify specific issues with actionable recommendations

**Target pages based on argument**:
- `all`: /, /docs/getting-started, /docs/prayer-times, /docs/qibla, /docs/quran
- `home`: / only
- `getting-started`: /docs/getting-started
- `prayer-times`: /docs/prayer-times, /docs/prayer-times/quick-start, /docs/prayer-times/calculation-methods, /docs/prayer-times/api
- `qibla`: /docs/qibla, /docs/qibla/api
- `quran`: /docs/quran, /docs/quran/data-format, /docs/quran/api
- `components`: Review component code in apps/docs/components/

### Step 2: Content & Structure (docs-architect)

Use the `docs-architect` agent to:
1. Review documentation structure and navigation
2. Check code examples for accuracy and completeness
3. Verify all imports and TypeScript types are correct
4. Ensure consistent formatting across pages
5. Fix any documentation issues found

**Files to review based on argument**:
- `all`: All MDX files in apps/docs/content/docs/
- `getting-started`: apps/docs/content/docs/getting-started.mdx
- `prayer-times`: apps/docs/content/docs/prayer-times/*.mdx
- `qibla`: apps/docs/content/docs/qibla/*.mdx
- `quran`: apps/docs/content/docs/quran/*.mdx
- `components`: apps/docs/components/*.tsx

### Step 3: Islamic Content Accuracy (open-source-steward)

Use the `open-source-steward` agent to:
1. Verify Islamic terminology is accurate and respectful
2. Check prayer time calculation method descriptions
3. Validate Qibla direction explanations
4. Ensure Quran data references are correct
5. Review for cultural sensitivity and inclusivity

## Auto-Fix Behavior

After identifying issues, automatically fix them:
- UI/UX issues: Update component styles, improve layouts
- Content issues: Fix documentation text, code examples, types
- Islamic accuracy issues: Correct terminology, add clarifications

## Output

Provide a summary of:
1. Issues found and fixed
2. Any remaining issues that need manual attention
3. Screenshots showing before/after for significant UI changes
