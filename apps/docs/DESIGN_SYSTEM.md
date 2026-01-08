# Fumadocs Design System Specification

> Comprehensive design specification for islam-kit documentation site built with Fumadocs

## Executive Summary

Fumadocs employs a **modern, minimal, and highly functional** design language optimized for documentation sites. The design system is characterized by:

1. **Clean Neutrality**: A grayscale-dominant color palette with strategic accent colors
2. **High Contrast**: Clear visual hierarchy between dark mode (primary) and light mode
3. **Technical Precision**: Monospace code fonts, systematic spacing, and sharp visual edges
4. **Accessibility First**: High contrast ratios, clear focus states, and RTL support
5. **Shadcn UI Inspiration**: Design tokens and patterns derived from the Shadcn UI system

The overall aesthetic is **technical, professional, and developer-friendly** - a documentation framework that feels like a premium IDE or code editor experience.

---

## 1. Color System

### 1.1 Design Token Structure

Fumadocs uses CSS custom properties with the `--fd-` prefix (Fumadocs namespace) and follows the HSL color model.

### 1.2 Light Mode Palette

```css
:root {
  /* Core Colors */
  --color-fd-background: hsl(0, 0%, 96%);         /* #f5f5f5 - Page background */
  --color-fd-foreground: hsl(0, 0%, 3.9%);        /* #0a0a0a - Primary text */

  /* Muted Colors */
  --color-fd-muted: hsl(0, 0%, 96.1%);            /* #f5f5f5 - Muted backgrounds */
  --color-fd-muted-foreground: hsl(0, 0%, 45.1%); /* #737373 - Secondary text */

  /* Popover Colors */
  --color-fd-popover: hsl(0, 0%, 98%);            /* #fafafa - Popover background */
  --color-fd-popover-foreground: hsl(0, 0%, 15.1%); /* #262626 - Popover text */

  /* Card Colors */
  --color-fd-card: hsl(0, 0%, 94.7%);             /* #f2f2f2 - Card background */
  --color-fd-card-foreground: hsl(0, 0%, 3.9%);  /* #0a0a0a - Card text */

  /* Border Colors */
  --color-fd-border: hsla(0, 0%, 80%, 50%);       /* Semi-transparent gray */

  /* Primary Colors */
  --color-fd-primary: hsl(0, 0%, 9%);             /* #171717 - Primary buttons */
  --color-fd-primary-foreground: hsl(0, 0%, 98%); /* #fafafa - Primary button text */

  /* Secondary Colors */
  --color-fd-secondary: hsl(0, 0%, 93.1%);        /* #ededed - Secondary buttons */
  --color-fd-secondary-foreground: hsl(0, 0%, 9%); /* #171717 - Secondary text */

  /* Accent Colors */
  --color-fd-accent: hsla(0, 0%, 82%, 50%);       /* Semi-transparent accent */
  --color-fd-accent-foreground: hsl(0, 0%, 9%);  /* #171717 - Accent text */

  /* Focus Ring */
  --color-fd-ring: hsl(0, 0%, 63.9%);             /* #a3a3a3 - Focus ring */
}
```

### 1.3 Dark Mode Palette (Primary Theme)

