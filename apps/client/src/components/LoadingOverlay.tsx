import React from 'react';

interface LoadingOverlayProps {
  message?: string;
  progress?: number;
  isLoading?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  progress,
  isLoading = false
}) => {
  if (!isLoading) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[200px] max-w-sm">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            {progress !== undefined && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Message */}
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 text-center">
            {message}
          </p>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};