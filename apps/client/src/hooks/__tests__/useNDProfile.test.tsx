import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNDProfile } from '../useNDProfile';
import { useAppStore } from '../../stores/appStore';
import { getProfile } from '../../data/ndProfiles';

describe('useNDProfile', () => {
    const originalRootStyle = document.documentElement.style.cssText;
    const originalRootClassName = document.documentElement.className;

    beforeEach(() => {
        // Reset store to default profile
        useAppStore.setState({ ndProfile: getProfile('default') });
        // Reset document state
        document.documentElement.style.cssText = '';
        document.documentElement.className = '';
    });

    afterEach(() => {
        document.documentElement.style.cssText = originalRootStyle;
        document.documentElement.className = originalRootClassName;
    });

    describe('font scale application', () => {
        it('should apply default font scale (1)', () => {
            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.style.fontSize).toBe('100%');
            expect(root.style.getPropertyValue('--nd-font-scale')).toBe('1');
        });

        it('should apply ADHD font scale (1.1)', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            // Handle floating point precision (1.1 * 100 = 110.00000000000001)
            expect(parseFloat(root.style.fontSize)).toBeCloseTo(110, 0);
            expect(root.style.getPropertyValue('--nd-font-scale')).toBe('1.1');
        });

        it('should apply Dyslexia font scale (1.2)', () => {
            useAppStore.setState({ ndProfile: getProfile('dyslexia') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.style.fontSize).toBe('120%');
        });
    });

    describe('font family classes', () => {
        it('should add font-default class for default profile', () => {
            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('font-default')).toBe(true);
            expect(root.classList.contains('font-dyslexia')).toBe(false);
            expect(root.classList.contains('font-mono')).toBe(false);
        });

        it('should add font-dyslexia class for dyslexia profile', () => {
            useAppStore.setState({ ndProfile: getProfile('dyslexia') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('font-dyslexia')).toBe(true);
        });

        it('should add font-mono class for autism profile', () => {
            useAppStore.setState({ ndProfile: getProfile('autism') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('font-mono')).toBe(true);
        });
    });

    describe('color intensity classes', () => {
        it('should add colors-balanced for default profile', () => {
            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('colors-balanced')).toBe(true);
        });

        it('should add colors-vibrant for ADHD profile', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('colors-vibrant')).toBe(true);
        });

        it('should add colors-muted for autism profile', () => {
            useAppStore.setState({ ndProfile: getProfile('autism') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('colors-muted')).toBe(true);
        });
    });

    describe('density classes', () => {
        it('should add density-comfortable for default', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('density-comfortable')).toBe(true);
        });

        it('should add density-minimal for ADHD and dyslexia', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('density-minimal')).toBe(true);
        });
    });

    describe('motion preferences', () => {
        it('should apply reduced motion with 150ms duration', () => {
            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('motion-reduced')).toBe(true);
            expect(root.style.getPropertyValue('--nd-animation-duration')).toBe('150ms');
            expect(root.style.getPropertyValue('--nd-transition-duration')).toBe('100ms');
        });

        it('should apply no motion for autism profile', () => {
            useAppStore.setState({ ndProfile: getProfile('autism') });

            renderHook(() => useNDProfile());

            const root = document.documentElement;
            expect(root.classList.contains('motion-none')).toBe(true);
            expect(root.style.getPropertyValue('--nd-animation-duration')).toBe('0ms');
            expect(root.style.getPropertyValue('--nd-transition-duration')).toBe('0ms');
        });
    });

    describe('contrast classes', () => {
        it('should add contrast-normal for default', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('contrast-normal')).toBe(true);
        });

        it('should add contrast-high for ADHD', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('contrast-high')).toBe(true);
        });
    });

    describe('gamification classes', () => {
        it('should add gamification-light for default', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('gamification-light')).toBe(true);
        });

        it('should add gamification-full for ADHD', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('gamification-full')).toBe(true);
        });
    });

    describe('celebration styles', () => {
        it('should add celebrations-subtle for default', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('celebrations-subtle')).toBe(true);
        });

        it('should add celebrations-enthusiastic for ADHD', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            renderHook(() => useNDProfile());

            expect(document.documentElement.classList.contains('celebrations-enthusiastic')).toBe(true);
        });
    });

    describe('data attributes', () => {
        it('should set data-nd-profile attribute', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.dataset.ndProfile).toBe('default');
        });

        it('should set data-progress-style attribute', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.dataset.progressStyle).toBe('visual');
        });

        it('should set data-reminder-style attribute', () => {
            renderHook(() => useNDProfile());

            expect(document.documentElement.dataset.reminderStyle).toBe('neutral');
        });

        it('should update attributes when profile changes', () => {
            const { rerender } = renderHook(() => useNDProfile());

            expect(document.documentElement.dataset.ndProfile).toBe('default');

            useAppStore.setState({ ndProfile: getProfile('adhd') });
            rerender();

            expect(document.documentElement.dataset.ndProfile).toBe('adhd');
            expect(document.documentElement.dataset.reminderStyle).toBe('urgent');
        });
    });

    describe('return value', () => {
        it('should return the current ND profile', () => {
            const { result } = renderHook(() => useNDProfile());

            expect(result.current.preset).toBe('default');
            expect(result.current.name).toBe('Default');
        });

        it('should return updated profile when store changes', () => {
            const { result, rerender } = renderHook(() => useNDProfile());

            expect(result.current.preset).toBe('default');

            useAppStore.setState({ ndProfile: getProfile('adhd') });
            rerender();

            expect(result.current.preset).toBe('adhd');
            expect(result.current.name).toBe('ADHD');
        });
    });

    describe('cleanup', () => {
        it('should reset font size on unmount', () => {
            const { unmount } = renderHook(() => useNDProfile());

            document.documentElement.style.fontSize = '120%';

            unmount();

            expect(document.documentElement.style.fontSize).toBe('100%');
        });
    });

    describe('profile-specific comprehensive tests', () => {
        it('should correctly apply all ADHD settings', () => {
            useAppStore.setState({ ndProfile: getProfile('adhd') });

            const { result } = renderHook(() => useNDProfile());
            const root = document.documentElement;

            // Visual
            expect(root.classList.contains('colors-vibrant')).toBe(true);
            expect(root.classList.contains('density-minimal')).toBe(true);
            expect(root.classList.contains('contrast-high')).toBe(true);

            // Motivation
            expect(root.classList.contains('gamification-full')).toBe(true);
            expect(root.classList.contains('celebrations-enthusiastic')).toBe(true);

            // Profile data
            expect(result.current.agents.reminderAggressiveness).toBe('persistent');
            expect(result.current.time.timeBlindnessAids).toBe(true);
        });

        it('should correctly apply all Autism settings', () => {
            useAppStore.setState({ ndProfile: getProfile('autism') });

            const { result } = renderHook(() => useNDProfile());
            const root = document.documentElement;

            // Visual
            expect(root.classList.contains('colors-muted')).toBe(true);
            expect(root.classList.contains('motion-none')).toBe(true);
            expect(root.classList.contains('font-mono')).toBe(true);

            // Time
            expect(result.current.time.transitionWarnings).toBe(true);
            expect(result.current.time.transitionWarningMinutes).toBe(15);

            // Notifications
            expect(result.current.notifications.frequency).toBe('minimal');
            expect(result.current.notifications.batching).toBe(true);
        });

        it('should correctly apply all Dyslexia settings', () => {
            useAppStore.setState({ ndProfile: getProfile('dyslexia') });

            const { result } = renderHook(() => useNDProfile());
            const root = document.documentElement;

            // Visual
            expect(root.classList.contains('font-dyslexia')).toBe(true);
            expect(root.classList.contains('colors-muted')).toBe(true);
            expect(root.style.fontSize).toBe('120%');

            // Information
            expect(result.current.information.preferredFormat).toBe('audio');
            expect(result.current.information.disclosure).toBe('progressive');
        });
    });
});
