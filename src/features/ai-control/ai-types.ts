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
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
