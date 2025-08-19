/**
 * @fileoverview Task filtering service for MADLAB application
 * @module js/services/FilterService
 * @author MADLAB Team
 * @since 1.0.0
 * @description Service for applying complex filters to task data including search,
 *              assignee, difficulty, phase, and duration filters.
 */

/**
 * Service class for task filtering operations
 * Handles all filtering logic and filter combinations
 */
export class FilterService {
    constructor() {
        this.activeFilters = {};
    }

    /**
     * Apply all active filters to a task array
     * @param {Array<Object>} tasks - Array of tasks to filter
     * @param {Object} filters - Filter criteria object
     * @param {string} lang - Current language for text matching
     * @returns {Array<Object>} Filtered tasks array
     * @example
     * const filtered = filterService.applyFilters(tasks, {
     *   search: 'design',
     *   assignee: 'Aldo',
     *   difficulty: '3'
     * }, 'es');
     */
    applyFilters(tasks, filters = {}, lang = 'es') {
        let filteredTasks = [...tasks];

        // Apply each filter type sequentially
        if (filters.search) {
            filteredTasks = this.applySearchFilter(filteredTasks, filters.search, lang);
        }

        if (filters.assignee) {
            filteredTasks = this.applyAssigneeFilter(filteredTasks, filters.assignee);
        }

        if (filters.difficulty) {
            filteredTasks = this.applyDifficultyFilter(filteredTasks, filters.difficulty);
        }

        if (filters.phase) {
            filteredTasks = this.applyPhaseFilter(filteredTasks, filters.phase);
        }

        if (filters.duration) {
            filteredTasks = this.applyDurationFilter(filteredTasks, filters.duration);
        }

        return filteredTasks;
    }

    /**
     * Apply search filter to tasks
     * @param {Array<Object>} tasks - Tasks to filter
     * @param {string} searchTerm - Search query
     * @param {string} lang - Language for text matching
     * @returns {Array<Object>} Filtered tasks
     */
    applySearchFilter(tasks, searchTerm, lang = 'es') {
        if (!searchTerm || searchTerm.trim() === '') {
            return tasks;
        }

        const query = searchTerm.toLowerCase().trim();
        
        return tasks.filter(task => {
            const taskName = this.getTaskName(task, lang).toLowerCase();
            const taskId = (task.id || '').toLowerCase();
            const assignee = (task.assignedTo || '').toLowerCase();
            
            return taskName.includes(query) || 
                   taskId.includes(query) || 
                   assignee.includes(query);
        });
    }

    /**
     * Apply assignee filter to tasks
     * @param {Array<Object>} tasks - Tasks to filter
     * @param {string} assignee - Assignee name or 'All' for team-wide tasks
     * @returns {Array<Object>} Filtered tasks
     */
    applyAssigneeFilter(tasks, assignee) {
        if (!assignee || assignee === '') {
            return tasks;
        }

        if (assignee === 'All') {
            // Return tasks assigned to multiple people or team tasks
            return tasks.filter(task => 
                task.assignedTo === 'All' || 
                task.assignedTo === 'Team' ||
                (task.assignedTo && task.assignedTo.includes(','))
            );
        }

        return tasks.filter(task => task.assignedTo === assignee);
    }

    /**
     * Apply difficulty filter to tasks
     * @param {Array<Object>} tasks - Tasks to filter
     * @param {string|number} difficulty - Difficulty level (1-5)
     * @returns {Array<Object>} Filtered tasks
     */
    applyDifficultyFilter(tasks, difficulty) {
        if (!difficulty || difficulty === '') {
            return tasks;
        }

        const difficultyLevel = parseInt(difficulty, 10);
        return tasks.filter(task => task.difficulty === difficultyLevel);
    }

    /**
     * Apply phase filter to tasks
     * @param {Array<Object>} tasks - Tasks to filter
     * @param {string|number} phaseNum - Phase number
     * @returns {Array<Object>} Filtered tasks
     */
    applyPhaseFilter(tasks, phaseNum) {
        if (!phaseNum || phaseNum === '') {
            return tasks;
        }

        return tasks.filter(task => task.phase === phaseNum.toString());
    }

