/**
 * Performance monitoring utilities for MADLAB application
 * Production-ready performance tracking without console output
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            taskLoadTime: 0,
            filterTime: 0,
            interactions: []
        };
        
        this.startTime = performance.now();
    }

    /**
     * Mark a performance milestone
     */
    mark(name) {
        if (!performance.mark) return;
        performance.mark(`madlab-${name}`);
    }

    /**
     * Measure between two marks
     */
    measure(name, startMark, endMark) {
        if (!performance.measure) return;
        
        try {
            performance.measure(
                `madlab-${name}`,
                `madlab-${startMark}`,
                `madlab-${endMark}`
            );
            
            const measure = performance.getEntriesByName(`madlab-${name}`)[0];
            if (measure) {
                this.metrics[name] = measure.duration;
            }
        } catch (e) {
            // Silent fail in production
        }
    }

    /**
     * Track component initialization time
     */
    trackComponentInit(componentName, duration) {
        if (!this.metrics.components) {
            this.metrics.components = {};
        }
        this.metrics.components[componentName] = duration;
    }

    /**
     * Track user interaction
     */
    trackInteraction(type, target, duration) {
        this.metrics.interactions.push({
            type,
            target,
            duration,
            timestamp: Date.now()
        });
        
        // Keep only last 50 interactions
        if (this.metrics.interactions.length > 50) {
            this.metrics.interactions.shift();
        }
    }

    /**
     * Get current metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            totalTime: performance.now() - this.startTime,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    /**
     * Check if performance is degraded
     */
    isPerformanceDegraded() {
        const metrics = this.getMetrics();
        
        // Check for slow load time (> 3 seconds)
        if (metrics.totalTime > 3000 && metrics.loadTime === 0) {
            return true;
        }
        
        // Check for high memory usage (> 50MB)
        if (metrics.memory && metrics.memory.used > 50 * 1024 * 1024) {
            return true;
        }
        
        // Check for slow filter operations (> 100ms)
        if (metrics.filterTime > 100) {
            return true;
        }
        
        return false;
    }

    /**
     * Get performance summary
     */
    getSummary() {
        const metrics = this.getMetrics();
        const summary = {
            loadTime: `${metrics.loadTime.toFixed(2)}ms`,
            renderTime: `${metrics.renderTime.toFixed(2)}ms`,
            totalTime: `${metrics.totalTime.toFixed(2)}ms`,
            interactionCount: metrics.interactions.length
        };
        
        if (metrics.memory) {
            summary.memoryUsage = `${(metrics.memory.used / 1024 / 1024).toFixed(2)}MB`;
        }
        
        return summary;
    }

    /**
     * Send metrics to analytics (placeholder)
     */
    sendMetrics() {
        // In production, this would send to analytics service
        // For now, just store in sessionStorage for debugging
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('madlab-performance', JSON.stringify(this.getMetrics()));
        }
    }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Debounce utility for performance
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle utility for performance
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request idle callback wrapper
 */
export function whenIdle(callback) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, 1);
    }
}

/**
 * Lazy load images
 */
export function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Optimize animation frame
 */
export function optimizeAnimation(callback) {
    let ticking = false;
    
    return function(...args) {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}