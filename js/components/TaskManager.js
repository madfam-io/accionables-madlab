// ==========================================================================
// Task Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { tasksData } from '../data/tasks.js';
import { getAssigneeColor, getAssigneeInitials } from '../utils/helpers.js';

export class TaskManager extends Component {
    constructor(element, state) {
        super(element, state);
        this.subscribeToState('filters', () => this.applyFilters());
        this.subscribeToState('currentLang', () => this.update());
        
        // Initialize tasks data
        this.state.setState({ tasks: tasksData });
        this.debounceTimer = null;
    }

    /**
     * Get all tasks as a flat array
     * @returns {Array} All tasks with phase and section info
     */
    getAllTasks() {
        const tasks = [];
        const tasksData = this.state.getState('tasks');
        
        if (!tasksData) return tasks;

        Object.entries(tasksData).forEach(([phaseNum, phase]) => {
            phase.sections.forEach(section => {
                section.tasks.forEach(task => {
                    tasks.push({
                        ...task,
                        phase: phaseNum,
                        phaseTitle: phase.title,
                        section: section.title
                    });
                });
            });
        });

        return tasks;
    }

    /**
     * Get tasks by assignee
     * @param {string} assignee - Team member name
     * @returns {Array} Tasks assigned to the member
     */
    getTasksByAssignee(assignee) {
        return this.getAllTasks().filter(task => task.assignedTo === assignee);
    }

    /**
     * Get team statistics
     * @returns {Object} Team member statistics
     */
    getTeamStats() {
        const allTasks = this.getAllTasks();
        const teamMembers = ['Aldo', 'Nuri', 'Luis', 'Silvia', 'Caro'];
        
        return teamMembers.map(member => {
            const memberTasks = allTasks.filter(task => task.assignedTo === member);
            const totalHours = memberTasks.reduce((sum, task) => sum + parseFloat(task.duration), 0);
            
            return {
                name: member,
                taskCount: memberTasks.length,
                totalHours: totalHours.toFixed(1),
                avgDifficulty: memberTasks.length > 0 
                    ? (memberTasks.reduce((sum, task) => sum + task.difficulty, 0) / memberTasks.length).toFixed(1)
                    : '0'
            };
        });
    }

