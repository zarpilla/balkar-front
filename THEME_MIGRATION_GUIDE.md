# Theme System Migration Guide

## Overview

This project now includes a comprehensive SCSS theme system that extracts colors from components and allows for easy theme switching. The system separates thematic colors (that change between themes) from neutral colors (that remain consistent).

## Theme Structure

### Core Files

1. **`src/assets/scss/themes/_theme-default.scss`** - Primary theme with green color scheme
2. **`src/assets/scss/themes/_theme-blue.scss`** - Alternative blue theme demonstration
3. **`src/assets/scss/themes/_index.scss`** - Theme utilities, mixins, and functions

### Color Categories

#### Thematic Colors (Change between themes)
- Primary: `#44B08E` (green) → `#2563EB` (blue)
- Secondary: `#F0C05A` (yellow) → `#059669` (green)
- Accent: `#F0C05A` (yellow) → `#FBBF24` (yellow)
- Status colors: success, warning, error, info

#### Neutral Colors (Consistent across themes)
- Grays: `#000000`, `#ffffff`, `#f8f9fa`, `#edeef3`, etc.
- Text colors, backgrounds, borders

#### SVG Icon Colors (Theme-aware)
- `--icon-primary`: Matches theme primary color
- `--icon-secondary`: Matches theme secondary color
- `--icon-accent`: Matches theme accent color
- `--icon-placeholder`: For placeholder rectangles (`#D9D9D9`)
- `--icon-dark`: For dark icons (`#1C1B1F`, `#000000`)
- `--icon-muted`: For muted/secondary icons
- `--icon-orange`: For error states (`#E3744A`)

## Implementation Details

### CSS Custom Properties

All theme colors are exported as CSS custom properties for use in components:

```css
:root {
  --theme-primary: #44B08E;
  --theme-secondary: #F0C05A;
  --theme-accent: #F0C05A;
  
  /* SVG Icon colors */
  --icon-primary: #44B08E;
  --icon-secondary: #F0C05A;
  --icon-placeholder: #D9D9D9;
  --icon-dark: #1C1B1F;
  /* ... more icon variables */
}
```

### SCSS Variables and Mixins

Theme provides utility mixins for common styling patterns:

```scss
// Use in SCSS files
@include theme-button(primary);
@include theme-text(secondary);
@include theme-background(muted);

// Access individual colors
$primary: theme-color('primary');
$secondary: theme-color('secondary');
```

### SVG Color Migration

Hardcoded SVG fill colors have been replaced with CSS custom properties:

**Before:**
```html
<path fill="#44B08E" d="..." />
<rect fill="#D9D9D9" />
```

**After:**
```html
<path fill="var(--icon-primary, #44B08E)" d="..." />
<rect fill="var(--icon-placeholder, #D9D9D9)" />
```

## Updated Components

### Fully Migrated Components

- **CustomToast.vue** - Toast notification styling
- **LearningSpaceBanner.vue** - Course banner buttons
- **ForumSpace.vue** - Forum interface elements
- **BookmarksSpace.vue** - Bookmark icons
- **ProgressSpace.vue** - Progress indicators
- **ContentQuiz.vue** - Quiz radio buttons
- **RadioOption.vue** - Radio button states (correct/incorrect/selected)
- **LearningSpaceModuleMenu.vue** - Module navigation icons
- **ContentSlider.vue** - Slider navigation arrows

### Core Styles Migrated

- **custom.scss** - Global styles updated to use theme variables
- **Bootstrap overrides** - Button and form styling uses theme colors

## Theme Switching

To switch themes, change the import in your main SCSS file:

```scss
// Default green theme
@import './themes/theme-default';

// Alternative blue theme  
@import './themes/theme-blue';
```

Or dynamically load theme CSS files for runtime switching.

## Usage Guidelines

### For Designers
- Use theme variables for all primary brand colors
- Neutral colors (grays, black, white) can remain hardcoded
- Consider how colors will look in alternative themes

### For Developers

#### When adding new colors:
1. Determine if the color is thematic or neutral
2. If thematic, add to theme files as SCSS variable and CSS custom property
3. Use CSS custom properties in components with fallbacks
4. Test with multiple themes

#### Component color patterns:
```scss
// Good - uses theme variables
.button {
  background-color: var(--theme-primary, #44B08E);
  border-color: var(--theme-primary-dark, #3A9B7A);
}

// Good - neutral colors can be hardcoded
.text-muted {
  color: #6c757d;
}

// Avoid - hardcoded thematic colors
.button {
  background-color: #44B08E;
}
```

#### SVG icon patterns:
```html
<!-- Primary brand color icons -->
<path fill="var(--icon-primary, #44B08E)" />

<!-- Success/positive state -->
<circle fill="var(--icon-success, #28a745)" />

<!-- Error/negative state -->
<circle fill="var(--icon-error, #dc3545)" />

<!-- Placeholder/background -->
<rect fill="var(--icon-placeholder, #D9D9D9)" />

<!-- Dark content -->
<path fill="var(--icon-dark, #1C1B1F)" />
```

## Benefits

1. **Consistent Branding** - Centralized color management
2. **Easy Theme Switching** - Change entire color scheme by switching theme file
3. **Maintainability** - Update colors in one place
4. **Scalability** - Easy to add new themes
5. **Fallback Support** - CSS custom properties include fallback values
6. **SVG Theme Support** - Icons adapt to theme colors automatically

## Next Steps

1. **Complete Migration** - Continue updating remaining components with hardcoded colors
2. **Additional Themes** - Create dark theme, high contrast theme, etc.
3. **Runtime Switching** - Implement dynamic theme switching UI
4. **Documentation** - Document color usage guidelines for new developers
5. **Testing** - Test all components with different themes

## Build Status

✅ **Build Successful** - All theme changes compile without errors
✅ **Type Safety** - TypeScript integration maintained  
✅ **Backwards Compatibility** - Fallback values ensure compatibility
✅ **Performance** - No impact on bundle size or runtime performance