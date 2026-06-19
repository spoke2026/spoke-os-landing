# Spoke OS - Design System

**Status:** Fully implemented across login.html, index.html, and strategy.html  
**Last Updated:** June 19, 2026  
**Implementation:** 95%+ on production pages

The design system ensures visual consistency across all pages through standardized colors, typography, spacing, and components. The Spoke Solutions Design System has been fully integrated into the core pages with complete token usage, responsive design, and interactive enhancements.

## Implementation Notes (June 19, 2026 - Final Session)

### Session Accomplishments
- **Core Values & How We Deliver Cards**: Left-border accent styling (3px zest) matching strategy page design
- **Hedgehog Concept**: Complete redesign with multiply blend mode SVG circles and grid-based legend layout (deployed across home and vision pages)
- **Playing to Win Cascade**: Added interactive hover effects with zest background highlights and smooth transitions
- **Build Sequence Cards**: Redesigned from 3-column to 4-column grid for all 4 cards on one row
- **Customer Scoring Model**: Fixed inconsistent font sizes (all headings now 32px)
- **Brandforce Header**: Background color updated to mineral green for visual consistency
- **Text Width Constraints**: Removed all max-width constraints (prose, quote-block, section-summary, sec-meta sum, note) for full section width
- **Interactive States**: Smooth transitions on all elements using --ease-standard and --duration-base
- **Zembr Pricing**: Updated lead generation rates ($2,280 entry, $4,360 scaled based on BD package)

### Key Principles
- All colors use CSS variables (no hardcoded hex values)
- All spacing uses 8px base grid system (--space-* tokens)
- All typography uses semantic naming (--text-3xs through --text-6xl)
- All interactions include smooth transitions with motion tokens
- Responsive design uses 768px breakpoint with auto-fit grids
- Left-border accents (3px) used for card sections, hover states for interactive elements

---

## 1. Color Palette

### CSS Variables (Primary)
```css
--mineral:     #40514F  /* Dark teal - headers, primary text, accents */
--zest:        #BEDA81  /* Lime green - CTAs, highlights, active states */
--zest-dark:   #7A9650  /* Dark green - secondary accents, labels */
--warn:        #b04a4a  /* Red - warnings, negative states */
--white:       #FFFFFF  /* Pure white backgrounds and text */
--stone:       #EDEDE1  /* Light warm neutral - page background */
--text:        #2A2A2A  /* Dark text color */
--text-light:  #666666  /* Secondary text, muted content */
--border:      rgba(64,81,79,0.15)  /* Borders and subtle backgrounds */
```

### Extended Colors (Variables)
```css
--zest-hover:  #a4c767  /* Zest hover state */
--accent-1:    #3B6D11  /* Green accent for icons, positive states */
--accent-2:    #185FA5  /* Blue accent for milestones, info states */
--accent-3:    #854F0B  /* Orange accent for warnings, emphasis */
--accent-4:    #5a7a30  /* Dark green for badges, secondary accents */
```

### Color Usage
| Variable | Primary Use |
|----------|------------|
| `--mineral` | Page headers, section titles, body text, primary UI |
| `--zest` | Buttons, links, highlights, active tabs, CTAs |
| `--zest-dark` | Secondary labels, eyebrows, badges, muted accents |
| `--warn` | Negative states, warnings, deadlines, red text |
| `--white` | Card backgrounds, text on dark, clean space |
| `--stone` | Page background, subtle fills, neutral spaces |
| `--text` | Body text, default text color |
| `--text-light` | Secondary text, fine print, muted copy |
| `--border` | Borders, subtle overlays, dividers |
| `--zest-hover` | Button hover states, link interactions |
| `--accent-1/2/3/4` | Icon colors, status indicators, special states |

## 2. Typography System

### Font Families
- **Headings & Display**: `DM Serif Display`, serif
  - Use italic for: hero headlines, section introductions, large quotes
- **Body & UI**: `DM Sans`, sans-serif
  - All body text, buttons, forms, labels, navigation

