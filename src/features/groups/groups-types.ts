import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

export type GroupType = "public" | "private";
export type GroupStatus = "active" | "suspended" | "archived" | "deleted";
export type GroupRole = "owner" | "moderator" | "member" | "visitor";
export type GroupMemberStatus = 'active' | 'banned' | 'left' | 'pending' | 'muted' | 'invited';

// New types for publish workflow
export type GroupPostType = "text" | "image" | "video" | "library_link";
export type PostVisibility = "group_only" | "requested_global" | "published_global";
export type PublishRequestStatus = "pending" | "approved" | "rejected";

export type Message = {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'video';
  content: string;
  createdAt: Date;
};

export type Media = {
  id: string;
  groupId: string;
  uploaderId: string;
  uploaderName: string;
  type: 'image' | 'video';
  url: string;
  sizeMB: number;
  createdAt: Date;
};

export type Report = {
  id: string;
  postId: string;
  groupId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
};

export type GroupPost = {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: GroupPostType;
  visibility: PostVisibility;
  libraryLinkUrl?: string;  // optional, for shared library links only
  createdAt: Date;
  updatedAt: Date;
};

export type PublishRequest = {
  id: string;
  postId: string;
  groupId: string;
  requestedBy: string;
  status: PublishRequestStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
};

export interface GroupSettings {
  visitorPreviewEnabled: boolean;
  visitorCanSeeMedia: boolean;
  requireJoinApproval: boolean;
  allowMedia: boolean;
  maxMediaSizeMB: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  status: GroupMemberStatus;
  joinedAt: Date;
  user: User;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  type: GroupType;
  status: GroupStatus;
  ownerId: string;
  ownerDisplayName?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  membersCount: number;
  moderatorsCount: number;
  messagesCount: number;
  mediaCount: number;
  flaggedContentCount?: number;
  settings: GroupSettings;
  lastActivity?: Date;
}

export interface GroupFilters {
  search: string;
  type: GroupType | 'all_types';
  status: GroupStatus | 'all_statuses';
  specialization?: string | 'all_specializations';
  activityLevel?: 'high' | 'medium' | 'low' | 'all_activity';
}

export interface GroupTableColumn {
  key: keyof Group | 'actions';
  label: string;
  sortable?: boolean;
}

export interface GroupAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
  onClick: (group: Group) => void;
}

export interface GroupActivity {
  id: string;
  groupId: string;
  action: 'member_joined' | 'member_left' | 'member_promoted' | 'member_demoted' | 'member_banned' | 'group_created' | 'group_updated' | 'media_uploaded' | 'settings_changed';
  details: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
