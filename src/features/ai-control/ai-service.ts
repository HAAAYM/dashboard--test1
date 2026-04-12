import { AISettings, AIServiceResponse } from './ai-types';
import { mockAISettings } from './ai-mock';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client-config';

export const aiService = {
  /**
   * Get current AI settings from Firestore
   */
  async getAISettings(): Promise<AIServiceResponse<AISettings>> {
    try {
      const docRef = doc(db, 'ai_settings', 'global');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          success: true, 
          data: docSnap.data() as AISettings 
        };
      } else {
        // Initialize with mock settings if document doesn't exist
        const initialSettings = {
          ...mockAISettings,
          lastUpdated: serverTimestamp(),
          updatedBy: 'system'
        };
        
        await setDoc(docRef, initialSettings);
        return { 
          success: true, 
          data: initialSettings as AISettings 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch AI settings' 
      };
    }
  },

  /**
   * Update AI settings in Firestore
   */
  async updateAISettings(settings: Partial<AISettings>, updatedBy?: string): Promise<AIServiceResponse<AISettings>> {
    try {
      const docRef = doc(db, 'ai_settings', 'global');
      
      // Get current settings first
      const currentDoc = await getDoc(docRef);
      const currentSettings = currentDoc.exists() ? currentDoc.data() as AISettings : mockAISettings;
      
      // Update with new settings
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        lastUpdated: serverTimestamp(),
        updatedBy: updatedBy || 'unknown'
      };
      
      await setDoc(docRef, updatedSettings);
      
      return { 
        success: true, 
        data: updatedSettings as AISettings 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update AI settings' 
      };
    }
  }
};
