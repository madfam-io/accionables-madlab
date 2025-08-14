// ==========================================================================
// PerformanceManager - Performance Optimization & Lazy Loading
// ==========================================================================

import { Component } from './Component.js';

/**
 * PerformanceManager handles lazy loading, virtual scrolling, and
 * performance optimizations for the application
 */
export class PerformanceManager extends Component {
    constructor(container, state) {
        super(container, state);
        
        this.intersectionObserver = null;
        this.mutationObserver = null;
        this.performanceObserver = null;
        
        // Virtual scrolling configuration
        this.virtualScrolling = {
            enabled: false,
            itemHeight: 120,
            bufferSize: 5,
            visibleStart: 0,
            visibleEnd: 0,
            totalItems: 0,
            container: null,
            viewport: null
        };
        
        // Lazy loading configuration
        this.lazyLoading = {
            enabled: true,
            rootMargin: '300px',
            threshold: 0.1,
            loadedItems: new Set(),
            pendingItems: new Set()
        };
        
        // Performance metrics
        this.metrics = {
            fps: 0,
            frameCount: 0,
            lastTime: 0,
            memory: null,
            renderTime: 0,
            scrollPerformance: []
        };
        
        // Optimization flags
        this.optimizations = {
            imageOptimization: true,
            cssContainment: true,
            willChange: true,
            reducedMotion: false,
            batchDOMUpdates: true
        };
        
        // Bind methods
        this.handleIntersection = this.handleIntersection.bind(this);
        this.handleMutation = this.handleMutation.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.measurePerformance = this.measurePerformance.bind(this);
        this.throttledScroll = this.throttle(this.handleScroll, 16); // 60fps
    }

    /**
     * Initialize performance manager
     */
    mount() {
        this.setupIntersectionObserver();
        this.setupMutationObserver();
        this.setupPerformanceMonitoring();
        this.applyInitialOptimizations();
        this.bindEvents();
        
        console.log('⚡ PerformanceManager initialized');
        console.log('Lazy loading enabled:', this.lazyLoading.enabled);
        console.log('Optimizations applied:', this.optimizations);
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, falling back to immediate loading');
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            this.handleIntersection,
            {
                root: null,
                rootMargin: this.lazyLoading.rootMargin,
                threshold: this.lazyLoading.threshold
            }
        );

