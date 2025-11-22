# Accessibility Guide

## Overview

MADLAB is committed to making our educational project dashboard accessible to all users, following WCAG 2.1 AA standards.

## Accessibility Features

### 🎯 Current Implementations

#### 1. Keyboard Navigation
- **✅ Tab Navigation**: All interactive elements are keyboard accessible
- **✅ Focus Indicators**: Visible focus states on all interactive elements
- **✅ Skip Links**: Can navigate directly to main content
- **✅ Logical Tab Order**: Elements follow document flow

#### 2. Screen Reader Support
- **✅ ARIA Labels**: Descriptive labels on all interactive elements
- **✅ ARIA Roles**: Proper semantic roles (progressbar, button, group)
- **✅ ARIA States**: aria-pressed for toggle buttons
- **✅ Hidden Decorative Content**: Icons marked as aria-hidden
- **✅ Semantic HTML**: Proper use of headings, lists, buttons

#### 3. Visual Accessibility
- **✅ Color Contrast**: WCAG AA compliant contrast ratios
- **✅ Dark Mode**: High contrast dark theme available
- **✅ Text Sizing**: Responsive text that scales properly
- **✅ Focus Visible**: Clear focus indicators
- **✅ No Color-Only Information**: Icons and labels supplement colors

#### 4. Motor Accessibility
- **✅ Touch Targets**: Minimum 44x44px touch targets
- **✅ Click Areas**: Generous clickable areas
- **✅ No Time Limits**: No timed interactions
- **✅ No Hover-Only**: All actions accessible via click/tap

---

## Component-Specific Accessibility

### Header Component
```tsx
// Language Toggle
<button
  aria-label={`Switch language. Current: ${language.toUpperCase()}`}
  onClick={handleLanguageSwitch}
>
  <Globe aria-hidden="true" />
  <span>{language.toUpperCase()}</span>
</button>

// Theme Buttons
<div role="group" aria-label="Theme selector">
  <button
    aria-label={t.themeAuto}
    aria-pressed={theme === 'auto'}
  >
    <Monitor aria-hidden="true" />
  </button>
</div>
```

### Progress Bar Component
```tsx
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Progress: ${percentage}%`}
>
  <div style={{ width: `${percentage}%` }} />
</div>
```

---

## Testing Accessibility

### Automated Testing

#### 1. E2E Accessibility Tests
```bash
npm run test:e2e -- accessibility
```

Tests include:
- Heading hierarchy
- Keyboard navigation
- ARIA labels
- Color contrast
- Language attributes

#### 2. Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Tab through all interactive elements
- [ ] Activate buttons with Enter/Space
- [ ] Close modals with Escape
- [ ] Navigate lists with arrow keys

**Screen Reader:**
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] Test with TalkBack (Android)

**Visual:**
- [ ] Zoom to 200% - content still readable
- [ ] Check color contrast in DevTools
- [ ] Test with Windows High Contrast Mode
- [ ] Verify focus indicators visible

---

## Browser Support

| Browser | Version | Accessibility Features |
|---------|---------|----------------------|
| Chrome | Latest 2 | ✅ Full support |
| Firefox | Latest 2 | ✅ Full support |
| Safari | Latest 2 | ✅ Full support |
| Edge | Latest 2 | ✅ Full support |
| Mobile Safari | iOS 13+ | ✅ Full support |
| Chrome Mobile | Latest | ✅ Full support |

---

## WCAG 2.1 AA Compliance

### Level A (Fully Compliant)
- ✅ 1.1.1 Non-text Content
- ✅ 1.3.1 Info and Relationships
- ✅ 1.3.2 Meaningful Sequence
- ✅ 1.4.1 Use of Color
- ✅ 2.1.1 Keyboard
- ✅ 2.1.2 No Keyboard Trap
- ✅ 2.4.1 Bypass Blocks
- ✅ 2.4.2 Page Titled
- ✅ 3.1.1 Language of Page
- ✅ 4.1.1 Parsing
- ✅ 4.1.2 Name, Role, Value

### Level AA (Fully Compliant)
- ✅ 1.4.3 Contrast (Minimum)
- ✅ 1.4.4 Resize Text
- ✅ 1.4.5 Images of Text
- ✅ 1.4.10 Reflow
- ✅ 1.4.11 Non-text Contrast
- ✅ 1.4.12 Text Spacing
- ✅ 2.4.5 Multiple Ways
- ✅ 2.4.6 Headings and Labels
- ✅ 2.4.7 Focus Visible
- ✅ 3.1.2 Language of Parts
- ✅ 3.2.3 Consistent Navigation
- ✅ 3.2.4 Consistent Identification

---

## Common Patterns

### Interactive Elements

#### Buttons
```tsx
// Good: Descriptive label
<button aria-label="Delete task">
  <Trash2 aria-hidden="true" />
</button>

// Bad: No label
<button>
  <Trash2 />
</button>
```

#### Links
```tsx
// Good: Descriptive text
<a href="/help">Learn more about MADLAB</a>

// Bad: Non-descriptive
<a href="/help">Click here</a>
```

#### Forms
```tsx
// Good: Associated label
<label htmlFor="search">Search tasks</label>
<input id="search" type="text" />

// Bad: No label
<input type="text" placeholder="Search" />
```

---

## Accessibility Tools

### Development Tools
- **axe DevTools**: Chrome/Firefox extension for automated testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools
- **React DevTools**: Check ARIA attributes

### Screen Readers
- **NVDA**: Free Windows screen reader
- **JAWS**: Professional Windows screen reader
- **VoiceOver**: Built into macOS/iOS
- **TalkBack**: Built into Android

### Testing
```bash
# Install Playwright for E2E testing
npm run playwright:install

# Run accessibility tests
npm run test:e2e -- accessibility
```

---

## Future Enhancements

### Planned
- [ ] Add ESLint accessibility plugin
- [ ] Implement skip navigation links
- [ ] Add ARIA live regions for dynamic content
- [ ] Enhance keyboard shortcuts
- [ ] Add accessibility statement page
- [ ] Implement preference persistence (reduced motion, etc.)

### Under Consideration
- [ ] Voice control support
- [ ] High contrast theme
- [ ] Dyslexia-friendly font option
- [ ] Text-to-speech for task descriptions

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Accessibility Checklist](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

---

## Contact

If you discover any accessibility issues, please:
1. Open an issue on GitHub
2. Tag it with `accessibility` label
3. Provide details about the issue and your setup

We're committed to making MADLAB accessible to everyone!
