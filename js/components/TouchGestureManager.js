// ==========================================================================
// TouchGestureManager - Advanced Touch Gesture Recognition
// ==========================================================================

import { Component } from './Component.js';

/**
 * TouchGestureManager handles all touch gestures including swipe, long-press,
 * pull-to-refresh, and other mobile interactions
 */
export class TouchGestureManager extends Component {
    constructor(container, state) {
        super(container, state);
        
        this.gestures = {
            swipe: new Map(),
            longPress: new Map(),
            pullToRefresh: new Map(),
            tap: new Map(),
            doubleTap: new Map()
        };
        
        this.currentTouch = null;
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.lastTapTime = 0;
        this.tapCount = 0;
        
        // Gesture thresholds
        this.thresholds = {
            swipeMinDistance: 50,
            swipeMaxTime: 1000,
            longPressTime: 500,
            doubleTapMaxTime: 300,
            pullToRefreshDistance: 80,
            tapMaxDistance: 10,
            tapMaxTime: 250
        };
        
        // Pull-to-refresh state
        this.pullToRefresh = {
            active: false,
            startY: 0,
            currentY: 0,
            threshold: 80,
            maxDistance: 150,
            element: null,
            indicator: null,
            isRefreshing: false
        };
        
        // Bind methods
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchCancel = this.handleTouchCancel.bind(this);
    }

    /**
     * Initialize touch gesture manager
     */
    mount() {
        try {
            this.bindEvents();
            this.createPullToRefreshIndicator();
            this.enableTouchCallout();
            
            console.log('👆 TouchGestureManager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize TouchGestureManager:', error);
            throw error;
        }
    }

