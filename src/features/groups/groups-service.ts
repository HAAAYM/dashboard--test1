import { Group, GroupFilters, GroupMember, GroupRole, GroupMemberStatus, Message, Media, GroupPost, PublishRequest, Report, PostVisibility, PublishRequestStatus } from './groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { mockGroups } from './groups-mock';

// Mock audit log storage
let auditLogs: Array<{
  id: string;
  action: string;
  targetGroupId: string;
  targetGroupName: string;
  performedBy: string;
  timestamp: Date;
  oldValue?: any;
  newValue?: any;
}> = [];

// Audit logging function
export function logGroupAuditEvent(
  action: string,
  targetGroup: Group,
  performedBy: string,
  oldValue?: any,
  newValue?: any
) {
  const auditEvent = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    targetGroupId: targetGroup.id,
    targetGroupName: targetGroup.name,
    performedBy,
    timestamp: new Date(),
    oldValue,
    newValue,
  };
  
  auditLogs.push(auditEvent);
  console.log('GROUP AUDIT LOG:', auditEvent);
  return auditEvent;
}

// Mock audit log storage for group member events
let memberAuditLogs: Array<{
  id: string;
  action: string;
  targetGroupId: string;
  targetGroupName: string;
  targetUserId: string;
  performedBy: string;
  timestamp: Date;
  before: any;
  after: any;
}> = [];

// Log member audit event
const logMemberAuditEvent = (
  action: string,
  targetGroup: { id: string; name: string },
  performedBy: string,
  targetUserId: string,
  before?: any,
  after?: any
) => {
  const event = {
    id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    targetGroupId: targetGroup.id,
    targetGroupName: targetGroup.name,
    targetUserId,
    performedBy,
    timestamp: new Date(),
    before,
    after,
  };
  
  memberAuditLogs.push(event);
  console.log('Member audit event:', event);
};

// Get member audit logs (for debugging/future UI)
export function getMemberAuditLogs() {
  return [...memberAuditLogs];
}

// Service functions for group management
// Simple in-memory store for members persistence
let mockMembersStore: Record<string, GroupMember[]> = {};

// Group audit event type
interface GroupAuditEvent {
  id: string;
  actorUserId: string;
  action: 'ROLE_CHANGE' | 'REMOVE_MEMBER' | 'BAN_MEMBER' | 'SUBMIT_REQUEST' | 'APPROVE_REQUEST' | 'REJECT_REQUEST' | 'APPROVE_FLAGGED_POST' | 'DELETE_FLAGGED_POST' | 'REPORT_POST' | 'RESOLVE_REPORT' | 'DISMISS_REPORT';
  targetUserId: string;
  groupId: string;
  before?: {
    role?: GroupRole;
    status?: GroupMemberStatus;
  };
  after?: {
    role?: GroupRole;
    status?: GroupMemberStatus;
  };
  timestamp: Date;
}

// In-memory audit log for group member events
let mockGroupAuditLog: GroupAuditEvent[] = [];

// Mock store for publish requests
let mockPublishRequestsStore: PublishRequest[] = [];

// Mock store for posts (unified content system)
let mockPostsStore: Record<string, GroupPost[]> = {};

// Mock user moderation status store
interface UserModerationStatus {
  userId: string;
  violationsCount: number;
  lastViolationAt?: Date;
  moderationStatus: 'active' | 'warned' | 'restricted' | 'banned';
}

let mockUserModerationStore: Record<string, UserModerationStatus> = {};

// Mock store for reports
let mockReportsStore: Report[] = [];

// Mock stores for messages and media
let mockMessagesStore: Record<string, Message[]> = {};
let mockMediaStore: Record<string, Media[]> = {};

