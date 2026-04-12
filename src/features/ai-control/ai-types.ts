export type AIStatus = "active" | "disabled";

export type ResponseStyle = "professional" | "friendly" | "strict";

export interface AISettings {
  status: AIStatus;
  responseStyle: ResponseStyle;
  responseDelayMs: number;
  maxResponseLength: number;
  confidenceThreshold: number;
  allowedTopics: string[];
  blockedTopics: string[];
  rateLimits?: {
    student: number;
    faculty: number;
    admin: number;
  };
  lastUpdated?: unknown; // Firestore timestamp
  updatedBy?: string;
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
