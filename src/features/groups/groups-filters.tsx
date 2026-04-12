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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups by name or description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 h-10 border-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm">
              {groupCount} groups
              {activeFiltersCount > 0 && (
                <span className="ml-1 text-xs">
                  ({activeFiltersCount} filtered)
                </span>
              )}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="hover:bg-muted/50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Group Type</label>
              <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">All Types</SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          
          <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Group Status</label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Statuses</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Suspended
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Archived
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          
          <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Specialization</label>
              <Select 
                value={filters.specialization || 'all_specializations'} 
                onValueChange={(value) => updateFilter('specialization', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_specializations">All Specializations</SelectItem>
                  {mockGroupSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {filters.specialization && filters.specialization !== 'all_specializations' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('specialization', 'all_specializations')}
                  className="ml-2 hover:bg-muted/50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          
          <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Activity Level</label>
              <Select 
                value={filters.activityLevel || 'all_activity'} 
                onValueChange={(value) => updateFilter('activityLevel', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All activity levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_activity">All Activity Levels</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High Activity
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium Activity
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Low Activity
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {filters.activityLevel && filters.activityLevel !== 'all_activity' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('activityLevel', 'all_activity')}
                  className="ml-2 hover:bg-muted/50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {activeFiltersCount} filter{activeFiltersCount === 1 ? '' : 's'} applied
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="hover:bg-muted/50 transition-colors"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
