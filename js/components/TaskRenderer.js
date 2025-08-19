// ==========================================================================
// Task Renderer - Handles task element creation and rendering
// ==========================================================================

import { getAssigneeColor, getAssigneeInitials, getTaskStatus, formatWeekWithDates } from '../utils/helpers.js';

export class TaskRenderer {
    constructor(component) {
        this.component = component;
    }

    /**
     * Create task card element
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task element
     */
    createTaskElement(task, lang) {
        // Get task status based on current week
        const taskStatus = getTaskStatus(task.weekEstimate);
        
        const taskCard = this.component.createElement('div', {
            className: `task-card task-${taskStatus}`,
            dataset: { 
                taskId: task.id,
                taskStatus: taskStatus,
                weekEstimate: task.weekEstimate || ''
            }
        });

        // Create main content container for consistent layout
        const taskContent = this.component.createElement('div', {
            className: 'task-content'
        });

        // Task header (ID, name, assignee badge)
        const taskHeader = this.createTaskHeader(task, lang);
        
        // Task metadata (duration, week status, difficulty) 
        const taskMeta = this.createTaskMeta(task, lang);
        
        // Task details (dependencies) - consistent positioning
        const taskDetails = this.createTaskDetails(task, lang);

        // Assemble the card structure
        taskContent.appendChild(taskHeader);
        taskContent.appendChild(taskMeta);
        
        taskCard.appendChild(taskContent);
        
        // Add details at bottom for consistent positioning
        if (taskDetails) {
            taskCard.appendChild(taskDetails);
        }

        // Add click handler for task interaction
        this.component.addEventListener(taskCard, 'click', () => {
            this.component.handleTaskClick(task);
        });

        // Set phase color stripe
        this.setPhaseColorStripe(taskCard, task.phase);

        return taskCard;
    }

    /**
     * Create task header section
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task header element
     */
    createTaskHeader(task, lang) {
        const taskHeader = this.component.createElement('div', { className: 'task-header' });
        
        // Main info
        const mainInfo = this.component.createElement('div', { className: 'task-main-info' });
        const taskId = this.component.createElement('div', { className: 'task-id' }, task.id);
        const taskName = this.component.createElement('div', {
            className: 'task-name'
        }, task.name[lang] || task.name.es);
        
        mainInfo.appendChild(taskId);
        mainInfo.appendChild(taskName);

        // Visual indicators
        const indicators = this.component.createElement('div', { className: 'task-visual-indicators' });
        const assigneeBadge = this.createAssigneeBadge(task.assignedTo);
        const durationBar = this.createDurationBar(parseFloat(task.duration));
        
        indicators.appendChild(assigneeBadge);
        indicators.appendChild(durationBar);

        taskHeader.appendChild(mainInfo);
        taskHeader.appendChild(indicators);

        return taskHeader;
    }

