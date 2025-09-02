/**
 * @fileoverview Refactored Task Manager Component for MADLAB application
 * @module js/components/TaskManager
 * @author MADLAB Team
 * @since 2.0.0
 * @description Lightweight task manager component using service layer architecture.
 *              Handles task display, filtering, and user interactions while delegating
 *              business logic to dedicated services.
 */

import { Component } from './Component.js';
import { TaskRenderer } from './TaskRenderer.js';
import { TaskService } from '../services/TaskService.js';
import { FilterService } from '../services/FilterService.js';
import { translations } from '../data/translations.js';

/**
 * Task Manager Component
 * Manages task display and filtering using service layer
 */
export class TaskManager extends Component {
    /**
     * Initialize TaskManager with required services
     * @param {HTMLElement} element - Container element
     * @param {AppState} state - Application state
     */
    constructor(element, state) {
        super(element, state);
        
        // Initialize services
        this.taskService = new TaskService();
        this.filterService = new FilterService();
        this.taskRenderer = new TaskRenderer(this);
        
        // Debounce timer for performance
        this.debounceTimer = null;
        
        // Set up state subscriptions
        this.subscribeToState('filters', () => this.applyFilters());
        this.subscribeToState('currentLang', () => this.update());
        
        // Initialize tasks in state
        this.state.setState({ tasks: this.taskService.tasksData });
    }

    /**
     * Component mount lifecycle
     */
    onMount() {
        this.updateTaskDisplay();
        this.bindFilterEvents();
    }

    /**
     * Get all tasks using service layer
     * @returns {Array<Object>} All tasks with metadata
     */
    getAllTasks() {
        return this.taskService.getAllTasks();
    }

    /**
     * Get tasks by assignee using service layer
     * @param {string} assignee - Team member name
     * @returns {Array<Object>} Filtered tasks
     */
    getTasksByAssignee(assignee) {
        return this.taskService.getTasksByAssignee(assignee);
    }

    /**
     * Get team statistics using service layer
     * @returns {Array<Object>} Team statistics
     */
    getTeamStats() {
        return this.taskService.getTeamStats();
    }

    /**
     * Apply current filters to tasks
     * Uses debouncing for performance optimization
     */
    applyFilters() {
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce filter application
        this.debounceTimer = setTimeout(() => {
            this._performFiltering();
        }, 150);
    }

    /**
     * Perform the actual filtering operation
     * @private
     */
    _performFiltering() {
        const state = this.state.getState();
        const { filters = {} } = state;
        const currentLang = state.currentLang || 'es';
        
        // Get all tasks and apply filters
        const allTasks = this.taskService.getAllTasks();
        const filteredTasks = this.filterService.applyFilters(allTasks, filters, currentLang);
        
        // Update display with filtered tasks
        this.updateTaskDisplay(filteredTasks);
        this.updateTaskCounter(filteredTasks.length, allTasks.length);
        this.updateFilterChips(filters, currentLang);
    }

    /**
     * Update task display with current or filtered tasks
     * @param {Array<Object>} tasks - Tasks to display (optional)
     */
    updateTaskDisplay(tasks = null) {
        const displayTasks = tasks || this.getAllTasks();
        const currentLang = this.state.getState('currentLang') || 'es';
        
        // Group tasks by phase for organized display
        const tasksByPhase = this.taskService.groupTasksByPhase(displayTasks);
        
        // Update each phase section
        this.updatePhaseDisplay(tasksByPhase, currentLang);
    }

    /**
     * Update phase display with grouped tasks
     * @param {Object} tasksByPhase - Tasks grouped by phase
     * @param {string} lang - Current language
     */
    updatePhaseDisplay(tasksByPhase, lang) {
        // Update each phase (1-5)
        for (let phaseNum = 1; phaseNum <= 5; phaseNum++) {
            const phaseTasks = tasksByPhase[phaseNum] || [];
            this.updatePhaseSection(phaseNum.toString(), phaseTasks, lang);
        }
    }

