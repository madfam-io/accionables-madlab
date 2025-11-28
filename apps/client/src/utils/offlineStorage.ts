/**
 * Offline Storage with IndexedDB
 *
 * Provides offline-first data storage for MADLAB:
 * - Projects and tasks cached locally
 * - Pending changes queued for sync
 * - Automatic sync when back online
 */

// ============================================================================
// Types
// ============================================================================

export interface OfflineTask {
    id: string;
    projectId: string;
    title: string;
    titleEn?: string;
    description?: string;
    status: string;
    phase: number;
    estimatedHours?: number;
    assigneeId?: string;
    updatedAt: number; // timestamp
    syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface OfflineProject {
    id: string;
    name: string;
    nameEn?: string;
    description?: string;
    eventDate: string;
    eventType: string;
    updatedAt: number;
    syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface PendingChange {
    id: string;
    type: 'create' | 'update' | 'delete';
    entity: 'task' | 'project';
    entityId: string;
    data: Record<string, unknown>;
    timestamp: number;
    retries: number;
}

// ============================================================================
// IndexedDB Setup
// ============================================================================

const DB_NAME = 'madlab-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open IndexedDB:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Projects store
            if (!db.objectStoreNames.contains('projects')) {
                const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
                projectStore.createIndex('updatedAt', 'updatedAt');
                projectStore.createIndex('syncStatus', 'syncStatus');
            }

            // Tasks store
            if (!db.objectStoreNames.contains('tasks')) {
                const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
                taskStore.createIndex('projectId', 'projectId');
                taskStore.createIndex('updatedAt', 'updatedAt');
                taskStore.createIndex('syncStatus', 'syncStatus');
            }

            // Pending changes queue
            if (!db.objectStoreNames.contains('pendingChanges')) {
                const changeStore = db.createObjectStore('pendingChanges', { keyPath: 'id' });
                changeStore.createIndex('timestamp', 'timestamp');
                changeStore.createIndex('entity', 'entity');
            }

            // User settings
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        };
    });

    return dbPromise;
}

// ============================================================================
// Generic CRUD Operations
// ============================================================================

async function getFromStore<T>(storeName: string, key: string): Promise<T | null> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function getAllFromStore<T>(storeName: string): Promise<T[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function putToStore<T>(storeName: string, item: T): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function deleteFromStore(storeName: string, key: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function clearStore(storeName: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ============================================================================
// Task Operations
// ============================================================================

export const offlineTasks = {
    async get(id: string): Promise<OfflineTask | null> {
        return getFromStore<OfflineTask>('tasks', id);
    },

    async getAll(): Promise<OfflineTask[]> {
        return getAllFromStore<OfflineTask>('tasks');
    },

    async getByProject(projectId: string): Promise<OfflineTask[]> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('projectId');
            const request = index.getAll(projectId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async save(task: OfflineTask): Promise<void> {
        await putToStore('tasks', task);
    },

    async saveBulk(tasks: OfflineTask[]): Promise<void> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite');
            const store = transaction.objectStore('tasks');

            let completed = 0;
            for (const task of tasks) {
                const request = store.put(task);
                request.onsuccess = () => {
                    completed++;
                    if (completed === tasks.length) resolve();
                };
                request.onerror = () => reject(request.error);
            }

            if (tasks.length === 0) resolve();
        });
    },

    async delete(id: string): Promise<void> {
        return deleteFromStore('tasks', id);
    },

    async clear(): Promise<void> {
        return clearStore('tasks');
    },

    async getPending(): Promise<OfflineTask[]> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('syncStatus');
            const request = index.getAll('pending');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
};

// ============================================================================
// Project Operations
// ============================================================================

export const offlineProjects = {
    async get(id: string): Promise<OfflineProject | null> {
        return getFromStore<OfflineProject>('projects', id);
    },

    async getAll(): Promise<OfflineProject[]> {
        return getAllFromStore<OfflineProject>('projects');
    },

    async save(project: OfflineProject): Promise<void> {
        await putToStore('projects', project);
    },

    async delete(id: string): Promise<void> {
        return deleteFromStore('projects', id);
    },

    async clear(): Promise<void> {
        return clearStore('projects');
    },
};

// ============================================================================
// Pending Changes Queue
// ============================================================================

export const pendingChanges = {
    async add(change: Omit<PendingChange, 'id' | 'timestamp' | 'retries'>): Promise<void> {
        const pendingChange: PendingChange = {
            ...change,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            retries: 0,
        };
        await putToStore('pendingChanges', pendingChange);
    },

    async getAll(): Promise<PendingChange[]> {
        return getAllFromStore<PendingChange>('pendingChanges');
    },

    async remove(id: string): Promise<void> {
        return deleteFromStore('pendingChanges', id);
    },

    async incrementRetries(id: string): Promise<void> {
        const change = await getFromStore<PendingChange>('pendingChanges', id);
        if (change) {
            change.retries++;
            await putToStore('pendingChanges', change);
        }
    },

    async clear(): Promise<void> {
        return clearStore('pendingChanges');
    },

    async count(): Promise<number> {
        const changes = await getAllFromStore<PendingChange>('pendingChanges');
        return changes.length;
    },
};

// ============================================================================
// Settings
// ============================================================================

export const offlineSettings = {
    async get<T>(key: string, defaultValue: T): Promise<T> {
        const result = await getFromStore<{ key: string; value: T }>('settings', key);
        return result?.value ?? defaultValue;
    },

    async set<T>(key: string, value: T): Promise<void> {
        await putToStore('settings', { key, value });
    },
};

// ============================================================================
// Sync Manager
// ============================================================================

interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    conflicts: number;
}

