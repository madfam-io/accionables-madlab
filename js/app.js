/**
 * @fileoverview Refactored MADLAB SPA Application Entry Point
 * @module js/app
 * @author MADLAB Team
 * @since 2.0.0
 * @description Lightweight main application class using modular architecture.
 *              Delegates component management and event handling to specialized managers.
 */

import { AppState } from './state/AppState.js';
import { ComponentManager } from './core/ComponentManager.js';
import { EventManager } from './core/EventManager.js';

/**
 * Main MADLAB Application Class
 * Orchestrates the application using component and event managers
 */
export class MadlabApp {
    /**
     * Initialize the MADLAB application
     */
    constructor() {
        this.state = new AppState();
        this.componentManager = new ComponentManager(this.state);
        this.eventManager = new EventManager(this, this.componentManager.getAllComponents());
        this.initialized = false;
        
        // Bind phase management methods
        this.togglePhase = this.togglePhase.bind(this);
        this.collapseAllPhases = this.collapseAllPhases.bind(this);
        this.expandAllPhases = this.expandAllPhases.bind(this);
    }

    /**
     * Initialize the application
     * @returns {Promise<void>}
     */
    async init() {
        if (this.initialized) return;

        try {
            console.log('🚀 MADLAB SPA: Starting initialization...');
            
            // Show loading state
            this.setLoadingState(true);

            // Load saved state
            this.loadSavedState();
            
            // Initialize components
            await this.componentManager.initializeComponents();
            
            // Mount components
            this.componentManager.mountComponents();
            
            // Set up global events
            this.eventManager.bindGlobalEvents();
            
            // Set up global functions for backward compatibility
            this.setupGlobalFunctions();
            
            // Initialize PWA features
            this.initializePWA();
            
            // Mark as initialized
            this.initialized = true;
            
            // Hide loading state
            this.setLoadingState(false);
            
            // Log successful initialization
            this.logInitializationComplete();
            
        } catch (error) {
            console.error('❌ Failed to initialize MADLAB app:', error);
            this.setLoadingState(false);
            throw error;
        }
    }

    /**
     * Log initialization completion with performance metrics
     * @private
     */
    logInitializationComplete() {
        console.log('🚀 MADLAB SPA initialized successfully');
        
        if (window.performance) {
            const loadTime = performance.now();
            console.log(`⚡ App loaded in ${loadTime.toFixed(2)}ms`);
        }
        
        const componentStats = this.componentManager.getComponentStats();
        console.log(`📊 Components: ${componentStats.mounted}/${componentStats.total} mounted successfully`);
    }

    /**
     * Set up global functions for backward compatibility
     */
    setupGlobalFunctions() {
        // Expose app and key functions globally
        window.madlabApp = this;
        window.toggleLang = () => this.getComponent('language')?.toggleLanguage();
        window.setTheme = (theme) => this.getComponent('theme')?.setTheme(theme);
        window.togglePhase = this.togglePhase;
        window.collapseAllPhases = this.collapseAllPhases;
        window.expandAllPhases = this.expandAllPhases;
        window.getStats = () => this.getComponent('stats')?.getStatsSummary();
        
        // Enhanced functions
        window.getResponsiveInfo = () => this.getComponent('responsive')?.getResponsiveInfo();
        window.getPerformanceMetrics = () => this.getComponent('performance')?.getPerformanceMetrics();
        
        // Component access
        window.madlabApp.components = this.componentManager.getAllComponents();
    }

    /**
     * Get a component by name
     * @param {string} name - Component name
     * @returns {Component|null} Component instance
     */
    getComponent(name) {
        return this.componentManager.getComponent(name);
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
        this.updatePhaseState(phaseNum, isCollapsed);
    }