    /**
     * Bind touch events
     */
    bindEvents() {
        // Use passive listeners for better performance
        if (!this.container) {
            console.warn('TouchGestureManager: No container element provided, skipping event binding');
            return;
        }
        
        this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        this.container.addEventListener('touchcancel', this.handleTouchCancel, { passive: true });
        
        // Prevent default context menu on long press
        this.container.addEventListener('contextmenu', (e) => {
            if (this.currentTouch) {
                e.preventDefault();
            }
        });
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.currentTouch = {
                id: touch.identifier,
                startX: touch.clientX,
                startY: touch.clientY,
                currentX: touch.clientX,
                currentY: touch.clientY,
                startTime: Date.now(),
                element: e.target
            };
            
            this.touchStartTime = Date.now();
            this.touchStartPos = { x: touch.clientX, y: touch.clientY };
            
            // Check for pull-to-refresh
            this.checkPullToRefreshStart(touch);
            
            // Start long press timer
            this.startLongPressTimer(e.target, touch);
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        if (!this.currentTouch || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        if (touch.identifier !== this.currentTouch.id) return;
        
        this.currentTouch.currentX = touch.clientX;
        this.currentTouch.currentY = touch.clientY;
        
        // Handle pull-to-refresh
        if (this.pullToRefresh.active) {
            this.handlePullToRefreshMove(touch);
            e.preventDefault();
        }
        
        // Cancel long press if moved too far
        const distance = this.getDistance(this.touchStartPos, { x: touch.clientX, y: touch.clientY });
        if (distance > this.thresholds.tapMaxDistance) {
            this.cancelLongPress();
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (!this.currentTouch) return;
        
        const touchDuration = Date.now() - this.touchStartTime;
        const distance = this.getDistance(this.touchStartPos, this.currentTouch);
        
        // Handle pull-to-refresh
        if (this.pullToRefresh.active) {
            this.handlePullToRefreshEnd();
        }
        // Handle swipe gesture
        else if (distance >= this.thresholds.swipeMinDistance && touchDuration <= this.thresholds.swipeMaxTime) {
            this.handleSwipe();
        }
        // Handle tap gestures
        else if (distance <= this.thresholds.tapMaxDistance && touchDuration <= this.thresholds.tapMaxTime) {
            this.handleTap();
        }
        
        this.cancelLongPress();
        this.currentTouch = null;
    }

    /**
     * Handle touch cancel
     */
    handleTouchCancel(e) {
        this.cancelLongPress();
        this.handlePullToRefreshCancel();
        this.currentTouch = null;
    }

    /**
     * Calculate distance between two points
     */
    getDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Get swipe direction
     */
    getSwipeDirection() {
        if (!this.currentTouch) return null;
        
        const deltaX = this.currentTouch.currentX - this.currentTouch.startX;
        const deltaY = this.currentTouch.currentY - this.currentTouch.startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        if (absDeltaX > absDeltaY) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const direction = this.getSwipeDirection();
        const element = this.currentTouch.element;
        
        // Emit swipe event
        this.emitGestureEvent('swipe', {
            direction,
            element,
            startPos: { x: this.currentTouch.startX, y: this.currentTouch.startY },
            endPos: { x: this.currentTouch.currentX, y: this.currentTouch.currentY },
            distance: this.getDistance(this.touchStartPos, this.currentTouch)
        });
        
        // Handle specific swipe actions
        this.handleSwipeActions(direction, element);
    }

    /**
     * Handle swipe actions
     */
    handleSwipeActions(direction, element) {
        // Swipe to collapse/expand phases
        const phaseHeader = element.closest('.phase-header');
        if (phaseHeader) {
            if (direction === 'left') {
                const phaseElement = phaseHeader.closest('.phase');
                const phaseNum = phaseElement?.dataset.phase;
                if (phaseNum && window.madlabApp) {
                    window.madlabApp.togglePhase(phaseNum);
                }
            }
        }
        
        // Swipe to dismiss modals
        const modal = element.closest('.modal');
        if (modal && direction === 'down') {
            this.dismissModal(modal);
        }
        
        // Swipe to navigate filters on mobile
        const filterContainer = element.closest('.filters');
        if (filterContainer && ['left', 'right'].includes(direction)) {
            this.navigateFilters(direction);
        }
    }

    /**
     * Handle tap gesture
     */
    handleTap() {
        const now = Date.now();
        const element = this.currentTouch.element;
        
        // Check for double tap
        if (now - this.lastTapTime <= this.thresholds.doubleTapMaxTime) {
            this.tapCount++;
            if (this.tapCount === 2) {
                this.handleDoubleTap(element);
                this.tapCount = 0;
                return;
            }
        } else {
            this.tapCount = 1;
        }
        
        this.lastTapTime = now;
        
        // Single tap after delay to ensure it's not a double tap
        setTimeout(() => {
            if (this.tapCount === 1) {
                this.handleSingleTap(element);
                this.tapCount = 0;
            }
        }, this.thresholds.doubleTapMaxTime);
    }

    /**
     * Handle single tap
     */
    handleSingleTap(element) {
        this.emitGestureEvent('tap', {
            element,
            pos: { x: this.currentTouch.currentX, y: this.currentTouch.currentY }
        });
        
        // Add tap feedback
        this.addTapFeedback(element);
    }

    /**
     * Handle double tap
     */
    handleDoubleTap(element) {
        this.emitGestureEvent('doubletap', {
            element,
            pos: { x: this.currentTouch.currentX, y: this.currentTouch.currentY }
        });
        
        // Double tap to expand task details
        const taskCard = element.closest('.task-card');
        if (taskCard) {
            this.toggleTaskDetails(taskCard);
        }
    }

    /**
     * Start long press timer
     */
    startLongPressTimer(element, touch) {
        this.longPressTimer = setTimeout(() => {
            if (this.currentTouch) {
                this.handleLongPress(element, touch);
            }
        }, this.thresholds.longPressTime);
    }

    /**
     * Cancel long press timer
     */
    cancelLongPress() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    /**
     * Handle long press
     */
    handleLongPress(element, touch) {
        this.emitGestureEvent('longpress', {
            element,
            pos: { x: touch.clientX, y: touch.clientY }
        });
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Show context menu for task cards
        const taskCard = element.closest('.task-card');
        if (taskCard) {
            this.showTaskContextMenu(taskCard, { x: touch.clientX, y: touch.clientY });
        }
    }

    /**
     * Check if pull-to-refresh should start
     */
    checkPullToRefreshStart(touch) {
        const isAtTop = window.scrollY === 0;
        const container = document.querySelector('.container');
        
        if (isAtTop && container && touch.clientY < 100) {
            this.pullToRefresh.active = true;
            this.pullToRefresh.startY = touch.clientY;
            this.pullToRefresh.element = container;
            this.showPullToRefreshIndicator();
        }
    }

    /**
     * Handle pull-to-refresh move
     */
    handlePullToRefreshMove(touch) {
        const distance = Math.max(0, touch.clientY - this.pullToRefresh.startY);
        this.pullToRefresh.currentY = Math.min(distance, this.pullToRefresh.maxDistance);
        
        this.updatePullToRefreshIndicator(this.pullToRefresh.currentY);
        
        // Add elastic resistance
        if (this.pullToRefresh.element) {
            const transform = `translateY(${this.pullToRefresh.currentY * 0.5}px)`;
            this.pullToRefresh.element.style.transform = transform;
        }
    }

    /**
     * Handle pull-to-refresh end
     */
    handlePullToRefreshEnd() {
        const shouldRefresh = this.pullToRefresh.currentY >= this.pullToRefresh.threshold;
        
        if (shouldRefresh && !this.pullToRefresh.isRefreshing) {
            this.triggerRefresh();
        } else {
            this.cancelPullToRefresh();
        }
    }

    /**
     * Handle pull-to-refresh cancel
     */
    handlePullToRefreshCancel() {
        this.cancelPullToRefresh();
    }

    /**
     * Trigger refresh action
     */
    triggerRefresh() {
        this.pullToRefresh.isRefreshing = true;
        this.updatePullToRefreshIndicator(this.pullToRefresh.threshold, true);
        
        this.emitGestureEvent('refresh', {
            element: this.pullToRefresh.element
        });
        
        // Simulate refresh action
        setTimeout(() => {
            this.completeRefresh();
        }, 1500);
    }

    /**
     * Complete refresh action
     */
    completeRefresh() {
        this.pullToRefresh.isRefreshing = false;
        this.cancelPullToRefresh();
        
        // Show success feedback
        this.showRefreshSuccess();
    }

    /**
     * Cancel pull-to-refresh
     */
    cancelPullToRefresh() {
        this.pullToRefresh.active = false;
        this.pullToRefresh.currentY = 0;
        
        if (this.pullToRefresh.element) {
            this.pullToRefresh.element.style.transform = '';
            this.pullToRefresh.element.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                if (this.pullToRefresh.element) {
                    this.pullToRefresh.element.style.transition = '';
                }
            }, 300);
        }
        
        this.hidePullToRefreshIndicator();
    }

