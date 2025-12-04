# Balkar Theme System

The Balkar application now includes a comprehensive theming system that allows you to easily change colors across the entire application.

## Overview

The theme system separates **thematic colors** (which change between themes) from **neutral colors** (which remain constant). This approach ensures consistency while allowing for brand flexibility.

### Color Categories

**Thematic Colors (changeable):**
- Primary colors (main brand color)
- Secondary colors (supporting brand color)
- Accent colors (highlight color)
- Status colors (success, warning, error, info)

**Neutral Colors (constant):**
- Black, white, and grey variants
- These provide consistency and readability across all themes

## File Structure

```
src/assets/scss/themes/
├── _index.scss           # Main theme entry point with utility functions
├── _theme-default.scss   # Default green theme
├── _theme-blue.scss      # Alternative blue theme example
└── README.md            # This file
```

## Using Themes

### 1. SCSS Variables and Mixins

In your SCSS files, you can use theme variables and mixins:

```scss
// Use theme variables directly
.my-component {
  background-color: $theme-primary;
  border: 1px solid $theme-accent-blue;
}

// Use theme mixins
.my-button {
  @include theme-button('primary', 'filled');
}

.my-text {
  @include theme-text('accent');
}

.my-background {
  @include theme-background('success');
}
```

### 2. CSS Custom Properties

In your Vue component styles, use CSS custom properties:

```scss
<style scoped>
.component {
  background-color: var(--theme-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border-accent);
}

// For gradients with alpha transparency
.gradient {
  background: linear-gradient(
    180deg, 
    rgba(var(--theme-primary-rgb), 0.9) 0%, 
    rgba(var(--theme-primary-rgb), 0) 100%
  );
}
</style>
```

### 3. Available CSS Custom Properties

#### Theme Colors
- `--theme-primary`, `--theme-primary-light`, `--theme-primary-hover`
- `--theme-secondary`, `--theme-secondary-light`, `--theme-secondary-hover`
- `--theme-accent-blue`, `--theme-accent-blue-light`, `--theme-accent-blue-bg`

#### RGB Values (for alpha blending)
- `--theme-primary-rgb`: RGB values without alpha for use with `rgba()`
- `--theme-secondary-rgb`: RGB values for secondary color
- `--theme-accent-blue-rgb`: RGB values for accent color

#### Semantic Colors
- `--color-primary`, `--color-secondary`, `--color-accent`
- `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-inverse`
- `--color-background-primary`, `--color-background-secondary`, `--color-background-muted`
- `--color-border-primary`, `--color-border-secondary`, `--color-border-accent`

#### Legacy Variables (for backward compatibility)
- `--Green`, `--Blau-fosc`, `--Mimosa`, `--Blue-Grey`, etc.

## Creating New Themes

To create a new theme:

1. Create a new file in `src/assets/scss/themes/_theme-newname.scss`
2. Import the base theme and override color variables:

```scss
// Import base theme
@import 'theme-default';

// Override theme colors
$theme-primary: #your-primary-color !default;
$theme-secondary: #your-secondary-color !default;
// ... other overrides

// Update CSS custom properties
:root {
  --theme-primary: #{$theme-primary};
  --theme-primary-rgb: red, green, blue; // RGB values
  // ... other custom properties
}
```

## Switching Themes

To switch to a different theme, update the import in `src/assets/scss/themes/_index.scss`:

```scss
// Change from:
@import 'theme-default';

// To:
@import 'theme-blue';
```

## Available Mixins

### Button Theming
```scss
@include theme-button($type, $style);
// $type: 'primary' | 'secondary'
// $style: 'filled' | 'outlined'
```

### Text Colors
```scss
@include theme-text($type);
// $type: 'primary' | 'secondary' | 'muted' | 'accent' | 'inverse'
```

### Background Colors
```scss
@include theme-background($type);
// $type: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'info'
```

## Migration Notes

- **Legacy variables are maintained** for backward compatibility
- **Existing components** will continue to work without changes
- **New components** should use the new theme system
- **Gradual migration** is possible - update components one by one

## Best Practices

1. **Use semantic names** when possible (`--color-primary` vs `--Green`)
2. **Use CSS custom properties** in Vue components for dynamic theming
3. **Use SCSS variables and mixins** in global styles for compilation benefits
4. **Keep neutral colors constant** for accessibility and consistency
5. **Test themes** with different color combinations for accessibility

## Example Theme Implementation

See `_theme-blue.scss` for an example of how the default green theme can be transformed into a blue-focused theme while maintaining the same structure and functionality.