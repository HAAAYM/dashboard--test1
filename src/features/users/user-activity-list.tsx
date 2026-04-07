'use client';

import { UserActivity } from './users-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  FileText, 
  Shield,
  Calendar,
  Clock
} from 'lucide-react';

interface UserActivityListProps {
  activities: UserActivity[];
  title?: string;
  description?: string;
  maxItems?: number;
}

export function UserActivityList({ 
  activities, 
  title = "Recent Activity", 
  description = "Latest user actions and interactions",
  maxItems = 10 
}: UserActivityListProps) {
  const displayActivities = activities.slice(0, maxItems);

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'logout':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'join_group':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'leave_group':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'upload_file':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'verification_request':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'post_created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'post_deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityLabel = (action: string) => {
    switch (action) {
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      case 'join_group':
        return 'Joined Group';
      case 'leave_group':
        return 'Left Group';
      case 'upload_file':
        return 'File Upload';
      case 'verification_request':
        return 'Verification Request';
      case 'post_created':
        return 'Post Created';
      case 'post_deleted':
        return 'Post Deleted';
      default:
        return action.replace('_', ' ').toUpperCase();
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

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`mt-1 p-2 rounded-full ${getActivityBadgeColor(activity.action)}`}>
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{activity.details}</p>
                  <Badge variant="outline" className="text-xs">
                    {getActivityLabel(activity.action)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatRelativeTime(activity.timestamp)}</span>
                </div>
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {activities.length > maxItems && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {maxItems} of {activities.length} activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
