'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { UserFilters } from './users-types';
import { UserRole } from '@/lib/permissions/roles';
import { mockMajors } from './users-mock';
import { useUsers } from './users-provider';

interface UsersFiltersProps {
  userCount: number;
}

export function UsersFilters({ userCount }: UsersFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { filters, applyFilters, resetFilters } = useUsers();

  const updateFilter = (key: keyof UserFilters, value: any) => {
    applyFilters({ [key]: value });
  };

  const clearFilters = () => {
    resetFilters();
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => 
      value !== 'all_roles' && 
      value !== 'all_statuses' && 
      value !== 'all_verification' && 
      value !== 'all_majors' && 
      value !== ''
  ).length;

  return (
    <div className="space-y-4">
      {/* Basic Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-4 md:grid-cols-4 p-4 bg-card border rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_roles">All roles</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                <SelectItem value={UserRole.SUPPORT}>Support</SelectItem>
                <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification</label>
            <Select value={filters.verified} onValueChange={(value) => updateFilter('verified', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_verification">All verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Major</label>
            <Select value={filters.major || 'all_majors'} onValueChange={(value) => updateFilter('major', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All majors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_majors">All majors</SelectItem>
                {mockMajors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {userCount} user{userCount !== 1 ? 's' : ''} found
        {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
      </div>
    </div>
  );
}
