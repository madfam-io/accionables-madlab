// ==========================================================================
// Task Renderer - Handles task element creation and rendering
// ==========================================================================

import { getAssigneeColor, getAssigneeInitials, getTaskStatus, formatWeekWithDates } from '../utils/helpers.js';
import { translations } from '../data/translations.js';

export class TaskRenderer {
    constructor(component) {
        this.component = component;
        this.tooltipManager = null; // Will be set by component manager
    }

    /**
     * Set tooltip manager reference
     * @param {TooltipManager} tooltipManager - Tooltip manager instance
     */
    setTooltipManager(tooltipManager) {
        this.tooltipManager = tooltipManager;
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
        
        // Task dependencies (always rendered for consistency)
        const taskDependencies = this.createTaskDependencies(task, lang);

        // Assemble the unified card structure
        taskContent.appendChild(taskHeader);
        taskContent.appendChild(taskMeta);
        taskContent.appendChild(taskDependencies);
        
        taskCard.appendChild(taskContent);

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
        
        const badge = this.component.createElement('div', {
            className: 'assignee-badge',
            style: `background-color: ${color}`
        }, initials);

        // Add tooltip
        if (this.tooltipManager) {
            this.tooltipManager.addTaskTooltip(badge, 'assignee', { name: assignee });
        }
        
        return badge;
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

        // Add tooltip
        if (this.tooltipManager) {
            this.tooltipManager.addTaskTooltip(durationBar, 'duration', { hours: duration });
        }
        
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

        // Add tooltip
        if (this.tooltipManager) {
            this.tooltipManager.addTaskTooltip(container, 'difficulty', { level: difficulty });
        }

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
        
        const t = translations[lang] || translations.es;
        
        switch (taskStatus) {
            case 'current':
                badgeIcon = '🔥';
                statusText = t.inProgress;
                break;
            case 'past':
                badgeIcon = '✅';
                statusText = t.completed;
                break;
            case 'future':
                badgeIcon = '📅';
                statusText = t.upcoming;
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
     * Create task dependencies section (always rendered for consistency)
     * @param {Object} task - Task data
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task dependencies element (always)
     */
    createTaskDependencies(task, lang) {
        const t = translations[lang] || translations.es;
        const depText = typeof task.dependencies === 'object' 
            ? task.dependencies[lang] || task.dependencies.es
            : task.dependencies;
        
        const hasDependencies = depText && depText !== 'None' && depText !== 'Ninguna';
        
        const dependenciesContainer = this.component.createElement('div', {
            className: 'task-dependencies'
        });

        if (!hasDependencies) {
            // No dependencies - show consistent empty state
            const noDepsText = this.component.createElement('span', {
                className: 'no-dependencies'
            }, t.noDependencies);
            
            const noDepsIcon = this.component.createElement('span', {
                className: 'no-deps-icon'
            }, '✅');
            
            dependenciesContainer.appendChild(noDepsIcon);
            dependenciesContainer.appendChild(noDepsText);
        } else {
            // Has dependencies - show clickable indicator
            const dependencyIndicator = this.component.createElement('div', {
                className: 'dependency-indicator clickable',
                title: `${this.parseDependencyCount(depText)} blocking tasks`
            });
            
            const icon = this.component.createElement('span', {
                className: 'dependency-icon'
            }, '🔗');
            
            const count = this.parseDependencyCount(depText);
            const depsText = this.component.createElement('span', {
                className: 'dependency-text'
            }, count > 1 ? `${count} ${t.dependencyCountPlural}` : `1 ${t.dependencyCount}`);
            
            dependencyIndicator.appendChild(icon);
            dependencyIndicator.appendChild(depsText);

            // Click to show overlay
            this.component.addEventListener(dependencyIndicator, 'click', (e) => {
                e.stopPropagation();
                this.showDependenciesOverlay(task, depText, lang, e.currentTarget);
            });
            
            dependenciesContainer.appendChild(dependencyIndicator);
        }

        return dependenciesContainer;
    }

    /**
     * Parse and count dependencies
     * @param {string} depText - Dependencies text
     * @returns {number} Number of dependencies
     */
    parseDependencyCount(depText) {
        if (!depText) return 0;
        // Count task IDs in format like "1.1.1, 1.1.2" or single "1.1.1"
        const matches = depText.match(/\d+\.\d+\.\d+/g);
        return matches ? matches.length : 1;
    }

    /**
     * Show dependencies overlay relative to the task card
     * @param {Object} task - Current task
     * @param {string} depText - Dependencies text  
     * @param {string} lang - Current language
     * @param {HTMLElement} triggerElement - Element that triggered the overlay
     */
    showDependenciesOverlay(task, depText, lang, triggerElement) {
        // Remove any existing overlay
        const existingOverlay = document.querySelector('.dependencies-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Find the task card container
        const taskCard = triggerElement.closest('.task-card');
        if (!taskCard) return;

        // Create overlay
        const overlay = this.component.createElement('div', {
            className: 'dependencies-overlay'
        });

        // Create overlay content
        const overlayContent = this.component.createElement('div', {
            className: 'dependencies-overlay-content'
        });

        // Header
        const header = this.component.createElement('div', {
            className: 'overlay-header'
        });
        
        const t = translations[lang] || translations.es;
        const title = this.component.createElement('h3', {}, 
            `${t.blockingTasksTitle} - ${task.id}`);
        const closeBtn = this.component.createElement('button', {
            className: 'overlay-close'
        }, '✕');

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Dependencies list
        const dependenciesList = this.component.createElement('div', {
            className: 'dependencies-list'
        });

        const blockingTasks = this.parseBlockingTasks(depText);
        blockingTasks.forEach(taskId => {
            const taskItem = this.createBlockingTaskItem(taskId, lang);
            dependenciesList.appendChild(taskItem);
        });

        overlayContent.appendChild(header);
        overlayContent.appendChild(dependenciesList);
        overlay.appendChild(overlayContent);

        // Add overlay to the task card (not body)
        taskCard.style.position = 'relative';
        taskCard.appendChild(overlay);

        // Smart positioning based on available space
        this.positionOverlaySmartly(overlay, taskCard);

        // Event listeners
        this.component.addEventListener(closeBtn, 'click', () => overlay.remove());
        this.component.addEventListener(overlay, 'click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    /**
     * Parse blocking task IDs from dependencies text
     * @param {string} depText - Dependencies text
     * @returns {Array} Array of task IDs
     */
    parseBlockingTasks(depText) {
        if (!depText) return [];
        
        // Extract task IDs in format like "1.1.1", "1.2.3", etc.
        const matches = depText.match(/\d+\.\d+\.\d+/g);
        return matches || [];
    }

    /**
     * Create blocking task item for overlay
     * @param {string} taskId - Task ID 
     * @param {string} lang - Current language
     * @returns {HTMLElement} Task item element
     */
    createBlockingTaskItem(taskId, lang) {
        const t = translations[lang] || translations.es;
        const taskItem = this.component.createElement('div', {
            className: 'blocking-task-item'
        });

        const taskIcon = this.component.createElement('span', {
            className: 'task-icon'
        }, '📋');

        const taskInfo = this.component.createElement('div', {
            className: 'task-info'
        });

        const taskIdElement = this.component.createElement('div', {
            className: 'task-id-display'
        }, taskId);

        const taskStatus = this.component.createElement('div', {
            className: 'task-status-display'
        }, t.blocking);

        const navigateBtn = this.component.createElement('button', {
            className: 'navigate-task-btn'
        }, t.goToTask);

        taskInfo.appendChild(taskIdElement);
        taskInfo.appendChild(taskStatus);

        taskItem.appendChild(taskIcon);
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(navigateBtn);

        // Navigate to task functionality
        this.component.addEventListener(navigateBtn, 'click', (e) => {
            e.stopPropagation();
            this.navigateToTask(taskId);
            document.querySelector('.dependencies-overlay')?.remove();
        });

        return taskItem;
    }

    /**
     * Navigate to a specific task
     * @param {string} taskId - Task ID to navigate to
     */
    navigateToTask(taskId) {
        const targetElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight the target task
            targetElement.classList.add('task-highlighted');
            setTimeout(() => {
                targetElement.classList.remove('task-highlighted');
            }, 3000);
        }
    }

    /**
     * Smart positioning for card-relative overlay
     * @param {HTMLElement} overlay - Overlay element
     * @param {HTMLElement} taskCard - Task card container
     */
    positionOverlaySmartly(overlay, taskCard) {
        const cardRect = taskCard.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate available space around the card
        const spaceBelow = viewportHeight - (cardRect.bottom + 20);
        const spaceAbove = cardRect.top - 20;
        const spaceRight = viewportWidth - (cardRect.right + 20);
        const spaceLeft = cardRect.left - 20;
        
        // Default position: below the card
        let position = 'below';
        
        // If not enough space below, try above
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
            position = 'above';
            overlay.classList.add('position-above');
        }
        // If not enough space above or below, try side positioning
        else if (spaceBelow < 200 && spaceAbove < 200) {
            if (spaceRight > 300) {
                position = 'right';
                overlay.classList.add('position-right');
            } else if (spaceLeft > 300) {
                position = 'left';
                overlay.classList.add('position-left');
            }
        }
        
        // For mobile, always use below position with full width
        if (window.innerWidth <= 768) {
            overlay.classList.remove('position-above', 'position-right', 'position-left');
        }
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