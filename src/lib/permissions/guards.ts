import React from 'react';
import { User } from '@/types';
import { UserRole, hasPermission } from './roles';
import { PERMISSIONS, Permission } from './permissions';

export interface PermissionGuardProps {
  user: User;
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  user,
  permission,
  fallback,
  children,
}: PermissionGuardProps) {
  const resourceAction = permission.split('.');
  const resource = resourceAction[0];
  const action = resourceAction[1] as 'create' | 'read' | 'update' | 'delete';
  
  const hasAccess = hasPermission(user.role, resource, action);
  
  if (!hasAccess) {
    return fallback || null;
  }
  
  return children;
}

export function usePermissionGuard(user: User | null) {
  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const resourceAction = permission.split('.');
    const resource = resourceAction[0];
    const action = resourceAction[1] as 'create' | 'read' | 'update' | 'delete';
    
    return hasPermission(user.role, resource, action);
  };

  const canAccess = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => checkPermission(permission));
  };

  const canAccessAny = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => checkPermission(permission));
  };

  const canManageUsers = (): boolean => {
    return canAccess([
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_BAN,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.USERS_CHANGE_ROLE,
    ]);
  };

  const canManageGroups = (): boolean => {
    return canAccess([
      PERMISSIONS.GROUPS_MANAGE,
      PERMISSIONS.GROUPS_CREATE,
      PERMISSIONS.GROUPS_EDIT,
      PERMISSIONS.GROUPS_DELETE,
    ]);
  };

  const canModerateContent = (): boolean => {
    return canAccess([
      PERMISSIONS.POSTS_MODERATE,
      PERMISSIONS.POSTS_CREATE,
      PERMISSIONS.POSTS_EDIT,
      PERMISSIONS.POSTS_DELETE,
    ]);
  };

  const canManageVerifications = (): boolean => {
    return canAccess([
      PERMISSIONS.VERIFICATION_REVIEW,
      PERMISSIONS.VERIFICATION_APPROVE,
      PERMISSIONS.VERIFICATION_REJECT,
    ]);
  };

  const canManageReports = (): boolean => {
    return canAccess([
      PERMISSIONS.REPORTS_RESOLVE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_ESCALATE,
    ]);
  };

  const canManageLibrary = (): boolean => {
    return canAccess([
      PERMISSIONS.LIBRARY_MANAGE,
      PERMISSIONS.LIBRARY_UPLOAD,
      PERMISSIONS.LIBRARY_DELETE,
      PERMISSIONS.LIBRARY_EDIT,
    ]);
  };

  const canManageSettings = (): boolean => {
    return canAccess([
      PERMISSIONS.SETTINGS_MANAGE,
      PERMISSIONS.SETTINGS_VIEW,
    ]);
  };

  const canViewAuditLogs = (): boolean => {
    return checkPermission(PERMISSIONS.AUDIT_VIEW);
  };

  const canDeleteUser = (targetUserRole: UserRole): boolean => {
    if (!user) return false;
    
    // Super admin can delete anyone except other super admins
    if (user.role === UserRole.SUPER_ADMIN) {
      return targetUserRole !== UserRole.SUPER_ADMIN;
    }
    
    // Admin can delete moderators and below
    if (user.role === UserRole.ADMIN) {
      return targetUserRole === UserRole.MODERATOR || 
             targetUserRole === UserRole.SUPPORT || 
             targetUserRole === UserRole.VIEWER;
    }
    
    // Moderator cannot delete users
    return false;
  };

  const canChangeRole = (targetUserRole: UserRole, newRole: UserRole): boolean => {
    if (!user) return false;
    
    // Only super admin can change super admin roles
    if (newRole === UserRole.SUPER_ADMIN) {
      return user.role === UserRole.SUPER_ADMIN;
    }
    
    // Super admin can change any role except other super admins
    if (user.role === UserRole.SUPER_ADMIN) {
      return targetUserRole !== UserRole.SUPER_ADMIN;
    }
    
    // Admin can change roles of moderators and below
    if (user.role === UserRole.ADMIN) {
      return targetUserRole === UserRole.MODERATOR || 
             targetUserRole === UserRole.SUPPORT || 
             targetUserRole === UserRole.VIEWER;
    }
    
    // Others cannot change roles
    return false;
  };

  const canBanUser = (targetUserRole: UserRole): boolean => {
    if (!user) return false;
    
    // Super admin can ban anyone except other super admins
    if (user.role === UserRole.SUPER_ADMIN) {
      return targetUserRole !== UserRole.SUPER_ADMIN;
    }
    
    // Admin can ban moderators and below
    if (user.role === UserRole.ADMIN) {
      return targetUserRole === UserRole.MODERATOR || 
             targetUserRole === UserRole.SUPPORT || 
             targetUserRole === UserRole.VIEWER;
    }
    
    // Moderator cannot ban users
    return false;
  };

  return {
    checkPermission,
    canAccess,
    canAccessAny,
    canManageUsers,
    canManageGroups,
    canModerateContent,
    canManageVerifications,
    canManageReports,
    canManageLibrary,
    canManageSettings,
    canViewAuditLogs,
    canDeleteUser,
    canChangeRole,
    canBanUser,
  };
}