```css
.dark {
  /* Core Colors */
  --color-fd-background: hsl(0, 0%, 7.04%);       /* #121212 - Page background */
  --color-fd-foreground: hsl(0, 0%, 92%);         /* #ebebeb - Primary text */

  /* Muted Colors */
  --color-fd-muted: hsl(0, 0%, 12.9%);            /* #212121 - Muted backgrounds */
  --color-fd-muted-foreground: hsla(0, 0%, 70%, 0.8); /* Semi-transparent gray */

  /* Popover Colors */
  --color-fd-popover: hsl(0, 0%, 11.6%);          /* #1d1d1d - Popover background */
  --color-fd-popover-foreground: hsl(0, 0%, 86.9%); /* #dedede - Popover text */

  /* Card Colors */
  --color-fd-card: hsl(0, 0%, 9.8%);              /* #191919 - Card background */
  --color-fd-card-foreground: hsl(0, 0%, 98%);   /* #fafafa - Card text */

  /* Border Colors */
  --color-fd-border: hsla(0, 0%, 40%, 20%);       /* Very subtle border */

  /* Primary Colors */
  --color-fd-primary: hsl(0, 0%, 98%);            /* #fafafa - Primary buttons */
  --color-fd-primary-foreground: hsl(0, 0%, 9%); /* #171717 - Primary button text */

  /* Secondary Colors */
  --color-fd-secondary: hsl(0, 0%, 12.9%);        /* #212121 - Secondary buttons */
  --color-fd-secondary-foreground: hsl(0, 0%, 92%); /* #ebebeb - Secondary text */

  /* Accent Colors */
  --color-fd-accent: hsla(0, 0%, 40.9%, 30%);     /* Semi-transparent accent */
  --color-fd-accent-foreground: hsl(0, 0%, 90%); /* #e5e5e5 - Accent text */

  /* Focus Ring */
  --color-fd-ring: hsl(0, 0%, 54.9%);             /* #8c8c8c - Focus ring */
}
```

### 1.4 Semantic Colors

```css
/* Callout/Alert Colors */
--callout-info-bg: rgba(59, 130, 246, 0.1);      /* Blue info background */
--callout-info-border: rgb(59, 130, 246);        /* Blue info border */
--callout-info-icon: rgb(59, 130, 246);          /* Blue info icon */

--callout-warn-bg: rgba(234, 179, 8, 0.1);       /* Yellow warning background */
--callout-warn-border: rgb(234, 179, 8);         /* Yellow warning border */
--callout-warn-icon: rgb(234, 179, 8);           /* Yellow warning icon */

--callout-error-bg: rgba(239, 68, 68, 0.1);      /* Red error background */
--callout-error-border: rgb(239, 68, 68);        /* Red error border */
--callout-error-icon: rgb(239, 68, 68);          /* Red error icon */

--callout-success-bg: rgba(34, 197, 94, 0.1);    /* Green success background */
--callout-success-border: rgb(34, 197, 94);      /* Green success border */
--callout-success-icon: rgb(34, 197, 94);        /* Green success icon */

--callout-idea-bg: rgba(168, 85, 247, 0.1);      /* Purple idea background */
--callout-idea-border: rgb(168, 85, 247);        /* Purple idea border */
--callout-idea-icon: rgb(168, 85, 247);          /* Purple idea icon */
```

### 1.5 Syntax Highlighting (Code Blocks)

```css
/* Shiki Theme Colors (Dark Mode) */
--shiki-color-text: #e1e4e8;
--shiki-color-background: transparent;
--shiki-token-constant: #79c0ff;
--shiki-token-string: #a5d6ff;
--shiki-token-comment: #8b949e;
--shiki-token-keyword: #ff7b72;
--shiki-token-parameter: #ffa657;
--shiki-token-function: #d2a8ff;
--shiki-token-string-expression: #a5d6ff;
--shiki-token-punctuation: #c9d1d9;
--shiki-token-link: #58a6ff;

/* Diff Highlighting */
--shiki-diff-add-bg: rgba(46, 160, 67, 0.15);
--shiki-diff-add-symbol: #3fb950;
--shiki-diff-remove-bg: rgba(248, 81, 73, 0.15);
--shiki-diff-remove-symbol: #f85149;

/* Line Highlighting */
--shiki-highlight-bg: rgba(136, 198, 190, 0.1);
```

### 1.6 Brand/Accent Color

```css
/* Fumadocs Brand Yellow (used sparingly) */
--brand-yellow: rgb(250, 204, 21);               /* #facc15 - Active states, highlights */
```

---

## 2. Typography System

### 2.1 Font Families

```css
/* Primary Font Stack (Body/UI) */
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
             "Segoe UI Symbol", "Noto Color Emoji";

/* Monospace Font Stack (Code) */
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
             Consolas, "Liberation Mono", "Courier New", monospace;

/* Heading Font (Optional - same as sans by default) */
--font-heading: var(--font-sans);
```

