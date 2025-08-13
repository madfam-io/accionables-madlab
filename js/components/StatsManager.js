// ==========================================================================
// Stats Manager Component
// ==========================================================================

import { Component } from './Component.js';

export class StatsManager extends Component {
    constructor(element, state) {
        super(element, state);
        this.subscribeToState('tasks', () => this.updateStats());
        this.subscribeToState('currentLang', () => this.updateStats());
    }

    /**
     * Calculate project statistics from task data
     * @returns {Object} Project statistics
     */
    calculateStats() {
        const tasks = this.state.getState('tasks');
        if (!tasks) return this.getEmptyStats();

        const allTasks = this.getAllTasks();
        const teamMembers = this.getUniqueTeamMembers(allTasks);
        const projectDuration = this.calculateProjectDuration();
        const totalHours = this.calculateTotalHours(allTasks);

        return {
            totalTasks: allTasks.length,
            projectDays: projectDuration,
            totalHours: totalHours,
            teamMembers: teamMembers.length
        };
    }

    /**
     * Get empty stats structure
     * @returns {Object} Empty statistics
     */
    getEmptyStats() {
        return {
            totalTasks: 0,
            projectDays: 0,
            totalHours: 0,
            teamMembers: 0
        };
    }

    /**
     * Get all tasks as a flat array
     * @returns {Array} All tasks
     */
    getAllTasks() {
        const tasks = this.state.getState('tasks');
        const allTasks = [];

        if (!tasks) return allTasks;

        Object.entries(tasks).forEach(([phaseNum, phase]) => {
            phase.sections.forEach(section => {
                section.tasks.forEach(task => {
                    allTasks.push({
                        ...task,
                        phase: phaseNum,
                        phaseTitle: phase.title,
                        section: section.title
                    });
                });
            });
        });

        return allTasks;
    }

    /**
     * Get unique team members from tasks
     * @param {Array} tasks - All tasks
     * @returns {Array} Unique team member names
     */
    getUniqueTeamMembers(tasks) {
        const members = new Set();
        tasks.forEach(task => {
            if (task.assignedTo && task.assignedTo !== 'All') {
                members.add(task.assignedTo);
            }
        });
        return Array.from(members).sort(); // Sort for consistent display order
    }

    /**
     * Calculate total hours from all tasks
     * @param {Array} tasks - All tasks
     * @returns {number} Total hours
     */
    calculateTotalHours(tasks) {
        return tasks.reduce((total, task) => {
            const duration = parseFloat(task.duration) || 0;
            return total + duration;
        }, 0);
    }

    /**
     * Calculate project duration in days
     * @returns {number} Project duration in days
     */
    calculateProjectDuration() {
        // Calculate based on project dates: August 11, 2025 to October 31, 2025
        const startDate = new Date('2025-08-11');
        const endDate = new Date('2025-10-31');
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const stats = this.calculateStats();
        
        // Update total tasks
        const totalTasksEl = document.getElementById('totalTasksCount');
        if (totalTasksEl) {
            totalTasksEl.textContent = stats.totalTasks.toString();
        }

        // Update project days
        const projectDaysEl = document.getElementById('projectDaysCount');
        if (projectDaysEl) {
            projectDaysEl.textContent = stats.projectDays.toString();
        }

        // Update total hours (formatted to 1 decimal place)
        const totalHoursEl = document.getElementById('totalHoursCount');
        if (totalHoursEl) {
            totalHoursEl.textContent = stats.totalHours.toFixed(1);
        }

        // Update team members count
        const teamMembersEl = document.getElementById('teamMembersCount');
        if (teamMembersEl) {
            teamMembersEl.textContent = stats.teamMembers.toString();
        }

        // Update task counter in filters section
        this.updateTaskCounter(stats.totalTasks, stats.totalTasks);

        // Update team summary
        this.updateTeamSummary();
    }

    /**
     * Update task counter display
     * @param {number} showing - Number of tasks showing
     * @param {number} total - Total number of tasks
     */
    updateTaskCounter(showing, total) {
        const taskCounter = document.getElementById('taskCounter');
        if (taskCounter) {
            taskCounter.textContent = `${showing} / ${total}`;
        }
    }

    /**
     * Update filtered task counter
     * @param {number} filteredCount - Number of filtered tasks
     */
    updateFilteredTaskCounter(filteredCount) {
        const stats = this.calculateStats();
        this.updateTaskCounter(filteredCount, stats.totalTasks);
    }

