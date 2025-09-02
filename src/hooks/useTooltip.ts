import { useState, useRef, useEffect, useCallback } from 'react';

interface UseTooltipOptions {
  delay?: number;
  offset?: number;
}

interface TooltipState {
  isVisible: boolean;
  position: { x: number; y: number };
}

export const useTooltip = (options: UseTooltipOptions = {}) => {
  const { delay = 500, offset = 8 } = options;
  const [tooltip, setTooltip] = useState<TooltipState>({
    isVisible: false,
    position: { x: 0, y: 0 }
  });
  
  const timeoutRef = useRef<number>();
  const elementRef = useRef<HTMLElement | null>(null);

  const showTooltip = useCallback((event: MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - offset;

      setTooltip({
        isVisible: true,
        position: { x, y }
      });
    }, delay);
  }, [delay, offset]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTooltip(prev => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);

    return () => {
      element.removeEventListener('mouseenter', showTooltip);
      element.removeEventListener('mouseleave', hideTooltip);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showTooltip, hideTooltip]);

  const bindTooltip = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  return {
    tooltip,
    bindTooltip
  };
};