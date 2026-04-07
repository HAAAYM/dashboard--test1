'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, MessageSquare, Eye, TrendingUp, Clock, Globe } from 'lucide-react';

export default function LiveActivityPage() {
  const liveStats = [
    {
      title: 'Online Users',
      value: '127',
      change: '+15%',
      icon: Users,
      description: 'Currently active',
      color: 'text-green-600',
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+8%',
      icon: Activity,
      description: 'Engaged users',
      color: 'text-blue-600',
    },
    {
      title: 'New Posts',
      value: '23',
      change: '+12%',
      icon: MessageSquare,
      description: 'Last hour',
      color: 'text-purple-600',
    },
    {
      title: 'Page Views',
      value: '1,847',
      change: '+23%',
      icon: Eye,
      description: 'Last hour',
      color: 'text-orange-600',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      user: 'Alice Johnson',
      action: 'logged in',
      details: 'From New York, US',
      time: 'Just now',
      type: 'login',
      ip: '192.168.1.100',
    },
    {
      id: '2',
      user: 'Bob Wilson',
      action: 'posted in CS Department',
      details: 'Shared study resources',
      time: '2 minutes ago',
      type: 'post',
      ip: '192.168.1.101',
    },
    {
      id: '3',
      user: 'Carol Davis',
      action: 'joined Study Group',
      details: 'Advanced Algorithms',
      time: '5 minutes ago',
      type: 'group',
      ip: '192.168.1.102',
    },
    {
      id: '4',
      user: 'Dr. John Doe',
      action: 'approved verification',
      details: 'Student application',
      time: '8 minutes ago',
      type: 'verification',
      ip: '192.168.1.103',
    },
    {
      id: '5',
      user: 'David Brown',
      action: 'downloaded file',
      details: 'Algorithm Textbook PDF',
      time: '12 minutes ago',
      type: 'download',
      ip: '192.168.1.104',
    },
    {
      id: '6',
      user: 'Emma Wilson',
      action: 'created new group',
      details: 'Mathematics Study Circle',
      time: '15 minutes ago',
      type: 'group',
      ip: '192.168.1.105',
    },
    {
      id: '7',
      user: 'Frank Miller',
      action: 'submitted verification',
      details: 'Faculty documents',
      time: '18 minutes ago',
      type: 'verification',
      ip: '192.168.1.106',
    },
    {
      id: '8',
      user: 'Grace Lee',
      action: 'reported content',
      details: 'Inappropriate post',
      time: '22 minutes ago',
      type: 'report',
      ip: '192.168.1.107',
    },
  ];

  const topPages = [
    { page: '/dashboard', views: 342, percentage: 18.5 },
    { page: '/groups/computer-science', views: 289, percentage: 15.6 },
    { page: '/users/profile', views: 234, percentage: 12.7 },
    { page: '/library/resources', views: 198, percentage: 10.7 },
    { page: '/posts/feed', views: 176, percentage: 9.5 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Users className="h-4 w-4" />;
      case 'post':
        return <MessageSquare className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'verification':
        return <Activity className="h-4 w-4" />;
      case 'download':
        return <Eye className="h-4 w-4" />;
      case 'report':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'login':
        return <Badge variant="outline" className="text-green-600">Login</Badge>;
      case 'post':
        return <Badge variant="outline" className="text-blue-600">Post</Badge>;
      case 'group':
        return <Badge variant="outline" className="text-purple-600">Group</Badge>;
      case 'verification':
        return <Badge variant="outline" className="text-orange-600">Verification</Badge>;
      case 'download':
        return <Badge variant="outline" className="text-cyan-600">Download</Badge>;
      case 'report':
        return <Badge variant="outline" className="text-red-600">Report</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Activity Monitor</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of platform activity and user engagement
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {liveStats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time user activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{activity.user}</span>
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                      {getActivityBadge(activity.type)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{activity.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {activity.ip}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Pages
            </CardTitle>
            <CardDescription>
              Most visited pages in the last hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {index + 1}. {page.page}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{page.views}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{page.percentage}% of traffic</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <CardDescription>
            User activity by location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">United States</span>
                <Badge variant="outline">89 users</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">United Kingdom</span>
                <Badge variant="outline">18 users</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Canada</span>
                <Badge variant="outline">12 users</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Others</span>
                <Badge variant="outline">8 users</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
