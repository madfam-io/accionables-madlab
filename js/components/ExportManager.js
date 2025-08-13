// ==========================================================================
// Export Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { translations } from '../data/translations.js';
import { downloadFile } from '../utils/helpers.js';

export class ExportManager extends Component {
    constructor(element, state) {
        super(element, state);
        this.subscribeToState('currentLang', () => this.updateModalContent());
        this.subscribeToState('ui', () => this.handleModalState());
    }

    /**
     * Open export modal
     */
    openModal() {
        this.state.setState({
            ui: { ...this.state.getState('ui'), activeModal: 'export' }
        });
        this.createModal();
    }

    /**
     * Close export modal
     */
    closeModal() {
        this.state.setState({
            ui: { ...this.state.getState('ui'), activeModal: null }
        });
        this.removeModal();
    }

    /**
     * Create export modal
     */
    createModal() {
        // Remove existing modal if any
        this.removeModal();

        const currentLang = this.state.getState('currentLang');
        const t = translations[currentLang] || translations.es;

        // Create modal overlay
        const overlay = this.createElement('div', {
            className: 'modal-overlay',
            id: 'exportModalOverlay'
        });

        // Create modal content
        const modal = this.createElement('div', {
            className: 'modal'
        });

        // Modal header
        const header = this.createElement('div', {
            className: 'modal-header'
        });
        
        const title = this.createElement('h3', {
            className: 'modal-title'
        }, currentLang === 'es' ? 'Exportar Tareas' : 'Export Tasks');
        
        const closeBtn = this.createElement('button', {
            className: 'modal-close'
        }, '×');

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Modal body
        const body = this.createElement('div', {
            className: 'modal-body'
        });

        // Export format selection
        const formatSection = this.createFormatSection(currentLang);
        body.appendChild(formatSection);

        // Export scope selection
        const scopeSection = this.createScopeSection(currentLang);
        body.appendChild(scopeSection);

        // Field selection
        const fieldsSection = this.createFieldsSection(currentLang);
        body.appendChild(fieldsSection);

        // Language selection
        const langSection = this.createLanguageSection(currentLang);
        body.appendChild(langSection);

        // Modal footer
        const footer = this.createElement('div', {
            className: 'modal-footer'
        });

        const cancelBtn = this.createElement('button', {
            className: 'btn btn-secondary'
        }, currentLang === 'es' ? 'Cancelar' : 'Cancel');

        const exportBtn = this.createElement('button', {
            className: 'btn btn-primary'
        }, currentLang === 'es' ? 'Exportar' : 'Export');

        footer.appendChild(cancelBtn);
        footer.appendChild(exportBtn);

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);

        // Add event listeners
        this.addEventListener(closeBtn, 'click', () => this.closeModal());
        this.addEventListener(cancelBtn, 'click', () => this.closeModal());
        this.addEventListener(exportBtn, 'click', () => this.performExport());
        this.addEventListener(overlay, 'click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        // Add to DOM
        document.body.appendChild(overlay);

        // Focus management
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    /**
     * Create format selection section
     */
    createFormatSection(currentLang) {
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, currentLang === 'es' ? 'Formato de Exportación' : 'Export Format');

        const options = this.createElement('div', {
            className: 'radio-group'
        });

        const formats = [
            { value: 'csv', label: 'CSV (Excel)', icon: '📊' },
            { value: 'json', label: 'JSON (Desarrolladores)', icon: '🔧' },
            { value: 'txt', label: currentLang === 'es' ? 'Texto Plano' : 'Plain Text', icon: '📄' }
        ];

        formats.forEach((format, index) => {
            const radioContainer = this.createElement('div', {
                className: 'radio-option'
            });

            const radio = this.createElement('input', {
                type: 'radio',
                name: 'exportFormat',
                value: format.value,
                id: `format-${format.value}`
            });

            if (index === 0) radio.checked = true;

            const radioLabel = this.createElement('label', {
                htmlFor: `format-${format.value}`,
                className: 'radio-label'
            }, `${format.icon} ${format.label}`);

            radioContainer.appendChild(radio);
            radioContainer.appendChild(radioLabel);
            options.appendChild(radioContainer);
        });

        section.appendChild(label);
        section.appendChild(options);
        return section;
    }

