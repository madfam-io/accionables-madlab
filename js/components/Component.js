// ==========================================================================
// Base Component Class
// ==========================================================================

export class Component {
    constructor(element, state) {
        this.element = element;
        this.state = state;
        this.mounted = false;
        this.eventListeners = new Map();
        this.unsubscribeFns = [];
    }

    /**
     * Mount the component (render and bind events)
     */
    mount() {
        if (this.mounted) return;
        
        try {
            this.render();
            this.bindEvents();
            this.mounted = true;
            this.onMount();
        } catch (error) {
            console.error(`Error mounting component:`, error);
        }
    }

    /**
     * Unmount the component (cleanup)
     */
    unmount() {
        if (!this.mounted) return;

        try {
            this.cleanup();
            this.mounted = false;
            this.onUnmount();
        } catch (error) {
            console.error(`Error unmounting component:`, error);
        }
    }

    /**
     * Render the component (override in subclasses)
     */
    render() {
        // Override in subclasses
    }

    /**
     * Bind event listeners (override in subclasses)
     */
    bindEvents() {
        // Override in subclasses
    }

    /**
     * Update the component (re-render if needed)
     */
    update() {
        if (!this.mounted) return;
        
        try {
            this.render();
        } catch (error) {
            console.error(`Error updating component:`, error);
        }
    }

    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(element, event, handler, options = {}) {
        const wrappedHandler = (e) => {
            try {
                handler(e);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        };

        element.addEventListener(event, wrappedHandler, options);
        
        const key = `${element.tagName}-${event}-${Date.now()}`;
        this.eventListeners.set(key, {
            element,
            event,
            handler: wrappedHandler,
            options
        });
    }

    /**
     * Subscribe to state changes with automatic cleanup
     * @param {string} stateKey - State key to watch
     * @param {Function} callback - Callback function
     */
    subscribeToState(stateKey, callback) {
        const unsubscribe = this.state.subscribe(stateKey, callback);
        this.unsubscribeFns.push(unsubscribe);
        return unsubscribe;
    }

    /**
     * Clean up event listeners and subscriptions
     */
    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        this.eventListeners.clear();

        // Unsubscribe from state changes
        this.unsubscribeFns.forEach(fn => fn());
        this.unsubscribeFns.length = 0;
    }

    /**
     * Safely query elements within component scope
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Context element (defaults to component element)
     * @returns {HTMLElement|null} Found element
     */
    $(selector, context = this.element) {
        try {
            return context ? context.querySelector(selector) : null;
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`, error);
            return null;
        }
    }

    /**
     * Safely query all elements within component scope
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Context element (defaults to component element)
     * @returns {NodeList} Found elements
     */
    $$(selector, context = this.element) {
        try {
            return context ? context.querySelectorAll(selector) : [];
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`, error);
            return [];
        }
    }

    /**
     * Create element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string|HTMLElement|Array} content - Element content
     * @returns {HTMLElement} Created element
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(item => {
                if (typeof item === 'string') {
                    element.appendChild(document.createTextNode(item));
                } else if (item instanceof HTMLElement) {
                    element.appendChild(item);
                }
            });
        }

        return element;
    }

    /**
     * Component lifecycle hook - called after mount
     */
    onMount() {
        // Override in subclasses
    }

    /**
     * Component lifecycle hook - called before unmount
     */
    onUnmount() {
        // Override in subclasses
    }

    /**
     * Get component status
     * @returns {Object} Component status
     */
    getStatus() {
        return {
            mounted: this.mounted,
            eventListeners: this.eventListeners.size,
            subscriptions: this.unsubscribeFns.length,
            element: this.element?.tagName || 'none'
        };
    }
}

export default Component;