    /**
     * Update team summary section
     */
    updateTeamSummary() {
        const teamSummaryContainer = document.getElementById('teamSummary');
        if (!teamSummaryContainer) return;

        const allTasks = this.getAllTasks();
        const individualMembers = this.getUniqueTeamMembers(allTasks); // This excludes "All"
        const allTeamTasks = allTasks.filter(task => task.assignedTo === 'All');
        const currentLang = this.state.getState('currentLang') || 'es';

        // Clear existing content
        teamSummaryContainer.innerHTML = '';

        // Generate individual member cards
        individualMembers.forEach(member => {
            const memberTasks = allTasks.filter(task => task.assignedTo === member);
            const memberHours = this.calculateTotalHours(memberTasks);
            
            const teamCard = this.createElement('div', {
                className: 'team-card',
                dataset: { member: member }
            });

            const teamName = this.createElement('div', {
                className: 'team-name'
            }, member);

            const taskText = currentLang === 'es' ? 'tareas' : 'tasks';
            const hoursText = currentLang === 'es' ? 'horas' : 'hours';

            const teamStats = this.createElement('div', {
                className: 'team-stats'
            }, `${memberTasks.length} ${taskText} • ${memberHours.toFixed(1)} ${hoursText}`);

            teamCard.appendChild(teamName);
            teamCard.appendChild(teamStats);
            teamSummaryContainer.appendChild(teamCard);
        });

        // Add team-wide tasks card if there are any
        if (allTeamTasks.length > 0) {
            const allTeamHours = this.calculateTotalHours(allTeamTasks);
            
            const teamCard = this.createElement('div', {
                className: 'team-card team-all-card',
                dataset: { member: 'All' }
            });

            const teamName = this.createElement('div', {
                className: 'team-name'
            }, currentLang === 'es' ? 'Equipo Completo' : 'Whole Team');

            const taskText = currentLang === 'es' ? 'tareas' : 'tasks';
            const hoursText = currentLang === 'es' ? 'horas' : 'hours';

            const teamStats = this.createElement('div', {
                className: 'team-stats'
            }, `${allTeamTasks.length} ${taskText} • ${allTeamHours.toFixed(1)} ${hoursText}`);

            teamCard.appendChild(teamName);
            teamCard.appendChild(teamStats);
            teamSummaryContainer.appendChild(teamCard);
        }
    }

    /**
     * Get detailed statistics for export or analysis
     * @returns {Object} Detailed statistics
     */
    getDetailedStats() {
        const allTasks = this.getAllTasks();
        const stats = this.calculateStats();
        const teamMembers = this.getUniqueTeamMembers(allTasks);

        // Calculate team statistics
        const teamStats = teamMembers.map(member => {
            const memberTasks = allTasks.filter(task => task.assignedTo === member);
            const memberHours = this.calculateTotalHours(memberTasks);
            const avgDifficulty = memberTasks.length > 0 
                ? memberTasks.reduce((sum, task) => sum + (task.difficulty || 0), 0) / memberTasks.length
                : 0;

            return {
                name: member,
                taskCount: memberTasks.length,
                totalHours: memberHours,
                averageDifficulty: Math.round(avgDifficulty * 10) / 10
            };
        });

        // Calculate phase statistics
        const tasks = this.state.getState('tasks');
        const phaseStats = Object.entries(tasks || {}).map(([phaseNum, phase]) => {
            const phaseTasks = [];
            phase.sections.forEach(section => {
                section.tasks.forEach(task => phaseTasks.push(task));
            });
            
            return {
                phase: parseInt(phaseNum),
                title: phase.title,
                taskCount: phaseTasks.length,
                totalHours: this.calculateTotalHours(phaseTasks),
                sectionCount: phase.sections.length
            };
        });

        // Calculate difficulty distribution
        const difficultyDistribution = [1, 2, 3, 4, 5].map(level => {
            const count = allTasks.filter(task => task.difficulty === level).length;
            return {
                level,
                count,
                percentage: stats.totalTasks > 0 ? Math.round((count / stats.totalTasks) * 100) : 0
            };
        });

        // Calculate duration distribution
        const durationDistribution = {
            short: allTasks.filter(task => parseFloat(task.duration) <= 2).length,
            medium: allTasks.filter(task => {
                const duration = parseFloat(task.duration);
                return duration > 2 && duration <= 5;
            }).length,
            long: allTasks.filter(task => parseFloat(task.duration) > 5).length
        };

        return {
            ...stats,
            teamStats,
            phaseStats,
            difficultyDistribution,
            durationDistribution,
            averageDifficulty: allTasks.length > 0 
                ? allTasks.reduce((sum, task) => sum + (task.difficulty || 0), 0) / allTasks.length 
                : 0,
            averageHoursPerTask: stats.totalTasks > 0 ? stats.totalHours / stats.totalTasks : 0
        };
    }

    /**
     * Component lifecycle - called when mounted
     */
    onMount() {
        // Initial stats calculation
        this.updateStats();
        
        // Subscribe to filtered tasks changes to update task counter
        this.subscribeToState('filteredTasks', (filteredTasks) => {
            if (filteredTasks && Array.isArray(filteredTasks)) {
                this.updateFilteredTaskCounter(filteredTasks.length);
            }
        });
    }

    /**
     * Get stats summary for display
     * @returns {Object} Stats summary
     */
    getStatsSummary() {
        const stats = this.calculateStats();
        const detailed = this.getDetailedStats();
        
        return {
            basic: stats,
            team: detailed.teamStats,
            phases: detailed.phaseStats,
            difficulty: detailed.difficultyDistribution,
            duration: detailed.durationDistribution,
            averages: {
                difficulty: Math.round(detailed.averageDifficulty * 10) / 10,
                hoursPerTask: Math.round(detailed.averageHoursPerTask * 10) / 10
            }
        };
    }
}

export default StatsManager;