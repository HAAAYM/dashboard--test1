'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AISettings } from './ai-types';
import { aiService } from './ai-service';

interface AIContextType {
  settings: AISettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<AISettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiService.getAISettings();
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        setError(result.error || 'Failed to load AI settings');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AISettings>) => {
    setError(null);

    try {
      const result = await aiService.updateAISettings(newSettings);
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        setError(result.error || 'Failed to update AI settings');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const contextValue = {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
