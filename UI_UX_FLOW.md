# AsAbove - UI/UX Flow & Interaction Patterns

## User Journey Map

### Primary Flow: First-Time User

```
Landing → Explore → Enter Pincode → Loading → Results → Explore Cards → (Optional) About Page
```

### Detailed State Transitions

---

## State 1: Initial Landing

### Visual State
- **Background**: Subtle animated starfield (see Immersive Elements)
- **Hero Section**: Centered, 60vh from top
- **Input Field**: Prominent, below hero text
- **Button**: Primary CTA style

### Interactive Elements
- Input field: Focus state on click
- Button: Disabled until valid input

### Animations
- Fade-in hero section (500ms ease-out)
- Subtle pulse on CTA button (2s loop, subtle)

---

## State 2: Input & Validation

### Visual State (Validating)
- Input border: Changes color on focus (gray → blue)
- Validation icon: Appears inline (checkmark for valid)

### Visual State (Valid)
- Input border: Green with checkmark icon
- Button: Enabled, hover state available
- Optional helper text: "✓ Ready to explore"

### Visual State (Invalid)
- Input border: Red
- Error icon: X icon inline
- Error message: Below input (small, red text)
- Button: Remains disabled

### Interactions
- **Real-time validation**: On each keystroke
- **Format check**: Must be 5 digits, numeric
- **Clear button**: Appears when input has value (X icon on right)

### Transitions
- Border color change: 200ms ease
- Icon appearance: 300ms fade-in
- Error message: Slide-down 200ms

---

## State 3: Submission & Loading

### Trigger
- User clicks "Explore Sky" or presses Enter (when valid)

### Loading Animation Sequence

#### Step 1: Button State Change (0ms)
- Button text: "Explore Sky" → "Finding location..."
- Button icon: Spinner replaces text
- Button: Disabled state
- Input: Disabled, grayed out

#### Step 2: Hero Fade (200ms delay)
- Hero section: Fade out (opacity 0.3)
- Transition: 400ms ease-out

#### Step 3: Loading Indicator (500ms delay)
- Central loading spinner appears
- Message: "Finding your location..."
- Optional: Progress indicator or skeleton loader

### Loading Indicator Design
- **Style**: Spinning orbs (space theme)
- **Color**: Accent color (blue/purple)
- **Size**: Medium (not overwhelming)
- **Position**: Center of hero area or below

### Duration Estimate
- Geocoding API: ~500ms - 2s
- Celestial data fetch: ~1s - 3s
- **Total**: ~1.5s - 5s typical

---

## State 4: Location Resolution

### Success Path

#### Transition Animation
1. **Location Banner Slide-in** (0ms)
   - From top: Slide down 400ms ease-out
   - Banner: "📍 Viewing from [City], [State]"
   - Background: Subtle accent color

2. **Results Section Fade-in** (300ms delay)
   - Grid container: Fade in 500ms
   - Initial opacity: 0 → 1

3. **Card Stagger Animation** (500ms delay)
   - Cards appear in sequence (top to bottom)
   - Delay between cards: 100ms
   - Animation: Fade + slide up (translateY 20px → 0)

#### Card Animation Details
```
Card 1: Appears at 500ms
Card 2: Appears at 600ms
Card 3: Appears at 700ms
Card 4: Appears at 800ms
... and so on
```

### Error Path

#### Error Display
1. **Error Message** (0ms)
   - Slide down from top (400ms)
   - Message: "Couldn't find location for that pincode..."
   - Background: Light red/orange

2. **Input Re-focus** (500ms delay)
   - Input field: Highlight (focus)
   - Border: Red accent
   - Cursor: Auto-positioned

3. **Hero Restore** (300ms delay)
   - Hero section: Fade back to full opacity
   - Transition: 400ms ease-in

---

## State 5: Results Display

### Grid Layout

#### Responsive Breakpoints
- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (> 1024px): 3 columns

#### Grouping Logic
Cards organized by visibility status (see below)

### Card Status Ordering

#### Group 1: Currently Visible (Top)
- **Background**: Subtle green tint (rgba(34, 197, 94, 0.05))
- **Border**: Green accent (1px)
- **Badge**: Green with checkmark icon
- **Priority**: Highest (shown first)

#### Group 2: Rising Soon (Middle)
- **Background**: Subtle amber tint (rgba(245, 158, 11, 0.05))
- **Border**: Amber accent (1px)
- **Badge**: Amber with clock icon
- **Priority**: Medium (shown second)

#### Group 3: Below Horizon (Bottom)
- **Background**: Subtle gray tint (rgba(107, 114, 128, 0.05))
- **Border**: Gray accent (1px)
- **Badge**: Gray with moon icon
- **Priority**: Low (shown last)

### Card Interaction States

#### Default State
- **Elevation**: Subtle shadow (2px blur)
- **Transform**: None
- **Cursor**: Default

#### Hover State
- **Elevation**: Increased shadow (4px blur)
- **Transform**: `scale(1.02)` translateY(-4px)
- **Transition**: 200ms ease
- **Cursor**: Pointer

#### Focus State (Keyboard Navigation)
- **Outline**: 2px solid accent color
- **Outline offset**: 4px
- **Transform**: Same as hover (for accessibility)

#### Active State (Click/Tap)
- **Transform**: `scale(0.98)`
- **Transition**: 100ms ease

### Card Content Layout