    /**
     * Apply filters to tasks
     */
    applyFilters() {
        const { tasks, filters } = this.state.getState();
        if (!tasks) {
            return;
        }

        const allTasks = this.getAllTasks();
        
        const filteredTasks = allTasks.filter(task => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                
                switch (key) {
                    case 'search':
                        const currentLang = this.state.getState('currentLang');
                        const taskName = task.name[currentLang] || task.name.es;
                        return taskName.toLowerCase().includes(value.toLowerCase()) ||
                               task.id.toLowerCase().includes(value.toLowerCase());
                    case 'assignee':
                        return task.assignedTo === value;
                    case 'difficulty':
                        return task.difficulty.toString() === value;
                    case 'phase':
                        return task.phase === value;
                    case 'duration':
                        return this.matchesDurationFilter(task.duration, value);
                    default:
                        return true;
                }
            });
        });

        this.state.setState({ filteredTasks });
        this.updateTaskDisplay();
        this.updateFilterChips();
    }

    /**
     * Check if task duration matches filter
     * @param {string} duration - Task duration
     * @param {string} filter - Duration filter value
     * @returns {boolean} Whether task matches filter
     */
    matchesDurationFilter(duration, filter) {
        const hours = parseFloat(duration);
        switch (filter) {
            case 'short': return hours <= 2;
            case 'medium': return hours > 2 && hours <= 5;
            case 'long': return hours > 5;
            default: return true;
        }
    }

    /**
     * Update task display in the UI
     */
    updateTaskDisplay() {
        const filteredTasks = this.state.getState('filteredTasks');
        const currentLang = this.state.getState('currentLang');
        
        // Update filtered tasks state (this will trigger StatsManager to update counter)
        this.state.setState({ filteredTasks });

        // Group filtered tasks by phase
        const tasksByPhase = this.groupTasksByPhase(filteredTasks);
        
        // Update each phase section
        Object.entries(tasksByPhase).forEach(([phaseNum, phaseTasks]) => {
            this.updatePhaseSection(phaseNum, phaseTasks, currentLang);
        });

        // Hide phases with no tasks
        this.hideEmptyPhases(tasksByPhase);
    }

    /**
     * Group tasks by phase
     * @param {Array} tasks - Tasks to group
     * @returns {Object} Tasks grouped by phase
     */
    groupTasksByPhase(tasks) {
        return tasks.reduce((groups, task) => {
            if (!groups[task.phase]) {
                groups[task.phase] = [];
            }
            groups[task.phase].push(task);
            return groups;
        }, {});
    }

    /**
     * Update a specific phase section
     * @param {string} phaseNum - Phase number
     * @param {Array} tasks - Tasks for this phase
     * @param {string} lang - Current language
     */
    updatePhaseSection(phaseNum, tasks, lang) {
        const phaseElement = document.querySelector(`[data-phase="${phaseNum}"]`);
        if (!phaseElement) return;

        const tasksContainer = phaseElement.querySelector('.phase-content');
        if (!tasksContainer) return;

        // Clear existing tasks
        tasksContainer.innerHTML = '';

        // Group tasks by section
        const tasksBySection = tasks.reduce((groups, task) => {
            const sectionTitle = task.section[lang] || task.section.es;
            if (!groups[sectionTitle]) {
                groups[sectionTitle] = [];
            }
            groups[sectionTitle].push(task);
            return groups;
        }, {});

        // Render sections
        Object.entries(tasksBySection).forEach(([sectionTitle, sectionTasks]) => {
            const sectionElement = this.createSectionElement(sectionTitle, sectionTasks, lang);
            tasksContainer.appendChild(sectionElement);
        });

        // Show phase if it has tasks
        phaseElement.style.display = tasks.length > 0 ? 'block' : 'none';
    }

    /**
     * Create section element with tasks
     * @param {string} title - Section title
     * @param {Array} tasks - Section tasks
     * @param {string} lang - Current language
     * @returns {HTMLElement} Section element
     */
    createSectionElement(title, tasks, lang) {
        const section = this.createElement('div', { className: 'section' });
        
        // Section title
        const sectionTitle = this.createElement('h3', {
            className: 'section-title'
        }, title);
        section.appendChild(sectionTitle);

        // Tasks
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task, lang);
            section.appendChild(taskElement);
        });

        return section;
    }

    /**
     * Create task card element
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task element
     */
    createTaskElement(task, lang) {
        const taskCard = this.createElement('div', {
            className: 'task-card',
            dataset: { taskId: task.id }
        });

        // Task header
        const taskHeader = this.createElement('div', { className: 'task-header' });
        
        // Main info
        const mainInfo = this.createElement('div', { className: 'task-main-info' });
        
        const taskId = this.createElement('div', { className: 'task-id' }, task.id);
        const taskName = this.createElement('div', {
            className: 'task-name'
        }, task.name[lang] || task.name.es);
        
        mainInfo.appendChild(taskId);
        mainInfo.appendChild(taskName);

        // Visual indicators
        const indicators = this.createElement('div', { className: 'task-visual-indicators' });
        
        // Assignee badge
        const assigneeBadge = this.createAssigneeBadge(task.assignedTo);
        indicators.appendChild(assigneeBadge);
        
        // Duration bar
        const durationBar = this.createDurationBar(parseFloat(task.duration));
        indicators.appendChild(durationBar);

        taskHeader.appendChild(mainInfo);
        taskHeader.appendChild(indicators);

        // Task meta
        const taskMeta = this.createTaskMeta(task, lang);

        // Task details (dependencies) - collapsible
        const taskDetails = this.createTaskDetails(task, lang);

        taskCard.appendChild(taskHeader);
        taskCard.appendChild(taskMeta);
        if (taskDetails) {
            taskCard.appendChild(taskDetails);
        }

        // Add click handler for task interaction
        this.addEventListener(taskCard, 'click', () => {
            this.handleTaskClick(task);
        });

        // Set phase color stripe
        const phaseColors = {
            '1': '#3b82f6', // Blue
            '2': '#10b981', // Green  
            '3': '#f59e0b', // Orange
            '4': '#ef4444', // Red
            '5': '#8b5cf6'  // Purple
        };
        taskCard.style.setProperty('--phase-color', phaseColors[task.phase] || '#6b7280');

        return taskCard;
    }

    /**
     * Create assignee badge
     * @param {string} assignee - Assignee name
     * @returns {HTMLElement} Assignee badge
     */
    createAssigneeBadge(assignee) {
        const color = getAssigneeColor(assignee);
        const initials = getAssigneeInitials(assignee);
        return this.createElement('div', {
            className: 'assignee-badge',
            style: `background-color: ${color}`
        }, initials);
    }

    /**
     * Create duration bar
     * @param {number} duration - Duration in hours
     * @returns {HTMLElement} Duration bar
     */
    createDurationBar(duration) {
        const maxDuration = 12; // Assume max 12 hours for scaling
        const percentage = Math.min((duration / maxDuration) * 100, 100);
        
        const durationBar = this.createElement('div', { className: 'duration-bar' });
        const durationFill = this.createElement('div', {
            className: 'duration-fill',
            style: `width: ${percentage}%`
        });
        
        durationBar.appendChild(durationFill);
        return durationBar;
    }

    /**
     * Create task metadata section
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task meta element
     */
    createTaskMeta(task, lang) {
        const meta = this.createElement('div', { className: 'task-meta' });
        
        // Assignee info
        const assigneeInfo = this.createElement('span', {
            className: 'assignee-info'
        }, `👤 ${task.assignedTo}`);
        
        // Duration
        const duration = this.createElement('span', {}, 
            `⏱️ ${task.duration}h`);
        
        // Difficulty with dots
        const difficultyContainer = this.createDifficultyDisplay(task.difficulty);
        
        meta.appendChild(assigneeInfo);
        meta.appendChild(duration);
        meta.appendChild(difficultyContainer);
        
        return meta;
    }

    /**
     * Create difficulty display with dots
     * @param {number} difficulty - Difficulty level (1-5)
     * @returns {HTMLElement} Difficulty display element
     */
    createDifficultyDisplay(difficulty) {
        const container = this.createElement('div', {
            className: 'difficulty-container'
        });

        const label = this.createElement('span', {}, '⭐');
        const stars = this.createElement('div', {
            className: 'difficulty-stars'
        });

        // Create 5 difficulty dots
        for (let i = 1; i <= 5; i++) {
            const star = this.createElement('div', {
                className: `difficulty-star ${i <= difficulty ? 'filled' : ''}`
            });
            stars.appendChild(star);
        }

        container.appendChild(label);
        container.appendChild(stars);
        return container;
    }

    /**
     * Create task details section (dependencies)
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement|null} Task details element
     */
    createTaskDetails(task, lang) {
        const depText = typeof task.dependencies === 'object' 
            ? task.dependencies[lang] || task.dependencies.es
            : task.dependencies;
        
        if (!depText || depText === 'None' || depText === 'Ninguna') {
            return null;
        }

        const detailsContainer = this.createElement('div', {
            className: 'task-details collapsed'
        });

        const toggleBtn = this.createElement('button', {
            className: 'details-toggle'
        }, lang === 'es' ? 'Mostrar dependencias' : 'Show dependencies');

        const content = this.createElement('div', {
            className: 'details-content'
        });

        const depsLabel = this.createElement('strong', {}, 
            lang === 'es' ? 'Dependencias: ' : 'Dependencies: ');
        const depsText = this.createElement('span', {}, depText);

        content.appendChild(depsLabel);
        content.appendChild(depsText);

        detailsContainer.appendChild(toggleBtn);
        detailsContainer.appendChild(content);

        // Add toggle functionality
        this.addEventListener(toggleBtn, 'click', (e) => {
            e.stopPropagation();
            const isCollapsed = detailsContainer.classList.contains('collapsed');
            
            if (isCollapsed) {
                detailsContainer.classList.remove('collapsed');
                toggleBtn.textContent = lang === 'es' ? 'Ocultar dependencias' : 'Hide dependencies';
            } else {
                detailsContainer.classList.add('collapsed');
                toggleBtn.textContent = lang === 'es' ? 'Mostrar dependencias' : 'Show dependencies';
            }
        });

        return detailsContainer;
    }

    /**
     * Hide phases that have no visible tasks
     * @param {Object} tasksByPhase - Tasks grouped by phase
     */
    hideEmptyPhases(tasksByPhase) {
        for (let i = 1; i <= 5; i++) {
            const phaseElement = document.querySelector(`[data-phase="${i}"]`);
            if (phaseElement) {
                const hasVisibleTasks = tasksByPhase[i] && tasksByPhase[i].length > 0;
                phaseElement.style.display = hasVisibleTasks ? 'block' : 'none';
            }
        }
    }

    /**
     * Handle task card click
     * @param {Object} task - Clicked task data
     */
    handleTaskClick(task) {
        // Add selection animation
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            taskElement.classList.add('task-selected');
            setTimeout(() => {
                taskElement.classList.remove('task-selected');
            }, 300);
        }

        // Dispatch custom event for external listeners
        window.dispatchEvent(new CustomEvent('taskclick', {
            detail: { task }
        }));
    }

    /**
     * Update filter with debouncing
     * @param {string} type - Filter type
     * @param {string} value - Filter value
     */
    updateFilter(type, value) {
        const currentFilters = this.state.getState('filters');
        this.state.setState({
            filters: { ...currentFilters, [type]: value }
        });
    }

    /**
     * Update filter chips display
     */
    updateFilterChips() {
        const filters = this.state.getState('filters');
        const currentLang = this.state.getState('currentLang');
        const chipsContainer = document.getElementById('filterChips');
        
        if (!chipsContainer) return;

        // Clear existing chips
        chipsContainer.innerHTML = '';

        // Check if any filters are active
        const activeFilters = Object.entries(filters).filter(([key, value]) => value);
        
        if (activeFilters.length === 0) {
            chipsContainer.style.display = 'none';
            return;
        }

        chipsContainer.style.display = 'flex';

        // Create chips for active filters
        activeFilters.forEach(([filterType, filterValue]) => {
            const chip = this.createFilterChip(filterType, filterValue, currentLang);
            chipsContainer.appendChild(chip);
        });
    }

    /**
     * Create a filter chip
     */
    createFilterChip(filterType, filterValue, lang) {
        const chip = this.createElement('div', {
            className: `filter-chip ${filterType}`,
            dataset: { filterType, filterValue }
        });

        // Get display text for the chip
        const chipText = this.getFilterChipText(filterType, filterValue, lang);
        const textNode = this.createElement('span', {}, chipText);
        
        // Create remove button
        const removeBtn = this.createElement('button', {
            className: 'filter-chip-remove',
            title: lang === 'es' ? 'Quitar filtro' : 'Remove filter'
        }, '×');

        chip.appendChild(textNode);
        chip.appendChild(removeBtn);

        // Add click handler for removal
        this.addEventListener(removeBtn, 'click', (e) => {
            e.stopPropagation();
            this.removeFilter(filterType);
        });

        return chip;
    }

    /**
     * Get display text for filter chip
     */
    getFilterChipText(filterType, filterValue, lang) {
        const t = this.getTranslations(lang);
        
        switch (filterType) {
            case 'search':
                return `${lang === 'es' ? 'Buscar' : 'Search'}: "${filterValue}"`;
            case 'assignee':
                return `${t.assignedTo || 'Assigned'}: ${filterValue}`;
            case 'difficulty':
                return `${t.difficulty || 'Difficulty'}: ${t.level || 'Level'} ${filterValue}`;
            case 'phase':
                return `${t.phase || 'Phase'}: ${filterValue}`;
            case 'duration':
                const durationLabels = {
                    'short': lang === 'es' ? 'Corta (≤2h)' : 'Short (≤2h)',
                    'medium': lang === 'es' ? 'Media (2-5h)' : 'Medium (2-5h)',
                    'long': lang === 'es' ? 'Larga (>5h)' : 'Long (>5h)'
                };
                return `${t.duration || 'Duration'}: ${durationLabels[filterValue] || filterValue}`;
            default:
                return filterValue;
        }
    }

    /**
     * Get translations (helper method)
     */
    getTranslations(lang) {
        const languageManager = window.madlabApp?.components?.get('language');
        return languageManager ? languageManager.getTranslations(lang) : {};
    }

    /**
     * Remove a specific filter
     */
    removeFilter(filterType) {
        const currentFilters = this.state.getState('filters');
        this.state.setState({
            filters: { ...currentFilters, [filterType]: '' }
        });

        // Update UI elements
        this.updateFilterUI(filterType, '');
    }

    /**
     * Update filter UI elements
     */
    updateFilterUI(filterType, value) {
        switch (filterType) {
            case 'search':
                const searchBox = document.getElementById('searchBox');
                if (searchBox) searchBox.value = value;
                break;
            case 'assignee':
                const teamFilter = document.getElementById('teamFilter');
                if (teamFilter) teamFilter.value = value;
                break;
            case 'difficulty':
                const difficultyFilter = document.getElementById('difficultyFilter');
                if (difficultyFilter) difficultyFilter.value = value;
                break;
            case 'phase':
                const phaseFilter = document.getElementById('phaseFilter');
                if (phaseFilter) phaseFilter.value = value;
                break;
            case 'duration':
                const durationFilter = document.getElementById('durationFilter');
                if (durationFilter) durationFilter.value = value;
                break;
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        // Animate filter chips removal
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach((chip, index) => {
            setTimeout(() => {
                chip.classList.add('filter-chip-exit');
                setTimeout(() => {
                    chip.remove();
                }, 200);
            }, index * 50);
        });

        // Update state after animation
        setTimeout(() => {
            this.state.setState({
                filters: {
                    search: '',
                    assignee: '',
                    difficulty: '',
                    phase: '',
                    duration: ''
                }
            });

            // Reset filter UI elements
            const searchBox = document.getElementById('searchBox');
            if (searchBox) searchBox.value = '';
            
            document.querySelectorAll('select').forEach(select => {
                select.value = '';
            });

            // Hide chips container
            const chipsContainer = document.getElementById('filterChips');
            if (chipsContainer) {
                setTimeout(() => {
                    chipsContainer.style.display = 'none';
                }, 300);
            }
        }, chips.length * 50 + 200);
    }

    /**
     * Bind task-related event listeners
     */
    bindEvents() {
        // Search box
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            this.addEventListener(searchBox, 'input', (e) => {
                this.updateFilter('search', e.target.value);
            });
        }

        // Filter dropdowns
        const filterIds = ['teamFilter', 'difficultyFilter', 'phaseFilter', 'durationFilter'];
        filterIds.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                this.addEventListener(filter, 'change', (e) => {
                    const filterType = filterId.replace('Filter', '');
                    const actualType = filterType === 'team' ? 'assignee' : filterType;
                    this.updateFilter(actualType, e.target.value);
                });
            }
        });

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            this.addEventListener(clearFiltersBtn, 'click', () => {
                this.clearFilters();
            });
        }
    }

    /**
     * Initialize tasks on component mount
     */
    onMount() {
        // Apply initial filters to show all tasks
        this.applyFilters();
    }

    /**
     * Get task statistics
     * @returns {Object} Task statistics
     */
    getTaskStats() {
        const allTasks = this.getAllTasks();
        const filteredTasks = this.state.getState('filteredTasks');
        
        return {
            totalTasks: allTasks.length,
            filteredTasks: filteredTasks.length,
            totalHours: allTasks.reduce((sum, task) => sum + parseFloat(task.duration), 0),
            averageDifficulty: allTasks.reduce((sum, task) => sum + task.difficulty, 0) / allTasks.length,
            teamStats: this.getTeamStats()
        };
    }
}

export default TaskManager;