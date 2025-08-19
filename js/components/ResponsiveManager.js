// ==========================================================================
// ResponsiveManager - Advanced Responsive Design Management
// ==========================================================================

import { Component } from './Component.js';

/**
 * ResponsiveManager handles viewport detection, breakpoint tracking,
 * and responsive behavior coordination across the application
 */
export class ResponsiveManager extends Component {
    constructor(container, state) {
        super(container, state);
        
        // Enhanced breakpoint system
        this.breakpoints = {
            xs: 320,   // Extra small devices (phones in portrait)
            sm: 576,   // Small devices (large phones)
            md: 768,   // Medium devices (tablets)
            lg: 992,   // Large devices (desktops)
            xl: 1200,  // Extra large devices (large desktops)
            xxl: 1400  // Ultra-wide displays
        };
        
        this.currentBreakpoint = null;
        this.previousBreakpoint = null;
        this.viewport = {
            width: 0,
            height: 0,
            ratio: 0,
            orientation: 'portrait',
            isTouch: false,
            pixelRatio: 1
        };
        
        this.resizeTimer = null;
        this.orientationTimer = null;
        this.callbacks = new Map();
        this.mediaQueries = new Map();
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
        this.detectTouch = this.detectTouch.bind(this);
        
        // Initialize viewport immediately to prevent undefined access
        this.updateViewportSync();
    }

    /**
     * Initialize the responsive manager
     */
    mount() {
        // Don't call updateViewport again since we already called updateViewportSync in constructor
        // this.updateViewport();
        this.setupMediaQueries();
        this.bindEvents();
        this.detectDeviceCapabilities();
        this.applyInitialClasses();
        
        console.log('📱 ResponsiveManager initialized');
        console.log('Current breakpoint:', this.currentBreakpoint);
        console.log('Viewport:', this.viewport);
        
        this.emitBreakpointChange();
    }

