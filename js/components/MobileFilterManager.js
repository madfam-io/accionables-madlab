// ==========================================================================
// Mobile Filter Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { debounce } from '../utils/helpers.js';

export class MobileFilterManager extends Component {
    constructor(element, state) {
        super(element, state);
        
        // Mobile filter configuration
        this.config = {
            breakpoint: 768,                // Mobile breakpoint
            bottomSheetThreshold: 0.3,      // Swipe threshold to open/close
            animationDuration: 300,         // Animation duration in ms
            backdropOpacity: 0.5,           // Backdrop opacity
            snapPoints: [0.3, 0.7, 1.0],   // Bottom sheet snap positions
            dragResistance: 0.8             // Drag resistance when overscrolling
        };
        
        // Bottom sheet state
        this.bottomSheet = {
            isOpen: false,
            isDragging: false,
            startY: 0,
            currentY: 0,
            height: 0,
            position: 0, // 0 = closed, 1 = fully open
            snapPosition: 0
        };
        
        // Filter state
        this.mobileFilters = {
            search: '',
            assignee: '',
            difficulty: '',
            phase: '',
            duration: ''
        };
        
        // DOM elements
        this.elements = {
            bottomSheet: null,
            backdrop: null,
            handle: null,
            content: null,
            trigger: null
        };
        
        // Debounced handlers
        this.handleSearch = debounce(this.onSearchChange.bind(this), 300);
        
        // Bind methods
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onBackdropClick = this.onBackdropClick.bind(this);
    }

    /**
     * Create mobile filter bottom sheet
     */
    createBottomSheet() {
        if (this.elements.bottomSheet) return;
        
        const currentLang = this.state.getState('currentLang');
        const t = this.getTranslations(currentLang);
        
        // Create backdrop
        this.elements.backdrop = this.createElement('div', {
            className: 'mobile-filter-backdrop'
        });
        this.elements.backdrop.addEventListener('click', this.onBackdropClick);
        
        // Create bottom sheet
        this.elements.bottomSheet = this.createElement('div', {
            className: 'mobile-filter-bottom-sheet'
        });
        
        // Create drag handle
        this.elements.handle = this.createElement('div', {
            className: 'bottom-sheet-handle'
        });
        
        // Create header
        const header = this.createElement('div', {
            className: 'bottom-sheet-header'
        });
        
        const title = this.createElement('h3', {
            className: 'bottom-sheet-title'
        }, currentLang === 'es' ? 'Filtros' : 'Filters');
        
        const clearBtn = this.createElement('button', {
            className: 'btn btn-outline btn-clear-filters'
        }, currentLang === 'es' ? 'Limpiar' : 'Clear');
        
        clearBtn.addEventListener('click', () => this.clearAllFilters());
        
        header.appendChild(title);
        header.appendChild(clearBtn);
        
        // Create content
        this.elements.content = this.createElement('div', {
            className: 'bottom-sheet-content'
        });
        
        // Create filter sections
        this.createFilterSections(this.elements.content, currentLang);
        
        // Assemble bottom sheet
        this.elements.bottomSheet.appendChild(this.elements.handle);
        this.elements.bottomSheet.appendChild(header);
        this.elements.bottomSheet.appendChild(this.elements.content);
        
        // Add to DOM
        document.body.appendChild(this.elements.backdrop);
        document.body.appendChild(this.elements.bottomSheet);
        
        // Add touch events to handle
        this.elements.handle.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.elements.handle.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.elements.handle.addEventListener('touchend', this.onTouchEnd, { passive: false });
        
        // Add touch events to content for dragging
        this.elements.content.addEventListener('touchstart', this.onTouchStart, { passive: false });
        
        console.log('📱 Mobile filter bottom sheet created');
    }