### 2.2 Type Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px - H1 */
```

### 2.3 Font Weights

```css
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* UI elements, links */
--font-semibold: 600;    /* Headings, emphasis */
--font-bold: 700;        /* Strong emphasis */
```

### 2.4 Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### 2.5 Heading Hierarchy

```css
/* H1 - Page Title */
h1 {
  font-size: 2.25rem;    /* 36px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

/* H2 - Section Headers */
h2 {
  font-size: 1.5rem;     /* 24px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-top: 2rem;
}

/* H3 - Subsection Headers */
h3 {
  font-size: 1.25rem;    /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

/* H4 - Minor Headers */
h4 {
  font-size: 1.125rem;   /* 18px */
  font-weight: 600;
  line-height: 1.4;
}

/* Body Text */
p {
  font-size: 1rem;       /* 16px */
  font-weight: 400;
  line-height: 1.7;
}

/* Small/Caption Text */
.text-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.5;
}
```

### 2.6 Code Typography

```css
/* Inline Code */
code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 0.875em;    /* Relative to parent */
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: var(--color-fd-muted);
}

/* Code Block */
pre code {
  font-family: var(--font-mono);
  font-size: 0.875rem;   /* 14px */
  line-height: 1.7;
  tab-size: 2;
}
```

---

## 3. Spacing System

### 3.1 Base Unit

The spacing system uses a **4px base unit** with a scale multiplier.

### 3.2 Spacing Scale

```css
/* Spacing Scale (Tailwind-compatible) */
--spacing-0: 0;
--spacing-px: 1px;
--spacing-0.5: 0.125rem;  /* 2px */
--spacing-1: 0.25rem;     /* 4px */
--spacing-1.5: 0.375rem;  /* 6px */
--spacing-2: 0.5rem;      /* 8px */
--spacing-2.5: 0.625rem;  /* 10px */
--spacing-3: 0.75rem;     /* 12px */
--spacing-3.5: 0.875rem;  /* 14px */
--spacing-4: 1rem;        /* 16px */
--spacing-5: 1.25rem;     /* 20px */
--spacing-6: 1.5rem;      /* 24px */
--spacing-7: 1.75rem;     /* 28px */
--spacing-8: 2rem;        /* 32px */
--spacing-9: 2.25rem;     /* 36px */
--spacing-10: 2.5rem;     /* 40px */
--spacing-12: 3rem;       /* 48px */
--spacing-14: 3.5rem;     /* 56px */
--spacing-16: 4rem;       /* 64px */
--spacing-20: 5rem;       /* 80px */
--spacing-24: 6rem;       /* 96px */
```

### 3.3 Component Spacing Patterns

```css
/* Content Padding */
--content-padding-x: 1.5rem;     /* 24px - Horizontal */
--content-padding-y: 2rem;       /* 32px - Vertical */

/* Card Padding */
--card-padding: 1rem;            /* 16px */

/* Button Padding */
--button-padding-x: 1rem;        /* 16px */
--button-padding-y: 0.5rem;      /* 8px */

/* Input Padding */
--input-padding-x: 0.75rem;      /* 12px */
--input-padding-y: 0.5rem;       /* 8px */

/* Section Gaps */
--section-gap: 3rem;             /* 48px */
--element-gap: 1rem;             /* 16px */
```

---

## 4. Layout System

### 4.1 Layout Variables

```css
:root {
  --fd-layout-width: 1400px;           /* Max container width */
  --fd-sidebar-width: 240px;           /* Sidebar width */
  --fd-toc-width: 220px;               /* Table of contents width */
  --fd-nav-height: 56px;               /* Navigation height */
}
```

### 4.2 Breakpoints

```css
/* Responsive Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Fumadocs-specific */
--breakpoint-sidebar-collapse: 768px;  /* Sidebar becomes drawer */
--breakpoint-toc-hide: 1024px;         /* TOC hides on smaller screens */
```

### 4.3 Grid System

```css
/* Docs Layout Grid */
.docs-layout {
  display: grid;
  grid-template-columns: var(--fd-sidebar-width) 1fr var(--fd-toc-width);
  max-width: var(--fd-layout-width);
  margin: 0 auto;
}

/* Content Width */
.prose {
  max-width: 65ch;                     /* Optimal reading width */
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
```

### 4.4 Sidebar Layout

```css
/* Sidebar Structure */
.sidebar {
  width: var(--fd-sidebar-width);
  height: calc(100vh - var(--fd-nav-height));
  position: sticky;
  top: var(--fd-nav-height);
  overflow-y: auto;
  padding: 1rem;
  border-right: 1px solid var(--color-fd-border);
}

/* Sidebar Navigation Item */
.sidebar-item {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-item.active {
  background: var(--color-fd-accent);
  color: var(--brand-yellow);
}
```

---

## 5. Component Patterns

### 5.1 Navigation Header

```css
.nav-header {
  height: var(--fd-nav-height);
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-fd-background);
  border-bottom: 1px solid var(--color-fd-border);
  backdrop-filter: blur(8px);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-fd-muted-foreground);
  transition: color 150ms;
}

.nav-link:hover {
  color: var(--color-fd-foreground);
}
```

### 5.2 Buttons

```css
/* Base Button */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 150ms;
  cursor: pointer;
}