    /**
     * Create pull-to-refresh indicator
     */
    createPullToRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh-indicator';
        indicator.innerHTML = `
            <div class="pull-indicator-content">
                <div class="pull-spinner"></div>
                <span class="pull-text">Pull to refresh</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.pullToRefresh.indicator = indicator;
    }

    /**
     * Show pull-to-refresh indicator
     */
    showPullToRefreshIndicator() {
        if (this.pullToRefresh.indicator) {
            this.pullToRefresh.indicator.classList.add('visible');
        }
    }

    /**
     * Update pull-to-refresh indicator
     */
    updatePullToRefreshIndicator(distance, isRefreshing = false) {
        if (!this.pullToRefresh.indicator) return;
        
        const progress = Math.min(distance / this.pullToRefresh.threshold, 1);
        const indicator = this.pullToRefresh.indicator;
        const spinner = indicator.querySelector('.pull-spinner');
        const text = indicator.querySelector('.pull-text');
        
        // Update position
        indicator.style.transform = `translateY(${distance}px)`;
        
        // Update spinner rotation
        if (spinner) {
            if (isRefreshing) {
                spinner.style.animation = 'spin 1s linear infinite';
                text.textContent = 'Refreshing...';
            } else {
                spinner.style.transform = `rotate(${progress * 360}deg)`;
                text.textContent = progress >= 1 ? 'Release to refresh' : 'Pull to refresh';
            }
        }
        
        // Update opacity
        indicator.style.opacity = Math.min(progress + 0.3, 1);
    }

    /**
     * Hide pull-to-refresh indicator
     */
    hidePullToRefreshIndicator() {
        if (this.pullToRefresh.indicator) {
            this.pullToRefresh.indicator.classList.remove('visible');
            setTimeout(() => {
                if (this.pullToRefresh.indicator) {
                    this.pullToRefresh.indicator.style.transform = '';
                    this.pullToRefresh.indicator.style.opacity = '';
                }
            }, 300);
        }
    }

    /**
     * Show refresh success feedback
     */
    showRefreshSuccess() {
        const toast = document.createElement('div');
        toast.className = 'refresh-toast';
        toast.textContent = '✓ Refreshed successfully';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('visible');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    /**
     * Add tap feedback to element
     */
    addTapFeedback(element) {
        const feedback = document.createElement('div');
        feedback.className = 'tap-feedback';
        
        const rect = element.getBoundingClientRect();
        feedback.style.left = `${this.currentTouch.currentX - rect.left}px`;
        feedback.style.top = `${this.currentTouch.currentY - rect.top}px`;
        
        element.style.position = 'relative';
        element.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('animate');
        }, 10);
        
        setTimeout(() => {
            if (element.contains(feedback)) {
                element.removeChild(feedback);
            }
        }, 600);
    }

    /**
     * Toggle task details
     */
    toggleTaskDetails(taskCard) {
        const details = taskCard.querySelector('.task-details');
        if (details) {
            details.classList.toggle('collapsed');
        }
    }

    /**
     * Show task context menu
     */
    showTaskContextMenu(taskCard, pos) {
        // Remove existing context menu
        const existingMenu = document.querySelector('.task-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'task-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="details">View Details</div>
            <div class="context-menu-item" data-action="copy">Copy Task</div>
            <div class="context-menu-item" data-action="share">Share Task</div>
        `;
        
