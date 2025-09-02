import { useEffect, useRef } from 'react';

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onLongPress?: () => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useGestures = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: GestureHandlers
) => {
  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const minSwipeDistance = 50; // Minimum distance for a swipe
    const maxSwipeTime = 300; // Maximum time for a swipe (ms)
    const longPressDelay = 500; // Long press delay (ms)

    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      // Handle pinch start
      if (e.touches.length === 2) {
        initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      }

      // Start long press timer
      if (handlers.onLongPress) {
        longPressTimer.current = setTimeout(() => {
          handlers.onLongPress?.();
        }, longPressDelay);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel long press on move
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // Handle pinch
      if (e.touches.length === 2 && handlers.onPinch && initialPinchDistance.current) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialPinchDistance.current;
        handlers.onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Cancel long press
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // Reset pinch
      initialPinchDistance.current = null;

      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      const dx = touchEnd.current.x - touchStart.current.x;
      const dy = touchEnd.current.y - touchStart.current.y;
      const dt = touchEnd.current.time - touchStart.current.time;

      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if it's a swipe
      if (distance >= minSwipeDistance && dt <= maxSwipeTime) {
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (absX > absY) {
          // Horizontal swipe
          if (dx > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (dy > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    // Add passive: false for better touch performance
    const options = { passive: false };
    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [elementRef, handlers]);
};