    /**
     * Create filter sections in bottom sheet
     * @param {Element} container - Container element
     * @param {string} lang - Current language
     */
    createFilterSections(container, lang) {
        const t = this.getTranslations(lang);
        
        // Search section
        const searchSection = this.createFilterSection(
            lang === 'es' ? 'Buscar' : 'Search',
            this.createSearchInput(lang)
        );
        container.appendChild(searchSection);
        
        // Quick filters section
        const quickFiltersSection = this.createFilterSection(
            lang === 'es' ? 'Filtros Rápidos' : 'Quick Filters',
            this.createQuickFilters(lang)
        );
        container.appendChild(quickFiltersSection);
        
        // Assignee section
        const assigneeSection = this.createFilterSection(
            lang === 'es' ? 'Asignado a' : 'Assigned to',
            this.createAssigneeFilter(lang)
        );
        container.appendChild(assigneeSection);
        
        // Difficulty section
        const difficultySection = this.createFilterSection(
            lang === 'es' ? 'Dificultad' : 'Difficulty',
            this.createDifficultyFilter(lang)
        );
        container.appendChild(difficultySection);
        
        // Phase section
        const phaseSection = this.createFilterSection(
            lang === 'es' ? 'Fase' : 'Phase',
            this.createPhaseFilter(lang)
        );
        container.appendChild(phaseSection);
        
        // Duration section
        const durationSection = this.createFilterSection(
            lang === 'es' ? 'Duración' : 'Duration',
            this.createDurationFilter(lang)
        );
        container.appendChild(durationSection);
    }

    /**
     * Create filter section
     * @param {string} title - Section title
     * @param {Element} content - Section content
     * @returns {Element} Section element
     */
    createFilterSection(title, content) {
        const section = this.createElement('div', {
            className: 'mobile-filter-section'
        });
        
        const sectionTitle = this.createElement('h4', {
            className: 'filter-section-title'
        }, title);
        
        section.appendChild(sectionTitle);
        section.appendChild(content);
        
        return section;
    }

    /**
     * Create search input
     * @param {string} lang - Current language
     * @returns {Element} Search input element
     */
    createSearchInput(lang) {
        const searchInput = this.createElement('input', {
            type: 'text',
            className: 'mobile-search-input',
            placeholder: lang === 'es' ? 'Buscar tareas...' : 'Search tasks...'
        });
        
        searchInput.addEventListener('input', (e) => {
            this.mobileFilters.search = e.target.value;
            this.handleSearch();
        });
        
        return searchInput;
    }

    /**
     * Create quick filter chips
     * @param {string} lang - Current language
     * @returns {Element} Quick filters container
     */
    createQuickFilters(lang) {
        const container = this.createElement('div', {
            className: 'quick-filters-container'
        });
        
        const quickFilters = [
            { key: 'myTasks', label: lang === 'es' ? 'Mis Tareas' : 'My Tasks', filter: { assignee: 'Aldo' } },
            { key: 'urgent', label: lang === 'es' ? 'Urgente' : 'Urgent', filter: { difficulty: '5' } },
            { key: 'quick', label: lang === 'es' ? 'Rápido' : 'Quick', filter: { duration: 'short' } },
            { key: 'phase1', label: lang === 'es' ? 'Fase 1' : 'Phase 1', filter: { phase: '1' } }
        ];
        
        quickFilters.forEach(quickFilter => {
            const chip = this.createElement('button', {
                className: 'quick-filter-chip',
                dataset: { filter: quickFilter.key }
            }, quickFilter.label);
            
            chip.addEventListener('click', () => {
                this.applyQuickFilter(quickFilter.filter);
                chip.classList.toggle('active');
            });
            
            container.appendChild(chip);
        });
        
        return container;
    }

    /**
     * Create assignee filter
     * @param {string} lang - Current language
     * @returns {Element} Assignee filter element
     */
    createAssigneeFilter(lang) {
        const container = this.createElement('div', {
            className: 'assignee-filter-container'
        });
        
        const teamMembers = ['Aldo', 'Nuri', 'Luis', 'Silvia', 'Caro'];
        
        teamMembers.forEach(member => {
            const option = this.createElement('label', {
                className: 'assignee-option'
            });
            
            const radio = this.createElement('input', {
                type: 'radio',
                name: 'mobileAssignee',
                value: member
            });
            
            const label = this.createElement('span', {}, member);
            
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.mobileFilters.assignee = member;
                    this.applyFilters();
                }
            });
            
