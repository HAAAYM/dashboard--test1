import type { UserRole } from '@/lib/permissions/roles';

export type UserStatus = "active" | "inactive" | "suspended" | "banned";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  status: UserStatus;
  metadata?: Record<string, any>;
}
export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  groupId?: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'hidden' | 'deleted';
}

export interface VerificationRequest {
  id: string;
  userId: string;
  type: 'doctor' | 'faculty' | 'student';
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  submittedAt: Date;
}

export interface VerificationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'post' | 'user' | 'group' | 'comment';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

export interface LibraryFile {
  id: string;
  name: string;
  description?: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  categoryId?: string;
  tags?: string[];
  downloadCount: number;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetResource: string;
  targetId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AIBotSettings {
  id: string;
  isEnabled: boolean;
  responseStyle: 'formal' | 'friendly' | 'professional';
  allowedTopics: string[];
  blockedTopics: string[];
  maxResponseLength: number;
  responseDelay: number;
  lastUpdatedBy: string;
  updatedAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalPosts: number;
  pendingVerifications: number;
  pendingReports: number;
  totalFiles: number;
  onlineUsers: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
