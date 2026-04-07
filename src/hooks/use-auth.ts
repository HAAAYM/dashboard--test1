'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'admin@edumate.com',
  displayName: 'Super Admin',
  role: UserRole.SUPER_ADMIN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  createdAt: new Date('2024-01-01'),
  lastLoginAt: new Date(),
  status: 'active',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For development, auto-login with mock user
      // In production, this would check Firebase Auth
      setUser(mockUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    if (email === 'admin@edumate.com' && password === 'admin') {
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setIsLoading(false);
  };

  const hasPermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete') => {
    if (!user) return false;
    
    // Import permissions logic
    const { hasPermission: checkPermission } = require('@/lib/permissions/roles');
    return checkPermission(user.role, resource, action);
  };

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
