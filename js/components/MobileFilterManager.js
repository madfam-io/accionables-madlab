// ==========================================================================
// MobileFilterManager - Mobile-Native Filter Interface
// ==========================================================================

import { Component } from './Component.js';

/**
 * MobileFilterManager provides a mobile-native bottom sheet interface
 * for filtering tasks with touch-friendly interactions
 */
export class MobileFilterManager extends Component {
    constructor(container, state) {
        super(container, state);
        
        this.bottomSheet = null;
        this.overlay = null;
        this.isOpen = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentY = 0;
        this.sheetHeight = 0;
        
        // Bottom sheet configuration
        this.config = {
            snapPoints: [0.25, 0.5, 0.85], // Percentage of screen height
            currentSnapPoint: 0.5,
            minHeight: 200,
            maxHeight: window.innerHeight * 0.85,
            dragThreshold: 50,
            animationDuration: 300
        };
        
        // Filter state
        this.filters = {
            search: '',
            team: '',
            difficulty: '',
            phase: '',
            duration: ''
        };
        
        this.activeFilters = new Set();
        
        // Bind methods
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialize mobile filter manager
     */
    mount() {
        this.createBottomSheet();
        this.bindEvents();
        this.setupResponsiveDetection();
        
        console.log('📱 MobileFilterManager initialized');
    }

    /**
     * Create bottom sheet structure
     */
    createBottomSheet() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'filter-bottom-sheet-overlay';
        
        // Create bottom sheet
        this.bottomSheet = document.createElement('div');
        this.bottomSheet.className = 'filter-bottom-sheet';
        
        // Create handle
        const handle = document.createElement('div');
        handle.className = 'bottom-sheet-handle';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'bottom-sheet-header';
        header.innerHTML = `
            <h3 class="sheet-title" data-es="Filtros" data-en="Filters">Filtros</h3>
            <button class="sheet-close-btn" aria-label="Close filters">
                <span>×</span>
            </button>
        `;
        
        // Create content
        const content = document.createElement('div');
        content.className = 'bottom-sheet-content';
        content.innerHTML = this.createFilterContent();
        
        // Create footer
        const footer = document.createElement('div');
        footer.className = 'bottom-sheet-footer';
        footer.innerHTML = `
            <button class="btn btn-outline clear-filters-btn" data-es="Limpiar todo" data-en="Clear all">
                Limpiar todo
            </button>
            <button class="btn btn-primary apply-filters-btn" data-es="Aplicar filtros" data-en="Apply filters">
                Aplicar filtros
            </button>
        `;
        
        // Assemble bottom sheet
        this.bottomSheet.appendChild(handle);
        this.bottomSheet.appendChild(header);
        this.bottomSheet.appendChild(content);
        this.bottomSheet.appendChild(footer);
        
        // Add to overlay
        this.overlay.appendChild(this.bottomSheet);
        
        // Initially hidden
        this.overlay.style.display = 'none';
        document.body.appendChild(this.overlay);
    }

