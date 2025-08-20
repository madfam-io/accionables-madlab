/**
 * @fileoverview Tooltip Manager for MADLAB application
 * @module js/components/TooltipManager
 * @author MADLAB Team
 * @since 1.0.0
 * @description Manages tooltip creation, positioning, and interaction for enhanced UX
 */

import { Component } from './Component.js';

export class TooltipManager extends Component {
    constructor() {
        super('TooltipManager');
        this.activeTooltip = null;
        this.touchTimeout = null;
        this.isTouchDevice = 'ontouchstart' in window;
    }

    /**
     * Initialize tooltip system
     */
    onMount() {
        this.setupGlobalListeners();
        console.log('💬 TooltipManager initialized');
    }

    /**
     * Setup global event listeners for tooltip management
     */
    setupGlobalListeners() {
        // Handle touch devices
        if (this.isTouchDevice) {
            document.addEventListener('touchstart', (e) => this.handleTouch(e));
            document.addEventListener('touchend', () => this.handleTouchEnd());
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideTooltip();
            }
        });
    }

    /**
     * Create tooltip for an element
     * @param {HTMLElement} element - Target element
     * @param {Object} options - Tooltip configuration
     */
    createTooltip(element, options = {}) {
        const {
            content = '',
            title = '',
            position = 'top',
            rich = false,
            delay = 300
        } = options;

        if (!content) return;

        // Wrap element in tooltip container if not already wrapped
        if (!element.closest('.tooltip-container')) {
            this.wrapElementWithContainer(element);
        }

        const container = element.closest('.tooltip-container');
        const tooltip = this.createTooltipElement(content, title, position, rich);

        container.appendChild(tooltip);

        // Setup hover listeners for non-touch devices
        if (!this.isTouchDevice) {
            this.setupHoverListeners(container, tooltip, delay);
        }

        return tooltip;
    }

    /**
     * Wrap element with tooltip container
     * @param {HTMLElement} element - Element to wrap
     */
    wrapElementWithContainer(element) {
        const container = document.createElement('div');
        container.className = 'tooltip-container';
        
        element.parentNode.insertBefore(container, element);
        container.appendChild(element);
    }

    /**
     * Create tooltip element
     * @param {string} content - Tooltip content
     * @param {string} title - Optional title
     * @param {string} position - Tooltip position
     * @param {boolean} rich - Whether to create rich tooltip
     * @returns {HTMLElement} Tooltip element
     */
    createTooltipElement(content, title, position, rich) {
        const tooltip = document.createElement('div');
        const classes = ['tooltip', `tooltip-${position}`];
        
        if (rich) classes.push('tooltip-rich');
        if (content.length > 50) classes.push('tooltip-multiline');
        
        tooltip.className = classes.join(' ');

        if (rich && title) {
            tooltip.innerHTML = `
                <div class="tooltip-title">${title}</div>
                <div class="tooltip-description">${content}</div>
            `;
        } else {
            tooltip.textContent = content;
        }

        return tooltip;
    }

    /**
     * Setup hover listeners for tooltip
     * @param {HTMLElement} container - Tooltip container
     * @param {HTMLElement} tooltip - Tooltip element
     * @param {number} delay - Hover delay
     */
    setupHoverListeners(container, tooltip, delay) {
        let showTimeout;
        let hideTimeout;

        container.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => {
                this.showTooltip(tooltip);
            }, delay);
        });

        container.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                this.hideTooltip(tooltip);
            }, 100);
        });
    }

    /**
     * Show tooltip with positioning adjustments
     * @param {HTMLElement} tooltip - Tooltip to show
     */
    showTooltip(tooltip) {
        if (this.activeTooltip && this.activeTooltip !== tooltip) {
            this.hideTooltip(this.activeTooltip);
        }

        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        this.activeTooltip = tooltip;

        // Adjust position if tooltip goes off-screen
        this.adjustTooltipPosition(tooltip);
    }

    /**
     * Hide tooltip
     * @param {HTMLElement} tooltip - Tooltip to hide (optional)
     */
    hideTooltip(tooltip = this.activeTooltip) {
        if (!tooltip) return;

        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        
        if (tooltip === this.activeTooltip) {
            this.activeTooltip = null;
        }
    }

    /**
     * Adjust tooltip position to stay within viewport
     * @param {HTMLElement} tooltip - Tooltip element
     */
    adjustTooltipPosition(tooltip) {
        const rect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Horizontal adjustments
        if (rect.right > viewport.width - 10) {
            tooltip.style.transform = `translateX(${viewport.width - rect.right - 10}px)`;
        } else if (rect.left < 10) {
            tooltip.style.transform = `translateX(${10 - rect.left}px)`;
        }

        // Vertical adjustments for top/bottom positioned tooltips
        if (tooltip.classList.contains('tooltip-top') && rect.top < 10) {
            tooltip.className = tooltip.className.replace('tooltip-top', 'tooltip-bottom');
        } else if (tooltip.classList.contains('tooltip-bottom') && rect.bottom > viewport.height - 10) {
            tooltip.className = tooltip.className.replace('tooltip-bottom', 'tooltip-top');
        }
    }

    /**
     * Handle touch events for mobile tooltip interaction
     * @param {TouchEvent} e - Touch event
     */
    handleTouch(e) {
        const tooltipContainer = e.target.closest('.tooltip-container');
        
        if (tooltipContainer) {
            e.preventDefault();
            const tooltip = tooltipContainer.querySelector('.tooltip');
            
            if (tooltip) {
                // Toggle tooltip on touch
                if (this.activeTooltip === tooltip) {
                    this.hideTooltip(tooltip);
                } else {
                    this.showTooltip(tooltip);
                    
                    // Auto-hide after delay
                    this.touchTimeout = setTimeout(() => {
                        this.hideTooltip(tooltip);
                    }, 3000);
                }
            }
        } else if (this.activeTooltip) {
            // Hide tooltip when touching outside
            this.hideTooltip();
        }
    }

    /**
     * Handle touch end events
     */
    handleTouchEnd() {
        if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
            this.touchTimeout = null;
        }
    }

    /**
     * Create quick tooltip for task card elements
     * @param {HTMLElement} element - Element to add tooltip to
     * @param {string} type - Type of element (assignee, difficulty, duration, etc.)
     * @param {Object} data - Data for tooltip content
     */
    addTaskTooltip(element, type, data) {
        const tooltipContent = this.generateTaskTooltipContent(type, data);
        
        if (tooltipContent) {
            this.createTooltip(element, {
                content: tooltipContent.content,
                title: tooltipContent.title,
                position: tooltipContent.position || 'top',
                rich: tooltipContent.rich || false
            });
        }
    }

    /**
     * Generate tooltip content for different task elements
     * @param {string} type - Element type
     * @param {Object} data - Data for content generation
     * @returns {Object} Tooltip content configuration
     */
    generateTaskTooltipContent(type, data) {
        switch (type) {
            case 'assignee':
                return {
                    title: 'Assigned Team Member',
                    content: `${data.name} - ${this.getAssigneeRole(data.name)}`,
                    rich: true
                };

            case 'difficulty':
                return {
                    title: 'Task Difficulty',
                    content: `Level ${data.level}/5 - ${this.getDifficultyDescription(data.level)}`,
                    rich: true
                };

            case 'duration':
                return {
                    title: 'Estimated Duration',
                    content: `${data.hours} hours - ${this.getDurationCategory(data.hours)}`,
                    rich: true
                };

            case 'week':
                return {
                    title: `Week ${data.week}`,
                    content: `${data.dateRange} - Status: ${data.status}`,
                    rich: true,
                    position: 'left'
                };

            case 'dependencies':
                return {
                    title: 'Task Dependencies',
                    content: data.count > 0 
                        ? `Depends on ${data.count} task${data.count > 1 ? 's' : ''} - Click to view details`
                        : 'No dependencies - Ready to start',
                    rich: true
                };

            default:
                return null;
        }
    }

    /**
     * Get assignee role description
     * @param {string} name - Assignee name
     * @returns {string} Role description
     */
    getAssigneeRole(name) {
        const roles = {
            'Aldo': 'CEO MADFAM & Tech Lead',
            'Nuri': 'Strategy Officer MADFAM',
            'Luis': 'La Ciencia del Juego Representative',
            'Silvia': 'Marketing Guru',
            'Caro': 'Designer & Teacher',
            'All': 'Full Team Collaboration'
        };
        return roles[name] || 'Team Member';
    }

    /**
     * Get difficulty level description
     * @param {number} level - Difficulty level (1-5)
     * @returns {string} Difficulty description
     */
    getDifficultyDescription(level) {
        const descriptions = {
            1: 'Simple task, minimal complexity',
            2: 'Easy task with some coordination needed',
            3: 'Moderate complexity, requires planning',
            4: 'Complex task, significant coordination',
            5: 'Highly complex, critical coordination'
        };
        return descriptions[level] || 'Unknown difficulty';
    }

    /**
     * Get duration category description
     * @param {number} hours - Duration in hours
     * @returns {string} Duration category
     */
    getDurationCategory(hours) {
        if (hours <= 2) return 'Quick task';
        if (hours <= 5) return 'Medium task';
        if (hours <= 8) return 'Long task';
        return 'Extended task';
    }

    /**
     * Remove all tooltips from the page
     */
    cleanup() {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.remove();
        });
        this.activeTooltip = null;
    }
}