import { useEffect, useRef, useCallback } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export type GestureType = 'swipe' | 'longpress' | 'pinch' | 'tap' | 'doubletap';

interface GestureHandlers {
  onSwipe?: (direction: SwipeDirection, velocity: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onPinch?: (scale: number) => void;
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onPullToRefresh?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  lastTap: number;
  longPressTimer?: NodeJS.Timeout;
  isPulling: boolean;
  pullDistance: number;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;
const LONG_PRESS_DURATION = 500;
const DOUBLE_TAP_DELAY = 300;
const PULL_THRESHOLD = 80;

export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: GestureHandlers,
  enabled = true
) {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTap: 0,
    isPulling: false,
    pullDistance: 0,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const state = touchState.current;
    
    state.startX = touch.clientX;
    state.startY = touch.clientY;
    state.startTime = Date.now();

    // Long press detection
    if (handlers.onLongPress) {
      state.longPressTimer = setTimeout(() => {
        if (navigator.vibrate) {
          navigator.vibrate(50); // Haptic feedback
        }
        handlers.onLongPress?.(touch.clientX, touch.clientY);
      }, LONG_PRESS_DURATION);
    }

    // Pull to refresh detection
    if (handlers.onPullToRefresh && window.scrollY === 0) {
      state.isPulling = true;
      state.pullDistance = 0;
    }
  }, [handlers]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const state = touchState.current;
    
    // Cancel long press on move
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = undefined;
    }

    // Handle pull to refresh
    if (state.isPulling && handlers.onPullToRefresh) {
      const deltaY = touch.clientY - state.startY;
      if (deltaY > 0) {
        state.pullDistance = deltaY;
        if (deltaY > PULL_THRESHOLD) {
          e.preventDefault();
        }
      }
    }

    // Pinch detection (multi-touch)
    if (e.touches.length === 2 && handlers.onPinch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      // Calculate scale based on initial distance
      handlers.onPinch(distance / 100);
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const state = touchState.current;
    
    // Clear long press timer
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = undefined;
    }

    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;
    const deltaTime = Date.now() - state.startTime;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

    // Pull to refresh
    if (state.isPulling && state.pullDistance > PULL_THRESHOLD && handlers.onPullToRefresh) {
      handlers.onPullToRefresh();
      state.isPulling = false;
      state.pullDistance = 0;
      return;
    }

    // Swipe detection
    if (velocity > SWIPE_VELOCITY_THRESHOLD) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
        let direction: SwipeDirection;
        if (absX > absY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        handlers.onSwipe?.(direction, velocity);
        return;
      }
    }

    // Tap and double tap detection
    const isQuickTap = deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10;
    if (isQuickTap) {
      const now = Date.now();
      if (now - state.lastTap < DOUBLE_TAP_DELAY) {
        handlers.onDoubleTap?.(touch.clientX, touch.clientY);
        state.lastTap = 0;
      } else {
        handlers.onTap?.(touch.clientX, touch.clientY);
        state.lastTap = now;
      }
    }

    state.isPulling = false;
    state.pullDistance = 0;
  }, [handlers]);

  const handleTouchCancel = useCallback(() => {
    const state = touchState.current;
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = undefined;
    }
    state.isPulling = false;
    state.pullDistance = 0;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
      
      // Clean up any pending timers
      const state = touchState.current;
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }
    };
  }, [elementRef, enabled, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  // Return gesture state for UI feedback
  return {
    isPulling: touchState.current.isPulling,
    pullDistance: touchState.current.pullDistance,
  };
}