'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Users2, 
  MessageSquare, 
  ShieldCheck, 
  Flag, 
  Library, 
  Activity, 
  FileText, 
  Bot, 
  Settings 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const navigation = [
  {
    title: 'Main',
    items: [
      {
        titleKey: 'sidebar.dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        titleKey: 'sidebar.users',
        url: '/dashboard/users',
        icon: Users,
      },
      {
        titleKey: 'sidebar.groups',
        url: '/dashboard/groups',
        icon: Users2,
      },
      {
        titleKey: 'sidebar.posts',
        url: '/dashboard/posts',
        icon: MessageSquare,
      },
      {
        titleKey: 'sidebar.verification',
        url: '/dashboard/verification',
        icon: ShieldCheck,
      },
      {
        titleKey: 'sidebar.reports',
        url: '/dashboard/reports',
        icon: Flag,
      },
      {
        titleKey: 'sidebar.library',
        url: '/dashboard/library',
        icon: Library,
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      {
        titleKey: 'sidebar.live_activity',
        url: '/dashboard/live-activity',
        icon: Activity,
      },
      {
        titleKey: 'sidebar.audit_logs',
        url: '/dashboard/audit-logs',
        icon: FileText,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        titleKey: 'sidebar.ai_control',
        url: '/dashboard/ai-control',
        icon: Bot,
      },
      {
        titleKey: 'sidebar.settings',
        url: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({ side = 'left' }: { side?: 'left' | 'right' }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Sidebar variant="inset" side={side} className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">EM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Edu Mate</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      className="hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border">
        <div className="px-3 py-2">
          <div className="text-xs text-muted-foreground">
            Version 1.0.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
