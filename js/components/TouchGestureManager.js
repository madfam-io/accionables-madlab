// ==========================================================================
// Touch Gesture Manager Component
// ==========================================================================

import { Component } from './Component.js';
import { throttle } from '../utils/helpers.js';

export class TouchGestureManager extends Component {
    constructor(element, state) {
        super(element, state);
        
        // Gesture configuration
        this.config = {
            swipeThreshold: 50,        // Minimum distance for swipe
            swipeTimeout: 300,         // Maximum time for swipe
            longPressTimeout: 500,     // Long press duration
            doubleTapTimeout: 300,     // Double tap timeout
            pullToRefreshThreshold: 80, // Pull distance for refresh
            velocityThreshold: 0.3     // Minimum velocity for swipe
        };
        
        // Touch state
        this.touchState = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            startTime: 0,
            isTracking: false,
            isPullToRefresh: false,
            lastTap: 0
        };
        
        // Active gestures
        this.activeGestures = new Set();
        
        // Throttled handlers
        this.handleTouchMove = throttle(this.onTouchMove.bind(this), 16); // ~60fps
        
        // Bind context
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
    }

    /**
     * Handle touch start event
     * @param {TouchEvent} event - Touch event
     */
    onTouchStart(event) {
        const touch = event.touches[0];
        if (!touch) return;
        
        this.touchState = {
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY,
            startTime: Date.now(),
            isTracking: true,
            isPullToRefresh: window.scrollY === 0,
            lastTap: this.touchState.lastTap
        };
        
        // Start long press timer
        this.startLongPressTimer(event);
        
        // Dispatch touch start event
        this.dispatchGestureEvent('touchstart', {
            touch,
            position: { x: touch.clientX, y: touch.clientY }
        });
    }

    /**
     * Handle touch move event
     * @param {TouchEvent} event - Touch event
     */
    onTouchMove(event) {
        if (!this.touchState.isTracking) return;
        
        const touch = event.touches[0];
        if (!touch) return;
        
        // Update current position
        this.touchState.currentX = touch.clientX;
        this.touchState.currentY = touch.clientY;
        
        // Calculate distances
        const deltaX = this.touchState.currentX - this.touchState.startX;
        const deltaY = this.touchState.currentY - this.touchState.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Cancel long press if moved too far
        if (distance > 10) {
            this.cancelLongPress();
        }
        
        // Handle pull to refresh
        if (this.touchState.isPullToRefresh && deltaY > 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
            this.handlePullToRefresh(deltaY, event);
        }
        
        // Handle horizontal swipe detection
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
            const direction = deltaX > 0 ? 'right' : 'left';
            this.dispatchGestureEvent('swipeProgress', {
                direction,
                distance: Math.abs(deltaX),
                deltaX,
                deltaY,
                progress: Math.min(Math.abs(deltaX) / this.config.swipeThreshold, 1)
            });
        }
        
        // Dispatch general move event
        this.dispatchGestureEvent('touchmove', {
            touch,
            position: { x: touch.clientX, y: touch.clientY },
            delta: { x: deltaX, y: deltaY },
            distance
        });
    }

    /**
     * Handle touch end event
     * @param {TouchEvent} event - Touch event
     */
    onTouchEnd(event) {
        if (!this.touchState.isTracking) return;
        
        const endTime = Date.now();
        const duration = endTime - this.touchState.startTime;
        
        // Calculate final distances and velocity
        const deltaX = this.touchState.currentX - this.touchState.startX;
        const deltaY = this.touchState.currentY - this.touchState.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const velocity = distance / duration;
        
        // Cancel timers
        this.cancelLongPress();
        
        // Handle tap/double tap
        if (distance < 10 && duration < 200) {
            this.handleTap(event);
        }
        
        // Handle swipe
        if (this.isSwipeGesture(deltaX, deltaY, duration, velocity)) {
            this.handleSwipe(deltaX, deltaY, velocity, event);
        }
        
        // Handle pull to refresh end
        if (this.touchState.isPullToRefresh && deltaY > this.config.pullToRefreshThreshold) {
            this.triggerPullToRefresh();
        } else {
            this.cancelPullToRefresh();
        }
        
        // Reset tracking
        this.touchState.isTracking = false;
        
        // Dispatch touch end event
        this.dispatchGestureEvent('touchend', {
            duration,
            distance,
            velocity,
            delta: { x: deltaX, y: deltaY }
        });
    }

    /**
     * Handle touch cancel event
     * @param {TouchEvent} event - Touch event
     */
    onTouchCancel(event) {
        this.cancelLongPress();
        this.cancelPullToRefresh();
        this.touchState.isTracking = false;
        
        this.dispatchGestureEvent('touchcancel', { event });
    }

    /**
     * Check if gesture qualifies as a swipe
     * @param {number} deltaX - X distance
     * @param {number} deltaY - Y distance
     * @param {number} duration - Gesture duration
     * @param {number} velocity - Gesture velocity
     * @returns {boolean} Is swipe gesture
     */
    isSwipeGesture(deltaX, deltaY, duration, velocity) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        return absX > this.config.swipeThreshold &&
               absX > absY &&
               duration < this.config.swipeTimeout &&
               velocity > this.config.velocityThreshold;
    }

    /**
     * Handle swipe gesture
     * @param {number} deltaX - X distance
     * @param {number} deltaY - Y distance
     * @param {number} velocity - Gesture velocity
     * @param {TouchEvent} event - Original event
     */
    handleSwipe(deltaX, deltaY, velocity, event) {
        const direction = deltaX > 0 ? 'right' : 'left';
        const distance = Math.abs(deltaX);
        
        // Find the target element
        const target = this.findSwipeTarget(event.target);
        
        if (target) {
            this.dispatchGestureEvent('swipe', {
                direction,
                distance,
                velocity,
                target,
                deltaX,
                deltaY
            });
            
            // Handle specific swipe actions
            this.handleSwipeAction(target, direction, distance, velocity);
        }
    }

    /**
     * Find the appropriate target for swipe actions
     * @param {Element} element - Starting element
     * @returns {Element|null} Target element
     */
    findSwipeTarget(element) {
        // Look for phase headers
        const phaseHeader = element.closest('.phase-header');
        if (phaseHeader) return phaseHeader;
        
        // Look for task cards
        const taskCard = element.closest('.task-card');
        if (taskCard) return taskCard;
        
        // Look for modal content
        const modal = element.closest('.modal');
        if (modal) return modal;
        
        return null;
    }

    /**
     * Handle specific swipe actions
     * @param {Element} target - Target element
     * @param {string} direction - Swipe direction
     * @param {number} distance - Swipe distance
     * @param {number} velocity - Swipe velocity
     */
    handleSwipeAction(target, direction, distance, velocity) {
        // Handle phase header swipes
        if (target.classList.contains('phase-header')) {
            const phaseElement = target.closest('[data-phase]');
            if (phaseElement) {
                const phaseNum = phaseElement.dataset.phase;
                
                // Right swipe expands, left swipe collapses
                if (direction === 'right') {
                    this.expandPhase(phaseNum);
                } else if (direction === 'left') {
                    this.collapsePhase(phaseNum);
                }
            }
        }
        
        // Handle task card swipes
        if (target.classList.contains('task-card')) {
            const taskId = target.dataset.taskId;
            if (taskId) {
                // Left swipe could show actions, right swipe could show details
                this.dispatchGestureEvent('taskSwipe', {
                    taskId,
                    direction,
                    distance,
                    velocity,
                    element: target
                });
            }
        }
        
        // Handle modal swipes
        if (target.classList.contains('modal')) {
            // Down swipe to close modal
            if (direction === 'down' && distance > 100) {
                this.closeModal(target);
            }
        }
    }

    /**
     * Expand phase with animation
     * @param {string} phaseNum - Phase number
     */
    expandPhase(phaseNum) {
        if (window.madlabApp?.expandPhase) {
            window.madlabApp.togglePhase(phaseNum);
        }
        
        // Add expand animation class
        const phaseElement = document.querySelector(`[data-phase="${phaseNum}"]`);
        if (phaseElement) {
            phaseElement.classList.add('phase-expanding');
            setTimeout(() => {
                phaseElement.classList.remove('phase-expanding');
            }, 300);
        }
    }

    /**
     * Collapse phase with animation
     * @param {string} phaseNum - Phase number
     */
    collapsePhase(phaseNum) {
        if (window.madlabApp?.collapsePhase) {
            window.madlabApp.togglePhase(phaseNum);
        }
        
        // Add collapse animation class
        const phaseElement = document.querySelector(`[data-phase="${phaseNum}"]`);
        if (phaseElement) {
            phaseElement.classList.add('phase-collapsing');
            setTimeout(() => {
                phaseElement.classList.remove('phase-collapsing');
            }, 300);
        }
    }

    /**
     * Handle tap gesture
     * @param {TouchEvent} event - Touch event
     */
    handleTap(event) {
        const now = Date.now();
        const isDoubleTap = now - this.touchState.lastTap < this.config.doubleTapTimeout;
        
        if (isDoubleTap) {
            this.dispatchGestureEvent('doubletap', {
                position: { x: this.touchState.startX, y: this.touchState.startY },
                target: event.target
            });
        } else {
            this.dispatchGestureEvent('tap', {
                position: { x: this.touchState.startX, y: this.touchState.startY },
                target: event.target
            });
        }
        
        this.touchState.lastTap = now;
    }

    /**
     * Start long press timer
     * @param {TouchEvent} event - Touch event
     */
    startLongPressTimer(event) {
        this.longPressTimer = setTimeout(() => {
            if (this.touchState.isTracking) {
                this.dispatchGestureEvent('longpress', {
                    position: { x: this.touchState.startX, y: this.touchState.startY },
                    target: event.target
                });
            }
        }, this.config.longPressTimeout);
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
     * Handle pull to refresh gesture
     * @param {number} distance - Pull distance
     * @param {TouchEvent} event - Touch event
     */
    handlePullToRefresh(distance, event) {
        const progress = Math.min(distance / this.config.pullToRefreshThreshold, 1);
        
        // Add pull indication
        document.body.classList.add('pull-to-refresh-active');
        document.body.style.setProperty('--pull-progress', progress.toString());
        
        this.dispatchGestureEvent('pullToRefreshProgress', {
            distance,
            progress,
            threshold: this.config.pullToRefreshThreshold
        });
        
        // Prevent default scroll
        if (distance > 20) {
            event.preventDefault();
        }
    }

    /**
     * Trigger pull to refresh action
     */
    triggerPullToRefresh() {
        document.body.classList.add('pull-to-refresh-triggered');
        
        this.dispatchGestureEvent('pullToRefresh', {
            triggered: true
        });
        
        // Auto-cancel after animation
        setTimeout(() => {
            this.cancelPullToRefresh();
        }, 2000);
    }

    /**
     * Cancel pull to refresh
     */
    cancelPullToRefresh() {
        document.body.classList.remove('pull-to-refresh-active', 'pull-to-refresh-triggered');
        document.body.style.removeProperty('--pull-progress');
    }

    /**
     * Close modal with animation
     * @param {Element} modal - Modal element
     */
    closeModal(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.click();
        }
    }

    /**
     * Dispatch custom gesture event
     * @param {string} type - Event type
     * @param {Object} detail - Event detail
     */
    dispatchGestureEvent(type, detail) {
        window.dispatchEvent(new CustomEvent(`gesture:${type}`, {
            detail: {
                ...detail,
                timestamp: Date.now(),
                config: this.config
            }
        }));
    }

    /**
     * Enable touch gestures for element
     * @param {Element} element - Target element
     */
    enableGesturesForElement(element) {
        if (!element || this.activeGestures.has(element)) return;
        
        element.addEventListener('touchstart', this.onTouchStart, { passive: false });
        element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        element.addEventListener('touchend', this.onTouchEnd, { passive: false });
        element.addEventListener('touchcancel', this.onTouchCancel, { passive: false });
        
        this.activeGestures.add(element);
    }

    /**
     * Disable touch gestures for element
     * @param {Element} element - Target element
     */
    disableGesturesForElement(element) {
        if (!element || !this.activeGestures.has(element)) return;
        
        element.removeEventListener('touchstart', this.onTouchStart);
        element.removeEventListener('touchmove', this.handleTouchMove);
        element.removeEventListener('touchend', this.onTouchEnd);
        element.removeEventListener('touchcancel', this.onTouchCancel);
        
        this.activeGestures.delete(element);
    }

    /**
     * Bind touch gestures to common elements
     */
    bindEvents() {
        // Enable gestures for main areas
        const gestureAreas = [
            document.body,
            ...document.querySelectorAll('.phase-header'),
            ...document.querySelectorAll('.task-card'),
            ...document.querySelectorAll('.modal')
        ];
        
        gestureAreas.forEach(element => {
            this.enableGesturesForElement(element);
        });
        
        // Listen for new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.phase-header, .task-card, .modal')) {
                            this.enableGesturesForElement(node);
                        }
                        
                        // Check children
                        const children = node.querySelectorAll('.phase-header, .task-card, .modal');
                        children.forEach(child => this.enableGesturesForElement(child));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this.mutationObserver = observer;
    }

    /**
     * Initialize on mount
     */
    onMount() {
        // Only enable on touch devices
        const responsive = this.state.getState('responsive');
        if (responsive?.hasTouch) {
            console.log('👆 TouchGestureManager initialized');
        }
    }

    /**
     * Cleanup on unmount
     */
    onUnmount() {
        // Disable all active gestures
        this.activeGestures.forEach(element => {
            this.disableGesturesForElement(element);
        });
        
        // Stop mutation observer
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Cancel any active timers
        this.cancelLongPress();
        this.cancelPullToRefresh();
    }

    /**
     * Get gesture configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Update gesture configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

export default TouchGestureManager;