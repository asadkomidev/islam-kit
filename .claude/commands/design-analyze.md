# Analyze Design System

Analyze an external website's design system to create a comprehensive specification for the docs site.

**Target**: $ARGUMENTS (URL to analyze)

## Arguments

Provide the URL of the website to analyze (e.g., `https://stripe.com/docs`)

## Workflow

Use the `design-system-analyzer` agent to extract:

1. **Color System** - Palettes, semantic colors, dark mode
2. **Typography** - Fonts, scales, hierarchy
3. **Spacing** - Base unit, scales, rhythm
4. **Layout** - Grid, breakpoints, containers
5. **Components** - Navigation, buttons, cards, forms, code blocks
6. **Visual Effects** - Shadows, radius, transitions
7. **Animations** - Micro-interactions, motion
8. **Iconography** - Style, sizing, usage
9. **Imagery** - Media patterns, treatments
10. **Philosophy** - Overall design principles

## Iteration Loop

**IMPORTANT**: Keep iterating until the analysis is complete and comprehensive:

1. Capture multiple pages/states of the reference site
2. If initial analysis misses elements, re-analyze specific components
3. Validate extracted design tokens are complete
4. Cross-reference dark mode vs light mode patterns
5. Ensure all 10 framework areas are documented

Do NOT consider analysis complete until:
- All design framework areas are documented
- Design tokens are extractable and usable
- Implementation notes are actionable

## Output

Comprehensive design specification document with:
- CSS custom properties / design tokens
- Component specifications
- Implementation notes for Tailwind CSS
- Before/after recommendations

## Next Steps

After analysis, use `ui-ux-reviewer` agent to implement the design changes.
