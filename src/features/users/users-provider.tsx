'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { UserDetails } from './users-types';
import { mockUsers } from './users-mock';

interface UsersFilters {
  search: string;
  role: UserRole | 'all_roles';
  status: 'active' | 'inactive' | 'suspended' | 'banned' | 'all_statuses';
  verified: 'verified' | 'unverified' | 'all_verification';
  major?: string | 'all_majors';
}

interface UsersContextType {
  users: UserDetails[];
  filteredUsers: UserDetails[];
  filters: UsersFilters;
  setUsers: (users: UserDetails[]) => void;
  updateUser: (userId: string, updates: Partial<UserDetails>) => void;
  deleteUser: (userId: string) => void;
  applyFilters: (filters: Partial<UsersFilters>) => void;
  resetFilters: () => void;
  loading: boolean;
  error: string | null;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsersState] = useState<UserDetails[]>(mockUsers);
  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    role: 'all_roles',
    status: 'all_statuses',
    verified: 'all_verification',
    major: 'all_majors',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          user.displayName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.major && user.major.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Role filter
      if (filters.role !== 'all_roles' && user.role !== filters.role) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all_statuses') {
        if (filters.status === 'active' && user.status !== 'active') return false;
        if (filters.status === 'inactive' && user.status !== 'inactive') return false;
        if (filters.status === 'suspended' && user.status !== 'suspended') return false;
        if (filters.status === 'banned' && user.status !== 'banned') return false;
      }

      // Verification filter
      if (filters.verified !== 'all_verification') {
        if (filters.verified === 'verified' && user.verificationStatus !== 'approved') return false;
        if (filters.verified === 'unverified' && user.verificationStatus === 'approved') return false;
      }

      // Major filter
      if (filters.major !== 'all_majors' && user.major !== filters.major) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  // Set users
  const setUsers = useCallback((newUsers: UserDetails[]) => {
    setUsersState(newUsers);
    setError(null);
  }, []);

  // Update user
  const updateUser = useCallback((userId: string, updates: Partial<UserDetails>) => {
    setUsersState(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
    setError(null);
  }, []);

  // Delete user
  const deleteUser = useCallback((userId: string) => {
    setUsersState(prevUsers => prevUsers.filter(user => user.id !== userId));
    setError(null);
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<UsersFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      role: 'all_roles',
      status: 'all_statuses',
      verified: 'all_verification',
      major: 'all_majors',
    });
  }, []);

  const value = useMemo(() => ({
    users,
    filteredUsers,
    filters,
    setUsers,
    updateUser,
    deleteUser,
    applyFilters,
    resetFilters,
    loading,
    error,
  }), [
    users,
    filteredUsers,
    filters,
    setUsers,
    updateUser,
    deleteUser,
    applyFilters,
    resetFilters,
    loading,
    error,
  ]);

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