/* Primary Button */
.button-primary {
  background: var(--color-fd-primary);
  color: var(--color-fd-primary-foreground);
}

.button-primary:hover {
  opacity: 0.9;
}

/* Secondary Button */
.button-secondary {
  background: var(--color-fd-secondary);
  color: var(--color-fd-secondary-foreground);
  border: 1px solid var(--color-fd-border);
}

.button-secondary:hover {
  background: var(--color-fd-accent);
}

/* Ghost Button */
.button-ghost {
  background: transparent;
  color: var(--color-fd-foreground);
}

.button-ghost:hover {
  background: var(--color-fd-muted);
}

/* Icon Button */
.button-icon {
  padding: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
}
```

### 5.3 Cards

```css
/* Base Card */
.card {
  background: var(--color-fd-card);
  border: 1px solid var(--color-fd-border);
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 200ms;
}

.card:hover {
  border-color: var(--color-fd-accent);
  background: var(--color-fd-muted);
}

/* Link Card */
.card-link {
  display: block;
  text-decoration: none;
}

.card-link h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-link p {
  font-size: 0.75rem;
  color: var(--color-fd-muted-foreground);
}

/* Feature Card (with icon) */
.card-feature {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-feature .icon {
  width: 2rem;
  height: 2rem;
  padding: 0.375rem;
  background: var(--color-fd-muted);
  border-radius: 0.5rem;
}
```

### 5.4 Code Blocks

```css
/* Code Block Container */
.codeblock {
  position: relative;
  background: var(--color-fd-card);
  border: 1px solid var(--color-fd-border);
  border-radius: 0.75rem;
  overflow: hidden;
  margin: 1rem 0;
}

/* Code Block Header */
.codeblock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: var(--color-fd-muted);
  border-bottom: 1px solid var(--color-fd-border);
  font-size: 0.75rem;
  font-family: var(--font-mono);
}

.codeblock-header .filename {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-fd-muted-foreground);
}

/* Code Block Body */
.codeblock pre {
  padding: 1rem;
  overflow-x: auto;
  margin: 0;
}

/* Copy Button */
.codeblock-copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.375rem;
  background: var(--color-fd-muted);
  border-radius: 0.375rem;
  opacity: 0;
  transition: opacity 150ms;
}

.codeblock:hover .codeblock-copy {
  opacity: 1;
}
```

### 5.5 Callouts

```css
/* Base Callout */
.callout {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border-left: 3px solid;
  margin: 1rem 0;
}

.callout-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.callout-content p:first-child {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

/* Callout Variants */
.callout-info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgb(59, 130, 246);
}

.callout-warn {
  background: rgba(234, 179, 8, 0.1);
  border-color: rgb(234, 179, 8);
}

.callout-error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgb(239, 68, 68);
}

.callout-success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgb(34, 197, 94);
}

