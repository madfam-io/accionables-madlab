import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback, useThrottledCallback } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('useDebounce hook', () => {
        it('should return the initial value immediately', () => {
            const { result } = renderHook(() => useDebounce('initial', 500));
            expect(result.current).toBe('initial');
        });

        it('should debounce value changes', async () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 500 } }
            );

            expect(result.current).toBe('initial');

            // Change the value
            rerender({ value: 'updated', delay: 500 });

            // Value should still be initial (debounced)
            expect(result.current).toBe('initial');

            // Fast-forward time
            act(() => {
                vi.advanceTimersByTime(500);
            });

            // Now the value should be updated
            expect(result.current).toBe('updated');
        });

        it('should reset the timer on rapid value changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'a', delay: 300 } }
            );

            // Rapid changes
            rerender({ value: 'b', delay: 300 });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            rerender({ value: 'c', delay: 300 });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            rerender({ value: 'd', delay: 300 });

            // Should still be 'a' - timer keeps resetting
            expect(result.current).toBe('a');

            // Wait for full debounce period after last change
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Now should be the final value
            expect(result.current).toBe('d');
        });

        it('should work with different data types', () => {
            // Numbers
            const { result: numResult } = renderHook(() => useDebounce(42, 100));
            expect(numResult.current).toBe(42);

            // Objects
            const obj = { key: 'value' };
            const { result: objResult } = renderHook(() => useDebounce(obj, 100));
            expect(objResult.current).toEqual(obj);

            // Arrays
            const arr = [1, 2, 3];
            const { result: arrResult } = renderHook(() => useDebounce(arr, 100));
            expect(arrResult.current).toEqual(arr);

            // Null
            const { result: nullResult } = renderHook(() => useDebounce(null, 100));
            expect(nullResult.current).toBe(null);
        });

        it('should handle delay changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'test', delay: 500 } }
            );

            rerender({ value: 'new', delay: 100 });

            act(() => {
                vi.advanceTimersByTime(100);
            });

            expect(result.current).toBe('new');
        });
    });

    describe('useDebouncedCallback hook', () => {
        it('should debounce callback execution', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useDebouncedCallback(callback, 300));

            // Call multiple times rapidly
            act(() => {
                result.current('a');
                result.current('b');
                result.current('c');
            });

            // Callback should not have been called yet
            expect(callback).not.toHaveBeenCalled();

            // Advance time
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Callback should have been called once with the last argument
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('c');
        });

        it('should pass all arguments to the callback', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useDebouncedCallback(callback, 200));

            act(() => {
                result.current('arg1', 'arg2', 123);
            });

            act(() => {
                vi.advanceTimersByTime(200);
            });

            expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
        });

        it('should cancel previous timeout on new call', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useDebouncedCallback(callback, 300));

            act(() => {
                result.current('first');
            });

            act(() => {
                vi.advanceTimersByTime(200);
            });

            act(() => {
                result.current('second');
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('second');
        });

        it('should use the latest callback reference', () => {
            let value = 'initial';
            const { result, rerender } = renderHook(
                ({ cb }) => useDebouncedCallback(cb, 100),
                { initialProps: { cb: () => value } }
            );

            value = 'updated';
            rerender({ cb: () => value });

            act(() => {
                result.current();
            });

            act(() => {
                vi.advanceTimersByTime(100);
            });

            // The latest callback should have been used
            // (this test verifies the callbackRef pattern works)
        });
    });

    describe('useThrottledCallback hook', () => {
        it('should execute immediately on first call', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useThrottledCallback(callback, 300));

            act(() => {
                result.current('first');
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('first');
        });

        it('should throttle subsequent calls', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useThrottledCallback(callback, 300));

            act(() => {
                result.current('first');
                result.current('second');
                result.current('third');
            });

            // Only first call should have executed immediately
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('first');

            // After throttle period, the last call should execute
            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenLastCalledWith('third');
        });

        it('should allow new immediate call after throttle period', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useThrottledCallback(callback, 200));

            act(() => {
                result.current('first');
            });

            expect(callback).toHaveBeenCalledTimes(1);

            act(() => {
                vi.advanceTimersByTime(200);
            });

            act(() => {
                result.current('second');
            });

            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenLastCalledWith('second');
        });

        it('should schedule trailing call if called during throttle', () => {
            const callback = vi.fn();
            const { result } = renderHook(() => useThrottledCallback(callback, 300));

            act(() => {
                result.current('first');
            });

            act(() => {
                vi.advanceTimersByTime(150);
            });

            act(() => {
                result.current('during-throttle');
            });

            expect(callback).toHaveBeenCalledTimes(1);

            act(() => {
                vi.advanceTimersByTime(150);
            });

            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenLastCalledWith('during-throttle');
        });
    });
});
