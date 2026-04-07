import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

export interface UserFilters {
  search: string;
  role: UserRole | 'all_roles';
  status: 'active' | 'inactive' | 'suspended' | 'banned' | 'all_statuses';
  verified: 'verified' | 'unverified' | 'all_verification';
  major?: string | 'all_majors';
}

export interface UserTableColumn {
  key: keyof User | 'actions';
  label: string;
  sortable?: boolean;
}

export interface UserAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
  onClick: (user: User) => void;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'join_group' | 'leave_group' | 'upload_file' | 'verification_request' | 'post_created' | 'post_deleted';
  details: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserDetails extends User {
  major?: string;
  bio?: string;
  groupsCount: number;
  uploadsCount: number;
  reportsCount: number;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
}
