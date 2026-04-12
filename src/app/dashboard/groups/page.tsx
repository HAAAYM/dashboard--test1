'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GroupsTable } from '@/features/groups/groups-table';
import { GroupsFilters } from '@/features/groups/groups-filters';
import { GroupsProvider, useGroups } from '@/features/groups/groups-provider';
import { Group } from '@/features/groups/groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

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

function GroupsPageContent() {
  const router = useRouter();
  const { filteredGroups, filters } = useGroups();

  const handleGroupUpdated = () => {
    // Context automatically updates, no additional action needed
  };

  const handleViewGroupDetails = (group: Group) => {
    router.push(`/dashboard/groups/${group.id}`);
  };

  // Calculate stats based on filtered groups
  const stats = (() => {
    const total = filteredGroups.length;
    const active = filteredGroups.filter(g => g.status === 'active').length;
    const publicGroups = filteredGroups.filter(g => g.type === 'public').length;
    const privateGroups = filteredGroups.filter(g => g.type === 'private').length;
    const totalMembers = filteredGroups.reduce((sum, g) => sum + g.membersCount, 0);

    return { total, active, publicGroups, privateGroups, totalMembers };
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Groups Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform groups
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {filters.search || 
               filters.type !== 'all_types' || 
               filters.status !== 'all_statuses' || 
               filters.specialization !== 'all_specializations' ||
               filters.activityLevel !== 'all_activity'
                ? 'Filtered results'
                : '+8% from last month'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Groups</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.publicGroups}</div>
            <p className="text-xs text-muted-foreground">
              Open to everyone
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Groups</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.privateGroups}</div>
            <p className="text-xs text-muted-foreground">
              Invite-only access
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Across all groups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <GroupsFilters
        groupCount={filteredGroups.length}
      />

      {/* Groups Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div>
            <CardTitle>All Groups</CardTitle>
            <CardDescription>
              Manage group settings, members, and permissions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <GroupsTable
            currentUser={mockCurrentUser}
            onGroupUpdated={handleGroupUpdated}
            onViewDetails={handleViewGroupDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function GroupsPage() {
  return (
    <GroupsProvider>
      <GroupsPageContent />
    </GroupsProvider>
  );
}
