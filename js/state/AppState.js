// ==========================================================================
// Application State Management
// ==========================================================================

export class AppState {
    constructor() {
        this.state = {
            currentLang: this.loadFromStorage('madlab-lang', 'es'),
            theme: this.loadFromStorage('madlab-theme', 'auto'),
            filters: {
                search: '',
                assignee: '',
                difficulty: '',
                phase: '',
                duration: ''
            },
            ui: {
                collapsedPhases: new Set(),
                activeModal: null,
                loading: false
            },
            tasks: null,
            filteredTasks: []
        };
        
        this.subscribers = new Map();
        this.lastStateUpdate = Date.now();
    }

    /**
     * Get current state or specific state property
     * @param {string} [key] - Optional key to get specific state property
     * @returns {*} State value
     */
    getState(key = null) {
        return key ? this.state[key] : { ...this.state };
    }

    /**
     * Update state and notify subscribers
     * @param {Object} updates - State updates to apply
     */
    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this.lastStateUpdate = Date.now();
        
        // Notify subscribers of specific state changes
        Object.keys(updates).forEach(key => {
            if (this.subscribers.has(key)) {
                this.subscribers.get(key).forEach(callback => {
                    try {
                        callback(this.state[key], prevState[key]);
                    } catch (error) {
                        console.error(`Error in state subscriber for ${key}:`, error);
                    }
                });
            }
        });

        // Persist certain state changes
        this.persistState(updates);
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const keySubscribers = this.subscribers.get(key);
            if (keySubscribers) {
                keySubscribers.delete(callback);
                if (keySubscribers.size === 0) {
                    this.subscribers.delete(key);
                }
            }
        };
    }

    /**
     * Load data from localStorage with fallback
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    loadFromStorage(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.warn(`Failed to load ${key} from localStorage:`, error);
            return defaultValue;
        }
    }

    /**
     * Persist state changes to localStorage
     * @param {Object} updates - State updates
     */
    persistState(updates) {
        Object.keys(updates).forEach(key => {
            if (['currentLang', 'theme', 'ui'].includes(key)) {
                try {
                    localStorage.setItem(`madlab-${key}`, JSON.stringify(this.state[key]));
                } catch (error) {
                    console.warn(`Failed to persist ${key} to localStorage:`, error);
                }
            }
        });
    }

    /**
     * Reset state to initial values
     */
    reset() {
        this.setState({
            filters: {
                search: '',
                assignee: '',
                difficulty: '',
                phase: '',
                duration: ''
            },
            ui: {
                collapsedPhases: new Set(),
                activeModal: null,
                loading: false
            },
            filteredTasks: []
        });
    }

    /**
     * Get state statistics for debugging
     * @returns {Object} State statistics
     */
    getStats() {
        return {
            subscriberCount: Array.from(this.subscribers.values())
                .reduce((total, subs) => total + subs.size, 0),
            lastUpdate: this.lastStateUpdate,
            stateKeys: Object.keys(this.state),
            memoryUsage: JSON.stringify(this.state).length
        };
    }
}

export default AppState;