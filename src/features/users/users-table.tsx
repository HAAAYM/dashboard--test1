'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserDetails } from './users-types';
import { UserRole } from '@/lib/permissions/roles';
import { UserActionsMenu } from './user-actions-menu';
import { User } from '@/types';
import { useUsers } from './users-provider';

interface UsersTableProps {
  currentUser: User | null;
  onUserUpdated?: () => void;
  onViewDetails?: (user: User) => void;
}

export function UsersTable({ currentUser, onUserUpdated, onViewDetails }: UsersTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserDetails | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const { filteredUsers } = useUsers();

  const handleSort = (key: keyof UserDetails) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600';
      case 'inactive':
        return 'bg-gray-600';
      case 'suspended':
        return 'bg-orange-600';
      case 'banned':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getVerificationBadgeColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('displayName')}
          >
            User
            {sortConfig.key === 'displayName' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('role')}
          >
            Role
            {sortConfig.key === 'role' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Verification</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('createdAt')}
          >
            Joined
            {sortConfig.key === 'createdAt' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('lastLoginAt')}
          >
            Last Active
            {sortConfig.key === 'lastLoginAt' && (
              <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.major && (
                    <div className="text-xs text-muted-foreground">{user.major}</div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={getRoleBadgeVariant(user.role)} 
                className={getRoleBadgeColor(user.role)}
              >
                {user.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant="default" 
                className={getStatusBadgeColor(user.status)}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              {user.verificationStatus && (
                <Badge 
                  variant="outline" 
                  className={getVerificationBadgeColor(user.verificationStatus)}
                >
                  {user.verificationStatus.toUpperCase()}
                </Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell>
              {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
            </TableCell>
            <TableCell className="text-right">
              <UserActionsMenu 
                user={user as User} 
                currentUser={currentUser}
                onUserUpdated={onUserUpdated}
                onViewDetails={(user) => onViewDetails?.(user)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