    /**
     * Create filter content HTML
     */
    createFilterContent() {
        return `
            <div class="filter-section">
                <label class="filter-label" data-es="Buscar tareas" data-en="Search tasks">Buscar tareas</label>
                <div class="search-input-wrapper">
                    <input type="text" class="mobile-search-input" placeholder="Escribe para buscar..." data-filter="search">
                    <button class="search-clear-btn" style="display: none;">×</button>
                </div>
            </div>
            
            <div class="filter-section">
                <label class="filter-label" data-es="Miembro del equipo" data-en="Team member">Miembro del equipo</label>
                <div class="filter-chips-container" data-filter-type="team">
                    <div class="filter-chip" data-value="">
                        <span data-es="Todos" data-en="All">Todos</span>
                    </div>
                    <div class="filter-chip" data-value="Aldo">
                        <span>Aldo</span>
                    </div>
                    <div class="filter-chip" data-value="Nuri">
                        <span>Nuri</span>
                    </div>
                    <div class="filter-chip" data-value="Luis">
                        <span>Luis</span>
                    </div>
                    <div class="filter-chip" data-value="Silvia">
                        <span>Silvia</span>
                    </div>
                    <div class="filter-chip" data-value="Caro">
                        <span>Caro</span>
                    </div>
                    <div class="filter-chip" data-value="All">
                        <span data-es="Equipo Completo" data-en="Full Team">Equipo Completo</span>
                    </div>
                </div>
            </div>
            
            <div class="filter-section">
                <label class="filter-label" data-es="Dificultad" data-en="Difficulty">Dificultad</label>
                <div class="filter-chips-container" data-filter-type="difficulty">
                    <div class="filter-chip" data-value="">
                        <span data-es="Todas" data-en="All">Todas</span>
                    </div>
                    <div class="filter-chip" data-value="1">
                        <span>⭐ Nivel 1</span>
                    </div>
                    <div class="filter-chip" data-value="2">
                        <span>⭐⭐ Nivel 2</span>
                    </div>
                    <div class="filter-chip" data-value="3">
                        <span>⭐⭐⭐ Nivel 3</span>
                    </div>
                    <div class="filter-chip" data-value="4">
                        <span>⭐⭐⭐⭐ Nivel 4</span>
                    </div>
                    <div class="filter-chip" data-value="5">
                        <span>⭐⭐⭐⭐⭐ Nivel 5</span>
                    </div>
                </div>
            </div>
            
            <div class="filter-section">
                <label class="filter-label" data-es="Fase del proyecto" data-en="Project phase">Fase del proyecto</label>
                <div class="filter-chips-container" data-filter-type="phase">
                    <div class="filter-chip" data-value="">
                        <span data-es="Todas las fases" data-en="All phases">Todas las fases</span>
                    </div>
                    <div class="filter-chip" data-value="1">
                        <span data-es="Fase 1: Fundación" data-en="Phase 1: Foundation">Fase 1: Fundación</span>
                    </div>
                    <div class="filter-chip" data-value="2">
                        <span data-es="Fase 2: Desarrollo" data-en="Phase 2: Development">Fase 2: Desarrollo</span>
                    </div>
                    <div class="filter-chip" data-value="3">
                        <span data-es="Fase 3: Piloto Prep" data-en="Phase 3: Pilot Prep">Fase 3: Piloto Prep</span>
                    </div>
                    <div class="filter-chip" data-value="4">
                        <span data-es="Fase 4: Piloto" data-en="Phase 4: Pilot">Fase 4: Piloto</span>
                    </div>
                    <div class="filter-chip" data-value="5">
                        <span data-es="Fase 5: Lanzamiento" data-en="Phase 5: Launch">Fase 5: Lanzamiento</span>
                    </div>
                </div>
            </div>
            
            <div class="filter-section">
                <label class="filter-label" data-es="Duración" data-en="Duration">Duración</label>
                <div class="filter-chips-container" data-filter-type="duration">
                    <div class="filter-chip" data-value="">
                        <span data-es="Toda duración" data-en="All durations">Toda duración</span>
                    </div>
                    <div class="filter-chip" data-value="short">
                        <span data-es="Corta (≤2h)" data-en="Short (≤2h)">Corta (≤2h)</span>
                    </div>
                    <div class="filter-chip" data-value="medium">
                        <span data-es="Media (2-5h)" data-en="Medium (2-5h)">Media (2-5h)</span>
                    </div>
                    <div class="filter-chip" data-value="long">
                        <span data-es="Larga (>5h)" data-en="Long (>5h)">Larga (>5h)</span>
                    </div>
                </div>
            </div>
            
            <div class="active-filters-section">
                <label class="filter-label" data-es="Filtros activos" data-en="Active filters">Filtros activos</label>
                <div class="active-filters-container"></div>
            </div>
        `;
    }

