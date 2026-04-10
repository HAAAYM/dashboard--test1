'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Users2, MessageSquare, ShieldCheck, TrendingUp, Activity, FileText, Library } from 'lucide-react';
import { mockDataService } from '@/lib/services/mock-data';
import { useTranslation } from 'react-i18next';

export default function OverviewPage() {
  const { t } = useTranslation();
  
  const stats = [
    {
      titleKey: 'dashboard.totalUsers',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active registered users',
    },
    {
      titleKey: 'dashboard.totalGroups',
      value: '45',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users2,
      description: 'Community groups',
    },
    {
      titleKey: 'dashboard.totalPosts',
      value: '1,234',
      change: '+23%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      description: 'Feed posts this month',
    },
    {
      titleKey: 'dashboard.pendingVerifications',
      value: '23',
      change: '-5%',
      changeType: 'negative' as const,
      icon: ShieldCheck,
      description: 'Awaiting review',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      user: 'Alice Johnson',
      action: 'created a new post',
      time: '2 minutes ago',
      type: 'post',
    },
    {
      id: '2',
      user: 'Dr. John Doe',
      action: 'approved verification',
      time: '15 minutes ago',
      type: 'verification',
    },
    {
      id: '3',
      user: 'Jane Smith',
      action: 'resolved a report',
      time: '1 hour ago',
      type: 'report',
    },
    {
      id: '4',
      user: 'Bob Wilson',
      action: 'joined CS Department',
      time: '2 hours ago',
      type: 'group',
    },
  ];

  const topGroups = [
    {
      name: 'Computer Science Department',
      members: 245,
      posts: 89,
      growth: '+15%',
    },
    {
      name: 'Study Group - Advanced Algorithms',
      members: 32,
      posts: 156,
      growth: '+8%',
    },
    {
      name: 'Mathematics Club',
      members: 89,
      posts: 45,
      growth: '+12%',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.overview')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.welcome')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.titleKey} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(stat.titleKey)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {stat.change}
                </span>{' '}
                from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Groups */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Top Groups
            </CardTitle>
            <CardDescription>
              Most active communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topGroups.map((group, index) => (
                <div key={group.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {index + 1}. {group.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {group.growth}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{group.members} members</span>
                    <span>{group.posts} posts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current platform health and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">API Status</span>
                <Badge variant="default" className="bg-green-600">
                  Operational
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                All systems running normally
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Database</span>
                <Badge variant="default" className="bg-green-600">
                  Healthy
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Response time: 12ms
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Storage</span>
                <Badge variant="outline">
                  67% Used
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                2.1 GB of 3.1 GB used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
