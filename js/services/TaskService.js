/**
 * @fileoverview Task data service for MADLAB application
 * @module js/services/TaskService
 * @author MADLAB Team
 * @since 1.0.0
 * @description Service layer for task data operations including filtering, grouping,
 *              statistics calculation, and data transformations.
 */

import { tasksData } from '../data/tasks.js';

/**
 * Service class for task data operations and business logic
 * Handles data retrieval, filtering, statistics, and transformations
 */
export class TaskService {
    constructor() {
        this.tasksData = tasksData;
    }

    /**
     * Get all tasks as a flat array with phase and section metadata
     * @returns {Array<Object>} Array of tasks with phase/section info
     * @example
     * const tasks = taskService.getAllTasks();
     * console.log(tasks[0].phase, tasks[0].phaseTitle);
     */
    getAllTasks() {
        const tasks = [];
        
        if (!this.tasksData) return tasks;

        Object.entries(this.tasksData).forEach(([phaseNum, phase]) => {
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
     * Get tasks assigned to a specific team member
     * @param {string} assignee - Team member name
     * @returns {Array<Object>} Tasks assigned to the member
     * @example
     * const aldoTasks = taskService.getTasksByAssignee('Aldo');
     */
    getTasksByAssignee(assignee) {
        return this.getAllTasks().filter(task => task.assignedTo === assignee);
    }

    /**
     * Calculate team statistics including task counts and hours
     * @returns {Array<Object>} Team member statistics
     * @example
     * const stats = taskService.getTeamStats();
     * console.log(stats.find(s => s.name === 'Aldo').totalHours);
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
     * Group tasks by phase for organized display
     * @param {Array<Object>} tasks - Array of tasks to group
     * @returns {Object} Tasks grouped by phase number
     * @example
     * const grouped = taskService.groupTasksByPhase(filteredTasks);
     */
    groupTasksByPhase(tasks) {
        const grouped = {};
        
        tasks.forEach(task => {
            if (!grouped[task.phase]) {
                grouped[task.phase] = [];
            }
            grouped[task.phase].push(task);
        });
        
        return grouped;
    }

    /**
     * Get project overview statistics
     * @returns {Object} Project statistics summary
     * @example
     * const overview = taskService.getProjectOverview();
     * console.log(overview.totalTasks, overview.totalHours);
     */
    getProjectOverview() {
        const allTasks = this.getAllTasks();
        const totalHours = allTasks.reduce((sum, task) => sum + parseFloat(task.duration), 0);
        const teamMembers = new Set(allTasks.map(task => task.assignedTo));
        
        return {
            totalTasks: allTasks.length,
            totalHours: totalHours.toFixed(1),
            teamMembersCount: teamMembers.size,
            averageDifficulty: allTasks.length > 0 
                ? (allTasks.reduce((sum, task) => sum + task.difficulty, 0) / allTasks.length).toFixed(1)
                : '0',
            phases: Object.keys(this.tasksData).length
        };
    }

    /**
     * Get tasks by difficulty level
     * @param {number} difficulty - Difficulty level (1-5)
     * @returns {Array<Object>} Tasks with specified difficulty
     */
    getTasksByDifficulty(difficulty) {
        return this.getAllTasks().filter(task => task.difficulty === difficulty);
    }

    /**
     * Get tasks by duration range
     * @param {string} range - Duration range ('short', 'medium', 'long')
     * @returns {Array<Object>} Tasks within the duration range
     */
    getTasksByDuration(range) {
        const allTasks = this.getAllTasks();
        
        switch (range) {
            case 'short':
                return allTasks.filter(task => parseFloat(task.duration) <= 2);
            case 'medium':
                return allTasks.filter(task => {
                    const duration = parseFloat(task.duration);
                    return duration > 2 && duration <= 5;
                });
            case 'long':
                return allTasks.filter(task => parseFloat(task.duration) > 5);
            default:
                return allTasks;
        }
    }

    /**
     * Search tasks by name or description
     * @param {string} query - Search query
     * @param {string} lang - Language for search ('es' or 'en')
     * @returns {Array<Object>} Matching tasks
     */
    searchTasks(query, lang = 'es') {
        if (!query || query.trim() === '') {
            return this.getAllTasks();
        }

        const searchTerm = query.toLowerCase().trim();
        
        return this.getAllTasks().filter(task => {
            const taskName = (task.name[lang] || task.name.es || '').toLowerCase();
            const taskId = (task.id || '').toLowerCase();
            
            return taskName.includes(searchTerm) || taskId.includes(searchTerm);
        });
    }

    /**
     * Get tasks data for a specific phase
     * @param {string|number} phaseNum - Phase number
     * @returns {Object|null} Phase data or null if not found
     */
    getPhaseData(phaseNum) {
        return this.tasksData[phaseNum.toString()] || null;
    }

    /**
     * Validate task data structure
     * @param {Object} task - Task object to validate
     * @returns {boolean} True if task is valid
     */
    validateTask(task) {
        const requiredFields = ['id', 'name', 'assignedTo', 'duration', 'difficulty'];
        
        return requiredFields.every(field => {
            if (field === 'name') {
                return task[field] && (typeof task[field] === 'object' || typeof task[field] === 'string');
            }
            return task[field] !== undefined && task[field] !== null;
        });
    }
}