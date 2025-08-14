// ==========================================================================
// MADLAB SPA Application Entry Point
// ==========================================================================

import { AppState } from './state/AppState.js';
import { ThemeManager } from './components/ThemeManager.js';
import { LanguageManager } from './components/LanguageManager.js';
import { TaskManager } from './components/TaskManager.js';
import { ExportManager } from './components/ExportManager.js';
import { StatsManager } from './components/StatsManager.js';
import { ResponsiveManager } from './components/ResponsiveManager.js';
import { TouchGestureManager } from './components/TouchGestureManager.js';
import { PerformanceManager } from './components/PerformanceManager.js';
import { MobileFilterManager } from './components/MobileFilterManager.js';

/**
 * Main MADLAB Application Class
 */
export class MadlabApp {
    constructor() {
        this.state = new AppState();
        this.components = new Map();
        this.initialized = false;
        
        // Bind methods to preserve context
        this.togglePhase = this.togglePhase.bind(this);
        this.collapseAllPhases = this.collapseAllPhases.bind(this);
        this.expandAllPhases = this.expandAllPhases.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        try {
            // Show loading state
            this.setLoadingState(true);

            // Initialize components
            await this.initializeComponents();
            
            // Mount all components
            this.mountComponents();
            
            // Set up global event listeners
            this.bindGlobalEvents();
            
            // Initialize PWA features
            this.initializePWA();
            
            // Mark as initialized
            this.initialized = true;
            
            // Hide loading state
            this.setLoadingState(false);
            
            // Log successful initialization
            console.log('🚀 MADLAB SPA initialized successfully');
            
            // Performance logging
            if (window.performance) {
                const loadTime = performance.now();
                console.log(`⚡ App loaded in ${loadTime.toFixed(2)}ms`);
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize MADLAB app:', error);
            this.setLoadingState(false);
        }
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        // Responsive Manager (first - provides viewport state for others)
        const responsiveManager = new ResponsiveManager(document.body, this.state);
        this.components.set('responsive', responsiveManager);

        // Touch Gesture Manager (second - requires viewport state)
        const touchGestureManager = new TouchGestureManager(document.body, this.state);
        this.components.set('touchGestures', touchGestureManager);

        // Performance Manager (third - optimizes rendering for other components)
        const performanceManager = new PerformanceManager(document.body, this.state);
        this.components.set('performance', performanceManager);

        // Theme Manager
        const themeContainer = document.querySelector('.theme-switcher')?.parentElement || document.body;
        const themeManager = new ThemeManager(themeContainer, this.state);
        this.components.set('theme', themeManager);

        // Language Manager
        const langContainer = document.querySelector('#langToggle')?.parentElement || document.body;
        const languageManager = new LanguageManager(langContainer, this.state);
        this.components.set('language', languageManager);

        // Task Manager
        const taskContainer = document.querySelector('#tasksContainer') || document.body;
        const taskManager = new TaskManager(taskContainer, this.state);
        this.components.set('tasks', taskManager);

        // Export Manager
        const exportContainer = document.body;
        const exportManager = new ExportManager(exportContainer, this.state);
        this.components.set('export', exportManager);

        // Stats Manager
        const statsContainer = document.querySelector('.stats-grid') || document.body;
        const statsManager = new StatsManager(statsContainer, this.state);
        this.components.set('stats', statsManager);

        // Mobile Filter Manager (for responsive filter interfaces)
        const mobileFilterManager = new MobileFilterManager(document.body, this.state);
        this.components.set('mobileFilters', mobileFilterManager);

        // Initialize global functions for backward compatibility
        this.setupGlobalFunctions();
    }

    /**
     * Mount all components
     */
    mountComponents() {
        this.components.forEach((component, name) => {
            try {
                component.mount();
                console.log(`✅ ${name} component mounted`);
            } catch (error) {
                console.error(`❌ Failed to mount ${name} component:`, error);
            }
        });
    }

    /**
     * Set up global functions for backward compatibility
     */
    setupGlobalFunctions() {
        // Expose key functions globally
        window.madlabApp = this;
        window.toggleLang = () => this.components.get('language')?.toggleLanguage();
        window.setTheme = (theme) => this.components.get('theme')?.setTheme(theme);
        window.togglePhase = this.togglePhase;
        window.collapseAllPhases = this.collapseAllPhases;
        window.expandAllPhases = this.expandAllPhases;
        window.getStats = () => this.components.get('stats')?.getStatsSummary();
    }

    /**
     * Bind global event listeners
     */
    bindGlobalEvents() {
        // Responsive event listeners
        window.addEventListener('viewportchange', (e) => {
            this.handleViewportChange(e.detail);
        });

        window.addEventListener('breakpointchange', (e) => {
            this.handleBreakpointChange(e.detail);
        });

        window.addEventListener('orientationchange', (e) => {
            this.handleOrientationChange(e.detail);
        });

        // Touch gesture event listeners
        window.addEventListener('gesture:swipe', (e) => {
            this.handleSwipeGesture(e.detail);
        });

        window.addEventListener('gesture:pullToRefresh', (e) => {
            this.handlePullToRefresh(e.detail);
        });

        window.addEventListener('gesture:longpress', (e) => {
            this.handleLongPress(e.detail);
        });

        // Legacy window resize handler (kept for backward compatibility)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload - save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Collapse/Expand all buttons
        const collapseAllBtn = document.getElementById('collapseAllBtn');
        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', () => {
                this.collapseAllPhases();
            });
        }

        const expandAllBtn = document.getElementById('expandAllBtn');
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => {
                this.expandAllPhases();
            });
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Dispatch resize event for components
        window.dispatchEvent(new CustomEvent('appresize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768
            }
        }));
    }

    /**
     * Handle viewport changes from ResponsiveManager
     * @param {Object} detail - Viewport change details
     */
    handleViewportChange(detail) {
        const { viewport, changes } = detail;
        
        // Update components based on viewport changes
        if (changes.breakpointChanged) {
            this.adaptToBreakpoint(viewport.breakpoint);
        }
        
        if (changes.orientationChanged) {
            this.adaptToOrientation(viewport.orientation);
        }
        
        console.log('📱 Viewport changed:', viewport);
    }

    /**
     * Handle breakpoint changes
     * @param {Object} detail - Breakpoint change details
     */
    handleBreakpointChange(detail) {
        const { from, to, viewport } = detail;
        
        // Adapt UI for new breakpoint
        this.adaptToBreakpoint(to);
        
        // Update task manager for mobile optimizations
        const taskManager = this.components.get('tasks');
        if (taskManager && viewport.isMobile) {
            // Apply mobile-specific task optimizations
            this.enableMobileTaskOptimizations();
        } else {
            this.disableMobileTaskOptimizations();
        }
        
        console.log(`📱 Breakpoint changed: ${from} → ${to}`);
    }

    /**
     * Handle orientation changes
     * @param {Object} detail - Orientation change details
     */
    handleOrientationChange(detail) {
        const { from, to, viewport } = detail;
        
        // Adapt modals for orientation
        if (viewport.isMobile) {
            this.adaptModalsForMobile(to);
        }
        
        console.log(`🔄 Orientation changed: ${from} → ${to}`);
    }

    /**
     * Handle swipe gestures
     * @param {Object} detail - Swipe gesture details
     */
    handleSwipeGesture(detail) {
        const { direction, target, distance, velocity } = detail;
        
        // Handle global swipe actions
        if (target?.classList.contains('phase-header')) {
            // Phase header swipes are handled by TouchGestureManager
            console.log(`👆 Phase swipe: ${direction}`);
        } else if (target?.classList.contains('modal')) {
            // Handle modal dismissal swipes
            if (direction === 'down' && distance > 100) {
                this.components.get('export')?.closeModal();
            }
        }
    }

    /**
     * Handle pull to refresh gesture
     * @param {Object} detail - Pull to refresh details
     */
    handlePullToRefresh(detail) {
        if (detail.triggered) {
            console.log('🔄 Pull to refresh triggered');
            
            // Simulate data refresh
            this.showRefreshIndicator();
            
            // Hide indicator after delay
            setTimeout(() => {
                this.hideRefreshIndicator();
            }, 1500);
        }
    }

    /**
     * Handle long press gestures
     * @param {Object} detail - Long press details
     */
    handleLongPress(detail) {
        const { target, position } = detail;
        
        // Handle task card long press
        if (target?.closest('.task-card')) {
            const taskCard = target.closest('.task-card');
            const taskId = taskCard.dataset.taskId;
            
            if (taskId) {
                this.showTaskContextMenu(taskCard, position, taskId);
            }
        }
    }

    /**
     * Adapt UI for specific breakpoint
     * @param {string} breakpoint - Target breakpoint
     */
    adaptToBreakpoint(breakpoint) {
        const container = document.querySelector('.container');
        if (!container) return;
        
        // Update container classes
        container.classList.remove('bp-xs', 'bp-sm', 'bp-md', 'bp-lg', 'bp-xl', 'bp-xxl');
        container.classList.add(`bp-${breakpoint}`);
        
        // Mobile-specific adaptations
        if (['xs', 'sm'].includes(breakpoint)) {
            this.enableMobileLayout();
        } else {
            this.disableMobileLayout();
        }
    }

    /**
     * Adapt UI for orientation
     * @param {string} orientation - Target orientation
     */
    adaptToOrientation(orientation) {
        document.body.classList.toggle('landscape', orientation === 'landscape');
        document.body.classList.toggle('portrait', orientation === 'portrait');
    }

    /**
     * Enable mobile layout optimizations
     */
    enableMobileLayout() {
        document.body.classList.add('mobile-layout');
        
        // Collapse all phases by default on mobile
        if (window.innerWidth < 576) {
            this.collapseAllPhases();
        }
    }

    /**
     * Disable mobile layout optimizations
     */
    disableMobileLayout() {
        document.body.classList.remove('mobile-layout');
    }

    /**
     * Enable mobile task optimizations
     */
    enableMobileTaskOptimizations() {
        // Implement lazy loading for mobile
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            card.classList.add('mobile-optimized');
        });
    }

    /**
     * Disable mobile task optimizations
     */
    disableMobileTaskOptimizations() {
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => {
            card.classList.remove('mobile-optimized');
        });
    }

    /**
     * Adapt modals for mobile orientation
     * @param {string} orientation - Current orientation
     */
    adaptModalsForMobile(orientation) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (orientation === 'landscape') {
                modal.classList.add('landscape-modal');
            } else {
                modal.classList.remove('landscape-modal');
            }
        });
    }

    /**
     * Show refresh indicator
     */
    showRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'refresh-indicator';
        indicator.innerHTML = '🔄 Refreshing...';
        document.body.appendChild(indicator);
        
        setTimeout(() => indicator.classList.add('visible'), 10);
    }

    /**
     * Hide refresh indicator
     */
    hideRefreshIndicator() {
        const indicator = document.querySelector('.refresh-indicator');
        if (indicator) {
            indicator.classList.remove('visible');
            setTimeout(() => indicator.remove(), 300);
        }
    }

    /**
     * Show task context menu
     * @param {Element} taskCard - Task card element
     * @param {Object} position - Touch position
     * @param {string} taskId - Task ID
     */
    showTaskContextMenu(taskCard, position, taskId) {
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Highlight task card
        taskCard.classList.add('long-pressed');
        setTimeout(() => {
            taskCard.classList.remove('long-pressed');
        }, 200);
        
        console.log(`📋 Task context menu for: ${taskId}`);
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchBox = document.getElementById('searchBox');
            if (searchBox) {
                searchBox.focus();
                searchBox.select();
            }
        }

        // Ctrl/Cmd + /: Toggle language
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.components.get('language')?.toggleLanguage();
        }

        // Escape: Clear search and filters
        if (e.key === 'Escape') {
            const searchBox = document.getElementById('searchBox');
            if (searchBox && searchBox === document.activeElement) {
                this.components.get('tasks')?.clearFilters();
                searchBox.blur();
            }
        }
    }

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - save state
            this.saveState();
        } else {
            // Page is visible - check for updates
            this.checkForUpdates();
        }
    }

    /**
     * Toggle phase visibility
     * @param {string|number} phaseNum - Phase number
     */
    togglePhase(phaseNum) {
        const phaseElement = document.querySelector(`[data-phase="${phaseNum}"]`);
        if (!phaseElement) return;

        const header = phaseElement.querySelector('.phase-header');
        const content = phaseElement.querySelector('.phase-content');
        const toggle = phaseElement.querySelector('.phase-toggle');

        if (!header || !content) return;

        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            content.classList.remove('collapsed');
            header.classList.remove('collapsed');
            if (toggle) toggle.textContent = '🔽';
        } else {
            // Collapse
            content.classList.add('collapsed');
            header.classList.add('collapsed');
            if (toggle) toggle.textContent = '▶️';
        }

        // Update state
        const collapsedPhases = this.state.getState('ui').collapsedPhases;
        const phaseNumStr = phaseNum.toString();
        if (isCollapsed) {
            collapsedPhases.delete(phaseNumStr);
        } else {
            collapsedPhases.add(phaseNumStr);
        }

        this.state.setState({
            ui: { ...this.state.getState('ui'), collapsedPhases }
        });
    }

    /**
     * Collapse all phases
     */
    collapseAllPhases() {
        const collapsedPhases = new Set();
        
        for (let i = 1; i <= 5; i++) {
            const phaseElement = document.querySelector(`[data-phase="${i}"]`);
            if (!phaseElement) continue;

            const header = phaseElement.querySelector('.phase-header');
            const content = phaseElement.querySelector('.phase-content');
            const toggle = phaseElement.querySelector('.phase-toggle');

            if (header && content) {
                // Collapse
                content.classList.add('collapsed');
                header.classList.add('collapsed');
                if (toggle) toggle.textContent = '▶️';
                collapsedPhases.add(i.toString());
            }
        }
        
        this.state.setState({
            ui: { ...this.state.getState('ui'), collapsedPhases }
        });
    }

    /**
     * Expand all phases
     */
    expandAllPhases() {
        for (let i = 1; i <= 5; i++) {
            const phaseElement = document.querySelector(`[data-phase="${i}"]`);
            if (!phaseElement) continue;

            const header = phaseElement.querySelector('.phase-header');
            const content = phaseElement.querySelector('.phase-content');
            const toggle = phaseElement.querySelector('.phase-toggle');

            if (header && content) {
                // Expand
                content.classList.remove('collapsed');
                header.classList.remove('collapsed');
                if (toggle) toggle.textContent = '🔽';
            }
        }

        this.state.setState({
            ui: { ...this.state.getState('ui'), collapsedPhases: new Set() }
        });
    }

    /**
     * Set loading state
     * @param {boolean} loading - Loading state
     */
    setLoadingState(loading) {
        this.state.setState({
            ui: { ...this.state.getState('ui'), loading }
        });

        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('active', loading);
        }
    }

    /**
     * Save current state
     */
    saveState() {
        try {
            const currentState = this.state.getState();
            localStorage.setItem('madlab-app-state', JSON.stringify({
                currentLang: currentState.currentLang,
                theme: currentState.theme,
                ui: {
                    collapsedPhases: Array.from(currentState.ui.collapsedPhases)
                },
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to save app state:', error);
        }
    }

    /**
     * Load saved state
     */
    loadSavedState() {
        try {
            const saved = localStorage.getItem('madlab-app-state');
            if (saved) {
                const state = JSON.parse(saved);
                // Only load if saved within last 24 hours
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    this.state.setState({
                        currentLang: state.currentLang,
                        theme: state.theme,
                        ui: {
                            ...this.state.getState('ui'),
                            collapsedPhases: new Set(state.ui.collapsedPhases || [])
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    }

    /**
     * Check for updates (placeholder for future functionality)
     */
    checkForUpdates() {
        // Placeholder for checking if data has been updated
        console.log('🔍 Checking for updates...');
    }

    /**
     * Initialize PWA features
     */
    initializePWA() {
        // Service Worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }

        // Add to home screen prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            console.log('📱 PWA install prompt available');
            // Store the event for later use
            window.deferredPrompt = e;
        });
    }

    /**
     * Get application statistics
     * @returns {Object} App statistics
     */
    getAppStats() {
        return {
            initialized: this.initialized,
            componentCount: this.components.size,
            stateStats: this.state.getStats(),
            components: Array.from(this.components.keys()).map(name => ({
                name,
                status: this.components.get(name).getStatus()
            }))
        };
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        // Unmount all components
        this.components.forEach(component => {
            try {
                component.unmount();
            } catch (error) {
                console.error('Error unmounting component:', error);
            }
        });

        // Clear components
        this.components.clear();

        // Remove global functions
        delete window.madlabApp;
        delete window.toggleLang;
        delete window.setTheme;
        delete window.togglePhase;
        delete window.collapseAllPhases;
        delete window.expandAllPhases;

        // Mark as not initialized
        this.initialized = false;

        console.log('🧹 MADLAB app destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new MadlabApp();
    await app.init();
    
    // Expose app globally for debugging
    window.madlabApp = app;
});

export default MadlabApp;