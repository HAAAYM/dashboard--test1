import { AISettings, AIServiceResponse } from './ai-types';
import { mockAISettings } from './ai-mock';

// In-memory store for AI settings (will be replaced with Firebase)
let aiSettingsStore: AISettings = { ...mockAISettings };

export const aiService = {
  /**
   * Get current AI settings
   */
  async getAISettings(): Promise<AIServiceResponse<AISettings>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { 
        success: true, 
        data: { ...aiSettingsStore } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch AI settings' 
      };
    }
  },

  /**
   * Update AI settings
   */
  async updateAISettings(settings: Partial<AISettings>): Promise<AIServiceResponse<AISettings>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update settings in store
      aiSettingsStore = { ...aiSettingsStore, ...settings };
      
      return { 
        success: true, 
        data: { ...aiSettingsStore } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update AI settings' 
      };
    }
  }
};
