'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { GroupFilters } from './groups-types';
import { useGroups } from './groups-provider';
import { mockGroupSpecializations } from './groups-mock';

interface GroupsFiltersProps {
  groupCount: number;
}

export function GroupsFilters({ groupCount }: GroupsFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { filters, applyFilters, resetFilters } = useGroups();

  const updateFilter = (key: keyof GroupFilters, value: any) => {
    applyFilters({ [key]: value });
  };

  const clearFilters = () => {
    resetFilters();
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => 
      value !== 'all_types' && 
      value !== 'all_statuses' && 
      value !== 'all_specializations' &&
      value !== 'all_activity' &&
      value !== ''
  ).length;

  return (
    <div className="space-y-4">
      {/* Basic Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups by name or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {groupCount} groups
            {activeFiltersCount > 0 && (
              <span className="ml-1 text-xs">
                ({activeFiltersCount} filtered)
              </span>
            )}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-4 md:grid-cols-4 p-4 bg-card border rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">All types</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
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
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specialization</label>
            <Select 
              value={filters.specialization || 'all_specializations'} 
              onValueChange={(value) => updateFilter('specialization', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_specializations">All specializations</SelectItem>
                {mockGroupSpecializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <Select 
              value={filters.activityLevel || 'all_activity'} 
              onValueChange={(value) => updateFilter('activityLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All activity levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_activity">All activity levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