    /**
     * Update a specific phase section
     * @param {string} phaseNum - Phase number
     * @param {Array<Object>} tasks - Tasks for this phase
     * @param {string} lang - Current language
     */
    updatePhaseSection(phaseNum, tasks, lang) {
        const phaseElement = document.querySelector(`[data-phase="${phaseNum}"]`);
        if (!phaseElement) return;

        const contentElement = phaseElement.querySelector('.phase-content');
        if (!contentElement) return;

        // Clear existing content
        contentElement.innerHTML = '';

        // Add tasks to phase
        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskElement = this.taskRenderer.createTaskElement(task, lang);
                contentElement.appendChild(taskElement);
            });
        } else {
            // Show empty state
            this.createEmptyState(contentElement, lang);
        }

        // Phase updated successfully
    }

    /**
     * Create empty state for phases with no tasks
     * @param {HTMLElement} container - Container element
     * @param {string} lang - Current language
     */
    createEmptyState(container, lang) {
        const t = translations[lang] || translations.es;
        
        const emptyState = this.createElement('div', {
            className: 'empty-state'
        });
            
        emptyState.innerHTML = `
            <div class="empty-state-icon">📋</div>
            <div class="empty-state-message">${t.noMatchingTasks}</div>
        `;
        
        container.appendChild(emptyState);
    }

    /**
     * Update task counter display
     * @param {number} filtered - Number of filtered tasks
     * @param {number} total - Total number of tasks
     */
    updateTaskCounter(filtered, total) {
        const counter = document.getElementById('taskCounter');
        if (counter) {
            counter.textContent = `${filtered} / ${total}`;
        }
    }

    /**
     * Update filter chips display
     * @param {Object} filters - Current filters
     * @param {string} lang - Current language
     */
    updateFilterChips(filters, lang) {
        const chipsContainer = document.getElementById('filterChips');
        if (!chipsContainer) return;

        const chips = this.filterService.generateFilterChips(filters, lang);
        
        if (chips.length === 0) {
            chipsContainer.style.display = 'none';
            chipsContainer.innerHTML = '';
            return;
        }

        chipsContainer.style.display = 'flex';
        chipsContainer.innerHTML = chips.map(chip => `
            <div class="filter-chip" data-filter-type="${chip.type}">
                <span>${chip.label}</span>
                <button class="chip-remove" onclick="window.madlabApp.components.get('tasks').removeFilter('${chip.type}')">×</button>
            </div>
        `).join('');
    }

    /**
     * Remove a specific filter
     * @param {string} filterType - Type of filter to remove
     */
    removeFilter(filterType) {
        const currentFilters = this.state.getState('filters') || {};
        const updatedFilters = this.filterService.removeFilter(currentFilters, filterType);
        
        this.state.setState({ filters: updatedFilters });
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        const emptyFilters = this.filterService.clearAllFilters();
        this.state.setState({ filters: emptyFilters });
        
        // Clear form elements
        this.clearFilterInputs();
    }

    /**
     * Clear filter form inputs
     * @private
     */
    clearFilterInputs() {
        const searchBox = document.getElementById('searchBox');
        const teamFilter = document.getElementById('teamFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        const phaseFilter = document.getElementById('phaseFilter');
        const durationFilter = document.getElementById('durationFilter');

        if (searchBox) searchBox.value = '';
        if (teamFilter) teamFilter.value = '';
        if (difficultyFilter) difficultyFilter.value = '';
        if (phaseFilter) phaseFilter.value = '';
        if (durationFilter) durationFilter.value = '';
    }

    /**
     * Bind filter event listeners
     * @private
     */
    bindFilterEvents() {
        // Search box
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            this.addEventListener(searchBox, 'input', (e) => {
                this.updateFilter('search', e.target.value);
            });
        }

        // Filter dropdowns
        const filterElements = [
            { id: 'teamFilter', key: 'assignee' },
            { id: 'difficultyFilter', key: 'difficulty' },
            { id: 'phaseFilter', key: 'phase' },
            { id: 'durationFilter', key: 'duration' }
        ];

        filterElements.forEach(({ id, key }) => {
            const element = document.getElementById(id);
            if (element) {
                this.addEventListener(element, 'change', (e) => {
                    this.updateFilter(key, e.target.value);
                });
            }
        });
    }

    /**
     * Update a specific filter value
     * @param {string} filterKey - Filter key to update
     * @param {string} value - New filter value
     */
    updateFilter(filterKey, value) {
        const currentFilters = this.state.getState('filters') || {};
        const updatedFilters = { ...currentFilters };

        if (value && value.trim() !== '') {
            updatedFilters[filterKey] = value.trim();
        } else {
            delete updatedFilters[filterKey];
        }

        this.state.setState({ filters: updatedFilters });
    }

    /**
     * Handle task click interactions
     * @param {Object} task - Clicked task data
     */
    handleTaskClick(task) {
        // Emit custom event for other components
        window.dispatchEvent(new CustomEvent('taskClick', {
            detail: { task }
        }));
    }

    /**
     * Get component status for debugging
     * @returns {Object} Component status
     */
    getStatus() {
        const allTasks = this.getAllTasks();
        const currentFilters = this.state.getState('filters') || {};
        
        return {
            mounted: this.mounted,
            totalTasks: allTasks.length,
            activeFilters: Object.keys(currentFilters).length,
            services: {
                taskService: !!this.taskService,
                filterService: !!this.filterService,
                taskRenderer: !!this.taskRenderer
            }
        };
    }
}