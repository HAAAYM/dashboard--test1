export const PERMISSIONS = {
  // User permissions
  USERS_VIEW: 'users.view',
  USERS_EDIT: 'users.edit',
  USERS_BAN: 'users.ban',
  USERS_DELETE: 'users.delete',
  USERS_CHANGE_ROLE: 'users.changeRole',
  
  // Group permissions
  GROUPS_MANAGE: 'groups.manage',
  GROUPS_CREATE: 'groups.create',
  GROUPS_EDIT: 'groups.edit',
  GROUPS_DELETE: 'groups.delete',
  
  // Post permissions
  POSTS_MODERATE: 'posts.moderate',
  POSTS_CREATE: 'posts.create',
  POSTS_EDIT: 'posts.edit',
  POSTS_DELETE: 'posts.delete',
  
  // Verification permissions
  VERIFICATION_REVIEW: 'verification.review',
  VERIFICATION_APPROVE: 'verification.approve',
  VERIFICATION_REJECT: 'verification.reject',
  
  // Report permissions
  REPORTS_RESOLVE: 'reports.resolve',
  REPORTS_VIEW: 'reports.view',
  REPORTS_ESCALATE: 'reports.escalate',
  
  // Library permissions
  LIBRARY_MANAGE: 'library.manage',
  LIBRARY_UPLOAD: 'library.upload',
  LIBRARY_DELETE: 'library.delete',
  LIBRARY_EDIT: 'library.edit',
  
  // Settings permissions
  SETTINGS_MANAGE: 'settings.manage',
  SETTINGS_VIEW: 'settings.view',
  
  // Audit permissions
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',
  
  // System permissions
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_MAINTENANCE: 'system.maintenance',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_BAN,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_CHANGE_ROLE,
  ],
  GROUP_MANAGEMENT: [
    PERMISSIONS.GROUPS_MANAGE,
    PERMISSIONS.GROUPS_CREATE,
    PERMISSIONS.GROUPS_EDIT,
    PERMISSIONS.GROUPS_DELETE,
  ],
  CONTENT_MODERATION: [
    PERMISSIONS.POSTS_MODERATE,
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_EDIT,
    PERMISSIONS.POSTS_DELETE,
  ],
  VERIFICATION_MANAGEMENT: [
    PERMISSIONS.VERIFICATION_REVIEW,
    PERMISSIONS.VERIFICATION_APPROVE,
    PERMISSIONS.VERIFICATION_REJECT,
  ],
  REPORT_MANAGEMENT: [
    PERMISSIONS.REPORTS_RESOLVE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_ESCALATE,
  ],
  LIBRARY_MANAGEMENT: [
    PERMISSIONS.LIBRARY_MANAGE,
    PERMISSIONS.LIBRARY_UPLOAD,
    PERMISSIONS.LIBRARY_DELETE,
    PERMISSIONS.LIBRARY_EDIT,
  ],
  SYSTEM_ADMINISTRATION: [
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_MAINTENANCE,
  ],
} as const;
