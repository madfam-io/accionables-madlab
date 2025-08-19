// ==========================================================================
// View Manager Component - Handles Grid/List View Toggle
// ==========================================================================

import { Component } from './Component.js';

export class ViewManager extends Component {
    constructor(element, state) {
        super(element, state);
        
        // Initialize view state
        this.currentView = this.getStoredView() || 'list';
        this.state.setState({ currentView: this.currentView });
        
        // Subscribe to language changes for button text updates
        this.subscribeToState('currentLang', () => this.updateButtonLabels());
    }

    /**
     * Component mount
     */
    onMount() {
        this.bindViewToggleEvents();
        this.applyView(this.currentView);
        this.updateButtonStates();
        
        // Ensure default view is applied to body immediately
        document.body.classList.remove('view-grid', 'view-list');
        document.body.classList.add(`view-${this.currentView}`);
        
        console.log('📋 ViewManager initialized with view:', this.currentView);
    }

    /**
     * Get stored view preference from localStorage
     * @returns {string} Stored view preference
     */
    getStoredView() {
        try {
            return localStorage.getItem('madlab-view-preference') || 'list';
        } catch (error) {
            console.warn('Failed to read view preference from localStorage:', error);
            return 'list';
        }
    }

    /**
     * Store view preference in localStorage
     * @param {string} view - View to store
     */
    storeView(view) {
        try {
            localStorage.setItem('madlab-view-preference', view);
        } catch (error) {
            console.warn('Failed to store view preference:', error);
        }
    }

    /**
     * Bind view toggle button events
     */
    bindViewToggleEvents() {
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (gridBtn) {
            this.addEventListener(gridBtn, 'click', () => {
                this.switchToView('grid');
            });
        }

        if (listBtn) {
            this.addEventListener(listBtn, 'click', () => {
                this.switchToView('list');
            });
        }
    }

    /**
     * Switch to specified view
     * @param {string} view - View to switch to ('grid' or 'list')
     */
    switchToView(view) {
        if (this.currentView === view) return;

        console.log(`🔄 Switching view from ${this.currentView} to ${view}`);
        
        this.currentView = view;
        this.state.setState({ currentView: view });
        this.storeView(view);
        this.applyView(view);
        this.updateButtonStates();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('viewChanged', { 
            detail: { view, previousView: this.currentView } 
        }));
    }

    /**
     * Apply view classes to all phase content containers
     * @param {string} view - View to apply
     */
    applyView(view) {
        const phaseContents = document.querySelectorAll('.phase-content');
        
        phaseContents.forEach(phaseContent => {
            // Remove existing view classes
            phaseContent.classList.remove('view-grid', 'view-list');
            
            // Add new view class
            phaseContent.classList.add(`view-${view}`);
            
            // Add transition class for smooth switching
            phaseContent.classList.add('view-transitioning');
            
            // Remove transition class after animation
            setTimeout(() => {
                phaseContent.classList.remove('view-transitioning');
            }, 300);
        });

        // Update body class for global styling
        document.body.classList.remove('view-grid', 'view-list');
        document.body.classList.add(`view-${view}`);
    }

    /**
     * Update button active states
     */
    updateButtonStates() {
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', this.currentView === 'grid');
            listBtn.classList.toggle('active', this.currentView === 'list');
        }
    }

    /**
     * Update button labels based on current language
     */
    updateButtonLabels() {
        const currentLang = this.state.getState('currentLang') || 'es';
        
        // Update all data-es/data-en elements in view controls
        const viewControls = document.querySelector('.view-controls');
        if (viewControls) {
            const translatedElements = viewControls.querySelectorAll('[data-es][data-en]');
            translatedElements.forEach(element => {
                const text = element.getAttribute(`data-${currentLang}`);
                if (text) {
                    element.textContent = text;
                }
            });
        }
    }

    /**
     * Get current view
     * @returns {string} Current view
     */
    getCurrentView() {
        return this.currentView;
    }

    /**
     * Check if mobile view (always list-like)
     * @returns {boolean} Is mobile view
     */
    isMobileView() {
        return window.innerWidth <= 768;
    }

    /**
     * Force refresh view (useful after window resize)
     */
    refreshView() {
        this.applyView(this.currentView);
    }
}