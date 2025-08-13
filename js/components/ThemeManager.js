// ==========================================================================
// Theme Manager Component
// ==========================================================================

import { Component } from './Component.js';

export class ThemeManager extends Component {
    constructor(element, state) {
        super(element, state);
        this.subscribeToState('theme', () => this.update());
    }

    /**
     * Detect system theme preference
     * @returns {string} System theme ('light' or 'dark')
     */
    detectSystemTheme() {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme name ('auto', 'light', or 'dark')
     */
    applyTheme(theme) {
        const actualTheme = theme === 'auto' ? this.detectSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', actualTheme);
        
        // Update active theme button
        this.updateThemeButtons(theme);
        
        // Store theme preference
        this.state.setState({ theme });
    }

    /**
     * Set theme and apply changes
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        if (!['auto', 'light', 'dark'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }
        
        this.applyTheme(theme);
        
        // Dispatch custom event for external listeners
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme, actualTheme: this.getActualTheme() }
        }));
    }

    /**
     * Get the currently applied theme
     * @returns {string} Actual theme being used
     */
    getActualTheme() {
        const setTheme = this.state.getState('theme');
        return setTheme === 'auto' ? this.detectSystemTheme() : setTheme;
    }

    /**
     * Update theme button active states
     * @param {string} activeTheme - Currently active theme
     */
    updateThemeButtons(activeTheme) {
        const themes = ['auto', 'light', 'dark'];
        themes.forEach((theme, index) => {
            const button = this.$$(`.theme-btn`)[index];
            if (button) {
                button.classList.toggle('active', theme === activeTheme);
            }
        });
    }

    /**
     * Bind theme-related event listeners
     */
    bindEvents() {
        // Theme button handlers
        this.$$('.theme-btn').forEach((btn, index) => {
            const themes = ['auto', 'light', 'dark'];
            this.addEventListener(btn, 'click', () => {
                this.setTheme(themes[index]);
            });
        });

        // System theme change listener
        this.setupSystemThemeListener();
    }

    /**
     * Set up system theme change listener
     */
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            const currentTheme = this.state.getState('theme');
            if (currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        };

        // Store the handler for cleanup
        this.systemThemeHandler = handleSystemThemeChange;
        this.mediaQuery = mediaQuery;

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }

    /**
     * Initialize theme on component mount
     */
    onMount() {
        const savedTheme = this.state.getState('theme');
        this.applyTheme(savedTheme);
    }

    /**
     * Cleanup on unmount
     */
    onUnmount() {
        // Clean up system theme listener
        if (this.mediaQuery && this.systemThemeHandler) {
            if (this.mediaQuery.removeEventListener) {
                this.mediaQuery.removeEventListener('change', this.systemThemeHandler);
            } else {
                // Fallback for older browsers
                this.mediaQuery.removeListener(this.systemThemeHandler);
            }
        }
    }

    /**
     * Render theme controls (if not already in DOM)
     */
    render() {
        if (!this.element) return;

        // Check if theme switcher already exists
        const existingSwitcher = this.$('.theme-switcher');
        if (existingSwitcher) {
            this.updateThemeButtons(this.state.getState('theme'));
            return;
        }

        // Create theme switcher if it doesn't exist
        const themeSwitcher = this.createElement('div', {
            className: 'theme-switcher'
        });

        const themes = [
            { name: 'auto', icon: '🌓', title: 'Auto' },
            { name: 'light', icon: '☀️', title: 'Light' },
            { name: 'dark', icon: '🌙', title: 'Dark' }
        ];

        themes.forEach(theme => {
            const button = this.createElement('button', {
                className: 'theme-btn',
                title: theme.title
            }, theme.icon);
            
            themeSwitcher.appendChild(button);
        });

        this.element.appendChild(themeSwitcher);
        this.updateThemeButtons(this.state.getState('theme'));
    }

    /**
     * Get theme statistics for debugging
     * @returns {Object} Theme statistics
     */
    getThemeInfo() {
        return {
            currentTheme: this.state.getState('theme'),
            actualTheme: this.getActualTheme(),
            systemTheme: this.detectSystemTheme(),
            supportsPrefers: window.matchMedia?.('(prefers-color-scheme: dark)') !== undefined
        };
    }
}

export default ThemeManager;