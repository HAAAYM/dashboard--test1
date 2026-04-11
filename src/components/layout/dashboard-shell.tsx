'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface DashboardShellProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine sidebar side based on language direction
  const side = mounted ? (i18n.language === 'ar' ? 'right' : 'left') : 'left';

  return (
    <SidebarProvider>
      <AppSidebar side={side} />
      <SidebarInset className="flex-1">
        <AppHeader />
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <I18nProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </I18nProvider>
  );
}
