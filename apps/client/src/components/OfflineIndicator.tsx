/**
 * Offline Status Indicator
 *
 * Shows current online/offline status and pending sync count.
 * Appears as a subtle banner when offline or when changes are pending.
 */

import { Cloud, CloudOff, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

interface OfflineIndicatorProps {
    className?: string;
    showWhenOnline?: boolean;
}

export function OfflineIndicator({ className = '', showWhenOnline = false }: OfflineIndicatorProps) {
    const {
        isOnline,
        isSyncing,
        pendingCount,
        lastSyncResult,
        syncNow,
    } = useOffline();

    // Don't show if online with no pending changes (unless showWhenOnline)
    if (isOnline && pendingCount === 0 && !showWhenOnline && !isSyncing) {
        return null;
    }

    const getStatusColor = () => {
        if (!isOnline) return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
        if (pendingCount > 0) return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
        if (lastSyncResult && !lastSyncResult.success) return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
    };

    const getStatusIcon = () => {
        if (!isOnline) return <CloudOff size={16} />;
        if (isSyncing) return <RefreshCw size={16} className="animate-spin" />;
        if (pendingCount > 0) return <Cloud size={16} />;
        if (lastSyncResult && !lastSyncResult.success) return <AlertTriangle size={16} />;
        return <Check size={16} />;
    };

    const getStatusText = () => {
        if (!isOnline) return 'Offline';
        if (isSyncing) return 'Syncing...';
        if (pendingCount > 0) return `${pendingCount} change${pendingCount !== 1 ? 's' : ''} pending`;
        if (lastSyncResult && !lastSyncResult.success) return 'Sync failed';
        return 'Synced';
    };

    return (
        <div
            className={`
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium
                rounded-full border transition-all duration-300
                ${getStatusColor()}
                ${className}
            `}
        >
            {getStatusIcon()}
            <span>{getStatusText()}</span>

            {isOnline && pendingCount > 0 && !isSyncing && (
                <button
                    onClick={syncNow}
                    className="ml-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Sync now"
                >
                    <RefreshCw size={12} />
                </button>
            )}
        </div>
    );
}

/**
 * Floating Offline Banner
 *
 * Shows at the top of the screen when offline.
 */
export function OfflineBanner() {
    const { isOnline, pendingCount } = useOffline();

    if (isOnline && pendingCount === 0) return null;

    return (
        <div
            className={`
                fixed top-0 left-0 right-0 z-50
                px-4 py-2 text-center text-sm font-medium
                transition-all duration-300
                ${!isOnline
                    ? 'bg-amber-500 text-white'
                    : 'bg-blue-500 text-white'
                }
            `}
        >
            <div className="flex items-center justify-center gap-2">
                {!isOnline ? (
                    <>
                        <CloudOff size={16} />
                        <span>You're offline. Changes will sync when you reconnect.</span>
                    </>
                ) : (
                    <>
                        <Cloud size={16} />
                        <span>{pendingCount} change{pendingCount !== 1 ? 's' : ''} waiting to sync.</span>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * Minimal status dot for compact UIs
 */
export function OfflineStatusDot({ className = '' }: { className?: string }) {
    const { isOnline, pendingCount, isSyncing } = useOffline();

    const getColor = () => {
        if (!isOnline) return 'bg-amber-500';
        if (isSyncing) return 'bg-blue-500 animate-pulse';
        if (pendingCount > 0) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    return (
        <div
            className={`w-2 h-2 rounded-full ${getColor()} ${className}`}
            title={!isOnline ? 'Offline' : pendingCount > 0 ? `${pendingCount} pending` : 'Synced'}
        />
    );
}