    /**
     * Apply duration filter to tasks
     * @param {Array<Object>} tasks - Tasks to filter
     * @param {string} durationRange - Duration range ('short', 'medium', 'long')
     * @returns {Array<Object>} Filtered tasks
     */
    applyDurationFilter(tasks, durationRange) {
        if (!durationRange || durationRange === '') {
            return tasks;
        }

        return tasks.filter(task => {
            const duration = parseFloat(task.duration);
            
            switch (durationRange) {
                case 'short':
                    return duration <= 2;
                case 'medium':
                    return duration > 2 && duration <= 5;
                case 'long':
                    return duration > 5;
                default:
                    return true;
            }
        });
    }

    /**
     * Check if a duration matches the filter criteria
     * @param {number|string} duration - Task duration in hours
     * @param {string} filter - Filter type ('short', 'medium', 'long')
     * @returns {boolean} True if duration matches filter
     */
    matchesDurationFilter(duration, filter) {
        const hours = parseFloat(duration);
        
        switch (filter) {
            case 'short':
                return hours <= 2;
            case 'medium':
                return hours > 2 && hours <= 5;
            case 'long':
                return hours > 5;
            default:
                return true;
        }
    }

    /**
     * Get task name in specified language
     * @param {Object} task - Task object
     * @param {string} lang - Language code ('es' or 'en')
     * @returns {string} Task name in specified language
     */
    getTaskName(task, lang = 'es') {
        if (typeof task.name === 'string') {
            return task.name;
        }
        
        if (typeof task.name === 'object') {
            return task.name[lang] || task.name.es || task.name.en || '';
        }
        
        return '';
    }

    /**
     * Generate filter summary for display
     * @param {Object} filters - Active filters
     * @param {string} lang - Current language
     * @returns {Array<Object>} Filter chips data
     */
    generateFilterChips(filters, lang = 'es') {
        const chips = [];
        
        if (filters.search) {
            chips.push({
                type: 'search',
                label: lang === 'es' ? `Búsqueda: "${filters.search}"` : `Search: "${filters.search}"`,
                value: filters.search
            });
        }
        
        if (filters.assignee) {
            chips.push({
                type: 'assignee',
                label: lang === 'es' ? `Asignado: ${filters.assignee}` : `Assignee: ${filters.assignee}`,
                value: filters.assignee
            });
        }
        
        if (filters.difficulty) {
            chips.push({
                type: 'difficulty',
                label: lang === 'es' ? `Dificultad: ${filters.difficulty}` : `Difficulty: ${filters.difficulty}`,
                value: filters.difficulty
            });
        }
        
        if (filters.phase) {
            chips.push({
                type: 'phase',
                label: lang === 'es' ? `Fase: ${filters.phase}` : `Phase: ${filters.phase}`,
                value: filters.phase
            });
        }
        
        if (filters.duration) {
            const durationLabels = {
                es: { short: 'Corta', medium: 'Media', long: 'Larga' },
                en: { short: 'Short', medium: 'Medium', long: 'Long' }
            };
            
            chips.push({
                type: 'duration',
                label: lang === 'es' ? 
                    `Duración: ${durationLabels.es[filters.duration]}` : 
                    `Duration: ${durationLabels.en[filters.duration]}`,
                value: filters.duration
            });
        }
        
        return chips;
    }

    /**
     * Clear all filters
     * @returns {Object} Empty filters object
     */
    clearAllFilters() {
        this.activeFilters = {};
        return {};
    }

    /**
     * Remove a specific filter
     * @param {Object} filters - Current filters
     * @param {string} filterType - Type of filter to remove
     * @returns {Object} Updated filters object
     */
    removeFilter(filters, filterType) {
        const updatedFilters = { ...filters };
        delete updatedFilters[filterType];
        return updatedFilters;
    }

    /**
     * Count tasks matching current filters
     * @param {Array<Object>} allTasks - All available tasks
     * @param {Object} filters - Current filters
     * @param {string} lang - Current language
     * @returns {Object} Count summary
     */
    getFilteredCount(allTasks, filters, lang = 'es') {
        const filtered = this.applyFilters(allTasks, filters, lang);
        
        return {
            filtered: filtered.length,
            total: allTasks.length,
            percentage: allTasks.length > 0 ? ((filtered.length / allTasks.length) * 100).toFixed(1) : '0'
        };
    }
}