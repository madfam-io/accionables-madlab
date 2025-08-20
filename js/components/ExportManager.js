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
     * Get responsive information from ResponsiveManager
     * @returns {Object|null} Responsive information or null if not available
     */
    getResponsiveInfo() {
        try {
            // Access ResponsiveManager through the global app instance
            const responsiveManager = window.madlabApp?.components?.get('responsive');
            if (responsiveManager && typeof responsiveManager.getResponsiveInfo === 'function') {
                return responsiveManager.getResponsiveInfo();
            }
            
            // Fallback to basic responsive info if ResponsiveManager not available
            const viewport = {
                width: window.innerWidth || 1024,
                height: window.innerHeight || 768,
                orientation: (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
            };
            
            const isMobile = viewport.width < 768;
            const isTablet = viewport.width >= 768 && viewport.width < 992;
            const isDesktop = viewport.width >= 992;
            
            return {
                currentBreakpoint: isMobile ? 'sm' : isTablet ? 'md' : 'lg',
                viewport,
                isMobile,
                isTablet,
                isDesktop,
                orientation: viewport.orientation
            };
        } catch (error) {
            console.warn('ExportManager: Error getting responsive info:', error);
            
            // Return safe defaults
            return {
                currentBreakpoint: 'md',
                viewport: { width: 1024, height: 768, orientation: 'landscape' },
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                orientation: 'landscape'
            };
        }
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
        const viewport = this.state.getState('viewport');
        const responsiveInfo = this.getResponsiveInfo();

        // Create modal overlay
        const overlay = this.createElement('div', {
            className: 'modal-overlay export-modal-overlay',
            id: 'exportModalOverlay'
        });

        // Create modal content with enhanced responsive classes
        const modalClasses = ['modal', 'export-modal'];
        if (responsiveInfo?.isMobile) {
            modalClasses.push('modal-mobile', 'modal-slide-up');
        }
        if (responsiveInfo?.isTablet) {
            modalClasses.push('modal-tablet');
        }
        if (responsiveInfo?.orientation === 'landscape' && responsiveInfo?.isMobile) {
            modalClasses.push('modal-landscape');
        }
        if (responsiveInfo?.currentBreakpoint) {
            modalClasses.push(`modal-${responsiveInfo.currentBreakpoint}`);
        }

        const modal = this.createElement('div', {
            className: modalClasses.join(' '),
            'data-modal-type': 'export'
        });

        // Enhanced modal header with mobile-specific elements
        const header = this.createElement('div', {
            className: 'modal-header export-modal-header'
        });
        
        // Add mobile drag handle for bottom sheet behavior
        if (responsiveInfo?.isMobile) {
            const dragHandle = this.createElement('div', {
                className: 'modal-drag-handle'
            });
            header.appendChild(dragHandle);
        }
        
        const titleContainer = this.createElement('div', {
            className: 'modal-title-container'
        });
        
        const title = this.createElement('h3', {
            className: 'modal-title'
        }, t.exportTasks);
        
        const subtitle = this.createElement('p', {
            className: 'modal-subtitle'
        }, t.selectExportOptions);
        
        const closeBtn = this.createElement('button', {
            className: 'modal-close',
            'aria-label': t.closeModal,
            'data-touch-target': 'large'
        }, '×');

        titleContainer.appendChild(title);
        if (responsiveInfo?.isMobile) {
            titleContainer.appendChild(subtitle);
        }
        
        header.appendChild(titleContainer);
        header.appendChild(closeBtn);

        // Enhanced modal body with mobile optimizations
        const body = this.createElement('div', {
            className: `modal-body export-modal-body ${responsiveInfo?.isMobile ? 'modal-body-mobile' : ''}`,
            'data-scrollable': 'true'
        });

        // Create progressive disclosure for mobile
        if (responsiveInfo?.isMobile) {
            this.createMobileOptimizedSections(body, currentLang, responsiveInfo);
        } else {
            this.createDesktopSections(body, currentLang);
        }

        // Enhanced modal footer with mobile optimizations
        const footer = this.createElement('div', {
            className: `modal-footer export-modal-footer ${responsiveInfo?.isMobile ? 'modal-footer-mobile' : ''}`,
            'data-safe-area': 'bottom'
        });

        // Add progress indicator for mobile
        if (responsiveInfo?.isMobile) {
            const progressContainer = this.createElement('div', {
                className: 'export-progress-container'
            });
            
            const progressBar = this.createElement('div', {
                className: 'export-progress-bar',
                'aria-hidden': 'true'
            });
            
            const progressFill = this.createElement('div', {
                className: 'export-progress-fill'
            });
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
            footer.appendChild(progressContainer);
        }

        const buttonContainer = this.createElement('div', {
            className: 'modal-button-container'
        });

        const cancelBtn = this.createElement('button', {
            className: `btn btn-secondary ${responsiveInfo?.isMobile ? 'btn-mobile' : ''}`,
            'data-touch-target': responsiveInfo?.isMobile ? 'large' : 'default'
        }, t.cancel);

        const exportBtn = this.createElement('button', {
            className: `btn btn-primary btn-export ${responsiveInfo?.isMobile ? 'btn-mobile' : ''}`,
            'data-touch-target': responsiveInfo?.isMobile ? 'large' : 'default',
            'data-export-action': 'true'
        }, t.export);

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(exportBtn);
        footer.appendChild(buttonContainer);

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

        // Enhanced touch gesture and interaction support
        if (responsiveInfo?.isMobile) {
            this.addEnhancedMobileGestureSupport(modal, overlay);
            this.addMobileFormOptimizations(modal);
            this.addMobileAccessibilityEnhancements(modal);
        }

        // Add keyboard navigation
        this.addKeyboardNavigation(modal);

        // Add swipe-to-dismiss for mobile
        if (responsiveInfo?.isMobile) {
            this.addSwipeToDismiss(modal, overlay);
        }

        // Add responsive observers
        this.addResponsiveObservers(modal, overlay);

        // Add to DOM with animation preparation
        document.body.appendChild(overlay);
        
        // Enhanced body classes for different device types
        document.body.classList.add('modal-open');
        if (responsiveInfo?.isMobile) {
            document.body.classList.add('modal-open-mobile');
        }
        if (responsiveInfo?.isTablet) {
            document.body.classList.add('modal-open-tablet');
        }

        // Add safe area support for mobile devices
        if (responsiveInfo?.isMobile) {
            this.addSafeAreaSupport(modal);
        }

        // Enhanced focus management with device detection
        this.setupModalFocus(modal, responsiveInfo);
        
        // Trigger entrance animation
        this.animateModalEntrance(modal, overlay, responsiveInfo);
    }

    /**
     * Create format selection section
     */
    createFormatSection(currentLang) {
        const t = translations[currentLang] || translations.es;
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, t.exportFormat);

        const options = this.createElement('div', {
            className: 'radio-group'
        });

        const formats = [
            { value: 'csv', label: 'CSV (Excel)', icon: '📊' },
            { value: 'json', label: 'JSON (Desarrolladores)', icon: '🔧' },
            { value: 'txt', label: t.plainText, icon: '📄' }
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
        const t = translations[currentLang] || translations.es;
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, t.exportScope);

        const options = this.createElement('div', {
            className: 'radio-group'
        });

        const filteredTasks = this.state.getState('filteredTasks') || [];
        const allTasks = this.getAllTasks();

        const scopes = [
            { 
                value: 'filtered', 
                label: `${t.filteredTasksOnly} (${filteredTasks.length})`,
                icon: '🔍'
            },
            { 
                value: 'all', 
                label: `${t.allTasksExport} (${allTasks.length})`,
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
        const t = translations[currentLang] || translations.es;
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, t.fieldsToInclude);

        const fieldsGrid = this.createElement('div', {
            className: 'checkbox-grid'
        });
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
        const t = translations[currentLang] || translations.es;
        const section = this.createElement('div', {
            className: 'export-section'
        });

        const label = this.createElement('label', {
            className: 'section-label'
        }, t.exportLanguage);

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
     * Add mobile gesture support to modal
     * @param {Element} modal - Modal element
     * @param {Element} overlay - Overlay element
     */
    addMobileGestureSupport(modal, overlay) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let initialModalTop = 0;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
            currentY = startY;
            isDragging = true;
            initialModalTop = modal.offsetTop;
            modal.style.transition = 'none';
        };

        const onTouchMove = (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Only allow downward drag
            if (deltaY > 0) {
                e.preventDefault();
                const newTop = Math.max(0, deltaY * 0.5); // Add resistance
                modal.style.transform = `translateY(${newTop}px)`;
                
                // Fade overlay based on drag distance
                const opacity = Math.max(0.3, 1 - (deltaY / 300));
                overlay.style.opacity = opacity;
            }
        };

        const onTouchEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            const deltaY = currentY - startY;
            
            modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            overlay.style.transition = 'opacity 0.3s ease';
            
            if (deltaY > 100) {
                // Close modal if dragged down enough
                this.closeModal();
            } else {
                // Snap back to original position
                modal.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            }
        };

        // Add touch event listeners to modal header for dragging
        const modalHeader = modal.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.addEventListener('touchstart', onTouchStart, { passive: false });
            modalHeader.addEventListener('touchmove', onTouchMove, { passive: false });
            modalHeader.addEventListener('touchend', onTouchEnd, { passive: false });
            
            // Add drag indicator
            modalHeader.style.cursor = 'grab';
            modalHeader.setAttribute('data-mobile-draggable', 'true');
        }

        // Listen for swipe down on modal content
        modal.addEventListener('touchstart', (e) => {
            // Only start drag from the top area of modal
            const rect = modal.getBoundingClientRect();
            const touchY = e.touches[0].clientY;
            if (touchY - rect.top < 50) {
                onTouchStart(e);
            }
        }, { passive: false });

        modal.addEventListener('touchmove', onTouchMove, { passive: false });
        modal.addEventListener('touchend', onTouchEnd, { passive: false });
    }

    /**
     * Add keyboard navigation to modal
     * @param {Element} modal - Modal element
     */
    addKeyboardNavigation(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeModal();
                    break;
                    
                case 'Tab':
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                    break;
                    
                case 'Enter':
                    if (document.activeElement?.classList.contains('btn-primary')) {
                        e.preventDefault();
                        this.performExport();
                    }
                    break;
            }
        };

        modal.addEventListener('keydown', handleKeyDown);
        
        // Store handler for cleanup
        modal._keyboardHandler = handleKeyDown;
    }

    /**
     * Remove modal from DOM
     */
    removeModal() {
        const existingModal = document.getElementById('exportModalOverlay');
        if (existingModal) {
            // Clean up mobile classes
            document.body.classList.remove('modal-open-mobile');
            
            // Clean up keyboard handler
            const modal = existingModal.querySelector('.modal');
            if (modal?._keyboardHandler) {
                modal.removeEventListener('keydown', modal._keyboardHandler);
            }
            
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
     * Enhanced cleanup when component unmounts
     */
    onUnmount() {
        this.removeModal();
        
        // Clean up responsive listeners
        window.removeEventListener('breakpointchange', this.handleBreakpointChange);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        
        // Clean up any remaining toasts
        const toasts = document.querySelectorAll('.export-success-toast');
        toasts.forEach(toast => toast.remove());
        
        // Clean up modal touch state
        if (this.modalTouchState) {
            this.modalTouchState = null;
        }
    }
    
    /**
     * Mount component with mobile optimizations
     */
    mount() {
        super.mount();
        this.bindEvents();
        
        console.log('📤 ExportManager mounted with mobile-native modal support');
    }

    /**
     * Create mobile-optimized sections (stub implementation)
     * @param {Element} body - Modal body element
     * @param {string} currentLang - Current language
     * @param {Object} responsiveInfo - Responsive information
     */
    createMobileOptimizedSections(body, currentLang, responsiveInfo) {
        // Fallback to desktop sections for now
        this.createDesktopSections(body, currentLang);
    }

    /**
     * Create desktop sections
     * @param {Element} body - Modal body element
     * @param {string} currentLang - Current language
     */
    createDesktopSections(body, currentLang) {
        // Create all section types
        body.appendChild(this.createFormatSection(currentLang));
        body.appendChild(this.createScopeSection(currentLang));
        body.appendChild(this.createFieldsSection(currentLang));
        body.appendChild(this.createLanguageSection(currentLang));
    }

    /**
     * Add enhanced mobile gesture support (stub implementation)
     * @param {Element} modal - Modal element
     * @param {Element} overlay - Overlay element
     */
    addEnhancedMobileGestureSupport(modal, overlay) {
        // Use existing mobile gesture support
        this.addMobileGestureSupport(modal, overlay);
    }

    /**
     * Add mobile form optimizations (stub implementation)
     * @param {Element} modal - Modal element
     */
    addMobileFormOptimizations(modal) {
        // Add basic mobile form enhancements
        const inputs = modal.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.setAttribute('data-mobile-optimized', 'true');
        });
    }

    /**
     * Add mobile accessibility enhancements (stub implementation)
     * @param {Element} modal - Modal element
     */
    addMobileAccessibilityEnhancements(modal) {
        // Add basic mobile accessibility features
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
    }

    /**
     * Add swipe to dismiss functionality (stub implementation)
     * @param {Element} modal - Modal element
     * @param {Element} overlay - Overlay element
     */
    addSwipeToDismiss(modal, overlay) {
        // Use existing mobile gesture support which includes swipe
        this.addMobileGestureSupport(modal, overlay);
    }

    /**
     * Add responsive observers (stub implementation)
     * @param {Element} modal - Modal element
     * @param {Element} overlay - Overlay element
     */
    addResponsiveObservers(modal, overlay) {
        // Add basic resize observer if available
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                // Update modal on resize
                const responsiveInfo = this.getResponsiveInfo();
                modal.classList.toggle('modal-mobile', responsiveInfo.isMobile);
                modal.classList.toggle('modal-tablet', responsiveInfo.isTablet);
            });
            resizeObserver.observe(modal);
        }
    }

    /**
     * Add safe area support (stub implementation)
     * @param {Element} modal - Modal element
     */
    addSafeAreaSupport(modal) {
        // Add safe area CSS classes
        modal.classList.add('has-safe-area');
    }

    /**
     * Setup modal focus management (stub implementation)
     * @param {Element} modal - Modal element
     * @param {Object} responsiveInfo - Responsive information
     */
    setupModalFocus(modal, responsiveInfo) {
        // Focus on first focusable element
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    /**
     * Animate modal entrance (stub implementation)
     * @param {Element} modal - Modal element
     * @param {Element} overlay - Overlay element
     * @param {Object} responsiveInfo - Responsive information
     */
    animateModalEntrance(modal, overlay, responsiveInfo) {
        // Add entrance animation classes
        requestAnimationFrame(() => {
            overlay.classList.add('modal-entering');
            modal.classList.add('modal-entering');
            
            setTimeout(() => {
                overlay.classList.remove('modal-entering');
                modal.classList.remove('modal-entering');
                overlay.classList.add('modal-entered');
                modal.classList.add('modal-entered');
            }, 300);
        });
    }

    /**
     * Get component status
     */
    getStatus() {
        const modal = document.getElementById('exportModalOverlay');
        const responsiveInfo = this.getResponsiveInfo();
        
        return {
            mounted: this.mounted,
            modalOpen: !!modal,
            isMobile: responsiveInfo?.isMobile || false,
            currentBreakpoint: responsiveInfo?.currentBreakpoint || 'md',
            orientation: responsiveInfo?.orientation || 'portrait'
        };
    }
}

export default ExportManager;