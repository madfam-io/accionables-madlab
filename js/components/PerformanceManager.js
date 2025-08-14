// ==========================================================================
// Performance Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { debounce, throttle } from '../utils/helpers.js';

export class PerformanceManager extends Component {
    constructor(element, state) {
        super(element, state);
        
        // Performance configuration
        this.config = {
            lazyLoadThreshold: 0.1,          // Trigger when 10% visible
            virtualScrollThreshold: 50,      // Virtualize after 50 items
            imageLazyLoadThreshold: 0.2,     // Images load when 20% visible
            debounceDelay: 100,              // Debounce delay for scroll events
            preloadDistance: 500,            // Preload items 500px before visible
            maxVisibleItems: 20              // Maximum items to render at once
        };
        
        // Observer instances
        this.intersectionObserver = null;
        this.imageObserver = null;
        this.resizeObserver = null;
        
        // Performance tracking
        this.performance = {
            renderTimes: [],
            scrollEvents: 0,
            lazyLoadedItems: 0,
            memoryUsage: 0
        };
        
        // Virtual scroll state
        this.virtualScroll = {
            enabled: false,
            scrollTop: 0,
            containerHeight: 0,
            itemHeight: 120, // Estimated task card height
            visibleRange: { start: 0, end: 0 },
            totalItems: 0,
            renderedItems: new Set()
        };
        
        // Lazy load queues
        this.lazyLoadQueue = new Set();
        this.imageLoadQueue = new Set();
        
        // Debounced handlers
        this.handleScroll = throttle(this.onScroll.bind(this), 16); // ~60fps
        this.handleResize = debounce(this.onResize.bind(this), 200);
        
        // Initialize observers
        this.initializeObservers();
    }

