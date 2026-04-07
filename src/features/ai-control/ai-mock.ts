import { AISettings, AIStatus, ResponseStyle } from './ai-types';

export const mockAISettings: AISettings = {
  status: 'active' as AIStatus,
  responseStyle: 'professional' as ResponseStyle,
  responseDelayMs: 500,
  maxResponseLength: 1000,
  confidenceThreshold: 0.8,
  allowedTopics: [
    'general',
    'academic',
    'administrative',
    'technical',
    'support'
  ],
  blockedTopics: [
    'politics',
    'religion',
    'personal-relationships',
    'medical-advice',
    'legal-advice'
  ]
};