        menu.style.left = `${pos.x}px`;
        menu.style.top = `${pos.y}px`;
        
        document.body.appendChild(menu);
        
        // Add click handlers
        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleContextMenuAction(action, taskCard);
                menu.remove();
            }
        });
        
        // Remove menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                if (menu.parentNode) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);
    }

    /**
     * Handle context menu actions
     */
    handleContextMenuAction(action, taskCard) {
        switch (action) {
            case 'details':
                this.toggleTaskDetails(taskCard);
                break;
            case 'copy':
                this.copyTaskToClipboard(taskCard);
                break;
            case 'share':
                this.shareTask(taskCard);
                break;
        }
    }

    /**
     * Copy task to clipboard
     */
    copyTaskToClipboard(taskCard) {
        const taskName = taskCard.querySelector('.task-name')?.textContent || '';
        const taskId = taskCard.querySelector('.task-id')?.textContent || '';
        
        const text = `${taskId}: ${taskName}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Task copied to clipboard');
            });
        }
    }

    /**
     * Share task
     */
    shareTask(taskCard) {
        const taskName = taskCard.querySelector('.task-name')?.textContent || '';
        const taskId = taskCard.querySelector('.task-id')?.textContent || '';
        
        if (navigator.share) {
            navigator.share({
                title: 'MADLAB Task',
                text: `${taskId}: ${taskName}`,
                url: window.location.href
            });
        }
    }

    /**
     * Dismiss modal with animation
     */
    dismissModal(modal) {
        modal.style.animation = 'modalSlideOut 0.3s ease forwards';
        setTimeout(() => {
            const overlay = modal.closest('.modal-overlay');
            if (overlay) {
                overlay.remove();
            }
        }, 300);
    }

    /**
     * Navigate filters
     */
    navigateFilters(direction) {
        // Implementation for filter navigation
        this.emitGestureEvent('filternavigation', { direction });
    }

    /**
     * Enable touch callout prevention
     */
    enableTouchCallout() {
        document.documentElement.style.webkitTouchCallout = 'none';
        document.documentElement.style.webkitUserSelect = 'none';
        document.documentElement.style.userSelect = 'none';
    }

    /**
     * Show toast message
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'gesture-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('visible');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    /**
     * Emit gesture event
     */
    emitGestureEvent(type, detail) {
        window.dispatchEvent(new CustomEvent(`gesture${type}`, {
            detail: {
                type,
                timestamp: Date.now(),
                ...detail
            }
        }));
    }

    /**
     * Register gesture callback
     */
    onGesture(type, callback) {
        if (!this.gestures[type]) {
            this.gestures[type] = new Map();
        }
        
        const id = Date.now() + Math.random();
        this.gestures[type].set(id, callback);
        
        return () => this.gestures[type].delete(id);
    }

    /**
     * Cleanup and unmount
     */
    unmount() {
        this.container.removeEventListener('touchstart', this.handleTouchStart);
        this.container.removeEventListener('touchmove', this.handleTouchMove);
        this.container.removeEventListener('touchend', this.handleTouchEnd);
        this.container.removeEventListener('touchcancel', this.handleTouchCancel);
        
        this.cancelLongPress();
        this.cancelPullToRefresh();
        
        if (this.pullToRefresh.indicator) {
            this.pullToRefresh.indicator.remove();
        }
        
        // Clear gesture callbacks
        Object.values(this.gestures).forEach(gestureMap => {
            gestureMap.clear();
        });
        
        console.log('👆 TouchGestureManager unmounted');
    }

    /**
     * Get component status
     */
    getStatus() {
        return {
            mounted: this.mounted,
            gestureTypes: Object.keys(this.gestures),
            pullToRefreshActive: this.pullToRefresh.active,
            currentTouch: !!this.currentTouch
        };
    }
}