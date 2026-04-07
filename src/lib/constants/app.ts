export const APP_CONFIG = {
  name: 'Edu Mate Admin',
  description: 'Professional Admin Dashboard for Edu Mate University App',
  version: '1.0.0',
} as const;

export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'overview',
  USERS: 'users',
  GROUPS: 'groups',
  POSTS: 'posts',
  VERIFICATION: 'verification',
  REPORTS: 'reports',
  LIBRARY: 'library',
  LIVE_ACTIVITY: 'live-activity',
  AUDIT_LOGS: 'audit-logs',
  AI_CONTROL: 'ai-control',
  SETTINGS: 'settings',
} as const;

export type DashboardSection = typeof DASHBOARD_SECTIONS[keyof typeof DASHBOARD_SECTIONS];

export const ROUTES = {
  DASHBOARD: '/dashboard',
  OVERVIEW: '/dashboard/overview',
  USERS: '/dashboard/users',
  GROUPS: '/dashboard/groups',
  POSTS: '/dashboard/posts',
  VERIFICATION: '/dashboard/verification',
  REPORTS: '/dashboard/reports',
  LIBRARY: '/dashboard/library',
  LIVE_ACTIVITY: '/dashboard/live-activity',
  AUDIT_LOGS: '/dashboard/audit-logs',
  AI_CONTROL: '/dashboard/ai-control',
  SETTINGS: '/dashboard/settings',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  GROUPS: '/api/groups',
  POSTS: '/api/posts',
  VERIFICATION: '/api/verification',
  REPORTS: '/api/reports',
  LIBRARY: '/api/library',
  ACTIVITY: '/api/activity',
  AUDIT_LOGS: '/api/audit-logs',
  AI_CONTROL: '/api/ai-control',
} as const;
