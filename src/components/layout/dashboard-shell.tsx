'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { useAuth } from '@/lib/auth/auth-provider';
import { Loader2 } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only apply protection to dashboard routes
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    
    if (!loading && isDashboardRoute) {
      if (!user) {
        setIsChecking(false);
        router.push('/login');
      } else if (!isAdmin) {
        // User is authenticated but not an admin
        setIsChecking(false);
        router.push('/unauthorized');
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, isAdmin, pathname]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <AppHeader />
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