### Font Size Scale (Standardized)
```css
12px   /* Small labels, badge text, fine print, table headers, nav text */
14px   /* Body text, descriptions, standard copy, form labels */
16px   /* Medium body, larger descriptions, list items */
18px   /* Medium-large, card text, subheadings */
20px   /* Card titles, feature names, highlight text */
24px   /* Section headers (minimum via clamp) */
28px   /* Statistics, large numbers, emphasis */
32px   /* Responsive section headers */
40px   /* Large section headers (maximum via clamp) */
48px   /* VSBE phase letters, hero numbers */
56px   /* Section numbers, very large display */
```

**Responsive Headlines**: Use `clamp()` for fluid scaling
- Small sections: `clamp(24px, 3.5vw, 40px)`
- Large sections: `clamp(32px, 4vw, 48px)`

### Font Weight Scale
```css
300   /* Light - secondary text, less emphasis */
400   /* Regular - default weight, body text */
500   /* Medium - semi-bold, modest emphasis */
600   /* Semibold - titles, important labels */
700   /* Bold - badges, eyebrows, strong emphasis */
```

### Line Height Scale (Standardized)
```css
1.0    /* Tight - statistics, large headlines only */
1.25   /* Compact - section headers */
1.5    /* Standard - body text, descriptions, tables */
1.65   /* Open - prose blocks, callouts, generous spacing */
1.75   /* Very open - extended prose, readable body text */
```

**Usage**: Use consistently—don't mix 1.2, 1.3, 1.4, 1.55, 1.6 with unique values.

### Letter Spacing (Standardized)
```css
0px    /* Default - body text, no extra spacing */
1px    /* Labels, badges, kickers, field headings */
2px    /* Eyebrows, subheadings, uppercase labels */
3px    /* Large eyebrows, quote attribution, emphasis labels */
```

## 3. Spacing Scale (Standardized)

### Base Scale
```css
4px    /* Minimum spacing between elements */
8px    /* Small gaps, form fields, tight grids */
12px   /* Medium spacing, component gaps */
16px   /* Standard spacing, section gaps, margins */
24px   /* Large spacing, major sections */
32px   /* Extra large, section padding (mobile) */
48px   /* Very large, section padding (larger) */
52px   /* Page padding (horizontal) */
80px   /* Large section padding (desktop) */
```

**Rule**: Only use values in this scale. No odd values like 3px, 5px, 6px, 7px, 9px, 10px, 14px, 18px, 20px, 22px, 28px, 36px, 40px.

### Component Padding
```css
.card           padding: 22px        /* Standard card content padding */
.button         padding: 8px 16px    /* Button internal spacing */
.form-input     padding: 3px 7px     /* Form field padding (keep minimal) */
.stat           padding: 18px        /* Statistic box padding */
.callout        padding: 14px 18px   /* Callout left+top padding */
.section        padding: 52px 2rem   /* Page section padding */
```

### Grid/Flex Gaps
```css
8px    /* Small component grids, tight arrangements */
16px   /* Standard grid gap, card layouts */
24px   /* Large grid spacing, section-level grids */
```

## 4. Border Radius System (Standardized)

```css
4px     /* Small elements - checkboxes, badges, buttons */
8px     /* Medium elements - callouts (right side), small cards */
10px    /* Standard - most cards, tables, stat boxes */
12px    /* Large - feature cards, prominent cards */
100px   /* Pill buttons - fully rounded, narrow buttons */
```

**Rule**: Use from this list only. No other radius values.

## 5. Borders & Outlines (Standardized)

### Border Widths
```css
1px     /* Standard borders on cards, tables, form inputs */
2px     /* Progress states, accents, emphasis borders */
3px     /* Top accent borders on cards, feature accents */
4px     /* Left accent bars on callouts, main accents */
```

### Border Colors
```css
var(--border)           /* Standard card/table borders, soft dividers */
var(--mineral)          /* Dark borders, emphasis */
var(--zest)             /* Green borders, active/highlight states */
var(--warn)             /* Red borders, negative/warning states */
rgba(X, X, X, 0.15)     /* Soft variants of above with transparency */
```

## 6. Shadows & Visual Effects

### Box Shadows
```css
0 2px 12px rgba(0,0,0,0.2)   /* Site header only - use sparingly */
none                          /* All other elements (clean, flat design) */
```