    /**
     * Bind events
     */
    bindEvents() {
        // Touch events for dragging
        const handle = this.bottomSheet.querySelector('.bottom-sheet-handle');
        const header = this.bottomSheet.querySelector('.bottom-sheet-header');
        
        [handle, header].forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
            element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            element.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        });
        
        // Close button
        const closeBtn = this.bottomSheet.querySelector('.sheet-close-btn');
        closeBtn.addEventListener('click', () => this.close());
        
        // Overlay click to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Filter chips
        const filterChips = this.bottomSheet.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', this.handleFilterChange);
        });
        
        // Search input
        const searchInput = this.bottomSheet.querySelector('.mobile-search-input');
        searchInput.addEventListener('input', this.handleFilterChange);
        
        // Search clear button
        const searchClearBtn = this.bottomSheet.querySelector('.search-clear-btn');
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchClearBtn.style.display = 'none';
            this.handleFilterChange();
        });
        
        // Footer buttons
        const clearBtn = this.bottomSheet.querySelector('.clear-filters-btn');
        const applyBtn = this.bottomSheet.querySelector('.apply-filters-btn');
        
        clearBtn.addEventListener('click', () => this.clearAllFilters());
        applyBtn.addEventListener('click', () => this.applyFilters());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Resize handling
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Setup responsive detection
     */
    setupResponsiveDetection() {
        // Listen for breakpoint changes from ResponsiveManager
        window.addEventListener('breakpointchange', (e) => {
            const { current } = e.detail;
            this.updateForBreakpoint(current);
        });
        
        // Initial setup
        this.updateForBreakpoint(this.getCurrentBreakpoint());
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        if (width < 1400) return 'xl';
        return 'xxl';
    }

    /**
     * Update for breakpoint change
     */
    updateForBreakpoint(breakpoint) {
        const isMobile = ['xs', 'sm'].includes(breakpoint);
        
        if (isMobile) {
            this.enableMobileFilters();
        } else {
            this.disableMobileFilters();
        }
    }

    /**
     * Enable mobile filter interface
     */
    enableMobileFilters() {
        // Hide desktop filters
        const desktopFilters = document.querySelector('.filters');
        if (desktopFilters) {
            desktopFilters.style.display = 'none';
        }
        
        // Show mobile filter trigger
        this.createMobileFilterTrigger();
    }

    /**
     * Disable mobile filter interface
     */
    disableMobileFilters() {
        // Show desktop filters
        const desktopFilters = document.querySelector('.filters');
        if (desktopFilters) {
            desktopFilters.style.display = '';
        }
        
        // Hide mobile filter trigger
        this.removeMobileFilterTrigger();
        
        // Close if open
        if (this.isOpen) {
            this.close();
        }
    }

    /**
     * Create mobile filter trigger button
     */
    createMobileFilterTrigger() {
        let trigger = document.getElementById('mobile-filter-trigger');
        
        if (!trigger) {
            trigger = document.createElement('button');
            trigger.id = 'mobile-filter-trigger';
            trigger.className = 'mobile-filter-trigger';
            trigger.innerHTML = `
                <span class="filter-icon">🔍</span>
                <span class="filter-text" data-es="Filtros" data-en="Filters">Filtros</span>
                <span class="active-count" style="display: none;">0</span>
            `;
            
            trigger.addEventListener('click', () => this.open());
            
            // Insert after hero section
            const hero = document.querySelector('.hero');
            if (hero && hero.nextSibling) {
                hero.parentNode.insertBefore(trigger, hero.nextSibling);
            } else {
                document.querySelector('.container').appendChild(trigger);
            }
        }
    }

    /**
     * Remove mobile filter trigger
     */
    removeMobileFilterTrigger() {
        const trigger = document.getElementById('mobile-filter-trigger');
        if (trigger) {
            trigger.remove();
        }
    }

    /**
     * Handle touch start for dragging
     */
    handleTouchStart(e) {
        this.isDragging = true;
        this.startY = e.touches[0].clientY;
        this.currentY = this.startY;
        
        this.bottomSheet.style.transition = 'none';
    }

    /**
     * Handle touch move for dragging
     */
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentY = e.touches[0].clientY;
        const deltaY = this.currentY - this.startY;
        
        // Only allow dragging down when at top snap point
        if (deltaY > 0) {
            const currentHeight = this.sheetHeight;
            const newHeight = Math.max(
                this.config.minHeight,
                currentHeight - deltaY
            );
            
            this.setSheetHeight(newHeight);
        }
    }

    /**
     * Handle touch end for snap points
     */
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.bottomSheet.style.transition = `transform ${this.config.animationDuration}ms ease-out`;
        
        const deltaY = this.currentY - this.startY;
        const velocity = Math.abs(deltaY) / 100; // Simple velocity calculation
        
        // Determine snap point based on position and velocity
        if (deltaY > this.config.dragThreshold || velocity > 1.5) {
            // Drag down - close or go to lower snap point
            if (this.config.currentSnapPoint === 0.25) {
                this.close();
            } else {
                this.snapTo(0.25);
            }
        } else if (deltaY < -this.config.dragThreshold) {
            // Drag up - go to higher snap point
            if (this.config.currentSnapPoint < 0.85) {
                this.snapTo(0.85);
            }
        } else {
            // Return to current snap point
            this.snapTo(this.config.currentSnapPoint);
        }
    }

    /**
     * Handle filter changes
     */
    handleFilterChange(e) {
        const target = e.target;
        
        if (target.classList.contains('filter-chip')) {
            this.handleChipSelection(target);
        } else if (target.classList.contains('mobile-search-input')) {
            this.handleSearchInput(target);
        }
        
        this.updateActiveFilters();
        this.updateFilterCount();
    }

    /**
     * Handle chip selection
     */
    handleChipSelection(chip) {
        const container = chip.closest('.filter-chips-container');
        const filterType = container.dataset.filterType;
        const value = chip.dataset.value;
        
        // Remove active state from siblings
        container.querySelectorAll('.filter-chip').forEach(c => {
            c.classList.remove('active');
        });
        
        // Add active state to selected chip
        chip.classList.add('active');
        
        // Update filter state
        this.filters[filterType] = value;
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(25);
        }
    }

    /**
     * Handle search input
     */
    handleSearchInput(input) {
        this.filters.search = input.value;
        
        // Show/hide clear button
        const clearBtn = input.parentNode.querySelector('.search-clear-btn');
        clearBtn.style.display = input.value ? 'block' : 'none';
    }

    /**
     * Update active filters display
     */
    updateActiveFilters() {
        const container = this.bottomSheet.querySelector('.active-filters-container');
        container.innerHTML = '';
        
        // Add active filter chips
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value && key !== 'search') {
                const chip = document.createElement('div');
                chip.className = 'active-filter-chip';
                chip.innerHTML = `
                    <span>${this.getFilterDisplayName(key, value)}</span>
                    <button class="remove-filter" data-filter="${key}">×</button>
                `;
                
                container.appendChild(chip);
            }
        });
        
        // Add search filter if present
        if (this.filters.search) {
            const chip = document.createElement('div');
            chip.className = 'active-filter-chip';
            chip.innerHTML = `
                <span>"${this.filters.search}"</span>
                <button class="remove-filter" data-filter="search">×</button>
            `;
            
            container.appendChild(chip);
        }
        
        // Bind remove buttons
        container.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterKey = e.target.dataset.filter;
                this.removeFilter(filterKey);
            });
        });
        
        // Show/hide section
        const section = container.closest('.active-filters-section');
        section.style.display = container.children.length > 0 ? 'block' : 'none';
    }

    /**
     * Get display name for filter
     */
    getFilterDisplayName(key, value) {
        const displayNames = {
            team: {
                'Aldo': 'Aldo',
                'Nuri': 'Nuri',
                'Luis': 'Luis',
                'Silvia': 'Silvia',
                'Caro': 'Caro',
                'All': 'Equipo Completo'
            },
            difficulty: {
                '1': 'Nivel 1',
                '2': 'Nivel 2',
                '3': 'Nivel 3',
                '4': 'Nivel 4',
                '5': 'Nivel 5'
            },
            phase: {
                '1': 'Fase 1',
                '2': 'Fase 2',
                '3': 'Fase 3',
                '4': 'Fase 4',
                '5': 'Fase 5'
            },
            duration: {
                'short': 'Corta (≤2h)',
                'medium': 'Media (2-5h)',
                'long': 'Larga (>5h)'
            }
        };
        
        return displayNames[key]?.[value] || value;
    }

    /**
     * Remove specific filter
     */
    removeFilter(filterKey) {
        this.filters[filterKey] = '';
        
        // Update UI
        if (filterKey === 'search') {
            const searchInput = this.bottomSheet.querySelector('.mobile-search-input');
            searchInput.value = '';
            const clearBtn = searchInput.parentNode.querySelector('.search-clear-btn');
            clearBtn.style.display = 'none';
        } else {
            const container = this.bottomSheet.querySelector(`[data-filter-type="${filterKey}"]`);
            container.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.remove('active');
            });
            // Activate "All" option
            const allChip = container.querySelector('[data-value=""]');
            if (allChip) {
                allChip.classList.add('active');
            }
        }
        
        this.updateActiveFilters();
        this.updateFilterCount();
    }

    /**
     * Update filter count in trigger
     */
    updateFilterCount() {
        const count = Object.values(this.filters).filter(v => v !== '').length;
        const trigger = document.getElementById('mobile-filter-trigger');
        
        if (trigger) {
            const countElement = trigger.querySelector('.active-count');
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'inline' : 'none';
            
            trigger.classList.toggle('has-filters', count > 0);
        }
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        Object.keys(this.filters).forEach(key => {
            this.filters[key] = '';
        });
        
        // Reset UI
        this.bottomSheet.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        
        // Activate all "All" options
        this.bottomSheet.querySelectorAll('[data-value=""]').forEach(chip => {
            chip.classList.add('active');
        });
        
        // Clear search
        const searchInput = this.bottomSheet.querySelector('.mobile-search-input');
        searchInput.value = '';
        const clearBtn = searchInput.parentNode.querySelector('.search-clear-btn');
        clearBtn.style.display = 'none';
        
        this.updateActiveFilters();
        this.updateFilterCount();
    }

    /**
     * Apply filters
     */
    applyFilters() {
        // Emit filter change event
        window.dispatchEvent(new CustomEvent('mobilefiltersapplied', {
            detail: { filters: { ...this.filters } }
        }));
        
        // Apply to desktop filters for consistency
        this.syncToDesktopFilters();
        
        // Close sheet
        this.close();
        
        // Show success feedback
        this.showApplyFeedback();
    }

    /**
     * Sync filters to desktop interface
     */
    syncToDesktopFilters() {
        const desktopFilters = document.querySelector('.filters');
        if (!desktopFilters) return;
        
        // Sync search
        const searchBox = desktopFilters.querySelector('#searchBox');
        if (searchBox) {
            searchBox.value = this.filters.search;
        }
        
        // Sync select elements
        Object.entries(this.filters).forEach(([key, value]) => {
            if (key === 'search') return;
            
            const selectId = key + 'Filter';
            const select = document.getElementById(selectId);
            if (select) {
                select.value = value;
            }
        });
        
        // Trigger filter update in TaskManager
        if (window.madlabApp?.components?.get('tasks')) {
            window.madlabApp.components.get('tasks').applyFilters();
        }
    }

    /**
     * Show apply feedback
     */
    showApplyFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'filter-apply-feedback';
        feedback.textContent = '✓ Filtros aplicados';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('visible');
        }, 100);
        
        setTimeout(() => {
            feedback.classList.remove('visible');
            setTimeout(() => {
                if (document.body.contains(feedback)) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    /**
     * Open bottom sheet
     */
    open() {
        this.isOpen = true;
        this.overlay.style.display = 'block';
        
        // Force reflow
        this.overlay.offsetHeight;
        
        // Add active classes
        this.overlay.classList.add('active');
        this.bottomSheet.classList.add('active');
        
        // Snap to default position
        setTimeout(() => {
            this.snapTo(this.config.currentSnapPoint);
        }, 50);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Emit event
        window.dispatchEvent(new CustomEvent('mobilefiltersopen'));
        
        // Focus first input for accessibility
        const firstInput = this.bottomSheet.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    /**
     * Close bottom sheet
     */
    close() {
        this.isOpen = false;
        
        this.overlay.classList.remove('active');
        this.bottomSheet.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, this.config.animationDuration);
        
        // Emit event
        window.dispatchEvent(new CustomEvent('mobilefiltersclose'));
    }

    /**
     * Snap to specific point
     */
    snapTo(snapPoint) {
        this.config.currentSnapPoint = snapPoint;
        const height = window.innerHeight * snapPoint;
        this.setSheetHeight(height);
    }

    /**
     * Set sheet height
     */
    setSheetHeight(height) {
        this.sheetHeight = Math.max(
            this.config.minHeight,
            Math.min(height, this.config.maxHeight)
        );
        
        this.bottomSheet.style.height = `${this.sheetHeight}px`;
        this.bottomSheet.style.transform = `translateY(${window.innerHeight - this.sheetHeight}px)`;
    }

    /**
     * Handle resize
     */
    handleResize() {
        if (this.isOpen) {
            this.config.maxHeight = window.innerHeight * 0.85;
            this.snapTo(this.config.currentSnapPoint);
        }
    }

    /**
     * Get current filters
     */
    getCurrentFilters() {
        return { ...this.filters };
    }

    /**
     * Set filters programmatically
     */
    setFilters(newFilters) {
        Object.assign(this.filters, newFilters);
        this.updateUI();
    }

    /**
     * Update UI to reflect current filters
     */
    updateUI() {
        // Update chips
        Object.entries(this.filters).forEach(([key, value]) => {
            if (key === 'search') {
                const searchInput = this.bottomSheet.querySelector('.mobile-search-input');
                if (searchInput) {
                    searchInput.value = value;
                }
            } else {
                const container = this.bottomSheet.querySelector(`[data-filter-type="${key}"]`);
                if (container) {
                    container.querySelectorAll('.filter-chip').forEach(chip => {
                        chip.classList.toggle('active', chip.dataset.value === value);
                    });
                }
            }
        });
        
        this.updateActiveFilters();
        this.updateFilterCount();
    }

    /**
     * Unmount and cleanup
     */
    unmount() {
        window.removeEventListener('resize', this.handleResize);
        
        if (this.overlay) {
            this.overlay.remove();
        }
        
        this.removeMobileFilterTrigger();
        
        // Restore desktop filters
        const desktopFilters = document.querySelector('.filters');
        if (desktopFilters) {
            desktopFilters.style.display = '';
        }
        
        console.log('📱 MobileFilterManager unmounted');
    }

    /**
     * Get component status
     */
    getStatus() {
        return {
            mounted: this.mounted,
            isOpen: this.isOpen,
            currentSnapPoint: this.config.currentSnapPoint,
            activeFilters: Object.values(this.filters).filter(v => v !== '').length
        };
    }
}