/**
 * Reports Types Layer - V1
 * 
 * Simplified TypeScript interfaces for the reports system
 * Independent of data source (no Firebase/Firestore dependencies)
 * Focused on current system requirements only
 */

// ============================================================================
// CORE ENUMS
// ============================================================================

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum ReportType {
  GROUP_POST = 'group_post',
  USER = 'user',
  GROUP = 'group'
}

// ============================================================================
// USER INTERFACES
// ============================================================================

export interface ReportUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// ============================================================================
// TARGET INTERFACES
// ============================================================================

export interface ReportTarget {
  id: string;
  type: string;
  label: string;
  preview?: string;
  authorId?: string;
  authorName?: string;
  groupId?: string;
  groupName?: string;
}

// ============================================================================
// MAIN UNIFIED REPORT INTERFACE
// ============================================================================

export interface UnifiedReport {
  id: string;
  type: ReportType;
  status: ReportStatus;
  priority: ReportPriority;
  reason: string;
  title: string;
  reporter: ReportUser;
  target: ReportTarget;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedById?: string;
  reviewedByName?: string;
  tags?: string[];
  notes?: string;
}

// ============================================================================
// STATISTICS INTERFACES
// ============================================================================

export interface ReportsStats {
  total: number;
  pending: number;
  resolved: number;
  dismissed: number;
  resolvedToday: number;
  highPriority: number;
}

// ============================================================================
// FILTERS INTERFACES
// ============================================================================

export interface ReportsFilters {
  search: string;
  status: ReportStatus | 'all';
  priority: ReportPriority | 'all';
  type: ReportType | 'all';
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_REPORTS_FILTERS: ReportsFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  type: 'all'
};

export const DEFAULT_REPORTS_STATS: ReportsStats = {
  total: 0,
  pending: 0,
  resolved: 0,
  dismissed: 0,
  resolvedToday: 0,
  highPriority: 0
};