    /**
     * Initialize intersection observers
     */
    initializeObservers() {
        // Task card lazy loading observer
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: `${this.config.preloadDistance}px`,
                    threshold: this.config.lazyLoadThreshold
                }
            );
        }
        
        // Image lazy loading observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                this.handleImageIntersection.bind(this),
                {
                    rootMargin: '50px',
                    threshold: this.config.imageLazyLoadThreshold
                }
            );
        }
        
        // Resize observer for container size changes
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(
                this.handleResizeObservation.bind(this)
            );
        }
    }

    /**
     * Handle intersection observer entries
     * @param {IntersectionObserverEntry[]} entries - Observer entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Element is now visible
                this.loadElement(element);
                this.intersectionObserver?.unobserve(element);
            }
        });
    }

    /**
     * Handle image intersection observer entries
     * @param {IntersectionObserverEntry[]} entries - Observer entries
     */
    handleImageIntersection(entries) {
        entries.forEach(entry => {
            const img = entry.target;
            
            if (entry.isIntersecting) {
                this.loadImage(img);
                this.imageObserver?.unobserve(img);
            }
        });
    }

    /**
     * Handle resize observer entries
     * @param {ResizeObserverEntry[]} entries - Observer entries
     */
    handleResizeObservation(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (element.classList.contains('tasks-container')) {
                this.updateVirtualScrollDimensions();
            }
        });
    }

    /**
     * Load element with lazy loading
     * @param {Element} element - Element to load
     */
    loadElement(element) {
        if (element.classList.contains('lazy-loaded')) return;
        
        const startTime = performance.now();
        
        // Add loaded class
        element.classList.add('lazy-loaded');
        element.classList.remove('lazy-loading');
        
        // Trigger load animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Track performance
        const loadTime = performance.now() - startTime;
        this.performance.renderTimes.push(loadTime);
        this.performance.lazyLoadedItems++;
        
        // Dispatch load event
        element.dispatchEvent(new CustomEvent('lazy-loaded', {
            detail: { loadTime }
        }));
    }

    /**
     * Load image with lazy loading
     * @param {HTMLImageElement} img - Image element to load
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src || img.src === src) return;
        
        img.src = src;
        img.classList.add('lazy-image-loaded');
        
        img.addEventListener('load', () => {
            img.classList.add('lazy-image-complete');
        });
        
        img.addEventListener('error', () => {
            img.classList.add('lazy-image-error');
        });
    }

    /**
     * Enable lazy loading for task cards
     * @param {NodeList|Array} elements - Elements to observe
     */
    enableLazyLoading(elements) {
        if (!this.intersectionObserver) return;
        
        elements.forEach(element => {
            if (!element.classList.contains('lazy-loaded')) {
                element.classList.add('lazy-loading');
                this.intersectionObserver.observe(element);
                this.lazyLoadQueue.add(element);
            }
        });
    }

    /**
     * Enable lazy loading for images
     * @param {NodeList|Array} images - Images to observe
     */
    enableImageLazyLoading(images) {
        if (!this.imageObserver) return;
        
        images.forEach(img => {
            if (img.dataset.src && !img.classList.contains('lazy-image-loaded')) {
                this.imageObserver.observe(img);
                this.imageLoadQueue.add(img);
            }
        });
    }

    /**
     * Initialize virtual scrolling for large lists
     * @param {Element} container - Container element
     * @param {Array} items - All items data
     */
    initializeVirtualScroll(container, items) {
        if (!container || items.length < this.config.virtualScrollThreshold) {
            this.virtualScroll.enabled = false;
            return;
        }
        
        this.virtualScroll.enabled = true;
        this.virtualScroll.totalItems = items.length;
        this.virtualScroll.container = container;
        
        // Set up container
        container.style.overflowY = 'auto';
        container.style.position = 'relative';
        
        // Create virtual scroll wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'virtual-scroll-wrapper';
        wrapper.style.height = `${items.length * this.virtualScroll.itemHeight}px`;
        wrapper.style.position = 'relative';
        
        // Create viewport
        const viewport = document.createElement('div');
        viewport.className = 'virtual-scroll-viewport';
        viewport.style.position = 'absolute';
        viewport.style.top = '0';
        viewport.style.left = '0';
        viewport.style.right = '0';
        
        // Move existing content to viewport
        while (container.firstChild) {
            viewport.appendChild(container.firstChild);
        }
        
        wrapper.appendChild(viewport);
        container.appendChild(wrapper);
        
        // Store references
        this.virtualScroll.wrapper = wrapper;
        this.virtualScroll.viewport = viewport;
        this.virtualScroll.items = items;
        
        // Bind scroll events
        container.addEventListener('scroll', this.handleScroll);
        
        // Start resize observer
        if (this.resizeObserver) {
            this.resizeObserver.observe(container);
        }
        
        // Initial render
        this.updateVirtualScrollDimensions();
        this.renderVirtualItems();
        
        console.log(`🚀 Virtual scroll enabled for ${items.length} items`);
    }

    /**
     * Handle scroll events for virtual scrolling
     * @param {Event} event - Scroll event
     */
    onScroll(event) {
        if (!this.virtualScroll.enabled) return;
        
        this.performance.scrollEvents++;
        this.virtualScroll.scrollTop = event.target.scrollTop;
        
        this.updateVisibleRange();
        this.renderVirtualItems();
    }

    /**
     * Handle resize events
     */
    onResize() {
        if (this.virtualScroll.enabled) {
            this.updateVirtualScrollDimensions();
            this.renderVirtualItems();
        }
    }

    /**
     * Update virtual scroll dimensions
     */
    updateVirtualScrollDimensions() {
        if (!this.virtualScroll.container) return;
        
        const rect = this.virtualScroll.container.getBoundingClientRect();
        this.virtualScroll.containerHeight = rect.height;
        
        // Update visible range
        this.updateVisibleRange();
    }

    /**
     * Update visible item range for virtual scrolling
     */
    updateVisibleRange() {
        const { scrollTop, containerHeight, itemHeight, totalItems } = this.virtualScroll;
        
        const startIndex = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + 5, totalItems); // 5 item buffer
        
        this.virtualScroll.visibleRange = {
            start: Math.max(0, startIndex - 5), // 5 item buffer before
            end: endIndex
        };
    }

    /**
     * Render visible items in virtual scroll
     */
    renderVirtualItems() {
        if (!this.virtualScroll.enabled || !this.virtualScroll.viewport) return;
        
        const { visibleRange, items, itemHeight, viewport } = this.virtualScroll;
        const { start, end } = visibleRange;
        
        // Clear viewport
        viewport.innerHTML = '';
        
        // Set viewport position
        viewport.style.transform = `translateY(${start * itemHeight}px)`;
        
        // Render visible items
        for (let i = start; i < end; i++) {
            if (items[i]) {
                const itemElement = this.createVirtualItem(items[i], i);
                viewport.appendChild(itemElement);
                this.virtualScroll.renderedItems.add(i);
            }
        }
        
        // Clean up old rendered items
        this.virtualScroll.renderedItems.forEach(index => {
            if (index < start || index >= end) {
                this.virtualScroll.renderedItems.delete(index);
            }
        });
    }

    /**
     * Create virtual scroll item element
     * @param {Object} itemData - Item data
     * @param {number} index - Item index
     * @returns {Element} Item element
     */
    createVirtualItem(itemData, index) {
        // This should be implemented based on the specific item type
        // For task cards, delegate to TaskManager
        const taskManager = window.madlabApp?.components?.get('tasks');
        if (taskManager && typeof taskManager.createTaskElement === 'function') {
            const element = taskManager.createTaskElement(itemData, this.state.getState('currentLang'));
            element.dataset.virtualIndex = index.toString();
            element.style.height = `${this.virtualScroll.itemHeight}px`;
            return element;
        }
        
        // Fallback: create simple element
        const element = document.createElement('div');
        element.className = 'virtual-item';
        element.textContent = `Item ${index}`;
        element.style.height = `${this.virtualScroll.itemHeight}px`;
        return element;
    }

    /**
     * Optimize images for mobile
     */
    optimizeImagesForMobile() {
        const viewport = this.state.getState('viewport');
        if (!viewport?.isMobile) return;
        
        // Find all images
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for native lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimize image quality for mobile
            if (img.src && !img.dataset.optimized) {
                img.dataset.optimized = 'true';
                // Could implement image optimization logic here
            }
        });
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const head = document.head;
        
        // Preload critical CSS if not already loaded
        const criticalStyles = [
            '/css/base.css',
            '/css/variables.css',
            '/css/components.css'
        ];
        
        criticalStyles.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                head.appendChild(link);
            }
        });
        
        // Preload critical JavaScript modules
        const criticalModules = [
            '/js/utils/helpers.js',
            '/js/data/tasks.js',
            '/js/data/translations.js'
        ];
        
        criticalModules.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = href;
            head.appendChild(link);
        });
    }

    /**
     * Monitor performance metrics
     */
    monitorPerformance() {
        if (!window.performance) return;
        
        // Monitor memory usage
        if (performance.memory) {
            this.performance.memoryUsage = performance.memory.usedJSHeapSize;
        }
        
        // Monitor frame rate
        this.startFrameRateMonitoring();
        
        // Monitor load times
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('📊 Performance metrics:', {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaint(),
                    memoryUsage: this.performance.memoryUsage
                });
            }
        });
    }

    /**
     * Start frame rate monitoring
     */
    startFrameRateMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.performance.fps = fps;
                
                // Warn if FPS is low
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    /**
     * Get first paint timing
     * @returns {number} First paint time
     */
    getFirstPaint() {
        const paintMetrics = performance.getEntriesByType('paint');
        const firstPaint = paintMetrics.find(metric => metric.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    /**
     * Optimize task rendering for mobile
     */
    optimizeTaskRendering() {
        const viewport = this.state.getState('viewport');
        if (!viewport?.isMobile) return;
        
        // Use document fragments for batch DOM updates
        const taskContainer = document.querySelector('#tasksContainer');
        if (!taskContainer) return;
        
        // Enable CSS containment for task cards
        const taskCards = taskContainer.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            card.style.contain = 'layout style paint';
        });
        
        // Enable will-change for frequently animated elements
        const phaseHeaders = taskContainer.querySelectorAll('.phase-header');
        phaseHeaders.forEach(header => {
            header.style.willChange = 'transform';
        });
    }

    /**
     * Cleanup performance resources
     */
    cleanup() {
        // Disconnect observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Remove scroll listeners
        if (this.virtualScroll.container) {
            this.virtualScroll.container.removeEventListener('scroll', this.handleScroll);
        }
        
        // Clear queues
        this.lazyLoadQueue.clear();
        this.imageLoadQueue.clear();
        this.virtualScroll.renderedItems.clear();
    }

    /**
     * Initialize performance optimizations on mount
     */
    onMount() {
        // Start performance monitoring
        this.monitorPerformance();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize for current viewport
        this.optimizeImagesForMobile();
        this.optimizeTaskRendering();
        
        // Subscribe to viewport changes
        this.subscribeToState('viewport', (viewport) => {
            if (viewport.isMobile) {
                this.optimizeImagesForMobile();
                this.optimizeTaskRendering();
            }
        });
        
        console.log('⚡ PerformanceManager initialized');
    }

    /**
     * Cleanup on unmount
     */
    onUnmount() {
        this.cleanup();
    }

    /**
     * Get performance statistics
     * @returns {Object} Performance data
     */
    getPerformanceStats() {
        return {
            ...this.performance,
            averageRenderTime: this.performance.renderTimes.length > 0 
                ? this.performance.renderTimes.reduce((a, b) => a + b, 0) / this.performance.renderTimes.length 
                : 0,
            virtualScrollEnabled: this.virtualScroll.enabled,
            virtualScrollItems: this.virtualScroll.totalItems,
            lazyLoadQueueSize: this.lazyLoadQueue.size,
            imageLoadQueueSize: this.imageLoadQueue.size
        };
    }
}

export default PerformanceManager;