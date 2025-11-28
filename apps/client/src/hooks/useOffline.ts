/**
 * Offline Support Hook
 *
 * Provides offline-first data management with automatic sync.
 *
 * Usage:
 * ```tsx
 * const { isOnline, pendingCount, syncNow, lastSyncTime } = useOffline();
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    offlineTasks,
    offlineProjects,
    pendingChanges,
    syncWithServer,
    setupOnlineListener,
    isOnline as checkOnline,
    getStorageStats,
    type OfflineTask,
    type OfflineProject,
} from '../utils/offlineStorage';
import apiClient from '../api/client';

// ============================================================================
// Types
// ============================================================================

interface OfflineState {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    lastSyncTime: Date | null;
    lastSyncResult: {
        success: boolean;
        synced: number;
        failed: number;
    } | null;
    storageStats: {
        taskCount: number;
        projectCount: number;
        estimatedSize: string;
    } | null;
}

interface UseOfflineReturn extends OfflineState {
    syncNow: () => Promise<void>;
    cacheTasks: (tasks: OfflineTask[]) => Promise<void>;
    cacheProjects: (projects: OfflineProject[]) => Promise<void>;
    getCachedTasks: () => Promise<OfflineTask[]>;
    getCachedProjects: () => Promise<OfflineProject[]>;
    queueChange: (type: 'create' | 'update' | 'delete', entity: 'task' | 'project', entityId: string, data: Record<string, unknown>) => Promise<void>;
    refreshStats: () => Promise<void>;
}

// ============================================================================
// Hook
// ============================================================================

export function useOffline(): UseOfflineReturn {
    const [state, setState] = useState<OfflineState>({
        isOnline: checkOnline(),
        isSyncing: false,
        pendingCount: 0,
        lastSyncTime: null,
        lastSyncResult: null,
        storageStats: null,
    });

    const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Update pending count
    const updatePendingCount = useCallback(async () => {
        try {
            const count = await pendingChanges.count();
            setState(prev => ({ ...prev, pendingCount: count }));
        } catch (error) {
            console.error('Failed to get pending count:', error);
        }
    }, []);

    // Refresh storage stats
    const refreshStats = useCallback(async () => {
        try {
            const stats = await getStorageStats();
            setState(prev => ({
                ...prev,
                storageStats: {
                    taskCount: stats.taskCount,
                    projectCount: stats.projectCount,
                    estimatedSize: stats.estimatedSize,
                },
                pendingCount: stats.pendingCount,
            }));
        } catch (error) {
            console.error('Failed to get storage stats:', error);
        }
    }, []);

    // Sync with server
    const syncNow = useCallback(async () => {
        if (!checkOnline()) {
            console.log('Cannot sync: offline');
            return;
        }

        setState(prev => ({ ...prev, isSyncing: true }));

        try {
            const result = await syncWithServer({
                post: async (url: string, data: unknown) => {
                    const response = await apiClient.post(url, data);
                    return response.data;
                },
            });

            setState(prev => ({
                ...prev,
                isSyncing: false,
                lastSyncTime: new Date(),
                lastSyncResult: {
                    success: result.success,
                    synced: result.synced,
                    failed: result.failed,
                },
            }));

            await updatePendingCount();
        } catch (error) {
            console.error('Sync failed:', error);
            setState(prev => ({
                ...prev,
                isSyncing: false,
                lastSyncResult: {
                    success: false,
                    synced: 0,
                    failed: 1,
                },
            }));
        }
    }, [updatePendingCount]);

    // Cache tasks
    const cacheTasks = useCallback(async (tasks: OfflineTask[]) => {
        await offlineTasks.saveBulk(tasks);
        await refreshStats();
    }, [refreshStats]);

    // Cache projects
    const cacheProjects = useCallback(async (projects: OfflineProject[]) => {
        for (const project of projects) {
            await offlineProjects.save(project);
        }
        await refreshStats();
    }, [refreshStats]);

    // Get cached tasks
    const getCachedTasks = useCallback(async (): Promise<OfflineTask[]> => {
        return offlineTasks.getAll();
    }, []);

    // Get cached projects
    const getCachedProjects = useCallback(async (): Promise<OfflineProject[]> => {
        return offlineProjects.getAll();
    }, []);

    // Queue a change for sync
    const queueChange = useCallback(async (
        type: 'create' | 'update' | 'delete',
        entity: 'task' | 'project',
        entityId: string,
        data: Record<string, unknown>
    ) => {
        await pendingChanges.add({ type, entity, entityId, data });
        await updatePendingCount();

        // Try to sync immediately if online
        if (checkOnline()) {
            // Debounce sync attempts
            setTimeout(() => syncNow(), 1000);
        }
    }, [updatePendingCount, syncNow]);

    // Set up online/offline listeners
    useEffect(() => {
        const handleOnline = () => {
            setState(prev => ({ ...prev, isOnline: true }));
            // Sync when coming back online
            syncNow();
        };

        const handleOffline = () => {
            setState(prev => ({ ...prev, isOnline: false }));
        };

        const cleanup = setupOnlineListener(handleOnline, handleOffline);

        // Initial load
        updatePendingCount();
        refreshStats();

        // Set up periodic sync (every 5 minutes if online and has pending)
        syncIntervalRef.current = setInterval(async () => {
            if (checkOnline()) {
                const count = await pendingChanges.count();
                if (count > 0) {
                    syncNow();
                }
            }
        }, 5 * 60 * 1000);

        return () => {
            cleanup();
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [syncNow, updatePendingCount, refreshStats]);

    return {
        ...state,
        syncNow,
        cacheTasks,
        cacheProjects,
        getCachedTasks,
        getCachedProjects,
        queueChange,
        refreshStats,
    };
}

// ============================================================================
// Offline Status Component Hook
// ============================================================================

export function useOfflineStatus() {
    const [isOnline, setIsOnline] = useState(checkOnline());

    useEffect(() => {
        const cleanup = setupOnlineListener(
            () => setIsOnline(true),
            () => setIsOnline(false)
        );
        return cleanup;
    }, []);

    return isOnline;
}