**Rule**: Avoid shadows on cards and components. Rely on borders and background colors for depth.

### Transitions
```css
0.2s    /* Color/border changes, link interactions */
0.3s    /* Progress animations, image transitions */
0.15s   /* Form field interactions, quick responses */
```

## 7. Component Library

### Cards
```css
.card {
  background: var(--white);
  border-radius: 12px;
  padding: 22px;
  border: 1px solid var(--border);
}

.card.accent-top {
  border-top: 3px solid var(--zest);  /* or --warn, --accent-1 */
  border-radius: 12px;
}

.card.accent-left {
  border-left: 4px solid var(--zest);
  border-radius: 12px;
}
```

### Callouts
```css
.callout {
  border-left: 4px solid var(--zest);
  padding: 16px 20px;
  background: rgba(190,218,129,0.08);
  border-radius: 0 8px 8px 0;
  margin: 16px 0;
}
```

### Buttons
```css
.btn {
  background: var(--zest);
  color: var(--black);
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: var(--zest-hover);
}
```

### Tables
```css
table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

thead {
  background: var(--mineral);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

tbody tr:nth-child(even) {
  background: rgba(64,81,79,0.02);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}
```

### Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(64,81,79,0.08);
  color: var(--mineral);
  border: 1px solid rgba(64,81,79,0.2);
}

.badge.zest {
  background: rgba(190,218,129,0.2);
  color: var(--zest-dark);
  border-color: rgba(122,150,80,0.3);
}

.badge.warn {
  background: rgba(176,74,74,0.1);
  color: var(--warn);
  border-color: rgba(176,74,74,0.2);
}
```

### Form Elements
```css
input, select {
  font-size: 12px;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--stone);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--zest);
  background: var(--white);
}

checkbox {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1.5px solid var(--mineral);
}

checkbox:checked {
  background: var(--mineral);
  color: var(--white);
}
```

## 8. Layout & Containers

### Page Containers
```css
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 52px 2rem;
}

.page-wide {
  max-width: 1200px;
  margin: 0 auto;
  padding: 52px 2rem;
}

@media (max-width: 768px) {
  .page, .page-wide {
    padding: 32px 1rem;
  }
}
```

### Grid Layouts (Responsive)
```css
/* Auto-fit responsive grids (no media query needed) */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.grid.tight {
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.grid.wide {
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Fixed grids - change at 768px */
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

## 9. Responsive Design

### Single Breakpoint: 768px

Changes at 768px and below:
- Multi-column grids collapse to 1-2 columns
- Page padding: `52px 2rem` → `32px 1rem`
- Navigation becomes scrollable
- Sections stack vertically

**Mobile-first approach**:
- Use `auto-fit` + `minmax()` for flexible grids
- Use `clamp()` for responsive font sizes
- Keep padding/spacing ratios consistent

## 10. Consistency Checklist

When adding new components or pages, ensure:

- [ ] Colors use CSS variables only (no hardcoded hex)
- [ ] Font sizes are from the scale (12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56)
- [ ] Border radius is from scale (4, 8, 10, 12, 100)
- [ ] Padding/margins use spacing scale (4, 8, 12, 16, 24, 32, 48, 52, 80)
- [ ] Grid gaps are 8px, 16px, or 24px only
- [ ] Line heights are 1.0, 1.25, 1.5, or 1.65
- [ ] Letter spacing is 0, 1, 2, or 3px
- [ ] Font weights are 300, 400, 500, 600, or 700
- [ ] Component padding follows established patterns
- [ ] Borders use standardized widths and colors
- [ ] No arbitrary shadow values (shadows only on header)
- [ ] Responsive behavior uses `auto-fit` or media queries at 768px

## 11. CSS Organization

Structure CSS in this order:
1. **Root variables** (colors, fonts)
2. **Reset & defaults** (*, body)
3. **Layout** (page, containers, grid)
4. **Headers & navigation**
5. **Components** (cards, buttons, badges, forms)
6. **Typography** (headings, body, prose)
7. **Utilities** (spacing, colors, states)
8. **Responsive** (media queries)
9. **Animations** (transitions, keyframes)
