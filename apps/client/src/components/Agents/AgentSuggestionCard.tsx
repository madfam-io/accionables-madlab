import { X, Clock, Check, RotateCcw } from 'lucide-react';
import { AgentSuggestion, AGENT_PERSONALITIES } from '../../types/agents';
import { useAgentStore } from '../../stores/agentStore';
import { useAppStore } from '../../stores/appStore';

interface AgentSuggestionCardProps {
  suggestion: AgentSuggestion;
  compact?: boolean;
}

export function AgentSuggestionCard({ suggestion, compact = false }: AgentSuggestionCardProps) {
  const { language } = useAppStore();
  const { dismissSuggestion, acknowledgeSuggestion, snoozeSuggestion, recordInteraction } =
    useAgentStore();

  const personality = AGENT_PERSONALITIES[suggestion.agentType];

  const handleAction = (action: typeof suggestion.actions[0]) => {
    switch (action.type) {
      case 'dismiss':
        recordInteraction(suggestion.id, suggestion.agentType, 'dismissed');
        dismissSuggestion(suggestion.id);
        break;
      case 'snooze':
        snoozeSuggestion(suggestion.id, 15); // 15 minutes default
        break;
      case 'accept':
        recordInteraction(suggestion.id, suggestion.agentType, 'accepted');
        acknowledgeSuggestion(suggestion.id);
        // Handle custom action if needed
        if (action.customAction) {
          // Emit custom event for handling elsewhere
          window.dispatchEvent(
            new CustomEvent('agent-action', {
              detail: { suggestionId: suggestion.id, action: action.customAction },
            })
          );
        }
        break;
    }
  };

  const getPriorityStyles = () => {
    switch (suggestion.priority) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg ${getPriorityStyles()} transition-all hover:shadow-md`}
      >
        <span className="text-2xl">{personality.avatar}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white truncate">
            {language === 'es' ? suggestion.message : suggestion.messageEn}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {suggestion.actions.slice(0, 2).map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={`p-1.5 rounded-lg transition-colors ${
                action.primary
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={language === 'es' ? action.label : action.labelEn}
            >
              {action.type === 'dismiss' && <X size={14} />}
              {action.type === 'snooze' && <Clock size={14} />}
              {action.type === 'accept' && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl ${getPriorityStyles()} overflow-hidden transition-all hover:shadow-lg`}
      style={{ borderColor: personality.color }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{personality.avatar}</span>
          <div>
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {language === 'es' ? personality.name : personality.nameEn}
            </span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {language === 'es' ? personality.description : personality.descriptionEn}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            recordInteraction(suggestion.id, suggestion.agentType, 'dismissed');
            dismissSuggestion(suggestion.id);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-gray-900 dark:text-white font-medium">
          {language === 'es' ? suggestion.message : suggestion.messageEn}
        </p>
        {(suggestion.detail || suggestion.detailEn) && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {language === 'es' ? suggestion.detail : suggestion.detailEn}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/30 dark:bg-gray-900/30">
        {suggestion.actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              action.primary
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {action.type === 'dismiss' && <X size={14} />}
            {action.type === 'snooze' && <Clock size={14} />}
            {action.type === 'accept' && <Check size={14} />}
            {action.type === 'custom' && <RotateCcw size={14} />}
            {language === 'es' ? action.label : action.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
}
