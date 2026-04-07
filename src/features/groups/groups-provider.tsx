'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Group, GroupFilters } from './groups-types';
import { mockGroups } from './groups-mock';

interface GroupsContextType {
  groups: Group[];
  filteredGroups: Group[];
  filters: GroupFilters;
  setGroups: (groups: Group[]) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  applyFilters: (filters: Partial<GroupFilters>) => void;
  resetFilters: () => void;
  loading: boolean;
  error: string | null;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroupsState] = useState<Group[]>(mockGroups);
  const [filters, setFilters] = useState<GroupFilters>({
    search: '',
    type: 'all_types',
    status: 'all_statuses',
    specialization: 'all_specializations',
    activityLevel: 'all_activity',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter groups based on current filters
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          group.name.toLowerCase().includes(searchLower) ||
          group.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type !== 'all_types' && group.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all_statuses' && group.status !== filters.status) {
        return false;
      }

      // Specialization filter (based on description/name)
      if (filters.specialization && filters.specialization !== 'all_specializations') {
        const specializationLower = filters.specialization.toLowerCase();
        const matchesSpecialization = 
          group.name.toLowerCase().includes(specializationLower) ||
          group.description.toLowerCase().includes(specializationLower);
        
        if (!matchesSpecialization) return false;
      }

      // Activity level filter (based on message count and last activity)
      if (filters.activityLevel && filters.activityLevel !== 'all_activity') {
        const messagesPerDay = group.messagesCount / Math.max(1, 
          (Date.now() - group.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const isHighActivity = messagesPerDay > 10;
        const isMediumActivity = messagesPerDay > 2 && messagesPerDay <= 10;
        const isLowActivity = messagesPerDay <= 2;
        
        if (filters.activityLevel === 'high' && !isHighActivity) return false;
        if (filters.activityLevel === 'medium' && !isMediumActivity) return false;
        if (filters.activityLevel === 'low' && !isLowActivity) return false;
      }

      return true;
    });
  }, [groups, filters]);

  // Set groups
  const setGroups = useCallback((newGroups: Group[]) => {
    setGroupsState(newGroups);
    setError(null);
  }, []);

  // Update group
  const updateGroup = useCallback((groupId: string, updates: Partial<Group>) => {
    setGroupsState(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, ...updates, updatedAt: new Date() } : group
      )
    );
    setError(null);
  }, []);

  // Delete group
  const deleteGroup = useCallback((groupId: string) => {
    setGroupsState(prevGroups => prevGroups.filter(group => group.id !== groupId));
    setError(null);
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<GroupFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all_types',
      status: 'all_statuses',
      specialization: 'all_specializations',
      activityLevel: 'all_activity',
    });
  }, []);

  const value = useMemo(() => ({
    groups,
    filteredGroups,
    filters,
    setGroups,
    updateGroup,
    deleteGroup,
    applyFilters,
    resetFilters,
    loading,
    error,
  }), [
    groups,
    filteredGroups,
    filters,
    setGroups,
    updateGroup,
    deleteGroup,
    applyFilters,
    resetFilters,
    loading,
    error,
  ]);

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}
