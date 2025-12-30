# UI/UX Design System - Jobbr AI

## Overview
This document outlines the design system, color palette, typography, components, and animations used in the Jobbr AI interview simulator redesign.

## Color Palette

### Primary Colors
- **Indigo**: `#4F46E5` (indigo-600) - Primary actions, CTAs
- **Purple**: `#9333EA` (purple-600) - Secondary accents, gradients
- **Pink**: `#EC4899` (pink-600) - Gradient accents

### Feature-Specific Colors
- **Blue/Cyan**: Written Test
  - Primary: `blue-500` to `cyan-500`
  - Background: `blue-50` to `cyan-50`
  - Icon: `blue-600`

- **Purple/Pink**: Technical Interview
  - Primary: `purple-500` to `pink-500`
  - Background: `purple-50` to `pink-50`
  - Icon: `purple-600`

- **Emerald/Teal**: HR/Behavioral Interview
  - Primary: `emerald-500` to `teal-500`
  - Background: `emerald-50` to `teal-50`
  - Icon: `emerald-600`

### Neutral Colors
- **Gray Scale**: Used for text, borders, and backgrounds
  - `gray-50` to `gray-900`
  - Primary text: `gray-900`
  - Secondary text: `gray-600`
  - Muted text: `gray-500`

## Typography

### Font Family
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`

### Type Scale
- **Hero Title**: `text-5xl md:text-6xl lg:text-7xl` (48px - 72px)
- **Section Title**: `text-4xl md:text-5xl` (36px - 48px)
- **Card Title**: `text-2xl` (24px)
- **Body Large**: `text-xl md:text-2xl` (20px - 24px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

### Font Weights
- **Bold**: `font-bold` (700) - Headings
- **Semibold**: `font-semibold` (600) - Buttons, emphasis
- **Medium**: `font-medium` (500) - Labels
- **Regular**: `font-normal` (400) - Body text

## Spacing System

### Container Spacing
- **Container Padding**: `px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-16 md:py-24`
- **Card Padding**: `p-6` to `p-8`

### Grid Gaps
- **Card Grid**: `gap-6` to `gap-8`
- **Button Groups**: `gap-4`

## Components

### Buttons

#### Primary Button
- Gradient background: `from-indigo-600 to-purple-600`
- Shadow: `shadow-lg shadow-indigo-500/50`
- Hover: Scale 1.05, enhanced shadow
- Tap: Scale 0.95
- Includes animated gradient overlay on hover

#### Secondary Button
- White background with border
- Subtle shadow on hover
- Same scale animations

### Cards

#### Feature Cards
- White background with subtle border
- Shadow: `shadow-lg` → `shadow-2xl` on hover
- Hover lift: `-8px` translate
- Icon with scale animation on hover
- Border radius: `rounded-2xl`

#### Round Selection Cards
- Enhanced with gradient backgrounds on hover
- Shine effect animation
- Status badges for completion
- Color-coded borders

### Animations

#### Entrance Animations
- **Fade In + Slide Up**: `opacity: 0 → 1, y: 20 → 0`
- **Stagger Children**: 0.1s delay between items
- **Duration**: 0.5s - 0.6s
- **Easing**: `easeOut`

#### Hover Animations
- **Scale**: 1.05 (buttons), 1.1 (icons)
- **Lift**: -8px translate (cards)
- **Shadow Enhancement**: Increased shadow on hover
- **Gradient Overlay**: Smooth slide-in effect

#### Micro-interactions
- **Button Press**: Scale 0.95
- **Icon Rotate**: Arrow icons translate on hover
- **Shine Effect**: Gradient sweep on card hover

## Layout Guidelines

### Hero Section
- Centered content with max-width container
- Large, bold typography
- Clear CTA placement
- Subtle background pattern

### Feature Sections
- Grid layout (1 column mobile, 3 columns desktop)
- Consistent card heights
- Visual hierarchy with icons
- Clear spacing between elements

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

## Accessibility

### Focus States
- Visible focus outline: `outline: 2px solid indigo-600`
- Offset: `2px`
- Applied via `:focus-visible`

### Color Contrast
- All text meets WCAG AA standards
- High contrast for interactive elements
- Clear visual feedback for states

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Clear focus indicators

## Animation Principles

1. **Purposeful**: Every animation serves a UX purpose
2. **Subtle**: Enhance without distracting
3. **Fast**: Quick transitions (300ms - 600ms)
4. **Smooth**: Ease-out timing functions
5. **Respectful**: Reduced motion support via Framer Motion

## Implementation Notes

### Framer Motion
- Used for all animations
- Respects `prefers-reduced-motion`
- Optimized for performance

### Performance
- Animations use GPU-accelerated properties (transform, opacity)
- Viewport-based animations only trigger when visible
- Staggered animations prevent layout thrashing

## Component Library

### Reusable Components
1. **AnimatedButton**: Configurable button with variants
2. **FeatureCard**: Consistent feature display card
3. Custom hooks for animation variants

## Future Enhancements
- Dark mode support
- Additional animation variants
- Loading states with skeletons
- Toast notifications
- Modal components