    /**
     * Update phase state in application state
     * @param {string|number} phaseNum - Phase number
     * @param {boolean} wasCollapsed - Previous collapsed state
     * @private
     */
    updatePhaseState(phaseNum, wasCollapsed) {
        const ui = this.state.getState('ui') || {};
        const collapsedPhases = ui.collapsedPhases || new Set();
        const phaseNumStr = phaseNum.toString();
        
        if (wasCollapsed) {
            collapsedPhases.delete(phaseNumStr);
        } else {
            collapsedPhases.add(phaseNumStr);
        }

        this.state.setState({
            ui: { ...ui, collapsedPhases }
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
                content.classList.add('collapsed');
                header.classList.add('collapsed');
                if (toggle) toggle.textContent = '▶️';
                collapsedPhases.add(i.toString());
            }
        }
        
        const ui = this.state.getState('ui') || {};
        this.state.setState({
            ui: { ...ui, collapsedPhases }
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
                content.classList.remove('collapsed');
                header.classList.remove('collapsed');
                if (toggle) toggle.textContent = '🔽';
            }
        }

        const ui = this.state.getState('ui') || {};
        this.state.setState({
            ui: { ...ui, collapsedPhases: new Set() }
        });
    }

    /**
     * Set loading state
     * @param {boolean} loading - Loading state
     */
    setLoadingState(loading) {
        const ui = this.state.getState('ui') || {};
        this.state.setState({
            ui: { ...ui, loading }
        });

        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('active', loading);
        }
    }

    /**
     * Save current application state
     */
    saveState() {
        try {
            const currentState = this.state.getState();
            const stateToSave = {
                currentLang: currentState.currentLang,
                theme: currentState.theme,
                ui: {
                    collapsedPhases: Array.from(currentState.ui?.collapsedPhases || [])
                },
                timestamp: Date.now()
            };
            
            localStorage.setItem('madlab-app-state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Failed to save app state:', error);
        }
    }

    /**
     * Load saved application state
     */
    loadSavedState() {
        try {
            const saved = localStorage.getItem('madlab-app-state');
            if (!saved) return;
            
            const state = JSON.parse(saved);
            
            // Only load if saved within last 24 hours
            if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                const ui = this.state.getState('ui') || {};
                this.state.setState({
                    currentLang: state.currentLang,
                    theme: state.theme,
                    ui: {
                        ...ui,
                        collapsedPhases: new Set(state.ui?.collapsedPhases || [])
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    }

    /**
     * Check for updates (placeholder for future functionality)
     */
    checkForUpdates() {
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
            window.deferredPrompt = e;
        });
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getAppStats() {
        return {
            initialized: this.initialized,
            components: this.componentManager.getComponentStats(),
            stateStats: this.state.getStats(),
            events: this.eventManager.getKeyboardShortcuts().length
        };
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        console.log('🧹 MADLAB app: Starting cleanup...');
        
        // Save state before cleanup
        this.saveState();
        
        // Cleanup managers
        this.eventManager.cleanup();
        this.componentManager.unmountAll();

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

    // Adapter methods for backward compatibility with existing event handlers
    adaptToBreakpoint(breakpoint) {
        const container = document.querySelector('.container');
        if (!container) return;
        
        container.classList.remove('bp-xs', 'bp-sm', 'bp-md', 'bp-lg', 'bp-xl', 'bp-xxl');
        container.classList.add(`bp-${breakpoint}`);
        
        if (['xs', 'sm'].includes(breakpoint)) {
            this.enableMobileLayout();
        } else {
            this.disableMobileLayout();
        }
    }

    adaptToOrientation(orientation) {
        document.body.classList.toggle('landscape', orientation === 'landscape');
        document.body.classList.toggle('portrait', orientation === 'portrait');
    }

    enableMobileLayout() {
        document.body.classList.add('mobile-layout');
        if (window.innerWidth < 576) {
            this.collapseAllPhases();
        }
    }

    disableMobileLayout() {
        document.body.classList.remove('mobile-layout');
    }

    enableMobileTaskOptimizations() {
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => card.classList.add('mobile-optimized'));
    }

    disableMobileTaskOptimizations() {
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach(card => card.classList.remove('mobile-optimized'));
    }

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
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new MadlabApp();
    await app.init();
});

export default MadlabApp;