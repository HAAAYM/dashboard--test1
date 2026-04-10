'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, onAuthStateChange, signIn, signOut } from './auth-service';
import { checkAdminAccess, AdminUser } from './admin-access';
import { createAdminSession, endAdminSession } from './admin-sessions';

interface AuthContextType {
  user: AuthUser | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      console.log('=== AUTH PROVIDER DEBUG ===');
      console.log('Auth state changed - authUser:', authUser);
      if (authUser) {
        console.log('Current Firebase auth user:');
        console.log('  - uid:', authUser.uid);
        console.log('  - email:', authUser.email);
      }
      
      setUser(authUser);
      setAdminUser(null);
      setSessionId(null);
      
      if (authUser) {
        console.log('Starting admin access check for uid:', authUser.uid);
        // Check admin access when user is authenticated
        try {
          const adminResult = await checkAdminAccess(authUser.uid);
          console.log('Admin check result:', adminResult);
          
          if (adminResult.success && adminResult.adminUser) {
            console.log('Admin check SUCCEEDED - setting adminUser');
            setAdminUser(adminResult.adminUser);
            
            // Create admin session
            const sessionResult = await createAdminSession(
              adminResult.adminUser.authUid,
              adminResult.adminUser.displayName
            );
            if (sessionResult.success && sessionResult.sessionId) {
              setSessionId(sessionResult.sessionId);
            } else {
              console.warn('Failed to create admin session:', sessionResult.error);
            }
          } else {
            console.log('Admin check FAILED - adminUser remains null');
            console.log('Failure reason:', adminResult.error);
          }
        } catch (error) {
          console.error('Admin access check failed with exception:', error);
        }
      } else {
        console.log('No authenticated user - adminUser remains null');
      }
      
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      const authUser = await signIn(email, password);
      setUser(authUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // End admin session if active
      if (sessionId) {
        try {
          await endAdminSession(sessionId);
        } catch (error) {
          console.warn('Failed to end admin session:', error);
        }
      }
      
      await signOut();
      setUser(null);
      setAdminUser(null);
      setSessionId(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = !!adminUser;

  const value: AuthContextType = {
    user,
    adminUser,
    loading,
    error,
    isAdmin,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
