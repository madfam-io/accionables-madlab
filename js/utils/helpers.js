// ==========================================================================
// Utility Helper Functions
// ==========================================================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Trigger on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is visible
 */
export function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Element or selector to scroll to
 * @param {Object} options - Scroll options
 */
export function scrollToElement(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format duration for display
 * @param {number|string} hours - Duration in hours
 * @returns {string} Formatted duration
 */
export function formatDuration(hours) {
    const h = parseFloat(hours);
    if (h < 1) {
        return `${Math.round(h * 60)}min`;
    } else if (h === Math.floor(h)) {
        return `${h}h`;
    } else {
        return `${h}h`;
    }
}

/**
 * Get assignee color
 * @param {string} assignee - Assignee name
 * @returns {string} Color hex code
 */
export function getAssigneeColor(assignee) {
    const colors = {
        'Aldo': '#6366f1',
        'Nuri': '#10b981',
        'Luis': '#f59e0b',
        'Silvia': '#ef4444',
        'Caro': '#8b5cf6',
        'All': '#6b7280'
    };
    return colors[assignee] || '#6b7280';
}

/**
 * Get assignee initials with special handling for edge cases
 * @param {string} assignee - Assignee name
 * @returns {string} Assignee initials
 */
export function getAssigneeInitials(assignee) {
    if (!assignee) return '??';
    
    // Handle special cases where standard initials would be ambiguous
    const specialCases = {
        'All': '👥', // Use group icon for "All" tasks
        'Team': '👥'
    };
    
    if (specialCases[assignee]) {
        return specialCases[assignee];
    }
    
    // For regular names, take first letter of first two words or first two letters if single word
    const words = assignee.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
        // Single word - take first two characters, but handle special cases
        const name = words[0];
        if (name === 'Aldo') {
            return 'AD'; // Use 'AD' for Aldo to distinguish from 'AL' for All
        } else if (name.length >= 2) {
            return name.substring(0, 2).toUpperCase();
        } else {
            return name.charAt(0).toUpperCase() + '?';
        }
    }
}

/**
 * Calculate difficulty color
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {string} Color hex code
 */
export function getDifficultyColor(difficulty) {
    const colors = ['#10b981', '#22c55e', '#eab308', '#f97316', '#ef4444'];
    return colors[difficulty - 1] || '#6b7280';
}

/**
 * Format number with locale-specific formatting
 * @param {number} num - Number to format
 * @param {string} locale - Locale code
 * @returns {string} Formatted number
 */