export async function syncWithServer(
    apiClient: { post: (url: string, data: unknown) => Promise<unknown> }
): Promise<SyncResult> {
    const result: SyncResult = {
        success: true,
        synced: 0,
        failed: 0,
        conflicts: 0,
    };

    const changes = await pendingChanges.getAll();

    for (const change of changes) {
        try {
            await apiClient.post('/sync', {
                type: change.type,
                entity: change.entity,
                entityId: change.entityId,
                data: change.data,
                clientTimestamp: change.timestamp,
            });

            await pendingChanges.remove(change.id);
            result.synced++;

            // Update local record as synced
            if (change.entity === 'task') {
                const task = await offlineTasks.get(change.entityId);
                if (task) {
                    task.syncStatus = 'synced';
                    await offlineTasks.save(task);
                }
            }
        } catch (error) {
            result.failed++;
            await pendingChanges.incrementRetries(change.id);

            // Mark as conflict after 3 retries
            if (change.retries >= 3) {
                if (change.entity === 'task') {
                    const task = await offlineTasks.get(change.entityId);
                    if (task) {
                        task.syncStatus = 'conflict';
                        await offlineTasks.save(task);
                    }
                }
                result.conflicts++;
            }
        }
    }

    result.success = result.failed === 0;
    return result;
}

// ============================================================================
// Online/Offline Detection
// ============================================================================

export function setupOnlineListener(onOnline: () => void, onOffline: () => void): () => void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
}

export function isOnline(): boolean {
    return navigator.onLine;
}

// ============================================================================
// Storage Stats
// ============================================================================

export async function getStorageStats(): Promise<{
    taskCount: number;
    projectCount: number;
    pendingCount: number;
    estimatedSize: string;
}> {
    const tasks = await offlineTasks.getAll();
    const projects = await offlineProjects.getAll();
    const pending = await pendingChanges.getAll();

    // Estimate size
    const dataSize = JSON.stringify({ tasks, projects, pending }).length;
    const sizeKB = Math.round(dataSize / 1024);
    const estimatedSize = sizeKB > 1024
        ? `${(sizeKB / 1024).toFixed(1)} MB`
        : `${sizeKB} KB`;

    return {
        taskCount: tasks.length,
        projectCount: projects.length,
        pendingCount: pending.length,
        estimatedSize,
    };
}

// ============================================================================
// Clear All Data
// ============================================================================

export async function clearAllOfflineData(): Promise<void> {
    await offlineTasks.clear();
    await offlineProjects.clear();
    await pendingChanges.clear();
    await clearStore('settings');
}
