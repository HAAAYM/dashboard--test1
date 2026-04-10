import { UserRole } from '@/lib/permissions/roles';
import { User } from '@/types';
import { getFirebase } from '@/lib/firebase/client-config';
import { doc, getDoc } from 'firebase/firestore';
import { mockUsers } from './users-mock';

// Mock audit log storage
let auditLogs: Array<{
  id: string;
  action: string;
  targetUserId: string;
  targetUserName: string;
  performedBy: string;
  timestamp: Date;
  oldValue?: any;
  newValue?: any;
}> = [];

// Audit logging function
export function logAuditEvent(
  action: string,
  targetUser: any,
  performedBy: string,
  oldValue?: any,
  newValue?: any
) {
  const auditEvent = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    targetUserId: targetUser.id,
    targetUserName: targetUser.displayName,
    performedBy,
    timestamp: new Date(),
    oldValue,
    newValue,
  };
  
  auditLogs.push(auditEvent);
  console.log('AUDIT LOG:', auditEvent);
  return auditEvent;
}

// Get audit logs (for debugging/future UI)
export function getAuditLogs() {
  return [...auditLogs];
}

// Service functions for user management
export const usersService = {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const { db } = getFirebase();
      if (!db) {
        console.warn('Firestore not available, falling back to mock data');
        // Fallback to mock if needed - check if mock users exist
        const mockUser = mockUsers.find(u => u.id === userId);
        if (mockUser) {
          return { success: true, data: mockUser };
        }
        return { success: false, error: 'User not found' };
      }

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        return { success: false, error: 'User not found' };
      }

      const data = userDocSnap.data();
      const user: User = {
        id: userDocSnap.id,
        email: data.email || '',
        displayName: data.displayName || data.fullName || data.username || data.email || '',
        role: data.role || UserRole.VIEWER,
        avatar: data.avatar || data.photoUrl || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate(),
        status: data.status || 'active',
        metadata: data.metadata || {},
      };

      return { success: true, data: user };
    } catch (error) {
      console.error('Firestore getUserById error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user' 
      };
    }
  },

  /**
   * Ban a user
   */
  async banUser(userId: string, performedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, this would call Firebase/API
      // For now, this is handled by the context
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to ban user' 
      };
    }
  },

  /**
   * Suspend a user
   */
  async suspendUser(userId: string, performedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to suspend user' 
      };
    }
  },

  /**
   * Activate a user
   */
  async activateUser(userId: string, performedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to activate user' 
      };
    }
  },

  /**
   * Change user role
   */
  async changeUserRole(
    userId: string, 
    newRole: UserRole, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to change user role' 
      };
    }
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string, performedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user' 
      };
    }
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string, 
    updates: Partial<User>, 
    performedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update user' 
      };
    }
  },
};