.callout-idea {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgb(168, 85, 247);
}
```

### 5.6 Tabs

```css
/* Tab List */
.tabs {
  border: 1px solid var(--color-fd-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.tab-list {
  display: flex;
  background: var(--color-fd-muted);
  border-bottom: 1px solid var(--color-fd-border);
  padding: 0.25rem;
  gap: 0.25rem;
}

.tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-fd-muted-foreground);
  border-radius: 0.375rem;
  transition: all 150ms;
}

.tab[data-state="active"] {
  background: var(--color-fd-background);
  color: var(--color-fd-foreground);
}

.tab-panel {
  padding: 0;
}

/* Code Tabs (for package manager commands) */
.code-tabs .tab {
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
```

### 5.7 Search Dialog

```css
/* Search Modal */
.search-dialog {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.search-content {
  width: 100%;
  max-width: 600px;
  background: var(--color-fd-popover);
  border: 1px solid var(--color-fd-border);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-fd-border);
}

.search-input {
  flex: 1;
  font-size: 1rem;
  background: transparent;
  border: none;
  outline: none;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.search-result-item:hover {
  background: var(--color-fd-accent);
}
```

### 5.8 Table of Contents

```css
/* TOC Container */
.toc {
  position: sticky;
  top: var(--fd-nav-height);
  height: fit-content;
  max-height: calc(100vh - var(--fd-nav-height) - 2rem);
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.875rem;
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-fd-muted-foreground);
  margin-bottom: 0.75rem;
}

.toc-link {
  display: block;
  padding: 0.25rem 0;
  color: var(--color-fd-muted-foreground);
  transition: color 150ms;
  border-left: 2px solid transparent;
  padding-left: 0.75rem;
  margin-left: -0.75rem;
}

.toc-link:hover {
  color: var(--color-fd-foreground);
}

.toc-link.active {
  color: var(--brand-yellow);
  border-color: var(--brand-yellow);
}

/* Nested TOC items */
.toc-link[data-level="3"] {
  padding-left: 1.5rem;
}
```

---

## 6. Visual Effects

### 6.1 Border Radius Scale

```css
--radius-none: 0;
--radius-sm: 0.25rem;     /* 4px - Small elements */
--radius-md: 0.375rem;    /* 6px - Buttons, inputs */
--radius-lg: 0.5rem;      /* 8px - Cards, modals */
--radius-xl: 0.75rem;     /* 12px - Large cards */
--radius-2xl: 1rem;       /* 16px - Hero sections */
--radius-full: 9999px;    /* Circles, pills */
```

### 6.2 Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Dark Mode Shadows (more subtle) */
.dark {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}
```

### 6.3 Transitions

```css
/* Transition Durations */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;   /* Default for small UI elements */
--duration-200: 200ms;   /* Default for larger elements */
--duration-300: 300ms;   /* Modals, drawers */
--duration-500: 500ms;   /* Page transitions */

/* Transition Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Default */

/* Common Transitions */
--transition-colors: color, background-color, border-color,
                     text-decoration-color, fill, stroke 150ms var(--ease-in-out);
--transition-opacity: opacity 150ms var(--ease-in-out);
--transition-transform: transform 200ms var(--ease-in-out);
--transition-all: all 150ms var(--ease-in-out);
```

### 6.4 Focus States

```css
/* Focus Ring */
*:focus-visible {
  outline: 2px solid var(--color-fd-ring);
  outline-offset: 2px;
}

/* Focus within card/button */
.focus-ring:focus-visible {
  box-shadow: 0 0 0 2px var(--color-fd-background),
              0 0 0 4px var(--color-fd-ring);
}
```

---

## 7. Animations & Micro-interactions

### 7.1 Keyframe Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide In from Right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Pulse (for loading states) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin (for loading indicators) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 7.2 Animation Usage

```css
/* Modal Enter */
.modal {
  animation: scaleIn 200ms var(--ease-out);
}

/* Dropdown/Popover */
.popover {
  animation: fadeInUp 150ms var(--ease-out);
}

/* Sidebar Slide */
.sidebar-mobile {
  animation: slideInRight 300ms var(--ease-out);
}

/* Loading State */
.skeleton {
  animation: pulse 2s var(--ease-in-out) infinite;
}

/* Hover Effects */
.card:hover {
  transform: translateY(-2px);
}

.button:active {
  transform: scale(0.98);
}
```

---

## 8. Iconography

### 8.1 Icon Library

Fumadocs uses **Lucide React** icons throughout the interface.

```tsx
import {
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  Github,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  FileText,
  Folder,
  Terminal
} from 'lucide-react';
```

### 8.2 Icon Sizes

```css
/* Icon Size Scale */
--icon-xs: 0.75rem;    /* 12px - Inline icons */
--icon-sm: 1rem;       /* 16px - Small buttons */
--icon-md: 1.25rem;    /* 20px - Default */
--icon-lg: 1.5rem;     /* 24px - Feature icons */
--icon-xl: 2rem;       /* 32px - Hero icons */
```

### 8.3 Icon Styling

```css
/* Default Icon Styles */
.icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
  flex-shrink: 0;
}

/* Muted Icons */
.icon-muted {
  color: var(--color-fd-muted-foreground);
}

/* Interactive Icons */
.icon-button .icon {
  transition: color 150ms;
}

.icon-button:hover .icon {
  color: var(--color-fd-foreground);
}
```

---

## 9. Responsive Design

### 9.1 Mobile Navigation

```css
/* Mobile Header (< 768px) */
@media (max-width: 767px) {
  .nav-header {
    padding: 0 1rem;
  }

  .nav-links {
    display: none;
  }

  .mobile-menu-button {
    display: flex;
  }
}

/* Mobile Sidebar */
.sidebar-mobile {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--color-fd-background);
  padding: 1rem;
  overflow-y: auto;
}

/* Mobile Progress Bar */
.mobile-progress {
  position: fixed;
  top: var(--fd-nav-height);
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-fd-muted);
}

.mobile-progress-bar {
  height: 100%;
  background: var(--brand-yellow);
}
```

### 9.2 Content Responsive Patterns

```css
/* Hide TOC on tablet */
@media (max-width: 1023px) {
  .toc {
    display: none;
  }

  .docs-content {
    max-width: 100%;
  }
}

/* Stack cards on mobile */
@media (max-width: 639px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 1rem;
  }
}

/* Code block horizontal scroll */
.codeblock pre {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## 10. Implementation for islam-kit

### 10.1 Recommended Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [
    require('fumadocs-ui/tailwind-plugin').preset,
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Add islam-kit brand color
        'brand': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Primary green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
};

export default config;
```

### 10.2 CSS Import Order

```css
/* globals.css */
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';  /* or another theme */
@import 'fumadocs-ui/css/preset.css';

/* Optional: Custom overrides */
@layer base {
  :root {
    /* Custom islam-kit variables */
  }
}
```

### 10.3 Key Components to Customize

1. **Logo**: Replace Fumadocs logo with islam-kit logo
2. **Colors**: Consider Islamic green (`#22c55e`) as accent color
3. **Code Examples**: Ensure examples show islam-kit API usage
4. **Callouts**: Use for Islamic terminology explanations

### 10.4 Accessibility Considerations

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for text)
- Ensure RTL support for Arabic content
- Use semantic HTML for screen readers
- Provide alt text for all images
- Ensure keyboard navigation works throughout

---

## Appendix: Screenshot References

The following screenshots were captured during analysis:

1. `fumadocs-main-docs.png` - Main docs landing page (light)
2. `fumadocs-dark-mode.png` - Dark mode docs
3. `fumadocs-components-page.png` - Component overview
4. `fumadocs-codeblock-page.png` - Code block patterns
5. `fumadocs-markdown-page.png` - Markdown features
6. `fumadocs-search-modal.png` - Search dialog
7. `fumadocs-mobile-view.png` - Mobile responsive
8. `fumadocs-mobile-sidebar.png` - Mobile navigation
9. `fumadocs-themes-page.png` - Theme configuration
10. `fumadocs-homepage.png` - Marketing homepage

---

*Generated for islam-kit documentation site*
*Based on Fumadocs v14+ design system*
