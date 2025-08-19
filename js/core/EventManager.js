/**
 * @fileoverview Global Event Manager for MADLAB application
 * @module js/core/EventManager
 * @author MADLAB Team
 * @since 2.0.0
 * @description Centralized event management system for handling global application events,
 *              keyboard shortcuts, window events, and component communication.
 */

/**
 * Event Manager class
 * Handles global event binding, keyboard shortcuts, and event coordination
 */
export class EventManager {
    /**
     * Initialize EventManager
     * @param {MadlabApp} app - Main application instance
     * @param {Map} components - Components map
     */
    constructor(app, components) {
        this.app = app;
        this.components = components;
        this.boundEvents = new Map();
        this.keyboardShortcuts = new Map();
        
        this.setupDefaultShortcuts();
    }

    /**
     * Bind all global event listeners
     */
    bindGlobalEvents() {
        console.log('🎯 EventManager: Binding global events...');
        
        this.bindWindowEvents();
        this.bindKeyboardEvents();
        this.bindComponentEvents();
        this.bindUIEvents();
        
        console.log('✅ EventManager: Global events bound');
    }

    /**
     * Bind window-level events
     * @private
     */
    bindWindowEvents() {
        // Responsive events
        this.addEventListener(window, 'viewportchange', (e) => {
            this.handleViewportChange(e.detail);
        });

        this.addEventListener(window, 'breakpointchange', (e) => {
            this.handleBreakpointChange(e.detail);
        });

        this.addEventListener(window, 'orientationchange', (e) => {
            this.handleOrientationChange(e.detail);
        });

        // Window resize with debouncing
        let resizeTimer;
        this.addEventListener(window, 'resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Page visibility
        this.addEventListener(document, 'visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload - save state
        this.addEventListener(window, 'beforeunload', () => {
            this.app.saveState();
        });
    }

    /**
     * Bind keyboard event listeners
     * @private
     */
    bindKeyboardEvents() {
        this.addEventListener(document, 'keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * Bind component communication events
     * @private
     */
    bindComponentEvents() {
        // Mobile filter events
        this.addEventListener(window, 'mobilefiltersapplied', (e) => {
            const { filters } = e.detail;
            const taskManager = this.components.get('tasks');
            if (taskManager && taskManager.applyMobileFilters) {
                taskManager.applyMobileFilters(filters);
            }
        });

        // Touch gesture events
        this.addEventListener(window, 'gestureswipe', (e) => {
            const { direction, element } = e.detail;
            this.handleSwipeGesture(direction, element);
        });

        this.addEventListener(window, 'gesturerefresh', (e) => {
            this.handlePullToRefresh();
        });

        // Performance warnings
        this.addEventListener(window, 'performancewarning', (e) => {
            const { type, metric } = e.detail;
            this.handlePerformanceWarning(type, metric);
        });

        // Task interaction events
        this.addEventListener(window, 'taskClick', (e) => {
            console.log('🎯 Global task click event:', e.detail.task);
        });

        // View change events
        this.addEventListener(window, 'viewChanged', (e) => {
            console.log('👀 View changed:', e.detail);
        });
    }

    /**
     * Bind UI-specific events
     * @private
     */
    bindUIEvents() {
        // Collapse/Expand all buttons
        const collapseAllBtn = document.getElementById('collapseAllBtn');
        if (collapseAllBtn) {
            this.addEventListener(collapseAllBtn, 'click', () => {
                this.app.collapseAllPhases();
            });
        }

        const expandAllBtn = document.getElementById('expandAllBtn');
        if (expandAllBtn) {
            this.addEventListener(expandAllBtn, 'click', () => {
                this.app.expandAllPhases();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            this.addEventListener(clearFiltersBtn, 'click', () => {
                const taskManager = this.components.get('tasks');
                if (taskManager && taskManager.clearFilters) {
                    taskManager.clearFilters();
                }
            });
        }
    }

    /**
     * Setup default keyboard shortcuts
     * @private
     */
    setupDefaultShortcuts() {
        // Ctrl/Cmd + K: Focus search
        this.keyboardShortcuts.set('mod+k', () => {
            const searchBox = document.getElementById('searchBox');
            if (searchBox) {
                searchBox.focus();
                searchBox.select();
            }
        });

        // Ctrl/Cmd + /: Toggle language
        this.keyboardShortcuts.set('mod+/', () => {
            const languageManager = this.components.get('language');
            if (languageManager && languageManager.toggleLanguage) {
                languageManager.toggleLanguage();
            }
        });

        // Escape: Clear search and filters
        this.keyboardShortcuts.set('escape', () => {
            const searchBox = document.getElementById('searchBox');
            if (searchBox && searchBox === document.activeElement) {
                const taskManager = this.components.get('tasks');
                if (taskManager && taskManager.clearFilters) {
                    taskManager.clearFilters();
                }
                searchBox.blur();
            }
        });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     * @private
     */
    handleKeyboardShortcuts(e) {
        const key = this.getShortcutKey(e);
        const handler = this.keyboardShortcuts.get(key);
        
        if (handler) {
            e.preventDefault();
            handler();
        }
    }

    /**
     * Get shortcut key string from keyboard event
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {string} Shortcut key string
     * @private
     */
    getShortcutKey(e) {
        const parts = [];
        
        if (e.ctrlKey || e.metaKey) parts.push('mod');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        
        const key = e.key.toLowerCase();
        parts.push(key);
        
        return parts.join('+');
    }

    /**
     * Handle window resize events
     * @private
     */
    handleResize() {
        const responsiveManager = this.components.get('responsive');
        const responsiveInfo = responsiveManager?.getResponsiveInfo();
        
        // Dispatch enhanced resize event
        window.dispatchEvent(new CustomEvent('appresize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: responsiveInfo?.isMobile || window.innerWidth < 768,
                isTablet: responsiveInfo?.isTablet || false,
                isDesktop: responsiveInfo?.isDesktop || window.innerWidth >= 992,
                breakpoint: responsiveInfo?.currentBreakpoint || 'md',
                viewport: responsiveInfo?.viewport || {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
                }
            }
        }));
    }

    /**
     * Handle viewport changes
     * @param {Object} detail - Viewport change details
     * @private
     */
    handleViewportChange(detail) {
        const { viewport, changes } = detail;
        
        if (changes.breakpointChanged) {
            this.app.adaptToBreakpoint(viewport.breakpoint);
        }
        
        if (changes.orientationChanged) {
            this.app.adaptToOrientation(viewport.orientation);
        }
        
        console.log('📱 Viewport changed:', viewport);
    }

    /**
     * Handle breakpoint changes
     * @param {Object} detail - Breakpoint change details
     * @private
     */
    handleBreakpointChange(detail) {
        const { from, to, viewport } = detail;
        
        this.app.adaptToBreakpoint(to);
        
        const taskManager = this.components.get('tasks');
        if (taskManager && viewport && viewport.isMobile) {
            this.app.enableMobileTaskOptimizations();
        } else {
            this.app.disableMobileTaskOptimizations();
        }
        
        console.log(`📱 Breakpoint changed: ${from} → ${to}`);
    }

    /**
     * Handle orientation changes
     * @param {Object} detail - Orientation change details
     * @private
     */
    handleOrientationChange(detail) {
        const { from, to, viewport } = detail;
        
        if (viewport.isMobile) {
            this.app.adaptModalsForMobile(to);
        }
        
        console.log(`🔄 Orientation changed: ${from} → ${to}`);
    }

    /**
     * Handle swipe gestures
     * @param {string} direction - Swipe direction
     * @param {HTMLElement} element - Target element
     * @private
     */
    handleSwipeGesture(direction, element) {
        const phaseElement = element.closest('.phase');
        if (phaseElement && direction === 'left') {
            const phaseNum = phaseElement.dataset.phase;
            if (phaseNum) {
                this.app.togglePhase(phaseNum);
            }
        }
    }

    /**
     * Handle pull-to-refresh gesture
     * @private
     */
    handlePullToRefresh() {
        const statsManager = this.components.get('stats');
        if (statsManager && statsManager.updateStats) {
            statsManager.updateStats();
        }
        
        console.log('🔄 Pull-to-refresh triggered');
    }

    /**
     * Handle performance warnings
     * @param {string} type - Warning type
     * @param {Object} metric - Performance metric
     * @private
     */
    handlePerformanceWarning(type, metric) {
        console.warn(`⚠️ Performance warning: ${type}`, metric);
        
        if (type === 'low-fps' && metric < 30) {
            document.body.classList.add('performance-mode');
        }
    }

    /**
     * Handle page visibility changes
     * @private
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.app.saveState();
        } else {
            this.app.checkForUpdates();
        }
    }

    /**
     * Add event listener with tracking
     * @param {EventTarget} target - Event target
     * @param {string} type - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(target, type, handler, options = {}) {
        target.addEventListener(type, handler, options);
        
        // Track bound events for cleanup
        const key = `${target.constructor.name}_${type}`;
        if (!this.boundEvents.has(key)) {
            this.boundEvents.set(key, []);
        }
        this.boundEvents.get(key).push({ target, type, handler, options });
    }

    /**
     * Add custom keyboard shortcut
     * @param {string} shortcut - Shortcut key combination
     * @param {Function} handler - Shortcut handler
     */
    addKeyboardShortcut(shortcut, handler) {
        this.keyboardShortcuts.set(shortcut.toLowerCase(), handler);
    }

    /**
     * Remove keyboard shortcut
     * @param {string} shortcut - Shortcut key combination
     */
    removeKeyboardShortcut(shortcut) {
        this.keyboardShortcuts.delete(shortcut.toLowerCase());
    }

    /**
     * Get all active keyboard shortcuts
     * @returns {Array<string>} Array of shortcut keys
     */
    getKeyboardShortcuts() {
        return Array.from(this.keyboardShortcuts.keys());
    }

    /**
     * Clean up all event listeners
     */
    cleanup() {
        console.log('🧹 EventManager: Cleaning up events...');
        
        for (const [key, events] of this.boundEvents) {
            events.forEach(({ target, type, handler, options }) => {
                try {
                    target.removeEventListener(type, handler, options);
                } catch (error) {
                    console.warn(`Failed to remove event listener for ${key}:`, error);
                }
            });
        }
        
        this.boundEvents.clear();
        this.keyboardShortcuts.clear();
        
        console.log('✅ EventManager: Cleanup complete');
    }
}