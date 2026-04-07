'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Calendar, 
  Shield, 
  Activity, 
  Users, 
  FileText, 
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { UserDetails, UserActivity } from './users-types';
import { UserRole } from '@/lib/permissions/roles';
import { mockUserActivities } from './users-mock';

interface UserDetailsDialogProps {
  user: UserDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const userActivities = mockUserActivities.filter(activity => activity.userId === user.id);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'default';
      case UserRole.ADMIN:
        return 'secondary';
      case UserRole.MODERATOR:
        return 'outline';
      case UserRole.SUPPORT:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-primary';
      case UserRole.ADMIN:
        return 'bg-blue-600';
      case UserRole.MODERATOR:
        return 'bg-purple-600';
      case UserRole.SUPPORT:
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getVerificationBadgeColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <Activity className="h-4 w-4" />;
      case 'join_group':
        return <Users className="h-4 w-4" />;
      case 'leave_group':
        return <Users className="h-4 w-4" />;
      case 'upload_file':
        return <FileText className="h-4 w-4" />;
      case 'verification_request':
        return <Shield className="h-4 w-4" />;
      case 'post_created':
      case 'post_deleted':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityBadgeColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'text-green-600';
      case 'logout':
        return 'text-gray-600';
      case 'join_group':
        return 'text-blue-600';
      case 'leave_group':
        return 'text-orange-600';
      case 'upload_file':
        return 'text-purple-600';
      case 'verification_request':
        return 'text-yellow-600';
      case 'post_created':
        return 'text-green-600';
      case 'post_deleted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.displayName} />
              <AvatarFallback>
                {user.displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{user.displayName}</span>
                <Badge 
                  variant={getRoleBadgeVariant(user.role)} 
                  className={getRoleBadgeColor(user.role)}
                >
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            User profile and activity information
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Role</span>
                    </div>
                    <Badge 
                      variant={getRoleBadgeVariant(user.role)} 
                      className={getRoleBadgeColor(user.role)}
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Joined</span>
                    </div>
                    <p className="text-sm">{user.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Last Active</span>
                    </div>
                    <p className="text-sm">
                      {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : 'Never'}
                    </p>
                  </div>
                  {user.major && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Major</span>
                      </div>
                      <p className="text-sm">{user.major}</p>
                    </div>
                  )}
                  {user.verificationStatus && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Verification</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getVerificationBadgeColor(user.verificationStatus)}
                      >
                        {user.verificationStatus.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
                {user.bio && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Bio</div>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity found
                    </p>
                  ) : (
                    userActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`mt-1 ${getActivityBadgeColor(activity.action)}`}>
                          {getActivityIcon(activity.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.details}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Groups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.groupsCount}</div>
                  <p className="text-xs text-muted-foreground">Active memberships</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uploads</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.uploadsCount}</div>
                  <p className="text-xs text-muted-foreground">Files shared</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reports</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.reportsCount}</div>
                  <p className="text-xs text-muted-foreground">Reports filed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  <p className="text-xs text-muted-foreground">Account status</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
