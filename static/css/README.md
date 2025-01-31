# Tarot App CSS Architecture
> A comprehensive guide to the CSS structure and usage

## Table of Contents
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [CSS Architecture](#css-architecture)
- [Best Practices](#best-practices)
- [Components](#components)
- [Utilities](#utilities)
- [Responsive Design](#responsive-design)
- [Browser Support](#browser-support)

## Directory Structure
```
/static/css/
├── base/
│   ├── variables.css     # Global variables and CSS custom properties
│   ├── reset.css         # CSS resets and base styles
│   ├── typography.css    # Text styles and font settings
│   ├── layout.css        # Grid and flexbox utilities
│   ├── themes.css        # Color themes and gradients
│   └── optimizations.css # Performance optimizations
│
├── components/
│   ├── steps.css         # Step container styles
│   ├── buttons.css       # Button variations
│   ├── cards.css         # Card styles and animations
│   ├── forms.css         # Form elements and inputs
│   ├── modals.css        # Modal and overlay styles
│   └── animations.css    # Animation keyframes
│
├── layout/
│   └── responsive.css    # Media queries and responsive styles
│
└── main.css             # Main CSS file importing all modules
```

## Getting Started
1. Include the main CSS file in your HTML:
```html
<link rel="stylesheet" href="/static/css/main.css">
```

2. All styles are modular and can be customized through CSS variables defined in `variables.css`.

## CSS Architecture

### Base Styles
- **variables.css**: Global CSS custom properties
  ```css
  /* Example usage */
  .element {
    color: var(--color-primary);
    padding: var(--spacing-md);
  }
  ```

- **typography.css**: Text styling utilities
  ```css
  /* Example usage */
  <h1 class="title title-xl">Large Title</h1>
  <p class="cosmic-message">Message text</p>
  ```

### Component Styles

#### Buttons
```html
<!-- Primary Button -->
<button class="cosmic-glassy-button1">Primary Action</button>

<!-- Secondary Button -->
<button class="cosmic-glassy-button2">Secondary Action</button>
```

#### Cards
```html
<!-- Basic Card -->
<div class="card">
  <div class="card-face card-front">Front content</div>
  <div class="card-face card-back">Back content</div>
</div>
```

#### Forms
```html
<!-- Input with Icon -->
<div class="input-container">
  <img src="icon.svg" class="input-icon" alt="">
  <input type="text" class="input" placeholder="Enter text">
</div>
```

### Utility Classes

#### Layout
```html
<!-- Flex Container -->
<div class="flex items-center justify-between">
  <!-- Content -->
</div>

<!-- Grid Container -->
<div class="grid grid-cols-3 gap-4">
  <!-- Grid items -->
</div>
```

#### Spacing
```html
<!-- Margin and Padding -->
<div class="m-4 p-3">
  <div class="mx-auto my-2">Centered content</div>
</div>
```

## Best Practices

### 1. Using CSS Variables
Always use CSS variables for consistent styling:
```css
/* Good */
.element {
  color: var(--color-primary);
  margin: var(--spacing-md);
}

/* Avoid */
.element {
  color: #A59AD1;
  margin: 1rem;
}
```

### 2. Responsive Design
Use the provided media query mixins:
```css
@media (max-width: 768px) {
  .element {
    width: 100%;
  }
}
```

### 3. Animation Performance
Use hardware-accelerated properties:
```css
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}
```

## Browser Support
- Modern browsers (last 2 versions)
- iOS Safari 12+
- Android Chrome 80+

### Special Considerations
- iOS backdrop-filter fallbacks included
- Touch device optimizations
- Reduced motion support

## Responsive Design
Breakpoints:
- Mobile: < 480px
- Tablet: < 768px
- Desktop: < 1024px
- Large: ≥ 1024px

```css
/* Mobile First Approach */
.element {
  width: 100%;
}

@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

## Performance Tips

1. Use CSS classes for animations:
```html
<div class="fade-in slide-up">Animated content</div>
```

2. Hardware acceleration for smooth animations:
```html
<div class="gpu">Hardware accelerated element</div>
```

3. Lazy loading for images:
```html
<img loading="lazy" src="image.jpg" alt="">
```

## Development Workflow

1. Modify variables in `variables.css` for global changes
2. Add component-specific styles to appropriate component files
3. Use utility classes from `layout.css` for common patterns
4. Add responsive styles to `responsive.css`

## Customization

### Adding New Colors
In `variables.css`:
```css
:root {
  --color-custom: #hexcode;
}
```

### Creating New Components
1. Create new file in `/components`
2. Import in `main.css`
3. Use existing variables and utilities

## Troubleshooting

### Common Issues

1. Styles not applying
   - Check file import order in `main.css`
   - Verify class names
   - Check specificity

2. Animations not working
   - Verify browser support
   - Check for reduced motion settings
   - Inspect hardware acceleration

3. Mobile layout issues
   - Test viewport meta tag
   - Verify media query breakpoints
   - Check touch target sizes

## Contributing
1. Follow existing naming conventions
2. Use CSS variables for consistency
3. Add responsive styles
4. Document new components