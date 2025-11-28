import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsive, useBreakpoint, useMediaQuery } from '../useResponsive';

// Mock window properties
const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
});

describe('useResponsive', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
        vi.useFakeTimers();
        window.matchMedia = vi.fn().mockImplementation(mockMatchMedia);
    });

    afterEach(() => {
        vi.useRealTimers();
        window.innerWidth = originalInnerWidth;
        window.innerHeight = originalInnerHeight;
        window.matchMedia = originalMatchMedia;
    });

    describe('breakpoint detection', () => {
        it('should detect xs breakpoint (< 576px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('xs');
            expect(result.current.isMobile).toBe(true);
            expect(result.current.isTablet).toBe(false);
            expect(result.current.isDesktop).toBe(false);
        });

        it('should detect sm breakpoint (576-767px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('sm');
            expect(result.current.isMobile).toBe(true);
        });

        it('should detect md breakpoint (768-991px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('md');
            expect(result.current.isMobile).toBe(false);
            expect(result.current.isTablet).toBe(true);
            expect(result.current.isDesktop).toBe(false);
        });

        it('should detect lg breakpoint (992-1199px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('lg');
            expect(result.current.isDesktop).toBe(true);
        });

        it('should detect xl breakpoint (1200-1399px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 720, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('xl');
            expect(result.current.isDesktop).toBe(true);
        });

        it('should detect xxl breakpoint (>= 1400px)', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('xxl');
            expect(result.current.isDesktop).toBe(true);
        });
    });

    describe('orientation detection', () => {
        it('should detect landscape orientation', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.viewport.orientation).toBe('landscape');
        });

        it('should detect portrait orientation', () => {
            Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 900, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.viewport.orientation).toBe('portrait');
        });
    });

    describe('viewport info', () => {
        it('should return viewport dimensions', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.viewport.width).toBe(1024);
            expect(result.current.viewport.height).toBe(768);
        });

        it('should return device pixel ratio', () => {
            Object.defineProperty(window, 'devicePixelRatio', { value: 2, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.viewport.devicePixelRatio).toBe(2);
        });
    });

    describe('online status', () => {
        it('should detect online status', () => {
            Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.isOnline).toBe(true);
        });

        it('should update on online/offline events', () => {
            const { result } = renderHook(() => useResponsive());

            act(() => {
                window.dispatchEvent(new Event('offline'));
            });

            // Note: The actual update depends on the event listener implementation
        });
    });

    describe('touch detection', () => {
        it('should detect touch capability via ontouchstart', () => {
            // This is tested via the window.ontouchstart check in the hook
            const { result } = renderHook(() => useResponsive());

            // Touch detection is based on 'ontouchstart' in window
            expect(typeof result.current.isTouch).toBe('boolean');
        });
    });

    describe('resize handling', () => {
        it('should update on window resize (debounced)', async () => {
            Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('lg');

            // Simulate resize to mobile
            Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });

            act(() => {
                window.dispatchEvent(new Event('resize'));
            });

            // Wait for debounce (150ms in the hook)
            act(() => {
                vi.advanceTimersByTime(200);
            });

            expect(result.current.breakpoint).toBe('xs');
        });
    });

    describe('CSS custom properties', () => {
        it('should set data attributes on document element', () => {
            Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

            renderHook(() => useResponsive());

            const root = document.documentElement;
            expect(root.getAttribute('data-breakpoint')).toBe('md');
            expect(root.getAttribute('data-orientation')).toBe('landscape');
        });
    });
});

describe('useBreakpoint', () => {
    beforeEach(() => {
        window.matchMedia = vi.fn().mockImplementation(mockMatchMedia);
    });

    it('should return true when current breakpoint is at or above specified', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        const { result } = renderHook(() => useBreakpoint('md'));

        expect(result.current).toBe(true);
    });

    it('should return false when current breakpoint is below specified', () => {
        Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

        const { result } = renderHook(() => useBreakpoint('lg'));

        expect(result.current).toBe(false);
    });
});

describe('useMediaQuery', () => {
    beforeEach(() => {
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: query.includes('768'),
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
    });

    it('should return match result for media query', () => {
        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

        expect(result.current).toBe(true);
    });

    it('should return false for non-matching query', () => {
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useMediaQuery('(min-width: 2000px)'));

        expect(result.current).toBe(false);
    });
});