// Initialize mock messages, media, posts, and publish requests for existing groups
mockGroups.forEach((group: Group) => {
  // Initialize posts store with sample data using new GroupPost structure
  mockPostsStore[group.id] = [
    {
      id: 'post-1',
      groupId: group.id,
      authorId: '4',
      authorName: 'Alice Johnson',
      content: 'Here are my study notes for the upcoming exam. Hope this helps everyone!',
      type: 'text',
      visibility: 'group_only',
      createdAt: new Date('2024-01-19T09:00:00'),
      updatedAt: new Date('2024-01-19T09:00:00'),
    },
    {
      id: 'post-2',
      groupId: group.id,
      authorId: '3',
      authorName: 'Jane Smith',
      content: 'Quick video tutorial on calculus basics I recorded yesterday.',
      type: 'video',
      visibility: 'group_only',
      createdAt: new Date('2024-01-20T14:30:00'),
      updatedAt: new Date('2024-01-20T14:30:00'),
    },
    {
      id: 'post-3',
      groupId: group.id,
      authorId: '5',
      authorName: 'Bob Wilson',
      content: 'Great discussion today about quantum physics concepts.',
      type: 'text',
      visibility: 'group_only',
      createdAt: new Date('2024-01-18T16:45:00'),
      updatedAt: new Date('2024-01-18T16:45:00'),
    },
    {
      id: 'post-4',
      groupId: group.id,
      authorId: '2',
      authorName: 'Dr. John Doe',
      content: 'Important announcement: Study session moved to Room 301 tomorrow.',
      type: 'text',
      visibility: 'group_only',
      createdAt: new Date('2024-01-17T11:30:00'),
      updatedAt: new Date('2024-01-17T11:30:00'),
    },
    {
      id: 'post-5',
      groupId: group.id,
      authorId: '3',
      authorName: 'Jane Smith',
      content: 'Check out this helpful resource from the library',
      type: 'library_link',
      visibility: 'group_only',
      libraryLinkUrl: 'https://library.edu/study-guides',
      createdAt: new Date('2024-01-16T10:15:00'),
      updatedAt: new Date('2024-01-16T10:15:00'),
    },
    // Add posts with different visibility states for testing
    {
      id: 'post-6',
      groupId: group.id,
      authorId: '6',
      authorName: 'John Smith',
      content: 'Inappropriate content that should be flagged',
      type: 'text',
      visibility: 'group_only',
      createdAt: new Date('2024-01-15T13:20:00'),
      updatedAt: new Date('2024-01-15T13:20:00'),
    },
    {
      id: 'post-7',
      groupId: group.id,
      authorId: '7',
      authorName: 'Mike Johnson',
      content: 'This post should be visible globally',
      type: 'text',
      visibility: 'published_global',
      createdAt: new Date('2024-01-14T09:30:00'),
      updatedAt: new Date('2024-01-14T09:30:00'),
    }
  ];
  
  // Initialize sample reports
  mockReportsStore.push(
    {
      id: 'report-1',
      postId: 'post-6',
      groupId: group.id,
      reporterId: '2',
      reporterName: 'Dr. John Doe',
      reason: 'Inappropriate content - contains adult material',
      status: 'pending',
      createdAt: new Date('2024-01-24T09:00:00'),
    },
    {
      id: 'report-2',
      postId: 'post-7',
      groupId: group.id,
      reporterId: '3',
      reporterName: 'Jane Smith',
      reason: 'Offensive language and inappropriate request',
      status: 'pending',
      createdAt: new Date('2024-01-24T10:30:00'),
    },
    {
      id: 'report-3',
      postId: 'post-1',
      groupId: group.id,
      reporterId: '5',
      reporterName: 'Bob Wilson',
      reason: 'Spam content - promotional material',
      status: 'resolved',
      createdAt: new Date('2024-01-23T14:00:00'),
      reviewedBy: '2',
      reviewedAt: new Date('2024-01-23T16:00:00'),
    }
  );
  
  // Initialize user moderation status for sample users
  const sampleUsers = ['2', '3', '4', '5', '6', '7']; // User IDs from sample data
  sampleUsers.forEach(userId => {
    if (!mockUserModerationStore[userId]) {
      mockUserModerationStore[userId] = {
        userId,
        violationsCount: 0,
        moderationStatus: 'active'
      };
    }
  });
  
  // Set some users with violations for testing
  mockUserModerationStore['6'].violationsCount = 1;
  mockUserModerationStore['6'].moderationStatus = 'warned';
  mockUserModerationStore['6'].lastViolationAt = new Date('2024-01-22T15:00:00');
  
  mockUserModerationStore['7'].violationsCount = 3;
  mockUserModerationStore['7'].moderationStatus = 'restricted';
  mockUserModerationStore['7'].lastViolationAt = new Date('2024-01-23T10:30:00');
  
  mockMessagesStore[group.id] = [
    {
      id: 'msg-1',
      groupId: group.id,
      senderId: '2',
      senderName: 'Dr. John Doe',
      type: 'text',
      content: 'Welcome to the study group! Feel free to share your questions and resources.',
      createdAt: new Date('2024-01-15T10:00:00'),
    },
    {
      id: 'msg-2',
      groupId: group.id,
      senderId: '3',
      senderName: 'Jane Smith',
      type: 'text',
      content: 'Thanks for creating this group! Looking forward to collaborating.',
      createdAt: new Date('2024-01-16T14:30:00'),
    },
    {
      id: 'msg-3',
      groupId: group.id,
      senderId: '4',
      senderName: 'Alice Johnson',
      type: 'image',
      content: 'https://picsum.photos/seed/study-notes/400/300.jpg',
      createdAt: new Date('2024-01-17T09:15:00'),
    },
    {
      id: 'msg-4',
      groupId: group.id,
      senderId: '5',
      senderName: 'Bob Wilson',
      type: 'video',
      content: 'https://example.com/video-tutorial.mp4',
      createdAt: new Date('2024-01-18T16:45:00'),
    },
  ];
  
  mockMediaStore[group.id] = [
    {
      id: 'media-1',
      groupId: group.id,
      uploaderId: '3',
      uploaderName: 'Jane Smith',
      type: 'image',
      url: 'https://picsum.photos/seed/group-photo/800/600.jpg',
      sizeMB: 2.4,
      createdAt: new Date('2024-01-16T15:00:00'),
    },
    {
      id: 'media-2',
      groupId: group.id,
      uploaderId: '4',
      uploaderName: 'Alice Johnson',
      type: 'video',
      url: 'https://example.com/presentation.mp4',
      sizeMB: 15.7,
      createdAt: new Date('2024-01-17T10:30:00'),
    },
    {
      id: 'media-3',
      groupId: group.id,
      uploaderId: '2',
      uploaderName: 'Dr. John Doe',
      type: 'image',
      url: 'https://picsum.photos/seed/resources/600/400.jpg',
      sizeMB: 1.8,
      createdAt: new Date('2024-01-18T11:00:00'),
    },
  ];
  
  // Initialize sample publish requests
  mockPublishRequestsStore.push(
    {
      id: 'req-1',
      postId: 'post-1',
      groupId: group.id,
      requestedBy: 'user_4',
      status: 'pending' as PublishRequestStatus,
      createdAt: new Date('2024-01-19T09:00:00'),
    },
    {
      id: 'req-2',
      postId: 'post-2',
      groupId: group.id,
      requestedBy: 'user_3',
      status: 'pending' as PublishRequestStatus,
      createdAt: new Date('2024-01-20T14:30:00'),
    },
    {
      id: 'req-3',
      postId: 'post-3',
      groupId: group.id,
      requestedBy: 'user_5',
      status: 'rejected' as PublishRequestStatus,
      reviewedBy: 'admin_1',
      reviewedAt: new Date('2024-01-15T10:30:00'),
      createdAt: new Date('2024-01-14T16:45:00'),
    }
  );
});