    /**
     * Create scope selection section
     */
    createScopeSection(currentLang) {
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, currentLang === 'es' ? 'Alcance de Exportación' : 'Export Scope');

        const options = this.createElement('div', {
            className: 'radio-group'
        });

        const filteredTasks = this.state.getState('filteredTasks') || [];
        const allTasks = this.getAllTasks();

        const scopes = [
            { 
                value: 'filtered', 
                label: currentLang === 'es' 
                    ? `Solo tareas filtradas (${filteredTasks.length})` 
                    : `Filtered tasks only (${filteredTasks.length})`,
                icon: '🔍'
            },
            { 
                value: 'all', 
                label: currentLang === 'es' 
                    ? `Todas las tareas (${allTasks.length})` 
                    : `All tasks (${allTasks.length})`,
                icon: '📋'
            }
        ];

        scopes.forEach((scope, index) => {
            const radioContainer = this.createElement('div', {
                className: 'radio-option'
            });

            const radio = this.createElement('input', {
                type: 'radio',
                name: 'exportScope',
                value: scope.value,
                id: `scope-${scope.value}`
            });

            if (index === 0) radio.checked = true;

            const radioLabel = this.createElement('label', {
                htmlFor: `scope-${scope.value}`,
                className: 'radio-label'
            }, `${scope.icon} ${scope.label}`);

            radioContainer.appendChild(radio);
            radioContainer.appendChild(radioLabel);
            options.appendChild(radioContainer);
        });

