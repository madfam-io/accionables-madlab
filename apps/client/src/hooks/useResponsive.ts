import { useState, useEffect, useMemo } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type Orientation = 'portrait' | 'landscape';
export type PointerType = 'none' | 'coarse' | 'fine';

interface ViewportInfo {
  width: number;
  height: number;
  orientation: Orientation;
  devicePixelRatio: number;
}

interface ResponsiveInfo {
  breakpoint: Breakpoint;
  viewport: ViewportInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  hasHover: boolean;
  pointerType: PointerType;
  prefersReducedMotion: boolean;
  isOnline: boolean;
  connectionType: string | undefined;
}

// Breakpoint definitions matching legacy system
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

function getBreakpoint(width: number): Breakpoint {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS.xxl) return 'xl';
  return 'xxl';
}

function getPointerType(): PointerType {
  if (!window.matchMedia) return 'fine';
  
  if (window.matchMedia('(pointer: none)').matches) return 'none';
  if (window.matchMedia('(pointer: coarse)').matches) return 'coarse';
  return 'fine';
}

function getConnectionType(): string | undefined {
  // @ts-ignore - Navigator.connection is not in TypeScript types
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection?.effectiveType;
}

export function useResponsive(): ResponsiveInfo {
  const [viewport, setViewport] = useState<ViewportInfo>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    devicePixelRatio: window.devicePixelRatio || 1,
  }));

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState(getConnectionType());

  // Calculate responsive properties
  const responsiveInfo = useMemo<ResponsiveInfo>(() => {
    const breakpoint = getBreakpoint(viewport.width);
    const isMobile = viewport.width < BREAKPOINTS.md;
    const isTablet = viewport.width >= BREAKPOINTS.md && viewport.width < BREAKPOINTS.lg;
    const isDesktop = viewport.width >= BREAKPOINTS.lg;
    const pointerType = getPointerType();
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      breakpoint,
      viewport,
      isMobile,
      isTablet,
      isDesktop,
      isTouch,
      hasHover,
      pointerType,
      prefersReducedMotion,
      isOnline,
      connectionType,
    };
  }, [viewport, isOnline, connectionType]);

  useEffect(() => {
    // Update CSS custom properties for responsive design
    const root = document.documentElement;
    root.style.setProperty('--viewport-width', `${viewport.width}px`);
    root.style.setProperty('--viewport-height', `${viewport.height}px`);
    root.style.setProperty('--breakpoint', responsiveInfo.breakpoint);
    root.setAttribute('data-breakpoint', responsiveInfo.breakpoint);
    root.setAttribute('data-orientation', viewport.orientation);
    root.setAttribute('data-touch', responsiveInfo.isTouch ? 'true' : 'false');
    root.setAttribute('data-hover', responsiveInfo.hasHover ? 'true' : 'false');
  }, [viewport, responsiveInfo]);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
          orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
          devicePixelRatio: window.devicePixelRatio || 1,
        });
      }, 150); // Debounce resize events
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleConnectionChange = () => {
      setConnectionType(getConnectionType());
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // @ts-ignore
    if (navigator.connection) {
      // @ts-ignore
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    // Set up matchMedia listeners for breakpoint changes
    const mediaQueries = Object.entries(BREAKPOINTS).map(([name, width]) => {
      const mq = window.matchMedia(`(min-width: ${width}px)`);
      const handler = () => handleResize();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // @ts-ignore
      if (navigator.connection) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
      
      mediaQueries.forEach(cleanup => cleanup());
    };
  }, []);

  return responsiveInfo;
}

// Utility hook for checking specific breakpoints
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { breakpoint: currentBreakpoint } = useResponsive();
  const breakpointIndex = Object.keys(BREAKPOINTS).indexOf(breakpoint);
  const currentIndex = Object.keys(BREAKPOINTS).indexOf(currentBreakpoint);
  return currentIndex >= breakpointIndex;
}

// Utility hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}