'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UserCheck, UserX, Shield } from 'lucide-react';
import { UserDetailsDialog } from '@/features/users/user-details-dialog';
import { UsersTable } from '@/features/users/users-table';
import { UsersFilters } from '@/features/users/users-filters';
import { UserDetails } from '@/features/users/users-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { UsersProvider, useUsers } from '@/features/users/users-provider';

// Mock current user - in real app this would come from auth context
const mockCurrentUser: User = {
  id: '2',
  email: 'john.doe@university.edu',
  displayName: 'Dr. John Doe',
  role: UserRole.ADMIN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  createdAt: new Date('2024-01-15'),
  lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  status: 'active',
};

function UsersPageContent() {
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { filteredUsers, filters } = useUsers();

  // Calculate stats based on filtered users
  const stats = (() => {
    const total = filteredUsers.length;
    const active = filteredUsers.filter(u => u.status === 'active').length;
    const newThisWeek = filteredUsers.filter(u => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return u.createdAt > weekAgo;
    }).length;
    const inactive = total - active;

    return { total, active, newThisWeek, inactive };
  })();

  const handleUserUpdated = () => {
    // Context automatically updates, no additional action needed
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user as UserDetails);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform users
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {filters.search || 
               filters.role !== 'all_roles' || 
               filters.status !== 'all_statuses' || 
               filters.verified !== 'all_verification' || 
               filters.major !== 'all_majors'
                ? 'Filtered results'
                : '+12% from last month'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.active / stats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.inactive / stats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <UsersFilters
        userCount={filteredUsers.length}
      />

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            currentUser={mockCurrentUser}
            onUserUpdated={handleUserUpdated}
            onViewDetails={handleViewUserDetails}
          />
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  );
}
