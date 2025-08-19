/**
 * @fileoverview Component Manager for MADLAB application
 * @module js/core/ComponentManager
 * @author MADLAB Team
 * @since 2.0.0
 * @description Manages component initialization, mounting, and lifecycle.
 *              Provides centralized component management with dependency injection.
 */

import { ThemeManager } from '../components/ThemeManager.js';
import { LanguageManager } from '../components/LanguageManager.js';
import { TaskManager } from '../components/TaskManager.js';
import { ExportManager } from '../components/ExportManager.js';
import { StatsManager } from '../components/StatsManager.js';
import { ResponsiveManager } from '../components/ResponsiveManager.js';
import { TouchGestureManager } from '../components/TouchGestureManager.js';
import { PerformanceManager } from '../components/PerformanceManager.js';
import { MobileFilterManager } from '../components/MobileFilterManager.js';
import { ViewManager } from '../components/ViewManager.js';

/**
 * Component Manager class
 * Handles component initialization, mounting, and lifecycle management
 */
export class ComponentManager {
    /**
     * Initialize ComponentManager
     * @param {AppState} state - Application state
     */
    constructor(state) {
        this.state = state;
        this.components = new Map();
        this.initializationOrder = [
            'responsive',      // First - provides viewport state
            'touchGestures',   // Second - requires viewport state
            'performance',     // Third - optimizes rendering
            'theme',          // UI components start here
            'language',
            'tasks',
            'export',
            'stats',
            'mobileFilters',
            'view'
        ];
    }

    /**
     * Initialize all components with proper dependency order
     * @returns {Promise<void>}
     */
    async initializeComponents() {
        try {
            console.log('🔧 ComponentManager: Initializing components...');
            
            // Create components in dependency order
            await this.createResponsiveManager();
            await this.createTouchGestureManager();
            await this.createPerformanceManager();
            await this.createThemeManager();
            await this.createLanguageManager();
            await this.createTaskManager();
            await this.createExportManager();
            await this.createStatsManager();
            await this.createMobileFilterManager();
            await this.createViewManager();
            
            console.log('✅ ComponentManager: All components initialized');
            
        } catch (error) {
            console.error('❌ ComponentManager: Error during initialization:', error);
            throw error;
        }
    }

    /**
     * Mount all components in correct order
     */
    mountComponents() {
        console.log('🔧 ComponentManager: Mounting components...');
        
        this.initializationOrder.forEach(name => {
            const component = this.components.get(name);
            if (!component) {
                console.warn(`⚠️ Component '${name}' not found for mounting`);
                return;
            }

            try {
                // Skip ResponsiveManager as it's already mounted
                if (name === 'responsive') {
                    console.log(`⏭️ ${name} component already mounted`);
                    return;
                }
                
                console.log(`🔧 Mounting ${name} component...`);
                component.mount();
                console.log(`✅ ${name} component mounted`);
            } catch (error) {
                console.error(`❌ Failed to mount ${name} component:`, error);
            }
        });
        
        console.log('✅ ComponentManager: All components mounted');
    }

    /**
     * Create ResponsiveManager component
     * @private
     */
    async createResponsiveManager() {
        const responsiveManager = new ResponsiveManager(document.body, this.state);
        this.components.set('responsive', responsiveManager);
        
        // Mount immediately to initialize viewport state
        responsiveManager.mount();
        console.log('✅ ResponsiveManager pre-mounted for state initialization');
    }

    /**
     * Create TouchGestureManager component
     * @private
     */
    async createTouchGestureManager() {
        const touchContainer = document.querySelector('#tasksContainer') || document.body;
        const touchGestureManager = new TouchGestureManager(touchContainer, this.state);
        this.components.set('touchGestures', touchGestureManager);
    }

    /**
     * Create PerformanceManager component
     * @private
     */
    async createPerformanceManager() {
        const performanceContainer = document.querySelector('#tasksContainer') || document.body;
        const performanceManager = new PerformanceManager(performanceContainer, this.state);
        this.components.set('performance', performanceManager);
    }

    /**
     * Create ThemeManager component
     * @private
     */
    async createThemeManager() {
        const themeContainer = document.querySelector('.theme-switcher')?.parentElement || document.body;
        const themeManager = new ThemeManager(themeContainer, this.state);
        this.components.set('theme', themeManager);
    }

    /**
     * Create LanguageManager component
     * @private
     */
    async createLanguageManager() {
        const langContainer = document.querySelector('#langToggle')?.parentElement || document.body;
        const languageManager = new LanguageManager(langContainer, this.state);
        this.components.set('language', languageManager);
    }

    /**
     * Create TaskManager component
     * @private
     */
    async createTaskManager() {
        const taskContainer = document.querySelector('#tasksContainer') || document.body;
        const taskManager = new TaskManager(taskContainer, this.state);
        this.components.set('tasks', taskManager);
    }

    /**
     * Create ExportManager component
     * @private
     */
    async createExportManager() {
        const exportContainer = document.body;
        const exportManager = new ExportManager(exportContainer, this.state);
        this.components.set('export', exportManager);
    }

    /**
     * Create StatsManager component
     * @private
     */
    async createStatsManager() {
        const statsContainer = document.querySelector('.stats-grid') || document.body;
        const statsManager = new StatsManager(statsContainer, this.state);
        this.components.set('stats', statsManager);
    }

    /**
     * Create MobileFilterManager component
     * @private
     */
    async createMobileFilterManager() {
        const mobileFilterManager = new MobileFilterManager(document.body, this.state);
        this.components.set('mobileFilters', mobileFilterManager);
    }

    /**
     * Create ViewManager component
     * @private
     */
    async createViewManager() {
        const viewContainer = document.querySelector('.view-controls') || document.body;
        const viewManager = new ViewManager(viewContainer, this.state);
        this.components.set('view', viewManager);
    }

    /**
     * Get a component by name
     * @param {string} name - Component name
     * @returns {Component|null} Component instance or null
     */
    getComponent(name) {
        return this.components.get(name) || null;
    }

    /**
     * Get all components
     * @returns {Map} Components map
     */
    getAllComponents() {
        return this.components;
    }

    /**
     * Check if all components are mounted
     * @returns {boolean} True if all components are mounted
     */
    areAllComponentsMounted() {
        for (const [name, component] of this.components) {
            if (!component.mounted) {
                console.warn(`Component '${name}' is not mounted`);
                return false;
            }
        }
        return true;
    }

    /**
     * Get component statistics
     * @returns {Object} Component statistics
     */
    getComponentStats() {
        const stats = {
            total: this.components.size,
            mounted: 0,
            failed: 0,
            components: {}
        };

        for (const [name, component] of this.components) {
            try {
                const status = component.getStatus ? component.getStatus() : { mounted: component.mounted };
                stats.components[name] = status;
                
                if (status.mounted) {
                    stats.mounted++;
                } else {
                    stats.failed++;
                }
            } catch (error) {
                stats.components[name] = { error: error.message };
                stats.failed++;
            }
        }

        return stats;
    }

    /**
     * Unmount all components
     */
    unmountAll() {
        console.log('🧹 ComponentManager: Unmounting all components...');
        
        // Unmount in reverse order
        const reverseOrder = [...this.initializationOrder].reverse();
        
        reverseOrder.forEach(name => {
            const component = this.components.get(name);
            if (component) {
                try {
                    component.unmount();
                    console.log(`✅ ${name} component unmounted`);
                } catch (error) {
                    console.error(`❌ Error unmounting ${name}:`, error);
                }
            }
        });

        this.components.clear();
        console.log('✅ ComponentManager: All components unmounted');
    }
}