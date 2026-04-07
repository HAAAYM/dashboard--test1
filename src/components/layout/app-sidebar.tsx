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

const navigation = [
  {
    title: 'Main',
    items: [
      {
        title: 'Overview',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        url: '/dashboard/users',
        icon: Users,
      },
      {
        title: 'Groups',
        url: '/dashboard/groups',
        icon: Users2,
      },
      {
        title: 'Feed Posts',
        url: '/dashboard/posts',
        icon: MessageSquare,
      },
      {
        title: 'Verification',
        url: '/dashboard/verification',
        icon: ShieldCheck,
      },
      {
        title: 'Reports',
        url: '/dashboard/reports',
        icon: Flag,
      },
      {
        title: 'Library',
        url: '/dashboard/library',
        icon: Library,
      },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      {
        title: 'Live Activity',
        url: '/dashboard/live-activity',
        icon: Activity,
      },
      {
        title: 'Audit Logs',
        url: '/dashboard/audit-logs',
        icon: FileText,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'AI Control',
        url: '/dashboard/ai-control',
        icon: Bot,
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="border-r border-border">
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.url}
                      className="hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
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