    /**
     * Setup media query listeners for each breakpoint
     */
    setupMediaQueries() {
        Object.entries(this.breakpoints).forEach(([name, width]) => {
            const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);
            this.mediaQueries.set(name, mediaQuery);
            
            // Listen for changes
            mediaQuery.addListener(() => {
                this.updateBreakpoint();
            });
        });
    }

    /**
     * Bind resize and orientation events
     */
    bindEvents() {
        // Resize handling with debouncing
        window.addEventListener('resize', this.handleResize);
        
        // Orientation change handling
        window.addEventListener('orientationchange', this.handleOrientationChange);
        
        // Visual viewport API support (iOS Safari)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.handleResize);
        }
        
        // Touch detection
        window.addEventListener('touchstart', this.detectTouch, { once: true });
    }

    /**
     * Handle window resize with debouncing
     */
    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            const oldViewport = { ...this.viewport };
            this.updateViewport();
            
            // Check if significant change occurred
            if (this.hasSignificantChange(oldViewport, this.viewport)) {
                this.emitViewportChange(oldViewport);
            }
        }, 100);
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        clearTimeout(this.orientationTimer);
        this.orientationTimer = setTimeout(() => {
            this.updateViewport();
            this.emitOrientationChange();
        }, 300); // Wait for orientation change to complete
    }

    /**
     * Detect touch capabilities
     */
    detectTouch() {
        this.viewport.isTouch = true;
        document.documentElement.classList.add('touch-device');
        document.documentElement.classList.remove('no-touch');
        
        this.emitCapabilityChange();
    }

    /**
     * Update viewport information synchronously (for initialization)
     */
    updateViewportSync() {
        this.viewport.width = window.innerWidth || 1024;
        this.viewport.height = window.innerHeight || 768;
        this.viewport.ratio = this.viewport.width / this.viewport.height;
        this.viewport.orientation = this.viewport.width > this.viewport.height ? 'landscape' : 'portrait';
        this.viewport.pixelRatio = window.devicePixelRatio || 1;
        
        // Set initial breakpoint
        let newBreakpoint = 'xs';
        Object.entries(this.breakpoints).forEach(([name, width]) => {
            if (this.viewport.width >= width) {
                newBreakpoint = name;
            }
        });
        this.currentBreakpoint = newBreakpoint;
        
        // Update state immediately
        this.state.setState({
            responsive: {
                breakpoint: this.currentBreakpoint,
                viewport: this.viewport,
                isMobile: this.isMobile(),
                isTablet: this.isTablet(),
                isDesktop: this.isDesktop()
            }
        });
    }

    /**
     * Update viewport information
     */
    updateViewport() {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.viewport.ratio = this.viewport.width / this.viewport.height;
        this.viewport.orientation = this.viewport.width > this.viewport.height ? 'landscape' : 'portrait';
        this.viewport.pixelRatio = window.devicePixelRatio || 1;
        
        this.updateBreakpoint();
        this.updateCSSVariables();
    }

    /**
     * Update current breakpoint
     */
    updateBreakpoint() {
        this.previousBreakpoint = this.currentBreakpoint;
        
        // Find the largest breakpoint that matches
        let newBreakpoint = 'xs';
        Object.entries(this.breakpoints).forEach(([name, width]) => {
            if (this.viewport.width >= width) {
                newBreakpoint = name;
            }
        });
        
        this.currentBreakpoint = newBreakpoint;
        
        // Update state
        this.state.setState({
            responsive: {
                breakpoint: this.currentBreakpoint,
                viewport: this.viewport,
                isMobile: this.isMobile(),
                isTablet: this.isTablet(),
                isDesktop: this.isDesktop()
            }
        });
        
        // Apply classes
        this.applyBreakpointClasses();
        
        // Emit change if breakpoint changed
        if (this.previousBreakpoint !== this.currentBreakpoint) {
            this.emitBreakpointChange();
        }
    }

    /**
     * Update CSS custom properties with viewport values
     */
    updateCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty('--viewport-width', `${this.viewport.width}px`);
        root.style.setProperty('--viewport-height', `${this.viewport.height}px`);
        root.style.setProperty('--viewport-ratio', this.viewport.ratio);
        root.style.setProperty('--pixel-ratio', this.viewport.pixelRatio);
        
        // Safe area insets for iOS
        if (CSS.supports('env(safe-area-inset-top)')) {
            root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
            root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
            root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
            root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
        }
    }

    /**
     * Apply initial device and capability classes
     */
    applyInitialClasses() {
        const root = document.documentElement;
        
        // Touch capability
        if (!this.viewport.isTouch) {
            root.classList.add('no-touch');
            root.classList.remove('touch-device');
        }
        
        // Device type classes
        root.classList.toggle('mobile-device', this.isMobile());
        root.classList.toggle('tablet-device', this.isTablet());
        root.classList.toggle('desktop-device', this.isDesktop());
        
        // Orientation class
        root.classList.toggle('portrait', this.viewport.orientation === 'portrait');
        root.classList.toggle('landscape', this.viewport.orientation === 'landscape');
        
        // High DPI
        root.classList.toggle('high-dpi', this.viewport.pixelRatio > 1.5);
    }

    /**
     * Apply breakpoint-specific classes
     */
    applyBreakpointClasses() {
        const root = document.documentElement;
        
        // Remove all breakpoint classes
        Object.keys(this.breakpoints).forEach(bp => {
            root.classList.remove(`bp-${bp}`, `bp-${bp}-up`, `bp-${bp}-down`);
        });
        
        // Add current breakpoint class
        root.classList.add(`bp-${this.currentBreakpoint}`);
        
        // Add up classes (current and larger)
        let found = false;
        Object.keys(this.breakpoints).forEach(bp => {
            if (bp === this.currentBreakpoint) found = true;
            if (found) root.classList.add(`bp-${bp}-up`);
        });
        
        // Add down classes (current and smaller)
        found = false;
        Object.keys(this.breakpoints).reverse().forEach(bp => {
            if (bp === this.currentBreakpoint) found = true;
            if (found) root.classList.add(`bp-${bp}-down`);
        });
    }

    /**
     * Detect device capabilities
     */
    detectDeviceCapabilities() {
        const root = document.documentElement;
        
        // Hover capability
        const hasHover = window.matchMedia('(hover: hover)').matches;
        root.classList.toggle('has-hover', hasHover);
        root.classList.toggle('no-hover', !hasHover);
        
        // Pointer capability
        const hasPointer = window.matchMedia('(pointer: fine)').matches;
        root.classList.toggle('fine-pointer', hasPointer);
        root.classList.toggle('coarse-pointer', !hasPointer);
        
        // Reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        root.classList.toggle('reduced-motion', prefersReducedMotion);
        
        // Color scheme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('prefers-dark', prefersDark);
        root.classList.toggle('prefers-light', !prefersDark);
    }

    /**
     * Check if significant viewport change occurred
     */
    hasSignificantChange(oldViewport, newViewport) {
        const widthChange = Math.abs(oldViewport.width - newViewport.width) > 50;
        const heightChange = Math.abs(oldViewport.height - newViewport.height) > 100;
        const orientationChange = oldViewport.orientation !== newViewport.orientation;
        
        return widthChange || heightChange || orientationChange;
    }

    /**
     * Device type detection methods
     */
    isMobile() {
        // Fallback if currentBreakpoint is not set
        if (!this.currentBreakpoint) {
            return window.innerWidth < 768;
        }
        return ['xs', 'sm'].includes(this.currentBreakpoint);
    }

    isTablet() {
        return this.currentBreakpoint === 'md';
    }

    isDesktop() {
        return ['lg', 'xl', 'xxl'].includes(this.currentBreakpoint);
    }

    /**
     * Register callback for breakpoint changes
     */
    onBreakpointChange(callback, immediate = false) {
        const id = Date.now() + Math.random();
        this.callbacks.set(id, { type: 'breakpoint', callback });
        
        if (immediate) {
            callback(this.currentBreakpoint, this.previousBreakpoint, this.viewport);
        }
        
        return () => this.callbacks.delete(id);
    }

    /**
     * Register callback for viewport changes
     */
    onViewportChange(callback, immediate = false) {
        const id = Date.now() + Math.random();
        this.callbacks.set(id, { type: 'viewport', callback });
        
        if (immediate) {
            callback(this.viewport);
        }
        
        return () => this.callbacks.delete(id);
    }

    /**
     * Emit breakpoint change event
     */
    emitBreakpointChange() {
        this.callbacks.forEach(({ type, callback }) => {
            if (type === 'breakpoint') {
                callback(this.currentBreakpoint, this.previousBreakpoint, this.viewport);
            }
        });

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('breakpointchange', {
            detail: {
                current: this.currentBreakpoint,
                previous: this.previousBreakpoint,
                viewport: this.viewport
            }
        }));
    }

    /**
     * Emit viewport change event
     */
    emitViewportChange(oldViewport) {
        this.callbacks.forEach(({ type, callback }) => {
            if (type === 'viewport') {
                callback(this.viewport, oldViewport);
            }
        });

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('viewportchange', {
            detail: {
                current: this.viewport,
                previous: oldViewport
            }
        }));
    }

    /**
     * Emit orientation change event
     */
    emitOrientationChange() {
        window.dispatchEvent(new CustomEvent('orientationchange', {
            detail: {
                orientation: this.viewport.orientation,
                viewport: this.viewport
            }
        }));
    }

    /**
     * Emit device capability change event
     */
    emitCapabilityChange() {
        window.dispatchEvent(new CustomEvent('capabilitychange', {
            detail: {
                isTouch: this.viewport.isTouch,
                viewport: this.viewport
            }
        }));
    }

    /**
     * Get responsive information
     */
    getResponsiveInfo() {
        return {
            currentBreakpoint: this.currentBreakpoint,
            previousBreakpoint: this.previousBreakpoint,
            viewport: { ...this.viewport },
            isMobile: this.isMobile(),
            isTablet: this.isTablet(),
            isDesktop: this.isDesktop(),
            breakpoints: { ...this.breakpoints }
        };
    }

    /**
     * Check if viewport matches specific breakpoint
     */
    matches(breakpoint) {
        if (typeof breakpoint === 'string') {
            return this.currentBreakpoint === breakpoint;
        }
        
        if (Array.isArray(breakpoint)) {
            return breakpoint.includes(this.currentBreakpoint);
        }
        
        return false;
    }

    /**
     * Check if viewport is at or above specific breakpoint
     */
    up(breakpoint) {
        const breakpointOrder = Object.keys(this.breakpoints);
        const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);
        const targetIndex = breakpointOrder.indexOf(breakpoint);
        
        return currentIndex >= targetIndex;
    }

    /**
     * Check if viewport is at or below specific breakpoint
     */
    down(breakpoint) {
        const breakpointOrder = Object.keys(this.breakpoints);
        const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);
        const targetIndex = breakpointOrder.indexOf(breakpoint);
        
        return currentIndex <= targetIndex;
    }

    /**
     * Cleanup and unmount
     */
    unmount() {
        clearTimeout(this.resizeTimer);
        clearTimeout(this.orientationTimer);
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this.handleResize);
        }
        
        // Clear media query listeners
        this.mediaQueries.forEach(mq => {
            mq.removeListener();
        });
        
        this.callbacks.clear();
        this.mediaQueries.clear();
        
        console.log('📱 ResponsiveManager unmounted');
    }

    /**
     * Get component status
     */
    getStatus() {
        return {
            mounted: this.mounted,
            breakpoint: this.currentBreakpoint,
            viewport: this.viewport,
            callbacks: this.callbacks.size
        };
    }
}