export function formatNumber(num, locale = 'es-ES') {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Download file with specified content
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Check if device is mobile
 * @returns {boolean} Is mobile device
 */
export function isMobile() {
    return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 * @returns {boolean} Supports touch
 */
export function supportsTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get browser information
 * @returns {Object} Browser info
 */
export function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
        version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
        version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
        version = userAgent.match(/Safari\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edge')) {
        browser = 'Edge';
        version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    return { browser, version, userAgent };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|HTMLElement|Array} content - Element content
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key === 'style' && typeof value === 'object') {
            Object.entries(value).forEach(([styleKey, styleValue]) => {
                element.style[styleKey] = styleValue;
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
 * Parse URL parameters
 * @param {string} [url] - URL to parse (defaults to current location)
 * @returns {Object} URL parameters
 */
export function parseURLParams(url = window.location.href) {
    const params = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

/**
 * Update URL without page reload
 * @param {Object} params - Parameters to set
 * @param {boolean} replace - Use replaceState instead of pushState
 */
export function updateURL(params, replace = false) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });

    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', url);
}

// ==========================================================================
// Date and Week Calculation Utilities
// ==========================================================================

/**
 * Get the current week number of the year (ISO week)
 * @param {Date} [date] - Date to calculate week for (defaults to current date)
 * @returns {number} Week number (1-53)
 */
export function getCurrentWeek(date = new Date()) {
    // Copy date so we don't modify original
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
}

/**
 * Get the current date in ISO format (YYYY-MM-DD)
 * @param {Date} [date] - Date to format (defaults to current date)
 * @returns {string} Date in ISO format
 */
export function getCurrentDate(date = new Date()) {
    return date.toISOString().split('T')[0];
}

/**
 * Parse week estimate string and return week number
 * @param {string} weekEstimate - Week estimate string (e.g., "Week 34")
 * @returns {number} Week number or null if invalid
 */
export function parseWeekEstimate(weekEstimate) {
    if (!weekEstimate || typeof weekEstimate !== 'string') return null;
    const match = weekEstimate.match(/Week\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * Get the current project week (MADLAB project specific)
 * Project started Aug 11, 2025 = Week 33
 * @param {Date} [date] - Date to calculate week for (defaults to current date)
 * @returns {number} Project week number (33-44)
 */
export function getCurrentProjectWeek(date = new Date()) {
    // Project start date: August 11, 2025 (Week 33)
    const projectStart = new Date('2025-08-11');
    const projectStartWeek = 33;
    
    // Calculate weeks since project start
    const diffTime = date.getTime() - projectStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksSinceStart = Math.floor(diffDays / 7);
    
    return projectStartWeek + weeksSinceStart;
}

/**
 * Get task status based on current week vs task week estimate
 * @param {string} taskWeekEstimate - Task week estimate (e.g., "Week 34")
 * @param {number} [currentWeek] - Current week number (defaults to current project week)
 * @returns {string} Status: 'past', 'current', or 'future'
 */
export function getTaskStatus(taskWeekEstimate, currentWeek = getCurrentProjectWeek()) {
    const taskWeek = parseWeekEstimate(taskWeekEstimate);
    if (!taskWeek) return 'future'; // Default to future if can't parse
    
    if (taskWeek < currentWeek) {
        return 'past';
    } else if (taskWeek === currentWeek) {
        return 'current';
    } else {
        return 'future';
    }
}

/**
 * Get week range dates for a given week number
 * @param {number} weekNumber - Week number (1-53)
 * @param {number} [year] - Year (defaults to current year)
 * @returns {Object} Object with start and end dates
 */
export function getWeekRange(weekNumber, year = new Date().getFullYear()) {
    // January 1st of the given year
    const jan1 = new Date(year, 0, 1);
    // Find the first Monday of the year (ISO week starts on Monday)
    const daysToMonday = (8 - jan1.getDay()) % 7;
    const firstMonday = new Date(year, 0, 1 + daysToMonday);
    
    // Calculate the Monday of the specified week
    const mondayOfWeek = new Date(firstMonday);
    mondayOfWeek.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    
    // Calculate the Friday of the same week
    const fridayOfWeek = new Date(mondayOfWeek);
    fridayOfWeek.setDate(mondayOfWeek.getDate() + 4);
    
    return {
        start: mondayOfWeek,
        end: fridayOfWeek,
        startFormatted: mondayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endFormatted: fridayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
}

/**
 * Format week display with date range
 * @param {string} weekEstimate - Week estimate string (e.g., "Week 34")
 * @param {number} [year] - Year (defaults to current year)
 * @returns {string} Formatted week with date range
 */
export function formatWeekWithDates(weekEstimate, year = new Date().getFullYear()) {
    const weekNumber = parseWeekEstimate(weekEstimate);
    if (!weekNumber) return weekEstimate;
    
    const range = getWeekRange(weekNumber, year);
    return `${weekEstimate} (${range.startFormatted} - ${range.endFormatted})`;
}

/**
 * Check if a task should be highlighted as current
 * @param {Object} task - Task object with weekEstimate property
 * @returns {boolean} True if task should be highlighted
 */
export function isCurrentTask(task) {
    return getTaskStatus(task.weekEstimate) === 'current';
}

/**
 * Check if a task is in the past (completed)
 * @param {Object} task - Task object with weekEstimate property
 * @returns {boolean} True if task is in the past
 */
export function isPastTask(task) {
    return getTaskStatus(task.weekEstimate) === 'past';
}

/**
 * Check if a task is in the future
 * @param {Object} task - Task object with weekEstimate property
 * @returns {boolean} True if task is in the future
 */
export function isFutureTask(task) {
    return getTaskStatus(task.weekEstimate) === 'future';
}

export default {
    debounce,
    throttle,
    isElementInViewport,
    scrollToElement,
    generateId,
    formatDuration,
    getAssigneeColor,
    getAssigneeInitials,
    getDifficultyColor,
    formatNumber,
    copyToClipboard,
    downloadFile,
    isMobile,
    supportsTouch,
    getBrowserInfo,
    isValidEmail,
    createElement,
    parseURLParams,
    updateURL,
    getCurrentWeek,
    getCurrentProjectWeek,
    getCurrentDate,
    parseWeekEstimate,
    getTaskStatus,
    getWeekRange,
    formatWeekWithDates,
    isCurrentTask,
    isPastTask,
    isFutureTask
};