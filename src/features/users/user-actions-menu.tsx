'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, UserCheck, UserX, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { usePermissionGuard } from '@/lib/permissions/guards';
import { PERMISSIONS } from '@/lib/permissions/permissions';
import { useUsers } from './users-provider';
import { usersService, logAuditEvent } from './users-service';
import { toast } from 'sonner';

interface UserActionsMenuProps {
  user: User;
  currentUser: User | null;
  onUserUpdated?: () => void;
  onViewDetails?: (user: User) => void;
}

export function UserActionsMenu({ user, currentUser, onUserUpdated, onViewDetails }: UserActionsMenuProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const permissions = usePermissionGuard(currentUser);
  const { updateUser, deleteUser } = useUsers();

  const canViewDetails = permissions.checkPermission(PERMISSIONS.USERS_VIEW);
  const canEdit = permissions.checkPermission(PERMISSIONS.USERS_EDIT);
  const canChangeRole = permissions.canChangeRole(user.role, user.role);
  const canBan = permissions.canBanUser(user.role);
  const canDelete = permissions.canDeleteUser(user.role);

  const handleAction = async (
    action: string, 
    title: string, 
    description: string, 
    onConfirm: () => Promise<void>
  ) => {
    setConfirmDialog({
      open: true,
      action,
      title,
      description,
      onConfirm,
    });
  };

  const executeAction = async () => {
    if (!confirmDialog || !currentUser) return;

    setIsActionLoading(true);
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
      onUserUpdated?.();
      toast.success(`${confirmDialog.action} completed successfully`);
    } catch (error) {
      toast.error(`Failed to ${confirmDialog.action}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!currentUser) return;
    
    const result = await usersService.banUser(user.id, currentUser.displayName);
    if (!result.success) throw new Error(result.error);

    // Log audit event
    logAuditEvent('ban_user', user as any, currentUser.displayName, { status: user.status }, { status: 'banned' });

    // Update user in state
    updateUser(user.id, { status: 'banned' });
  };

  const handleActivateUser = async () => {
    if (!currentUser) return;
    
    const result = await usersService.activateUser(user.id, currentUser.displayName);
    if (!result.success) throw new Error(result.error);

    // Log audit event
    logAuditEvent('activate_user', user as any, currentUser.displayName, { status: user.status }, { status: 'active' });

    // Update user in state
    updateUser(user.id, { status: 'active' });
  };

  const handleChangeRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    
    const result = await usersService.changeUserRole(user.id, newRole, currentUser.displayName);
    if (!result.success) throw new Error(result.error);

    // Log audit event
    logAuditEvent('change_role', user as any, currentUser.displayName, { role: user.role }, { role: newRole });

    // Update user in state
    updateUser(user.id, { role: newRole });
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    const result = await usersService.deleteUser(user.id, currentUser.displayName);
    if (!result.success) throw new Error(result.error);

    // Log audit event
    logAuditEvent('delete_user', user as any, currentUser.displayName, user, null);

    // Remove user from state
    deleteUser(user.id);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'default';
      case UserRole.ADMIN:
        return 'secondary';
      case UserRole.MODERATOR:
        return 'outline';
      case UserRole.SUPPORT:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-primary';
      case UserRole.ADMIN:
        return 'bg-blue-600';
      case UserRole.MODERATOR:
        return 'bg-purple-600';
      case UserRole.SUPPORT:
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={!canViewDetails}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onViewDetails?.(user)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>

          {canEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Edit user:', user)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </DropdownMenuItem>
            </>
          )}

          {canChangeRole && (
            <DropdownMenuItem onClick={() => console.log('Change role:', user)}>
              <Shield className="h-4 w-4 mr-2" />
              Change Role
            </DropdownMenuItem>
          )}

          {canBan && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleAction(
                    user.status === 'active' ? 'suspend' : 'activate',
                    user.status === 'active' ? 'Suspend User' : 'Activate User',
                    `Are you sure you want to ${user.status === 'active' ? 'suspend' : 'activate'} ${user.displayName}?`,
                    user.status === 'active' ? handleBanUser : handleActivateUser
                  )
                }
              >
                {user.status === 'active' ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() =>
                  handleAction(
                    'delete',
                    'Delete User',
                    `Are you sure you want to permanently delete ${user.displayName}? This action cannot be undone.`,
                    handleDeleteUser
                  )
                }
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </>
          )}

          {!canViewDetails && (
            <DropdownMenuItem disabled className="text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Insufficient permissions
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog?.open || false} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        {confirmDialog && (
          <>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {confirmDialog.action === 'delete' && <Trash2 className="h-5 w-5 text-red-600" />}
                  {confirmDialog.action === 'suspend' && <UserX className="h-5 w-5 text-orange-600" />}
                  {confirmDialog.action === 'activate' && <UserCheck className="h-5 w-5 text-green-600" />}
                  {confirmDialog.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="space-y-2">
                    <p>{confirmDialog.description}</p>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {user.displayName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <Badge variant={getRoleBadgeVariant(user.role)} className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDialog(null)} disabled={isActionLoading}>
                  Cancel
                </Button>
                <Button
                  variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
                  onClick={executeAction}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Processing...' : 
                   confirmDialog.action === 'delete' ? 'Delete' : 
                   confirmDialog.action === 'suspend' ? 'Suspend' : 'Activate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
