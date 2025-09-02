import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  fps: number;
  interactions: Map<string, number[]>;
}

interface PerformanceOptions {
  enableMonitoring?: boolean;
  enableLogging?: boolean;
  warnThreshold?: number;
  criticalThreshold?: number;
}

/**
 * Hook for monitoring component and application performance
 */
export function usePerformance(
  componentName: string, 
  options: PerformanceOptions = {}
): {
  metrics: PerformanceMetrics;
  measureInteraction: (name: string) => () => void;
  reportMetrics: () => void;
} {
  const {
    enableMonitoring = true,
    enableLogging = false,
    warnThreshold = 100,
    criticalThreshold = 500
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    interactions: new Map()
  });

  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number>();
  const mountTimeRef = useRef(performance.now());
  const renderCountRef = useRef(0);

  // Measure FPS
  const measureFPS = useCallback(() => {
    if (!enableMonitoring) return;

    const now = performance.now();
    const delta = now - lastFrameTimeRef.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      setMetrics(prev => ({ ...prev, fps }));
      
      if (enableLogging && fps < 30) {
        console.warn(`[Performance] Low FPS detected in ${componentName}: ${fps}fps`);
      }
      
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;
    }
    
    frameCountRef.current++;
    rafIdRef.current = requestAnimationFrame(measureFPS);
  }, [componentName, enableMonitoring, enableLogging]);

  // Measure memory usage (if available)
  const measureMemory = useCallback(() => {
    if (!enableMonitoring) return;
    
    // @ts-ignore - performance.memory is not in TypeScript types
    if (performance.memory) {
      // @ts-ignore
      const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      // @ts-ignore
      const heapLimit = performance.memory.jsHeapSizeLimit / 1048576;
      const usage = (memoryUsage / heapLimit) * 100;
      
      if (enableLogging && usage > 90) {
        console.warn(`[Performance] High memory usage in ${componentName}: ${memoryUsage}MB (${usage.toFixed(1)}%)`);
      }
    }
  }, [componentName, enableMonitoring, enableLogging]);

  // Measure interaction performance
  const measureInteraction = useCallback((name: string) => {
    if (!enableMonitoring) return () => {};
    
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      
      setMetrics(prev => {
        const interactions = new Map(prev.interactions);
        const existing = interactions.get(name) || [];
        interactions.set(name, [...existing, duration]);
        return { ...prev, interactions };
      });
      
      if (enableLogging) {
        if (duration > criticalThreshold) {
          console.error(`[Performance] Critical: ${name} in ${componentName} took ${duration.toFixed(2)}ms`);
        } else if (duration > warnThreshold) {
          console.warn(`[Performance] Warning: ${name} in ${componentName} took ${duration.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName, enableMonitoring, enableLogging, warnThreshold, criticalThreshold]);

  // Report comprehensive metrics
  const reportMetrics = useCallback(() => {
    if (!enableLogging) return;
    
    const report = {
      component: componentName,
      loadTime: metrics.loadTime,
      renderTime: metrics.renderTime,
      renderCount: renderCountRef.current,
      fps: metrics.fps,
      memoryUsage: metrics.memoryUsage,
      interactions: Object.fromEntries(
        Array.from(metrics.interactions.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values)
          }
        ])
      )
    };
    
    console.table(report);
  }, [componentName, metrics, enableLogging]);

  // Lifecycle measurements
  useEffect(() => {
    if (!enableMonitoring) return;
    
    // Measure initial load time
    const loadTime = performance.now() - mountTimeRef.current;
    setMetrics(prev => ({ ...prev, loadTime }));
    
    // Start FPS monitoring
    rafIdRef.current = requestAnimationFrame(measureFPS);
    
    // Periodic memory measurements
    const memoryInterval = setInterval(measureMemory, 5000);
    
    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearInterval(memoryInterval);
    };
  }, [enableMonitoring, measureFPS, measureMemory]);

  // Track render performance
  useEffect(() => {
    if (!enableMonitoring) return;
    
    renderCountRef.current++;
    const renderTime = performance.now() - mountTimeRef.current;
    setMetrics(prev => ({ ...prev, renderTime }));
  });

  return { metrics, measureInteraction, reportMetrics };
}

/**
 * Hook for lazy loading with Intersection Observer
 */
export function useLazyLoad(
  threshold = 0.1,
  rootMargin = '50px'
): {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
} {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isIntersecting };
}

/**
 * Hook for idle time operations
 */
export function useIdleCallback(
  callback: () => void,
  options?: IdleRequestOptions
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => callbackRef.current(), options);
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(() => callbackRef.current(), 1);
      return () => clearTimeout(id);
    }
  }, [options]);
}

/**
 * Hook for virtual scrolling large lists
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 3
): {
  visibleItems: T[];
  totalHeight: number;
  offsetY: number;
  handleScroll: (scrollTop: number) => void;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}