#### Card Structure (Mobile-First)
```
┌─────────────────────────┐
│ [Icon/Image]            │ ← Top section (1/3 height)
│                         │
├─────────────────────────┤
│ Planet Name             │ ← Header
│ [Type Badge]            │
├─────────────────────────┤
│ [Status Badge]          │ ← Status section
├─────────────────────────┤
│ Magnitude: X.XX         │ ← Data section (scrollable if long)
│ Altitude: XX°           │
│ Azimuth: XXX°           │
│                         │
│ Rise: HH:MM AM/PM       │
│ Set: HH:MM AM/PM        │
│                         │
│ [Description]           │
└─────────────────────────┘
```

#### Responsive Adjustments
- **Desktop**: Horizontal layout option (icon left, content right)
- **Tablet**: Vertical stack (current)
- **Mobile**: Full width, vertical stack

---

## State 6: Real-Time Updates

### Update Mechanism
- **Interval**: Every 5 minutes (or user-triggered refresh)
- **Method**: Recalculate altitude/azimuth based on current time

### Status Change Animation
When a card's status changes:

#### Transition Sequence
1. **Pulse Animation** (0ms)
   - Card: Pulse effect (scale 1 → 1.05 → 1)
   - Duration: 600ms
   - Color: Brief flash of new status color

2. **Badge Update** (300ms delay)
   - Old badge: Fade out 200ms
   - New badge: Fade in 200ms
   - Smooth color transition

3. **Border Update** (300ms delay)
   - Border color: Transitions to new status color
   - Duration: 400ms ease

### Visual Feedback
- **Toast notification** (optional): "Jupiter is now visible!" (appears top-right, auto-dismiss 3s)

---

## Interaction Patterns

### Keyboard Navigation

#### Tab Order
1. Pincode input
2. "Explore Sky" button
3. Location banner (if visible)
4. Planet cards (in order: visible → rising → below)
5. "Refresh" button (if visible)
6. Footer links

#### Keyboard Shortcuts
- **Enter**: Submit search (when input focused)
- **Escape**: Clear input or close error message
- **Arrow keys**: Navigate cards (when card focused)

### Touch Interactions (Mobile)

#### Swipe Gestures
- **Card swipe**: None (keeps content accessible)
- **Pull to refresh**: Optional (refresh positions)

#### Tap Targets
- **Minimum size**: 44px × 44px (Apple HIG, WCAG AA)
- **Card tap**: Expand details (optional future feature)

### Screen Reader Support

#### Announcements
- Status changes: "Jupiter is now visible"
- Loading: "Searching for location"
- Results: "Found 8 celestial objects"
- Errors: "Could not find location for pincode"

#### ARIA Labels
- All interactive elements labeled
- Status conveyed in text (not just color)
- Descriptive labels for cards

---

## Transition Timing

### Standard Durations
- **Micro-interactions**: 100-200ms (button presses, hovers)
- **Status changes**: 200-300ms (border color, badge updates)
- **Page transitions**: 400-500ms (fade, slide)
- **Complex animations**: 500-800ms (card stagger, hero fade)

### Easing Functions
- **Ease-out**: Most common (entering elements)
- **Ease-in**: Exiting elements
- **Ease-in-out**: Symmetric animations
- **Spring**: Card hover (slight bounce)

---

## Error States & Edge Cases

### Empty Results
**Scenario**: No celestial objects visible

**Display**:
- Empty state illustration (simple SVG)
- Message: "No celestial objects are currently visible..."
- Suggestion: "Check back tonight!" or "Try a different time"

### Network Failures
**Scenario**: API requests fail

**Display**:
- Error banner: Top of page, red/orange background
- Message: "Unable to fetch data. Please check your connection."
- Action: Retry button (reloads search)

### Invalid Time/Location
**Scenario**: Location outside supported range

**Display**:
- Message: "Location calculation unavailable for this area."
- Fallback: Generic sky view or suggested alternative

---

## Performance Considerations

### Animation Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during active animations)

### Loading Performance
- Skeleton loaders for cards (perceived performance)
- Progressive enhancement (basic layout first, then animations)
- Lazy load card descriptions if long

### Accessibility Performance
- Respect `prefers-reduced-motion`: Disable animations
- Reduce animation duration by 50% when enabled
- Ensure core functionality works without JavaScript

---

## Design Tokens Reference

### Colors (Status-Based)
```css
/* Status Colors */
--status-visible: #22c55e;    /* Green */
--status-rising: #f59e0b;     /* Amber */
--status-below: #6b7280;      /* Gray */
--status-error: #ef4444;      /* Red */

/* Background Tints (10% opacity) */
--bg-visible: rgba(34, 197, 94, 0.05);
--bg-rising: rgba(245, 158, 11, 0.05);
--bg-below: rgba(107, 114, 128, 0.05);
```

### Spacing
```css
/* Card Spacing */
--card-gap-mobile: 1rem;      /* 16px */
--card-gap-tablet: 1.5rem;    /* 24px */
--card-gap-desktop: 2rem;     /* 32px */
```

### Timing
```css
/* Animation Durations */
--duration-fast: 200ms;
--duration-normal: 400ms;
--duration-slow: 600ms;
```

---

## Next Steps for Implementation

1. **Create State Machine**: Define all states and transitions
2. **Build Loading States**: Design and implement loading indicators
3. **Implement Animations**: Start with CSS transitions, enhance with JS if needed
4. **Test Interactions**: Keyboard, touch, screen reader
5. **Performance Audit**: Ensure 60fps animations, fast load times

---

**Document Version:** 1.0  
**Last Updated:** Initial UI/UX Flow  
**Status:** Ready for Implementation