        // Observe existing lazy-loadable elements
        this.observeLazyElements();
    }

    /**
     * Setup mutation observer for dynamic content
     */
    setupMutationObserver() {
        if (!('MutationObserver' in window)) return;

        this.mutationObserver = new MutationObserver(this.handleMutation);
        this.mutationObserver.observe(this.container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-lazy', 'data-virtual']
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // FPS monitoring
        this.startFPSMonitoring();
        
        // Performance Observer for paint timings
        if ('PerformanceObserver' in window) {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'paint') {
                            this.metrics[entry.name.replace('-', '')] = entry.startTime;
                        }
                    });
                });
                
                this.performanceObserver.observe({ entryTypes: ['paint', 'navigation'] });
            } catch (e) {
                console.warn('PerformanceObserver setup failed:', e);
            }
        }

        // Memory monitoring
        this.monitorMemoryUsage();
    }

    /**
     * Apply initial performance optimizations
     */
    applyInitialOptimizations() {
        const root = document.documentElement;
        
        // CSS containment for better performance
        if (this.optimizations.cssContainment) {
            this.applyCSSContainment();
        }
        
        // Reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.optimizations.reducedMotion = true;
            root.classList.add('reduced-motion');
        }
        
        // Enable hardware acceleration for scrolling
        root.style.transform = 'translateZ(0)';
        
        // Optimize font rendering
        root.style.textRendering = 'optimizeSpeed';
        root.style.fontDisplay = 'swap';
    }

    /**
     * Apply CSS containment for performance
     */
    applyCSSContainment() {
        const containerElements = [
            '.task-card',
            '.phase-content',
            '.modal',
            '.filter-chips'
        ];
        
        containerElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.contain = 'layout style paint';
            });
        });
    }

    /**
     * Bind performance-related events
     */
    bindEvents() {
        // Scroll performance monitoring
        window.addEventListener('scroll', this.throttledScroll, { passive: true });
        
        // Resize handling for virtual scrolling
        window.addEventListener('resize', this.throttle(() => {
            this.updateVirtualScrolling();
        }, 250), { passive: true });
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausePerformanceMonitoring();
            } else {
                this.resumePerformanceMonitoring();
            }
        });
    }

    /**
     * Handle intersection observer entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadLazyElement(entry.target);
            }
        });
    }

    /**
     * Handle DOM mutations
     */
    handleMutation(mutations) {
        let shouldUpdateObserver = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const lazyElements = node.querySelectorAll 
                            ? node.querySelectorAll('[data-lazy]')
                            : [];
                        
                        lazyElements.forEach(el => {
                            this.observeLazyElement(el);
                        });
                        
                        // Check if virtual scrolling should be enabled
                        this.checkVirtualScrollingTrigger();
                        shouldUpdateObserver = true;
                    }
                });
            }
        });
        
        if (shouldUpdateObserver) {
            this.updateLazyObserver();
        }
    }

    /**
     * Handle scroll events for performance monitoring
     */
    handleScroll() {
        const now = performance.now();
        this.metrics.scrollPerformance.push(now);
        
        // Keep only last 100 scroll events for analysis
        if (this.metrics.scrollPerformance.length > 100) {
            this.metrics.scrollPerformance.shift();
        }
        
        // Update virtual scrolling if enabled
        if (this.virtualScrolling.enabled) {
            this.updateVirtualScrollPosition();
        }
    }

    /**
     * Load lazy element
     */
    loadLazyElement(element) {
        if (this.lazyLoading.loadedItems.has(element)) return;
        
        this.lazyLoading.loadedItems.add(element);
        this.intersectionObserver?.unobserve(element);
        
        // Handle different types of lazy loading
        const lazyType = element.dataset.lazy;
        
        switch (lazyType) {
            case 'image':
                this.loadLazyImage(element);
                break;
            case 'content':
                this.loadLazyContent(element);
                break;
            case 'component':
                this.loadLazyComponent(element);
                break;
            default:
                this.loadGenericLazyElement(element);
        }
        
        // Add loaded class for styling
        element.classList.add('lazy-loaded');
        
        // Emit event
        element.dispatchEvent(new CustomEvent('lazyloaded', {
            detail: { type: lazyType, element }
        }));
    }

    /**
     * Load lazy image
     */
    loadLazyImage(img) {
        const src = img.dataset.src || img.dataset.lazySrc;
        if (!src) return;
        
        const image = new Image();
        image.onload = () => {
            img.src = src;
            img.classList.add('loaded');
        };
        image.onerror = () => {
            img.classList.add('error');
        };
        image.src = src;
    }

    /**
     * Load lazy content
     */
    loadLazyContent(element) {
        const content = element.dataset.lazyContent;
        if (content) {
            element.innerHTML = content;
        }
        
        // Trigger any initialization scripts
        const initScript = element.dataset.lazyInit;
        if (initScript && window[initScript]) {
            window[initScript](element);
        }
    }

    /**
     * Load lazy component
     */
    loadLazyComponent(element) {
        const componentName = element.dataset.component;
        if (!componentName) return;
        
        // Dynamic component loading would go here
        // For now, just mark as loaded
        element.classList.add('component-loaded');
    }

    /**
     * Load generic lazy element
     */
    loadGenericLazyElement(element) {
        // Remove lazy loading attributes
        delete element.dataset.lazy;
        
        // Apply any deferred styles
        const styles = element.dataset.lazyStyles;
        if (styles) {
            element.style.cssText += styles;
            delete element.dataset.lazyStyles;
        }
    }

    /**
     * Observe lazy elements
     */
    observeLazyElements() {
        if (!this.intersectionObserver) return;
        
        const lazyElements = this.container.querySelectorAll('[data-lazy]');
        lazyElements.forEach(element => {
            this.observeLazyElement(element);
        });
    }

    /**
     * Observe single lazy element
     */
    observeLazyElement(element) {
        if (!this.intersectionObserver || this.lazyLoading.loadedItems.has(element)) {
            return;
        }
        
        this.intersectionObserver.observe(element);
    }

    /**
     * Update lazy observer
     */
    updateLazyObserver() {
        if (!this.intersectionObserver) return;
        
        // Re-observe new elements
        this.observeLazyElements();
    }

    /**
     * Check if virtual scrolling should be triggered
     */
    checkVirtualScrollingTrigger() {
        const taskCards = this.container.querySelectorAll('.task-card');
        const threshold = 50; // Enable virtual scrolling for 50+ items
        
        if (taskCards.length >= threshold && !this.virtualScrolling.enabled) {
            this.enableVirtualScrolling();
        } else if (taskCards.length < threshold && this.virtualScrolling.enabled) {
            this.disableVirtualScrolling();
        }
    }

    /**
     * Enable virtual scrolling
     */
    enableVirtualScrolling() {
        console.log('🔄 Enabling virtual scrolling for performance');
        
        this.virtualScrolling.enabled = true;
        this.setupVirtualScrollContainer();
        this.updateVirtualScrolling();
    }

    /**
     * Disable virtual scrolling
     */
    disableVirtualScrolling() {
        console.log('🔄 Disabling virtual scrolling');
        
        this.virtualScrolling.enabled = false;
        this.cleanupVirtualScrollContainer();
    }

    /**
     * Setup virtual scroll container
     */
    setupVirtualScrollContainer() {
        const tasksContainer = this.container.querySelector('#tasksContainer');
        if (!tasksContainer) return;
        
        // Create virtual scroll wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'virtual-scroll-wrapper';
        wrapper.style.cssText = `
            height: 400px;
            overflow-y: auto;
            position: relative;
        `;
        
        // Create viewport
        const viewport = document.createElement('div');
        viewport.className = 'virtual-scroll-viewport';
        viewport.style.cssText = `
            position: relative;
            will-change: transform;
        `;
        
        // Move existing content
        const existingContent = Array.from(tasksContainer.children);
        existingContent.forEach(child => viewport.appendChild(child));
        
        wrapper.appendChild(viewport);
        tasksContainer.appendChild(wrapper);
        
        this.virtualScrolling.container = wrapper;
        this.virtualScrolling.viewport = viewport;
        
        // Setup scroll listener
        wrapper.addEventListener('scroll', this.throttle(() => {
            this.updateVirtualScrollPosition();
        }, 16), { passive: true });
    }

    /**
     * Update virtual scrolling
     */
    updateVirtualScrolling() {
        if (!this.virtualScrolling.enabled || !this.virtualScrolling.container) return;
        
        const container = this.virtualScrolling.container;
        const viewport = this.virtualScrolling.viewport;
        const items = viewport.children;
        
        this.virtualScrolling.totalItems = items.length;
        
        if (this.virtualScrolling.totalItems === 0) return;
        
        // Calculate dimensions
        const containerHeight = container.clientHeight;
        const itemHeight = this.virtualScrolling.itemHeight;
        const totalHeight = this.virtualScrolling.totalItems * itemHeight;
        
        // Set viewport height
        viewport.style.height = `${totalHeight}px`;
        
        // Calculate visible range
        const scrollTop = container.scrollTop;
        const visibleStart = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const bufferSize = this.virtualScrolling.bufferSize;
        
        this.virtualScrolling.visibleStart = Math.max(0, visibleStart - bufferSize);
        this.virtualScrolling.visibleEnd = Math.min(
            this.virtualScrolling.totalItems - 1,
            visibleStart + visibleCount + bufferSize
        );
        
        this.renderVirtualItems();
    }

    /**
     * Update virtual scroll position
     */
    updateVirtualScrollPosition() {
        this.updateVirtualScrolling();
    }

    /**
     * Render virtual items
     */
    renderVirtualItems() {
        const viewport = this.virtualScrolling.viewport;
        const items = Array.from(viewport.children);
        
        items.forEach((item, index) => {
            const isVisible = index >= this.virtualScrolling.visibleStart && 
                            index <= this.virtualScrolling.visibleEnd;
            
            if (isVisible) {
                item.style.display = '';
                item.style.transform = `translateY(${index * this.virtualScrolling.itemHeight}px)`;
                item.style.position = 'absolute';
                item.style.width = '100%';
                item.style.height = `${this.virtualScrolling.itemHeight}px`;
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Cleanup virtual scroll container
     */
    cleanupVirtualScrollContainer() {
        if (!this.virtualScrolling.container) return;
        
        const wrapper = this.virtualScrolling.container;
        const viewport = this.virtualScrolling.viewport;
        const tasksContainer = wrapper.parentElement;
        
        // Move items back
        const items = Array.from(viewport.children);
        items.forEach(item => {
            item.style.display = '';
            item.style.transform = '';
            item.style.position = '';
            item.style.width = '';
            item.style.height = '';
            tasksContainer.appendChild(item);
        });
        
        // Remove wrapper
        wrapper.remove();
        
        this.virtualScrolling.container = null;
        this.virtualScrolling.viewport = null;
    }

    /**
     * Start FPS monitoring
     */
    startFPSMonitoring() {
        const measureFPS = (currentTime) => {
            this.metrics.frameCount++;
            
            if (currentTime >= this.metrics.lastTime + 1000) {
                this.metrics.fps = Math.round(
                    (this.metrics.frameCount * 1000) / (currentTime - this.metrics.lastTime)
                );
                this.metrics.frameCount = 0;
                this.metrics.lastTime = currentTime;
                
                // Update performance indicator if exists
                this.updatePerformanceIndicator();
            }
            
            if (!document.hidden) {
                requestAnimationFrame(measureFPS);
            }
        };
        
        requestAnimationFrame(measureFPS);
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }, 5000);
        }
    }

    /**
     * Update performance indicator
     */
    updatePerformanceIndicator() {
        // Create or update performance indicator in DOM
        let indicator = document.getElementById('performance-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'performance-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                display: none;
            `;
            document.body.appendChild(indicator);
        }
        
        // Show indicator if performance is poor
        const showIndicator = this.metrics.fps < 30;
        indicator.style.display = showIndicator ? 'block' : 'none';
        
        if (showIndicator) {
            indicator.innerHTML = `
                FPS: ${this.metrics.fps}<br>
                ${this.metrics.memory ? `Memory: ${Math.round(this.metrics.memory.used / 1024 / 1024)}MB` : ''}
            `;
        }
    }

    /**
     * Batch DOM updates for better performance
     */
    batchDOMUpdates(callback) {
        if (!this.optimizations.batchDOMUpdates) {
            callback();
            return;
        }
        
        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment();
            callback(fragment);
            
            // Apply batched updates
            if (fragment.children.length > 0) {
                this.container.appendChild(fragment);
            }
        });
    }

    /**
     * Optimize images for performance
     */
    optimizeImages() {
        if (!this.optimizations.imageOptimization) return;
        
        const images = this.container.querySelectorAll('img');
        images.forEach(img => {
            // Add loading attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decode attribute
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    /**
     * Throttle function for performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
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
     * Pause performance monitoring
     */
    pausePerformanceMonitoring() {
        this.performanceObserver?.disconnect();
    }

    /**
     * Resume performance monitoring
     */
    resumePerformanceMonitoring() {
        this.setupPerformanceMonitoring();
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.metrics,
            virtualScrolling: this.virtualScrolling.enabled,
            lazyLoadedItems: this.lazyLoading.loadedItems.size,
            averageScrollTime: this.getAverageScrollTime()
        };
    }

    /**
     * Get average scroll performance time
     */
    getAverageScrollTime() {
        if (this.metrics.scrollPerformance.length < 2) return 0;
        
        const times = this.metrics.scrollPerformance;
        let totalTime = 0;
        
        for (let i = 1; i < times.length; i++) {
            totalTime += times[i] - times[i - 1];
        }
        
        return totalTime / (times.length - 1);
    }

    /**
     * Force cleanup of lazy loading
     */
    cleanup() {
        this.lazyLoading.loadedItems.clear();
        this.lazyLoading.pendingItems.clear();
    }

    /**
     * Unmount and cleanup
     */
    unmount() {
        this.intersectionObserver?.disconnect();
        this.mutationObserver?.disconnect();
        this.performanceObserver?.disconnect();
        
        window.removeEventListener('scroll', this.throttledScroll);
        
        this.disableVirtualScrolling();
        this.cleanup();
        
        // Remove performance indicator
        const indicator = document.getElementById('performance-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        console.log('⚡ PerformanceManager unmounted');
    }

    /**
     * Get component status
     */
    getStatus() {
        return {
            mounted: this.mounted,
            lazyLoadingEnabled: this.lazyLoading.enabled,
            virtualScrollingEnabled: this.virtualScrolling.enabled,
            loadedItems: this.lazyLoading.loadedItems.size,
            metrics: this.getPerformanceMetrics()
        };
    }
}