// Initialize mock members for existing groups
mockGroups.forEach((group: Group) => {
  mockMembersStore[group.id] = [
    {
      id: '1',
      userId: '2',
      groupId: group.id,
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-10'),
      user: {
        id: '2',
        displayName: 'Dr. John Doe',
        email: 'john.doe@university.edu',
        role: UserRole.ADMIN,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'active',
      },
    },
    {
      id: '2',
      userId: '3',
      groupId: group.id,
      role: 'moderator',
      status: 'active',
      joinedAt: new Date('2024-01-20'),
      user: {
        id: '3',
        displayName: 'Jane Smith',
        email: 'jane.smith@university.edu',
        role: UserRole.MODERATOR,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        createdAt: new Date('2024-01-10'),
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'active',
      },
    },
    {
      id: '3',
      userId: '4',
      groupId: group.id,
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      user: {
        id: '4',
        displayName: 'Alice Johnson',
        email: 'alice.johnson@university.edu',
        role: UserRole.VIEWER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        createdAt: new Date('2024-02-15'),
        lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
    },
    {
      id: '4',
      userId: '5',
      groupId: group.id,
      role: 'member',
      status: 'banned',
      joinedAt: new Date('2024-02-15'),
      user: {
        id: '5',
        displayName: 'Bob Wilson',
        email: 'bob.wilson@university.edu',
        role: UserRole.VIEWER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        createdAt: new Date('2024-03-01'),
        lastLoginAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        status: 'suspended',
      },
    },
  ];
});

// Helper function to get actor's role in group
const getActorRoleInGroup = (groupId: string, actorUserId: string): GroupRole | null => {
  const members = mockMembersStore[groupId];
  if (!members) return null;
  
  const actorMember = members.find(m => m.userId === actorUserId);
  return actorMember ? actorMember.role : null;
};

// Helper function to validate hierarchy
const validateHierarchy = (
  actorRole: GroupRole | null,
  targetRole: GroupRole,
  action: 'remove' | 'ban' | 'role_change'
): { valid: boolean; error?: string } => {
  if (!actorRole) {
    return { valid: false, error: 'Actor not found in group' };
  }

  // Owner cannot be removed or banned
  if (targetRole === 'owner' && (action === 'remove' || action === 'ban')) {
    return { valid: false, error: 'Cannot remove or ban group owner' };
  }

  // Only owner can change owner role
  if (targetRole === 'owner' && action === 'role_change' && actorRole !== 'owner') {
    return { valid: false, error: 'Only owner can change owner role' };
  }

  // Moderator cannot affect owner
  if (actorRole === 'moderator' && targetRole === 'owner') {
    return { valid: false, error: 'Moderator cannot manage owner' };
  }

  // Member cannot manage anyone
  if (actorRole === 'member') {
    return { valid: false, error: 'Members cannot manage other members' };
  }

  return { valid: true };
};

// Get group audit logs (for debugging/future UI)
export function getGroupAuditLogs(): GroupAuditEvent[] {
  return [...mockGroupAuditLog];
}

// Get publish requests (for debugging/future UI)
export function getPublishRequests(): PublishRequest[] {
  return [...mockPublishRequestsStore];
}

// Get user moderation status (for debugging/future UI)
export function getUserModerationStatuses(): Record<string, UserModerationStatus> {
  return { ...mockUserModerationStore };
}

// Mock content safety check function
function checkContentSafety(content: string): { isFlagged: boolean; flagReason?: string } {
  const flaggedKeywords = ['sex', 'nude', 'xxx', 'porn', 'adult', 'erotic'];
  const lowerContent = content.toLowerCase();
  
  for (const keyword of flaggedKeywords) {
    if (lowerContent.includes(keyword)) {
      return {
        isFlagged: true,
        flagReason: `Contains inappropriate content: ${keyword}`
      };
    }
  }
  
  return { isFlagged: false };
}

// Enforcement rules function
function applyEnforcementRules(violationsCount: number): 'active' | 'warned' | 'restricted' | 'banned' {
  if (violationsCount >= 5) return 'banned';
  if (violationsCount >= 3) return 'restricted';
  if (violationsCount >= 1) return 'warned';
  return 'active';
}

// Update user violations and status
function updateUserViolations(userId: string): UserModerationStatus {
  if (!mockUserModerationStore[userId]) {
    mockUserModerationStore[userId] = {
      userId,
      violationsCount: 0,
      moderationStatus: 'active'
    };
  }
  
  const userStatus = mockUserModerationStore[userId];
  userStatus.violationsCount += 1;
  userStatus.lastViolationAt = new Date();
  userStatus.moderationStatus = applyEnforcementRules(userStatus.violationsCount);
  
  return userStatus;
}

// Get user moderation status
function getUserModerationStatus(userId: string): UserModerationStatus | null {
  return mockUserModerationStore[userId] || null;
}

export const groupsService = {
  /**
   * Get all groups
   */
  async getGroups(filters?: GroupFilters): Promise<{ success: boolean; data?: Group[]; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real implementation, this would call Firebase/API
      // For now, return mock data
      return { success: true, data: mockGroups };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch groups' 
      };
    }
  },

  /**
   * Get group by ID
   */
  async getGroupById(groupId: string): Promise<{ success: boolean; data?: Group; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find group in mock data
      const group = mockGroups.find(g => g.id === groupId);
      
      if (!group) {
        return { success: false, error: 'Group not found' };
      }
      
      return { success: true, data: group };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group' 
      };
    }
  },

  /**
   * Update group
   */
  async updateGroup(
    groupId: string, 
    updates: Partial<Group>, 
    performedBy: string
  ): Promise<{ success: boolean; data?: Group; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find and update group in mock data
      const groupIndex = mockGroups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        return { success: false, error: 'Group not found' };
      }
      
      // Update the group
      const updatedGroup = { 
        ...mockGroups[groupIndex], 
        ...updates, 
        updatedAt: new Date() 
      };
      
      mockGroups[groupIndex] = updatedGroup;
      
      // Log audit event
      logGroupAuditEvent('update_group', updatedGroup, performedBy, null, updates);
      
      return { success: true, data: updatedGroup };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update group' 
      };
    }
  },

  /**
   * Delete group
   */
  async deleteGroup(
    groupId: string, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete group' 
      };
    }
  },

  /**
   * Suspend group
   */
  async suspendGroup(
    groupId: string, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to suspend group' 
      };
    }
  },

  /**
   * Transfer ownership
   */
  async transferOwnership(
    groupId: string, 
    newOwnerId: string, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to transfer ownership' 
      };
    }
  },

  /**
   * Archive group
   */
  async archiveGroup(
    groupId: string, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to archive group' 
      };
    }
  },

  /**
   * Restore group
   */
  async restoreGroup(
    groupId: string, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to restore group' 
      };
    }
  },

  // Member Management Functions

  /**
   * Get group members
   */
  async getGroupMembers(groupId: string): Promise<{ success: boolean; data?: GroupMember[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return members from the shared store
      const members = mockMembersStore[groupId] || [];
      
      return { success: true, data: members };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group members' 
      };
    }
  },

  /**
   * Update group member role
   */
  async updateGroupMemberRole(
    groupId: string, 
    userId: string, 
    newRole: GroupRole,
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current members from shared store
      const members = mockMembersStore[groupId];
      if (!members) {
        return { success: false, error: 'Group not found' };
      }
      
      // Find target member
      const targetMember = members.find(m => m.userId === userId);
      if (!targetMember) {
        return { success: false, error: 'Member not found' };
      }
      
      // Get actor's role in group
      const actorRole = getActorRoleInGroup(groupId, performedBy);
      
      // Validate hierarchy for role change
      const validation = validateHierarchy(actorRole, targetMember.role, 'role_change');
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Additional validation for owner role changes
      if (newRole === 'owner' && actorRole !== 'owner') {
        return { success: false, error: 'Only owner can assign owner role' };
      }
      
      // Update member in shared store
      const updatedMembers = members.map(m => 
        m.userId === userId ? { ...m, role: newRole } : m
      );
      mockMembersStore[groupId] = updatedMembers;
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: performedBy,
        action: 'ROLE_CHANGE',
        targetUserId: userId,
        groupId,
        before: { role: targetMember.role },
        after: { role: newRole },
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update member role' 
      };
    }
  },

  /**
   * Remove group member
   */
  async removeGroupMember(
    groupId: string, 
    userId: string,
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get current members from shared store
      const members = mockMembersStore[groupId];
      if (!members) {
        return { success: false, error: 'Group not found' };
      }
      
      // Find target member
      const targetMember = members.find(m => m.userId === userId);
      if (!targetMember) {
        return { success: false, error: 'Member not found' };
      }
      
      // Get actor's role in group
      const actorRole = getActorRoleInGroup(groupId, performedBy);
      
      // Validate hierarchy for removal
      const validation = validateHierarchy(actorRole, targetMember.role, 'remove');
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Update member status to "left" in shared store
      const updatedMembers = members.map(m => 
        m.userId === userId ? { ...m, status: 'left' as GroupMemberStatus } : m
      );
      mockMembersStore[groupId] = updatedMembers;
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: performedBy,
        action: 'REMOVE_MEMBER',
        targetUserId: userId,
        groupId,
        before: { role: targetMember.role, status: targetMember.status },
        after: { status: 'left' },
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove group member' 
      };
    }
  },

  /**
   * Ban group member
   */
  async banGroupMember(
    groupId: string, 
    userId: string,
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current members from shared store
      const members = mockMembersStore[groupId];
      if (!members) {
        return { success: false, error: 'Group not found' };
      }
      
      // Find target member
      const targetMember = members.find(m => m.userId === userId);
      if (!targetMember) {
        return { success: false, error: 'Member not found' };
      }
      
      // Get actor's role in group
      const actorRole = getActorRoleInGroup(groupId, performedBy);
      
      // Validate hierarchy for ban
      const validation = validateHierarchy(actorRole, targetMember.role, 'ban');
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Update member status to "banned" in shared store
      const updatedMembers = members.map(m => 
        m.userId === userId ? { ...m, status: 'banned' as GroupMemberStatus } : m
      );
      mockMembersStore[groupId] = updatedMembers;
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: performedBy,
        action: 'BAN_MEMBER',
        targetUserId: userId,
        groupId,
        before: { role: targetMember.role, status: targetMember.status },
        after: { status: 'banned' },
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to ban group member' 
      };
    }
  },

  /**
   * Get group messages
   */
  async getGroupMessages(groupId: string): Promise<{ success: boolean; data?: Message[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return messages from the shared store
      const messages = mockMessagesStore[groupId] || [];
      
      return { success: true, data: messages };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group messages' 
      };
    }
  },

  /**
   * Delete group message
   */
  async deleteMessage(
    groupId: string,
    messageId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get current messages from shared store
      const messages = mockMessagesStore[groupId];
      if (!messages) {
        return { success: false, error: 'Group not found' };
      }
      
      // Find and remove the message
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) {
        return { success: false, error: 'Message not found' };
      }
      
      // Remove message from shared store
      messages.splice(messageIndex, 1);
      mockMessagesStore[groupId] = messages;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete message' 
      };
    }
  },

  /**
   * Get group media
   */
  async getGroupMedia(groupId: string): Promise<{ success: boolean; data?: Media[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return media from the shared store
      const media = mockMediaStore[groupId] || [];
      
      return { success: true, data: media };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group media' 
      };
    }
  },

  /**
   * Delete group media
   */
  async deleteMedia(
    groupId: string,
    mediaId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get current media from shared store
      const media = mockMediaStore[groupId];
      if (!media) {
        return { success: false, error: 'Group not found' };
      }
      
      // Find and remove the media
      const mediaIndex = media.findIndex(m => m.id === mediaId);
      if (mediaIndex === -1) {
        return { success: false, error: 'Media not found' };
      }
      
      // Remove media from shared store
      media.splice(mediaIndex, 1);
      mockMediaStore[groupId] = media;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete media' 
      };
    }
  },

  /**
   * Create a new post
   */
  async createPost(
    groupId: string,
    data: Omit<GroupPost, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: GroupPost; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if user is member of the group
      const actorRole = getActorRoleInGroup(groupId, data.authorId);
      if (!actorRole) {
        return { success: false, error: 'User is not a member of this group' };
      }
      
      // Check content safety
      const safetyCheck = checkContentSafety(data.content);
      
      // Create new post
      const newPost: GroupPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        groupId,
        authorId: data.authorId,
        authorName: data.authorName,
        content: data.content,
        type: 'text', // Default type for now
        visibility: 'group_only', // Default visibility for now
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add to posts store
      if (!mockPostsStore[groupId]) {
        mockPostsStore[groupId] = [];
      }
      mockPostsStore[groupId].push(newPost);
      
      return { success: true, data: newPost };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create post' 
      };
    }
  },

  /**
   * Get group posts
   */
  async getGroupPosts(groupId: string): Promise<{ success: boolean; data?: GroupPost[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return posts from the shared store
      const posts = mockPostsStore[groupId] || [];
      
      return { success: true, data: posts };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group posts' 
      };
    }
  },

  /**
   * Update post visibility (for moderation workflow)
   */
  async updatePostVisibility(
    postId: string,
    visibility: PostVisibility
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find the post in all groups
      let postFound = false;
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          mockPostsStore[groupId][postIndex].visibility = visibility;
          mockPostsStore[groupId][postIndex].updatedAt = new Date();
          postFound = true;
          break;
        }
      }
      
      if (!postFound) {
        return { success: false, error: 'Post not found' };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update post visibility' 
      };
    }
  },

  /**
   * Get posts with specific visibility for moderation
   */
  async getPostsByVisibility(groupId: string, visibility: PostVisibility): Promise<{ success: boolean; data?: GroupPost[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return posts with specific visibility from the shared store
      const posts = mockPostsStore[groupId] || [];
      const filteredPosts = posts.filter(post => post.visibility === visibility);
      
      return { success: true, data: filteredPosts };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch posts' 
      };
    }
  },

  /**
   * Approve flagged post (remove flag)
   */
  async approveFlaggedPost(
    postId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the post in all groups
      let postFound = false;
      let post: GroupPost | undefined;
      
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          post = mockPostsStore[groupId][postIndex];
          // Post is no longer flagged, just update visibility if needed
          mockPostsStore[groupId][postIndex].updatedAt = new Date();
          postFound = true;
          break;
        }
      }
      
      if (!postFound || !post) {
        return { success: false, error: 'Post not found' };
      }
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'APPROVE_FLAGGED_POST',
        targetUserId: post.authorId,
        groupId: post.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to approve flagged post' 
      };
    }
  },

  /**
   * Delete flagged post
   */
  async deleteFlaggedPost(
    postId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find and remove the post in all groups
      let postFound = false;
      let post: GroupPost | undefined;
      
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          post = mockPostsStore[groupId][postIndex];
          mockPostsStore[groupId].splice(postIndex, 1);
          postFound = true;
          break;
        }
      }
      
      if (!postFound || !post) {
        return { success: false, error: 'Post not found' };
      }
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'DELETE_FLAGGED_POST',
        targetUserId: post.authorId,
        groupId: post.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete flagged post' 
      };
    }
  },

  /**
   * Create a new report
   */
  async createReport(
    postId: string,
    reporterId: string,
    reporterName: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the post to get groupId
      let post: GroupPost | undefined;
      for (const groupId in mockPostsStore) {
        const foundPost = mockPostsStore[groupId].find(p => p.id === postId);
        if (foundPost) {
          post = foundPost;
          break;
        }
      }
      
      if (!post) {
        return { success: false, error: 'Post not found' };
      }
      
      // Check if user is member of the group
      const actorRole = getActorRoleInGroup(post.groupId, reporterId);
      if (!actorRole) {
        return { success: false, error: 'User is not a member of this group' };
      }
      
      // Check if report already exists for this post by this user
      const existingReport = mockReportsStore.find(
        report => report.postId === postId && 
                 report.reporterId === reporterId && 
                 report.status === 'pending'
      );
      if (existingReport) {
        return { success: false, error: 'You have already reported this post' };
      }
      
      // Create new report
      const newReport: Report = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId,
        groupId: post.groupId,
        reporterId,
        reporterName,
        reason,
        status: 'pending',
        createdAt: new Date()
      };
      
      mockReportsStore.push(newReport);
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reporterId,
        action: 'REPORT_POST',
        targetUserId: post.authorId,
        groupId: post.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create report' 
      };
    }
  },

  /**
   * Get pending reports for a group
   */
  async getPendingReports(groupId: string): Promise<{ success: boolean; data?: Report[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return only pending reports for this group
      const reports = mockReportsStore.filter(report => 
        report.groupId === groupId && report.status === 'pending'
      );
      
      return { success: true, data: reports };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pending reports' 
      };
    }
  },

  /**
   * Resolve report (delete the reported post)
   */
  async resolveReport(
    reportId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the report
      const report = mockReportsStore.find(r => r.id === reportId);
      if (!report) {
        return { success: false, error: 'Report not found' };
      }
      
      // Find and delete the post
      let postFound = false;
      let post: GroupPost | undefined;
      
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === report.postId);
        if (postIndex !== -1) {
          post = mockPostsStore[groupId][postIndex];
          mockPostsStore[groupId].splice(postIndex, 1);
          postFound = true;
          break;
        }
      }
      
      if (!postFound || !post) {
        return { success: false, error: 'Post not found' };
      }
      
      // Update report status
      report.status = 'resolved';
      report.reviewedBy = reviewerId;
      report.reviewedAt = new Date();
      
      // Increment violations for the post author
      const updatedUserStatus = updateUserViolations(post.authorId);
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'RESOLVE_REPORT',
        targetUserId: post.authorId,
        groupId: report.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to resolve report' 
      };
    }
  },

  /**
   * Dismiss report (keep the post)
   */
  async dismissReport(
    reportId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the report
      const report = mockReportsStore.find(r => r.id === reportId);
      if (!report) {
        return { success: false, error: 'Report not found' };
      }
      
      // Find the post for audit logging
      let post: GroupPost | undefined;
      for (const groupId in mockPostsStore) {
        const foundPost = mockPostsStore[groupId].find(p => p.id === report.postId);
        if (foundPost) {
          post = foundPost;
          break;
        }
      }
      
      if (!post) {
        return { success: false, error: 'Post not found' };
      }
      
      // Update report status
      report.status = 'dismissed';
      report.reviewedBy = reviewerId;
      report.reviewedAt = new Date();
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'DISMISS_REPORT',
        targetUserId: post.authorId,
        groupId: report.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to dismiss report' 
      };
    }
  },

  /**
   * Get user moderation status
   */
  async getUserModerationStatus(userId: string): Promise<{ success: boolean; data?: UserModerationStatus; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const userStatus = mockUserModerationStore[userId];
      if (!userStatus) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, data: userStatus };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user moderation status' 
      };
    }
  },

  /**
   * Check if user can post (based on moderation status)
   */
  async canUserPost(userId: string): Promise<{ success: boolean; canPost: boolean; reason?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userStatus = mockUserModerationStore[userId];
      if (!userStatus) {
        return { success: true, canPost: true };
      }
      
      switch (userStatus.moderationStatus) {
        case 'banned':
          return { success: true, canPost: false, reason: 'User is banned from posting' };
        case 'restricted':
          return { success: true, canPost: false, reason: 'User posting is restricted' };
        case 'warned':
        case 'active':
          return { success: true, canPost: true };
        default:
          return { success: true, canPost: true };
      }
    } catch (error) {
      return { 
        success: false, 
        canPost: false,
        reason: error instanceof Error ? error.message : 'Failed to check posting permissions'
      };
    }
  },

  /**
   * Create publish request for a post
   */
  async createPublishRequest(
    post: GroupPost
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if request already exists for this post
      const existingRequest = mockPublishRequestsStore.find(
        req => req.postId === post.id && req.status === 'pending'
      );
      if (existingRequest) {
        return { success: false, error: 'Publish request already exists for this post' };
      }
      
      // Check if user is member of the group
      const actorRole = getActorRoleInGroup(post.groupId, post.authorId);
      if (!actorRole) {
        return { success: false, error: 'User is not a member of this group' };
      }
      
      // Create new publish request
      const newRequest: PublishRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId: post.id,
        groupId: post.groupId,
        requestedBy: post.authorId,
        status: 'pending' as PublishRequestStatus,
        createdAt: new Date()
      };
      
      mockPublishRequestsStore.push(newRequest);
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: post.authorId,
        action: 'SUBMIT_REQUEST',
        targetUserId: post.authorId,
        groupId: post.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create publish request' 
      };
    }
  },

  /**
   * Get pending publish requests for a group
   */
  async getPendingRequests(
    groupId: string
  ): Promise<{ success: boolean; data?: PublishRequest[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const pendingRequests = mockPublishRequestsStore.filter(
        req => req.groupId === groupId && req.status === 'pending'
      );
      
      return { success: true, data: pendingRequests };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pending requests' 
      };
    }
  },

  /**
   * Approve publish request
   */
  async approveRequest(
    requestId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the request
      const request = mockPublishRequestsStore.find(req => req.id === requestId);
      if (!request) {
        return { success: false, error: 'Request not found' };
      }
      
      // Check if reviewer is moderator or owner
      const reviewerRole = getActorRoleInGroup(request.groupId, reviewerId);
      if (reviewerRole !== 'moderator' && reviewerRole !== 'owner') {
        return { success: false, error: 'Only moderators or owners can approve requests' };
      }
      
      // Update request status
      request.status = 'approved';
      request.reviewedBy = reviewerId;
      request.reviewedAt = new Date();
      
      // Update post visibility to published_global
      const postUpdateResult = await this.updatePostVisibility(request.postId, 'published_global' as PostVisibility);
      if (!postUpdateResult.success) {
        return { success: false, error: 'Failed to update post visibility' };
      }
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'APPROVE_REQUEST',
        targetUserId: request.requestedBy,
        groupId: request.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to approve request' 
      };
    }
  },

  /**
   * Reject publish request
   */
  async rejectRequest(
    requestId: string,
    reviewerId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the request
      const request = mockPublishRequestsStore.find(req => req.id === requestId);
      if (!request) {
        return { success: false, error: 'Request not found' };
      }
      
      // Check if reviewer is moderator or owner
      const reviewerRole = getActorRoleInGroup(request.groupId, reviewerId);
      if (reviewerRole !== 'moderator' && reviewerRole !== 'owner') {
        return { success: false, error: 'Only moderators or owners can reject requests' };
      }
      
      // Update request status
      request.status = 'rejected';
      request.reviewedBy = reviewerId;
      request.reviewedAt = new Date();
      
      // Log audit event
      const auditEvent: GroupAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        actorUserId: reviewerId,
        action: 'REJECT_REQUEST',
        targetUserId: request.requestedBy,
        groupId: request.groupId,
        timestamp: new Date()
      };
      mockGroupAuditLog.push(auditEvent);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to reject request' 
      };
    }
  },

  /**
   * Get group posts (using new GroupPost structure)
   */
  async getGroupPostsNew(groupId: string): Promise<{ success: boolean; data?: GroupPost[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return posts from the shared store
      const posts = mockPostsStore[groupId] || [];
      
      return { success: true, data: posts };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch group posts' 
      };
    }
  },

  /**
   * Get publish requests for a group
   */
  async getPublishRequests(groupId: string): Promise<{ success: boolean; data?: PublishRequest[]; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return publish requests from the shared store
      const requests = mockPublishRequestsStore.filter(req => req.groupId === groupId);
      
      return { success: true, data: requests };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch publish requests' 
      };
    }
  },

  /**
   * Submit a publish request for a post
   */
  async submitPublishRequest(postId: string, groupId: string, requestedBy: string): Promise<{ success: boolean; data?: PublishRequest; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Create new publish request
      const newRequest: PublishRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId,
        groupId,
        requestedBy,
        status: 'pending' as PublishRequestStatus,
        createdAt: new Date(),
      };
      
      // Add to publish Requests store
      mockPublishRequestsStore.push(newRequest);
      
      // Update post visibility to requested_global
      for (const gid in mockPostsStore) {
        const postIndex = mockPostsStore[gid].findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          mockPostsStore[gid][postIndex].visibility = 'requested_global' as PostVisibility;
          mockPostsStore[gid][postIndex].updatedAt = new Date();
          break;
        }
      }
      
      return { success: true, data: newRequest };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit publish request' 
      };
    }
  },

  /**
   * Approve a publish request
   */
  async approvePublishRequest(requestId: string, reviewedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the publish request
      const requestIndex = mockPublishRequestsStore.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return { success: false, error: 'Publish request not found' };
      }
      
      const request = mockPublishRequestsStore[requestIndex];
      
      // Update request status
      mockPublishRequestsStore[requestIndex] = {
        ...request,
        status: 'approved' as PublishRequestStatus,
        reviewedBy,
        reviewedAt: new Date(),
      };
      
      // Update post visibility to published_global
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === request.postId);
        if (postIndex !== -1) {
          mockPostsStore[groupId][postIndex].visibility = 'published_global' as PostVisibility;
          mockPostsStore[groupId][postIndex].updatedAt = new Date();
          break;
        }
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to approve publish request' 
      };
    }
  },

  /**
   * Reject a publish request
   */
  async rejectPublishRequest(requestId: string, reviewedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the publish request
      const requestIndex = mockPublishRequestsStore.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return { success: false, error: 'Publish request not found' };
      }
      
      const request = mockPublishRequestsStore[requestIndex];
      
      // Update request status
      mockPublishRequestsStore[requestIndex] = {
        ...request,
        status: 'rejected' as PublishRequestStatus,
        reviewedBy,
        reviewedAt: new Date(),
      };
      
      // Update post visibility back to group_only
      for (const groupId in mockPostsStore) {
        const postIndex = mockPostsStore[groupId].findIndex(p => p.id === request.postId);
        if (postIndex !== -1) {
          mockPostsStore[groupId][postIndex].visibility = 'group_only' as PostVisibility;
          mockPostsStore[groupId][postIndex].updatedAt = new Date();
          break;
        }
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to reject publish request' 
      };
    }
  }
};