            option.appendChild(radio);
            option.appendChild(label);
            container.appendChild(option);
        });
        
        return container;
    }

    /**
     * Create difficulty filter
     * @param {string} lang - Current language
     * @returns {Element} Difficulty filter element
     */
    createDifficultyFilter(lang) {
        const container = this.createElement('div', {
            className: 'difficulty-filter-container'
        });
        
        for (let i = 1; i <= 5; i++) {
            const difficultyBtn = this.createElement('button', {
                className: 'difficulty-level-btn',
                dataset: { level: i.toString() }
            });
            
            // Add stars
            for (let j = 1; j <= 5; j++) {
                const star = this.createElement('span', {
                    className: j <= i ? 'star filled' : 'star'
                }, '⭐');
                difficultyBtn.appendChild(star);
            }
            
            difficultyBtn.addEventListener('click', () => {
                // Toggle active state
                const isActive = difficultyBtn.classList.contains('active');
                container.querySelectorAll('.difficulty-level-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                
                if (!isActive) {
                    difficultyBtn.classList.add('active');
                    this.mobileFilters.difficulty = i.toString();
                } else {
                    this.mobileFilters.difficulty = '';
                }
                
                this.applyFilters();
            });
            
            container.appendChild(difficultyBtn);
        }
        
        return container;
    }

    /**
     * Create phase filter
     * @param {string} lang - Current language
     * @returns {Element} Phase filter element
     */
    createPhaseFilter(lang) {
        const container = this.createElement('div', {
            className: 'phase-filter-container'
        });
        
        for (let i = 1; i <= 5; i++) {
            const phaseBtn = this.createElement('button', {
                className: 'phase-btn',
                dataset: { phase: i.toString() }
            }, `${lang === 'es' ? 'Fase' : 'Phase'} ${i}`);
            
            phaseBtn.addEventListener('click', () => {
                // Toggle active state
                const isActive = phaseBtn.classList.contains('active');
                container.querySelectorAll('.phase-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                
                if (!isActive) {
                    phaseBtn.classList.add('active');
                    this.mobileFilters.phase = i.toString();
                } else {
                    this.mobileFilters.phase = '';
                }
                
                this.applyFilters();
            });
            
            container.appendChild(phaseBtn);
        }
        
        return container;
    }

    /**
     * Create duration filter
     * @param {string} lang - Current language
     * @returns {Element} Duration filter element
     */
    createDurationFilter(lang) {
        const container = this.createElement('div', {
            className: 'duration-filter-container'
        });
        
        const durations = [
            { key: 'short', label: lang === 'es' ? 'Corta (≤2h)' : 'Short (≤2h)' },
            { key: 'medium', label: lang === 'es' ? 'Media (2-5h)' : 'Medium (2-5h)' },
            { key: 'long', label: lang === 'es' ? 'Larga (>5h)' : 'Long (>5h)' }
        ];
        
        durations.forEach(duration => {
            const durationBtn = this.createElement('button', {
                className: 'duration-btn',
                dataset: { duration: duration.key }
            }, duration.label);
            
            durationBtn.addEventListener('click', () => {
                // Toggle active state
                const isActive = durationBtn.classList.contains('active');
                container.querySelectorAll('.duration-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                
                if (!isActive) {
                    durationBtn.classList.add('active');
                    this.mobileFilters.duration = duration.key;
                } else {
                    this.mobileFilters.duration = '';
                }
                
                this.applyFilters();
            });
            
            container.appendChild(durationBtn);
        });
        
        return container;
    }

    /**
     * Handle touch start for dragging
     * @param {TouchEvent} event - Touch event
     */
    onTouchStart(event) {
        this.bottomSheet.isDragging = true;
        this.bottomSheet.startY = event.touches[0].clientY;
        this.bottomSheet.currentY = this.bottomSheet.startY;
        
        // Disable transitions during drag
        this.elements.bottomSheet.style.transition = 'none';
    }

    /**
     * Handle touch move for dragging
     * @param {TouchEvent} event - Touch event
     */
    onTouchMove(event) {
        if (!this.bottomSheet.isDragging) return;
        
        event.preventDefault();
        
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - this.bottomSheet.startY;
        const newPosition = Math.max(0, Math.min(1, this.bottomSheet.position - (deltaY / this.bottomSheet.height)));
        
        this.setBottomSheetPosition(newPosition);
        this.bottomSheet.currentY = currentY;
    }

    /**
     * Handle touch end for dragging
     * @param {TouchEvent} event - Touch event
     */
    onTouchEnd(event) {
        if (!this.bottomSheet.isDragging) return;
        
        this.bottomSheet.isDragging = false;
        
        // Re-enable transitions
        this.elements.bottomSheet.style.transition = `transform ${this.config.animationDuration}ms ease-out`;
        
        // Calculate velocity
        const deltaY = this.bottomSheet.currentY - this.bottomSheet.startY;
        const velocity = Math.abs(deltaY) / this.config.animationDuration;
        
        // Determine snap position
        let targetPosition;
        if (velocity > 0.5) {
            // Fast swipe - snap in direction of movement
            targetPosition = deltaY > 0 ? 0 : 1;
        } else {
            // Slow drag - snap to nearest snap point
            targetPosition = this.findNearestSnapPoint(this.bottomSheet.position);
        }
        
        if (targetPosition === 0) {
            this.closeBottomSheet();
        } else {
            this.setBottomSheetPosition(targetPosition);
            this.bottomSheet.snapPosition = targetPosition;
        }
    }

    /**
     * Handle backdrop click
     */
    onBackdropClick() {
        this.closeBottomSheet();
    }

    /**
     * Find nearest snap point
     * @param {number} position - Current position
     * @returns {number} Nearest snap point
     */
    findNearestSnapPoint(position) {
        return this.config.snapPoints.reduce((nearest, snapPoint) => {
            return Math.abs(snapPoint - position) < Math.abs(nearest - position) ? snapPoint : nearest;
        });
    }

    /**
     * Set bottom sheet position
     * @param {number} position - Position (0-1)
     */
    setBottomSheetPosition(position) {
        this.bottomSheet.position = position;
        const translateY = (1 - position) * 100;
        
        this.elements.bottomSheet.style.transform = `translateY(${translateY}%)`;
        this.elements.backdrop.style.opacity = position * this.config.backdropOpacity;
    }

    /**
     * Open bottom sheet
     * @param {number} [position=0.7] - Target position
     */
    openBottomSheet(position = 0.7) {
        if (!this.elements.bottomSheet) {
            this.createBottomSheet();
        }
        
        this.bottomSheet.isOpen = true;
        this.bottomSheet.height = this.elements.bottomSheet.offsetHeight;
        
        // Show elements
        this.elements.backdrop.style.display = 'block';
        this.elements.bottomSheet.style.display = 'block';
        
        // Add body class to prevent scrolling
        document.body.classList.add('bottom-sheet-open');
        
        // Animate to open position
        requestAnimationFrame(() => {
            this.elements.bottomSheet.style.transition = `transform ${this.config.animationDuration}ms ease-out`;
            this.elements.backdrop.style.transition = `opacity ${this.config.animationDuration}ms ease-out`;
            
            this.setBottomSheetPosition(position);
            this.bottomSheet.snapPosition = position;
        });
        
        console.log('📱 Mobile filter bottom sheet opened');
    }

    /**
     * Close bottom sheet
     */
    closeBottomSheet() {
        if (!this.bottomSheet.isOpen) return;
        
        this.bottomSheet.isOpen = false;
        
        // Animate to closed position
        this.setBottomSheetPosition(0);
        
        // Hide elements after animation
        setTimeout(() => {
            this.elements.backdrop.style.display = 'none';
            this.elements.bottomSheet.style.display = 'none';
            document.body.classList.remove('bottom-sheet-open');
        }, this.config.animationDuration);
        
        console.log('📱 Mobile filter bottom sheet closed');
    }

    /**
     * Apply quick filter
     * @param {Object} filterValues - Filter values to apply
     */
    applyQuickFilter(filterValues) {
        Object.assign(this.mobileFilters, filterValues);
        this.applyFilters();
    }

    /**
     * Apply current filters
     */
    applyFilters() {
        const taskManager = window.madlabApp?.components?.get('tasks');
        if (!taskManager) return;
        
        // Update task manager filters
        Object.entries(this.mobileFilters).forEach(([key, value]) => {
            if (value) {
                taskManager.updateFilter(key, value);
            }
        });
    }

    /**
     * Handle search change
     */
    onSearchChange() {
        this.applyFilters();
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        // Reset mobile filters
        this.mobileFilters = {
            search: '',
            assignee: '',
            difficulty: '',
            phase: '',
            duration: ''
        };
        
        // Clear UI elements
        const searchInput = this.elements.content?.querySelector('.mobile-search-input');
        if (searchInput) searchInput.value = '';
        
        // Remove active states
        this.elements.content?.querySelectorAll('.active').forEach(element => {
            element.classList.remove('active');
        });
        
        // Clear task manager filters
        const taskManager = window.madlabApp?.components?.get('tasks');
        if (taskManager) {
            taskManager.clearFilters();
        }
        
        console.log('🧹 Mobile filters cleared');
    }

    /**
     * Update filters from external changes
     * @param {Object} filters - Current filters
     */
    updateFromExternalFilters(filters) {
        Object.assign(this.mobileFilters, filters);
        
        // Update UI to reflect changes
        if (this.elements.content) {
            const searchInput = this.elements.content.querySelector('.mobile-search-input');
            if (searchInput) searchInput.value = filters.search || '';
            
            // Update other filter UI elements...
        }
    }

    /**
     * Get translations helper
     * @param {string} lang - Language code
     * @returns {Object} Translations
     */
    getTranslations(lang) {
        const languageManager = window.madlabApp?.components?.get('language');
        return languageManager ? languageManager.getTranslations(lang) : {};
    }

    /**
     * Bind mobile filter events
     */
    bindEvents() {
        // Create filter trigger button if it doesn't exist
        this.createFilterTrigger();
        
        // Listen for responsive changes
        this.subscribeToState('viewport', (viewport) => {
            if (viewport.isMobile && !this.elements.bottomSheet) {
                this.createBottomSheet();
            } else if (!viewport.isMobile && this.bottomSheet.isOpen) {
                this.closeBottomSheet();
            }
        });
    }

    /**
     * Create filter trigger button for mobile
     */
    createFilterTrigger() {
        const existingTrigger = document.querySelector('.mobile-filter-trigger');
        if (existingTrigger) return;
        
        const filtersContainer = document.querySelector('.filters');
        if (!filtersContainer) return;
        
        const trigger = this.createElement('button', {
            className: 'mobile-filter-trigger btn btn-primary'
        }, '🔍 Filters');
        
        trigger.addEventListener('click', () => {
            this.openBottomSheet();
        });
        
        filtersContainer.appendChild(trigger);
        this.elements.trigger = trigger;
    }

    /**
     * Initialize on mount
     */
    onMount() {
        const viewport = this.state.getState('viewport');
        if (viewport?.isMobile) {
            this.createBottomSheet();
        }
        
        console.log('📱 MobileFilterManager initialized');
    }

    /**
     * Cleanup on unmount
     */
    onUnmount() {
        if (this.elements.bottomSheet) {
            this.elements.bottomSheet.remove();
        }
        
        if (this.elements.backdrop) {
            this.elements.backdrop.remove();
        }
        
        if (this.elements.trigger) {
            this.elements.trigger.remove();
        }
        
        document.body.classList.remove('bottom-sheet-open');
    }
}

export default MobileFilterManager;