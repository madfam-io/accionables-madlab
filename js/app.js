// ==========================================================================
// MADLAB SPA Application Entry Point
// ==========================================================================

import { AppState } from './state/AppState.js';
import { ThemeManager } from './components/ThemeManager.js';
import { LanguageManager } from './components/LanguageManager.js';
import { TaskManager } from './components/TaskManager.js';
import { ExportManager } from './components/ExportManager.js';
import { StatsManager } from './components/StatsManager.js';

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
        // Window resize handler
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