        section.appendChild(label);
        section.appendChild(options);
        return section;
    }

    /**
     * Create fields selection section
     */
    createFieldsSection(currentLang) {
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, currentLang === 'es' ? 'Campos a Incluir' : 'Fields to Include');

        const fieldsGrid = this.createElement('div', {
            className: 'checkbox-grid'
        });

        const t = translations[currentLang] || translations.es;
        const fields = [
            { key: 'id', label: t.taskId || 'ID', checked: true },
            { key: 'name', label: t.taskName || 'Name', checked: true },
            { key: 'assignee', label: t.assignedTo || 'Assigned to', checked: true },
            { key: 'duration', label: t.duration || 'Duration', checked: true },
            { key: 'difficulty', label: t.difficulty || 'Difficulty', checked: true },
            { key: 'phase', label: t.phase || 'Phase', checked: false },
            { key: 'section', label: t.section || 'Section', checked: false },
            { key: 'dependencies', label: t.dependencies || 'Dependencies', checked: false }
        ];

        fields.forEach(field => {
            const checkboxContainer = this.createElement('div', {
                className: 'checkbox-option'
            });

            const checkbox = this.createElement('input', {
                type: 'checkbox',
                name: 'exportFields',
                value: field.key,
                id: `field-${field.key}`
            });

            if (field.checked) checkbox.checked = true;

            const checkboxLabel = this.createElement('label', {
                htmlFor: `field-${field.key}`,
                className: 'checkbox-label'
            }, field.label);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkboxLabel);
            fieldsGrid.appendChild(checkboxContainer);
        });

        section.appendChild(label);
        section.appendChild(fieldsGrid);
        return section;
    }

    /**
     * Create language selection section
     */
    createLanguageSection(currentLang) {
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, currentLang === 'es' ? 'Idioma de Exportación' : 'Export Language');

        const select = this.createElement('select', {
            name: 'exportLanguage',
            id: 'exportLanguage',
            className: 'form-select'
        });

        const languages = [
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' }
        ];

        languages.forEach(lang => {
            const option = this.createElement('option', {
                value: lang.value
            }, lang.label);

            if (lang.value === currentLang) option.selected = true;
            select.appendChild(option);
        });

        section.appendChild(label);
        section.appendChild(select);
        return section;
    }

    /**
     * Perform the export based on modal selections
     */
    performExport() {
        const modal = document.getElementById('exportModalOverlay');
        if (!modal) return;

        // Get selections
        const format = modal.querySelector('input[name="exportFormat"]:checked')?.value || 'csv';
        const scope = modal.querySelector('input[name="exportScope"]:checked')?.value || 'filtered';
        const language = modal.querySelector('#exportLanguage')?.value || 'es';
        
        // Get selected fields
        const fieldCheckboxes = modal.querySelectorAll('input[name="exportFields"]:checked');
        const fields = {};
        fieldCheckboxes.forEach(checkbox => {
            fields[checkbox.value] = true;
        });

        // Get tasks to export
        const allTasks = this.getAllTasks();
        const filteredTasks = this.state.getState('filteredTasks') || [];
        const tasksToExport = scope === 'all' ? allTasks : filteredTasks;

        // Perform export
        this.exportData(tasksToExport, format, fields, language);

        // Close modal
        this.closeModal();
    }

    /**
     * Export data in specified format
     */
    exportData(tasks, format, fields, language) {
        switch (format) {
            case 'csv':
                this.exportToCSV(tasks, fields, language);
                break;
            case 'json':
                this.exportToJSON(tasks, fields, language);
                break;
            case 'txt':
                this.exportToText(tasks, fields, language);
                break;
        }
    }

    /**
     * Export to CSV format
     */
    exportToCSV(tasks, fields, lang) {
        const t = translations[lang] || translations.es;
        const headers = [];
        const fieldMap = {
            id: t.taskId || 'ID',
            name: t.taskName || 'Name',
            assignee: t.assignedTo || 'Assigned',
            duration: t.duration || 'Duration',
            difficulty: t.difficulty || 'Difficulty',
            phase: t.phase || 'Phase',
            section: t.section || 'Section',
            dependencies: t.dependencies || 'Dependencies'
        };

        // Build headers
        Object.keys(fields).forEach(key => {
            if (fields[key]) {
                headers.push(fieldMap[key]);
            }
        });

        // Build CSV content
        let csvContent = headers.join(',') + '\n';

        tasks.forEach(task => {
            const row = [];
            Object.keys(fields).forEach(key => {
                if (fields[key]) {
                    let value = '';
                    switch (key) {
                        case 'name':
                            value = task.name[lang] || task.name.es || '';
                            break;
                        case 'phase':
                            value = `Phase ${task.phase}`;
                            break;
                        case 'section':
                            const sectionTitle = task.section;
                            value = typeof sectionTitle === 'object' ? 
                                (sectionTitle[lang] || sectionTitle.es || '') : sectionTitle;
                            break;
                        case 'dependencies':
                            const deps = task.dependencies;
                            if (typeof deps === 'object') {
                                value = deps[lang] || deps.es || '';
                            } else {
                                value = deps || '';
                            }
                            break;
                        default:
                            value = task[key] || '';
                    }
                    
                    // Escape commas and quotes
                    value = String(value);
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        value = '"' + value.replace(/"/g, '""') + '"';
                    }
                    row.push(value);
                }
            });
            csvContent += row.join(',') + '\n';
        });

        downloadFile(csvContent, 'madlab-tasks.csv', 'text/csv');
    }

    /**
     * Export to JSON format
     */
    exportToJSON(tasks, fields, lang) {
        const filteredTasks = tasks.map(task => {
            const filtered = {};
            Object.keys(fields).forEach(key => {
                if (fields[key]) {
                    switch (key) {
                        case 'name':
                            filtered[key] = task.name[lang] || task.name.es;
                            break;
                        case 'section':
                            const sectionTitle = task.section;
                            filtered[key] = typeof sectionTitle === 'object' ? 
                                (sectionTitle[lang] || sectionTitle.es) : sectionTitle;
                            break;
                        case 'dependencies':
                            const deps = task.dependencies;
                            if (typeof deps === 'object') {
                                filtered[key] = deps[lang] || deps.es;
                            } else {
                                filtered[key] = deps;
                            }
                            break;
                        default:
                            filtered[key] = task[key];
                    }
                }
            });
            return filtered;
        });

        const exportData = {
            exportInfo: {
                timestamp: new Date().toISOString(),
                language: lang,
                totalTasks: filteredTasks.length,
                project: 'MADLAB'
            },
            tasks: filteredTasks
        };

        const jsonContent = JSON.stringify(exportData, null, 2);
        downloadFile(jsonContent, 'madlab-tasks.json', 'application/json');
    }

    /**
     * Export to text format
     */
    exportToText(tasks, fields, lang) {
        const t = translations[lang] || translations.es;
        let textContent = `MADLAB ${t.projectTasks || 'Project Tasks'}\n`;
        textContent += `${t.exportDate || 'Export Date'}: ${new Date().toLocaleDateString()}\n`;
        textContent += `${t.totalTasks || 'Total Tasks'}: ${tasks.length}\n\n`;

        tasks.forEach((task, index) => {
            textContent += `${index + 1}. `;
            if (fields.id) textContent += `[${task.id}] `;
            if (fields.name) {
                const taskName = task.name[lang] || task.name.es;
                textContent += `${taskName}\n`;
            }
            if (fields.assignee) textContent += `   ${t.assignedTo || 'Assigned'}: ${task.assignedTo}\n`;
            if (fields.duration) textContent += `   ${t.duration || 'Duration'}: ${task.duration} ${t.hours || 'hours'}\n`;
            if (fields.difficulty) textContent += `   ${t.difficulty || 'Difficulty'}: ${task.difficulty}/5\n`;
            if (fields.phase) textContent += `   ${t.phase || 'Phase'}: ${task.phase}\n`;
            if (fields.section) {
                const sectionTitle = task.section;
                const section = typeof sectionTitle === 'object' ? 
                    (sectionTitle[lang] || sectionTitle.es) : sectionTitle;
                textContent += `   ${t.section || 'Section'}: ${section}\n`;
            }
            if (fields.dependencies) {
                const deps = task.dependencies;
                let depsText = '';
                if (typeof deps === 'object') {
                    depsText = deps[lang] || deps.es;
                } else {
                    depsText = deps;
                }
                if (depsText && depsText !== 'None' && depsText !== 'Ninguna') {
                    textContent += `   ${t.dependencies || 'Dependencies'}: ${depsText}\n`;
                }
            }
            textContent += '\n';
        });

        downloadFile(textContent, 'madlab-tasks.txt', 'text/plain');
    }

    /**
     * Get all tasks (helper method)
     */
    getAllTasks() {
        const taskManager = window.madlabApp?.components?.get('tasks');
        return taskManager ? taskManager.getAllTasks() : [];
    }

    /**
     * Remove modal from DOM
     */
    removeModal() {
        const existingModal = document.getElementById('exportModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }
    }

    /**
     * Handle modal state changes
     */
    handleModalState() {
        const uiState = this.state.getState('ui');
        if (uiState.activeModal === 'export') {
            // Modal should be open
            if (!document.getElementById('exportModalOverlay')) {
                this.createModal();
            }
        } else {
            // Modal should be closed
            this.removeModal();
        }
    }

    /**
     * Update modal content when language changes
     */
    updateModalContent() {
        const modal = document.getElementById('exportModalOverlay');
        if (modal) {
            // Close and recreate modal with new language
            this.removeModal();
            this.createModal();
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Export button in filters
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            this.addEventListener(exportBtn, 'click', () => this.openModal());
        }
    }

    /**
     * Cleanup when component unmounts
     */
    onUnmount() {
        this.removeModal();
    }
}

export default ExportManager;