    /**
     * Create assignee badge
     * @param {string} assignee - Assignee name
     * @returns {HTMLElement} Assignee badge
     */
    createAssigneeBadge(assignee) {
        const color = getAssigneeColor(assignee);
        const initials = getAssigneeInitials(assignee);
        
        return this.component.createElement('div', {
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
        
        const durationBar = this.component.createElement('div', { className: 'duration-bar' });
        const durationFill = this.component.createElement('div', {
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
        const meta = this.component.createElement('div', { className: 'task-meta' });
        
        // Left section - Core task info
        const metaLeft = this.component.createElement('div', { className: 'task-meta-left' });
        
        // Assignee info
        const assigneeInfo = this.component.createElement('span', {
            className: 'assignee-info'
        }, `👤 ${task.assignedTo}`);
        
        // Duration
        const duration = this.component.createElement('span', {
            className: 'task-duration'
        }, `⏱️ ${task.duration}h`);
        
        // Difficulty with dots
        const difficultyContainer = this.createDifficultyDisplay(task.difficulty);
        
        metaLeft.appendChild(assigneeInfo);
        metaLeft.appendChild(duration);
        metaLeft.appendChild(difficultyContainer);
        
        // Right section - Week status (prominently positioned)
        const metaRight = this.component.createElement('div', { className: 'task-meta-right' });
        
        // Week status badge
        const weekBadge = this.createWeekStatusBadge(task, lang);
        if (weekBadge) {
            metaRight.appendChild(weekBadge);
        }
        
        meta.appendChild(metaLeft);
        meta.appendChild(metaRight);
        
        return meta;
    }

    /**
     * Create difficulty display with dots
     * @param {number} difficulty - Difficulty level (1-5)
     * @returns {HTMLElement} Difficulty display element
     */
    createDifficultyDisplay(difficulty) {
        const container = this.component.createElement('div', {
            className: 'difficulty-container'
        });

        const label = this.component.createElement('span', {}, '⭐');
        const stars = this.component.createElement('div', {
            className: 'difficulty-stars'
        });

        // Create 5 difficulty dots
        for (let i = 1; i <= 5; i++) {
            const star = this.component.createElement('div', {
                className: `difficulty-star ${i <= difficulty ? 'filled' : ''}`
            });
            stars.appendChild(star);
        }

        container.appendChild(label);
        container.appendChild(stars);
        return container;
    }

    /**
     * Create enhanced week status badge
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement|null} Week status badge element
     */
    createWeekStatusBadge(task, lang) {
        if (!task.weekEstimate) return null;
        
        const taskStatus = getTaskStatus(task.weekEstimate);
        const formattedWeek = formatWeekWithDates(task.weekEstimate, 2025);
        
        let badgeIcon = '';
        let statusText = '';
        
        switch (taskStatus) {
            case 'current':
                badgeIcon = '🔥';
                statusText = lang === 'es' ? 'EN CURSO' : 'IN PROGRESS';
                break;
            case 'past':
                badgeIcon = '✅';
                statusText = lang === 'es' ? 'COMPLETADA' : 'COMPLETED';
                break;
            case 'future':
                badgeIcon = '📅';
                statusText = lang === 'es' ? 'PENDIENTE' : 'UPCOMING';
                break;
        }
        
        const badge = this.component.createElement('div', {
            className: `week-status-badge week-status-${taskStatus}`
        });
        
        const iconSpan = this.component.createElement('span', {
            className: 'week-badge-icon'
        }, badgeIcon);
        
        const weekSpan = this.component.createElement('span', {
            className: 'week-badge-week'
        }, formattedWeek);
        
        const statusSpan = this.component.createElement('span', {
            className: 'week-badge-status'
        }, statusText);
        
        badge.appendChild(iconSpan);
        badge.appendChild(weekSpan);
        badge.appendChild(statusSpan);
        
        return badge;
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

        const detailsContainer = this.component.createElement('div', {
            className: 'task-details collapsed'
        });

        const toggleBtn = this.component.createElement('button', {
            className: 'details-toggle'
        });
        
        // Add icon and text content
        const icon = this.component.createElement('span', {}, '▶️');
        const text = this.component.createElement('span', {}, 
            lang === 'es' ? 'Mostrar dependencias' : 'Show dependencies');
        
        toggleBtn.appendChild(icon);
        toggleBtn.appendChild(text);

        const content = this.component.createElement('div', {
            className: 'details-content'
        }, depText);

        detailsContainer.appendChild(toggleBtn);
        detailsContainer.appendChild(content);

        // Toggle functionality
        this.component.addEventListener(toggleBtn, 'click', (e) => {
            e.stopPropagation();
            detailsContainer.classList.toggle('collapsed');
            
            const isCollapsed = detailsContainer.classList.contains('collapsed');
            icon.textContent = isCollapsed ? '▶️' : '🔽';
            text.textContent = isCollapsed
                ? (lang === 'es' ? 'Mostrar dependencias' : 'Show dependencies')
                : (lang === 'es' ? 'Ocultar dependencias' : 'Hide dependencies');
        });

        return detailsContainer;
    }

    /**
     * Set phase color stripe for task card
     * @param {HTMLElement} taskCard - Task card element
     * @param {string} phase - Phase number
     */
    setPhaseColorStripe(taskCard, phase) {
        const phaseColors = {
            '1': '#3b82f6', // Blue
            '2': '#10b981', // Green
            '3': '#f59e0b', // Yellow
            '4': '#ef4444', // Red
            '5': '#8b5cf6'  // Purple
        };
        
        const color = phaseColors[phase] || '#6b7280';
        taskCard.style.setProperty('--phase-color', color);
    }
}