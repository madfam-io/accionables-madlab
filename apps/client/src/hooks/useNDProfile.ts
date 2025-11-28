import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

/**
 * Hook to apply ND profile settings to the document
 * This modifies CSS variables and classes based on the active profile
 */
export function useNDProfile() {
  const { ndProfile } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply visual preferences
    const { visual, motivation, notifications } = ndProfile;

    // Font scale
    root.style.setProperty('--nd-font-scale', visual.fontScale.toString());
    root.style.fontSize = `${visual.fontScale * 100}%`;

    // Font family
    root.classList.remove('font-default', 'font-dyslexia', 'font-mono');
    if (visual.fontFamily === 'dyslexia-friendly') {
      root.classList.add('font-dyslexia');
    } else if (visual.fontFamily === 'monospace') {
      root.classList.add('font-mono');
    } else {
      root.classList.add('font-default');
    }

    // Color intensity
    root.classList.remove('colors-muted', 'colors-balanced', 'colors-vibrant');
    root.classList.add(`colors-${visual.colorIntensity}`);

    // Information density
    root.classList.remove('density-minimal', 'density-comfortable', 'density-dense');
    root.classList.add(`density-${visual.density}`);

    // Motion preferences
    root.classList.remove('motion-none', 'motion-reduced', 'motion-full');
    root.classList.add(`motion-${visual.motion}`);

    if (visual.motion === 'none') {
      root.style.setProperty('--nd-animation-duration', '0ms');
      root.style.setProperty('--nd-transition-duration', '0ms');
    } else if (visual.motion === 'reduced') {
      root.style.setProperty('--nd-animation-duration', '150ms');
      root.style.setProperty('--nd-transition-duration', '100ms');
    } else {
      root.style.setProperty('--nd-animation-duration', '300ms');
      root.style.setProperty('--nd-transition-duration', '200ms');
    }

    // Contrast
    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${visual.contrast}`);

    // Gamification level
    root.classList.remove('gamification-none', 'gamification-light', 'gamification-full');
    root.classList.add(`gamification-${motivation.gamification}`);

    // Celebration style
    root.classList.remove('celebrations-none', 'celebrations-subtle', 'celebrations-enthusiastic');
    root.classList.add(`celebrations-${motivation.celebrationStyle}`);

    // Progress style
    root.dataset.progressStyle = motivation.progressStyle;

    // Notification style
    root.dataset.reminderStyle = notifications.reminderStyle;

    // Profile identifier for CSS targeting
    root.dataset.ndProfile = ndProfile.preset;

    // Cleanup function to reset when component unmounts
    return () => {
      // Only reset font size to default, keep other classes
      root.style.fontSize = '100%';
    };
  }, [ndProfile]);

  return ndProfile;
}

/**
 * CSS classes to add to index.css for ND profile support:
 *
 * .font-dyslexia { font-family: 'OpenDyslexic', sans-serif; }
 * .font-mono { font-family: 'JetBrains Mono', monospace; }
 *
 * .colors-muted { --color-saturation: 0.7; }
 * .colors-vibrant { --color-saturation: 1.2; }
 *
 * .density-minimal { --spacing-scale: 1.5; }
 * .density-dense { --spacing-scale: 0.75; }
 *
 * .motion-none * { animation: none !important; transition: none !important; }
 * .motion-reduced * { animation-duration: 150ms !important; }
 *
 * .contrast-high { filter: contrast(1.1); }
 *
 * .celebrations-none .celebration { display: none; }
 * .celebrations-enthusiastic .celebration { animation: celebrate 500ms; }
 */
