
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  VIEWER = 'viewer',
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete'] },
  ],
  [UserRole.ADMIN]: [
    { resource: 'users', actions: ['create', 'read', 'update'] },
    { resource: 'groups', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'posts', actions: ['read', 'update', 'delete'] },
    { resource: 'verification', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read', 'update'] },
    { resource: 'library', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activity', actions: ['read'] },
    { resource: 'audit_logs', actions: ['read'] },
    { resource: 'ai_control', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  [UserRole.MODERATOR]: [
    { resource: 'users', actions: ['read'] },
    { resource: 'groups', actions: ['read'] },
    { resource: 'posts', actions: ['read', 'update', 'delete'] },
    { resource: 'verification', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read', 'update'] },
    { resource: 'library', actions: ['read'] },
    { resource: 'activity', actions: ['read'] },
  ],
  [UserRole.SUPPORT]: [
    { resource: 'users', actions: ['read'] },
    { resource: 'groups', actions: ['read'] },
    { resource: 'posts', actions: ['read'] },
    { resource: 'verification', actions: ['read'] },
    { resource: 'reports', actions: ['read', 'update'] },
    { resource: 'library', actions: ['read'] },
    { resource: 'activity', actions: ['read'] },
  ],
  [UserRole.VIEWER]: [
    { resource: 'users', actions: ['read'] },
    { resource: 'groups', actions: ['read'] },
    { resource: 'posts', actions: ['read'] },
    { resource: 'verification', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'library', actions: ['read'] },
    { resource: 'activity', actions: ['read'] },
    { resource: 'audit_logs', actions: ['read'] },
  ],
};

export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  return permissions.some(permission => {
    if (permission.resource === '*') {
      return true;
    }
    
    return permission.resource === resource && 
           permission.actions.includes(action);
  });
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routeResourceMap: Record<string, string> = {
    '/dashboard/users': 'users',
    '/dashboard/groups': 'groups',
    '/dashboard/posts': 'posts',
    '/dashboard/verification': 'verification',
    '/dashboard/reports': 'reports',
    '/dashboard/library': 'library',
    '/dashboard/live-activity': 'activity',
    '/dashboard/audit-logs': 'audit_logs',
    '/dashboard/ai-control': 'ai_control',
    '/dashboard/settings': 'settings',
  };

  const resource = routeResourceMap[route];
  if (!resource) return true; // Overview and dashboard routes are accessible to all

  return hasPermission(userRole, resource, 'read');
}
