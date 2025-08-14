// ==========================================================================
// Responsive Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { debounce, throttle } from '../utils/helpers.js';

export class ResponsiveManager extends Component {
    constructor(element, state) {
        super(element, state);
        
        // Responsive breakpoints
        this.breakpoints = {
            xs: 320,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        };
        
        // Current viewport state
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.getCurrentBreakpoint(),
            orientation: this.getOrientation(),
            isMobile: window.innerWidth < this.breakpoints.md,
            isTablet: window.innerWidth >= this.breakpoints.md && window.innerWidth < this.breakpoints.lg,
            isDesktop: window.innerWidth >= this.breakpoints.lg,
            hasTouch: this.hasTouchSupport(),
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        // Debounced handlers
        this.handleResize = debounce(this.updateViewport.bind(this), 150);
        this.handleOrientationChange = throttle(this.updateOrientation.bind(this), 100);
        
        // Initialize viewport state
        this.updateState();
    }

    /**
     * Get current breakpoint based on viewport width
     * @returns {string} Current breakpoint name
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.sm) return 'xs';
        if (width < this.breakpoints.md) return 'sm';
        if (width < this.breakpoints.lg) return 'md';
        if (width < this.breakpoints.xl) return 'lg';
        if (width < this.breakpoints.xxl) return 'xl';
        return 'xxl';
    }

    /**
     * Get current orientation
     * @returns {string} Orientation ('portrait' or 'landscape')
     */
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    /**
     * Check if device has touch support
     * @returns {boolean} Has touch support
     */
    hasTouchSupport() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }

    /**
     * Update viewport measurements and breakpoint
     */
    updateViewport() {
        const previousViewport = { ...this.viewport };
        
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.getCurrentBreakpoint(),
            orientation: this.getOrientation(),
            isMobile: window.innerWidth < this.breakpoints.md,
            isTablet: window.innerWidth >= this.breakpoints.md && window.innerWidth < this.breakpoints.lg,
            isDesktop: window.innerWidth >= this.breakpoints.lg,
            hasTouch: this.hasTouchSupport(),
            devicePixelRatio: window.devicePixelRatio || 1
        };

        // Check for significant changes
        const breakpointChanged = previousViewport.breakpoint !== this.viewport.breakpoint;
        const orientationChanged = previousViewport.orientation !== this.viewport.orientation;
        
        // Update state and trigger events
        this.updateState();
        
        if (breakpointChanged) {
            this.handleBreakpointChange(previousViewport.breakpoint, this.viewport.breakpoint);
        }
        
        if (orientationChanged) {
            this.handleOrientationChangeEvent(previousViewport.orientation, this.viewport.orientation);
        }

        // Dispatch global responsive event
        window.dispatchEvent(new CustomEvent('viewportchange', {
            detail: {
                viewport: this.viewport,
                changes: {
                    breakpointChanged,
                    orientationChanged,
                    previousViewport
                }
            }
        }));
    }

    /**
     * Handle orientation change specifically
     */
    updateOrientation() {
        const previousOrientation = this.viewport.orientation;
        this.viewport.orientation = this.getOrientation();
        
        if (previousOrientation !== this.viewport.orientation) {
            this.handleOrientationChangeEvent(previousOrientation, this.viewport.orientation);
            this.updateState();
        }
    }

    /**
     * Handle breakpoint changes
     * @param {string} from - Previous breakpoint
     * @param {string} to - New breakpoint
     */
    handleBreakpointChange(from, to) {
        console.log(`📱 Breakpoint changed: ${from} → ${to}`);
        
        // Update CSS custom properties for responsive behavior
        document.documentElement.style.setProperty('--current-breakpoint', to);
        document.documentElement.setAttribute('data-breakpoint', to);
        
        // Apply breakpoint-specific optimizations
        this.applyBreakpointOptimizations(to);
        
        // Dispatch breakpoint change event
        window.dispatchEvent(new CustomEvent('breakpointchange', {
            detail: { from, to, viewport: this.viewport }
        }));
    }

    /**
     * Handle orientation changes
     * @param {string} from - Previous orientation
     * @param {string} to - New orientation
     */
    handleOrientationChangeEvent(from, to) {
        console.log(`🔄 Orientation changed: ${from} → ${to}`);
        
        // Update document attributes
        document.documentElement.setAttribute('data-orientation', to);
        
        // Handle mobile keyboard issues
        if (this.viewport.isMobile) {
            this.handleMobileKeyboardAdjustments();
        }
        
        // Dispatch orientation change event
        window.dispatchEvent(new CustomEvent('orientationchange', {
            detail: { from, to, viewport: this.viewport }
        }));
    }

    /**
     * Apply breakpoint-specific optimizations
     * @param {string} breakpoint - Current breakpoint
     */
    applyBreakpointOptimizations(breakpoint) {
        const body = document.body;
        
        // Remove previous breakpoint classes
        Object.keys(this.breakpoints).forEach(bp => {
            body.classList.remove(`bp-${bp}`);
        });
        
        // Add current breakpoint class
        body.classList.add(`bp-${breakpoint}`);
        
        // Mobile-specific optimizations
        if (this.viewport.isMobile) {
            body.classList.add('mobile-device');
            this.enableMobileOptimizations();
        } else {
            body.classList.remove('mobile-device');
            this.disableMobileOptimizations();
        }
        
        // Touch device optimizations
        if (this.viewport.hasTouch) {
            body.classList.add('touch-device');
        } else {
            body.classList.remove('touch-device');
        }
    }

    /**
     * Enable mobile-specific optimizations
     */
    enableMobileOptimizations() {
        // Disable hover effects on mobile
        document.documentElement.style.setProperty('--enable-hover', '0');
        
        // Optimize scroll behavior
        document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
        
        // Prevent zoom on input focus (iOS)
        this.preventIOSZoom();
    }

    /**
     * Disable mobile optimizations for desktop
     */
    disableMobileOptimizations() {
        // Re-enable hover effects
        document.documentElement.style.setProperty('--enable-hover', '1');
        
        // Reset scroll behavior
        document.body.style.removeProperty('-webkit-overflow-scrolling');
    }

    /**
     * Prevent iOS zoom on input focus
     */
    preventIOSZoom() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.style.fontSize !== '16px') {
                input.style.fontSize = '16px';
            }
        });
    }

    /**
     * Handle mobile keyboard showing/hiding
     */
    handleMobileKeyboardAdjustments() {
        if (!this.viewport.isMobile) return;
        
        let initialViewportHeight = window.innerHeight;
        
        const checkKeyboard = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            const keyboardVisible = heightDifference > 150; // Threshold for keyboard detection
            
            document.body.classList.toggle('keyboard-visible', keyboardVisible);
            
            // Dispatch keyboard visibility event
            window.dispatchEvent(new CustomEvent('keyboardtoggle', {
                detail: { 
                    visible: keyboardVisible, 
                    heightDifference,
                    viewport: this.viewport 
                }
            }));
        };
        
        // Check for keyboard on resize with debouncing
        const debouncedKeyboardCheck = debounce(checkKeyboard, 100);
        window.addEventListener('resize', debouncedKeyboardCheck);
        
        // Store the handler for cleanup
        this.keyboardHandler = debouncedKeyboardCheck;
    }

    /**
     * Update component state
     */
    updateState() {
        this.state.setState({
            viewport: this.viewport,
            responsive: {
                isMobile: this.viewport.isMobile,
                isTablet: this.viewport.isTablet,
                isDesktop: this.viewport.isDesktop,
                hasTouch: this.viewport.hasTouch,
                breakpoint: this.viewport.breakpoint,
                orientation: this.viewport.orientation
            }
        });
    }

    /**
     * Check if current viewport matches breakpoint
     * @param {string} breakpoint - Breakpoint to check
     * @returns {boolean} Matches breakpoint
     */
    matchesBreakpoint(breakpoint) {
        return this.viewport.breakpoint === breakpoint;
    }

    /**
     * Check if viewport is at least specified breakpoint
     * @param {string} minBreakpoint - Minimum breakpoint
     * @returns {boolean} Is at least breakpoint
     */
    isAtLeast(minBreakpoint) {
        const breakpointOrder = Object.keys(this.breakpoints);
        const currentIndex = breakpointOrder.indexOf(this.viewport.breakpoint);
        const minIndex = breakpointOrder.indexOf(minBreakpoint);
        return currentIndex >= minIndex;
    }

    /**
     * Get responsive value based on current breakpoint
     * @param {Object} values - Values for different breakpoints
     * @returns {*} Value for current breakpoint
     */
    getResponsiveValue(values) {
        const breakpointOrder = Object.keys(this.breakpoints);
        const currentIndex = breakpointOrder.indexOf(this.viewport.breakpoint);
        
        // Find the largest breakpoint that has a value and is <= current
        for (let i = currentIndex; i >= 0; i--) {
            const breakpoint = breakpointOrder[i];
            if (values[breakpoint] !== undefined) {
                return values[breakpoint];
            }
        }
        
        // Fallback to the smallest breakpoint with a value
        for (const breakpoint of breakpointOrder) {
            if (values[breakpoint] !== undefined) {
                return values[breakpoint];
            }
        }
        
        return null;
    }

    /**
     * Bind responsive event listeners
     */
    bindEvents() {
        // Window resize
        window.addEventListener('resize', this.handleResize);
        
        // Orientation change
        window.addEventListener('orientationchange', this.handleOrientationChange);
        
        // Device pixel ratio change (for zoom detection)
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', this.handleResize);
            }
        }
    }

    /**
     * Initialize responsive features on mount
     */
    onMount() {
        // Initial setup
        this.applyBreakpointOptimizations(this.viewport.breakpoint);
        
        // Set up mobile keyboard handling
        if (this.viewport.isMobile) {
            this.handleMobileKeyboardAdjustments();
        }
        
        console.log('📱 ResponsiveManager initialized:', this.viewport);
    }

    /**
     * Cleanup on unmount
     */
    onUnmount() {
        // Remove keyboard handler if exists
        if (this.keyboardHandler) {
            window.removeEventListener('resize', this.keyboardHandler);
        }
    }

    /**
     * Get current responsive state for debugging
     * @returns {Object} Current responsive state
     */
    getResponsiveState() {
        return {
            viewport: this.viewport,
            breakpoints: this.breakpoints,
            capabilities: {
                touch: this.viewport.hasTouch,
                mobile: this.viewport.isMobile,
                tablet: this.viewport.isTablet,
                desktop: this.viewport.isDesktop
            }
        };
    }
}

export default ResponsiveManager;