'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Group, GroupType, GroupStatus } from '../groups-types';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

interface GroupOverviewProps {
  group: Group;
}

export function GroupOverview({ group }: GroupOverviewProps) {
  const getTypeBadgeColor = (type: GroupType) => {
    switch (type) {
      case 'public':
        return 'bg-green-600';
      case 'private':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status: GroupStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-600';
      case 'suspended':
        return 'bg-orange-600';
      case 'archived':
        return 'bg-gray-600';
      case 'deleted':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getActivityLevel = () => {
    const messagesPerDay = group.messagesCount / Math.max(1, 
      (Date.now() - group.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (messagesPerDay > 10) return { level: 'High', color: 'text-green-600' };
    if (messagesPerDay > 2) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-gray-600' };
  };

  const activity = getActivityLevel();

  return (
    <div className="space-y-6">
      {/* Admin Summary Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={group.avatar} alt={group.name} />
              <AvatarFallback className="text-xl font-bold">
                {group.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <Badge 
                  variant="default" 
                  className={`${getTypeBadgeColor(group.type)} text-white`}
                >
                  {group.type.toUpperCase()}
                </Badge>
                <Badge 
                  variant="default" 
                  className={`${getStatusBadgeColor(group.status)} text-white`}
                >
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </Badge>
              </div>
              {group.description && (
                <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
                  {group.description}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Created: {formatDate(group.createdAt)}</span>
                {group.updatedAt && group.updatedAt.getTime() !== group.createdAt.getTime() && (
                  <span>Updated: {formatDate(group.updatedAt)}</span>
                )}
                {group.lastActivity && (
                  <span>Last Activity: {formatDate(group.lastActivity)}</span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-muted/20 rounded-lg border border-border/50">
              <div className="text-3xl font-bold text-primary">{group.membersCount || 0}</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Members</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-lg border border-border/50">
              <div className="text-3xl font-bold text-primary">{group.messagesCount || 0}</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Messages</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-lg border border-border/50">
              <div className="text-3xl font-bold text-primary">{group.mediaCount || 0}</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Media Files</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-lg border border-border/50">
              <div className={`text-3xl font-bold ${activity.color}`}>{activity.level}</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Activity Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Group Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Access Control</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visitor Preview</span>
                  <Badge variant={group.settings.visitorPreviewEnabled ? 'default' : 'secondary'}>
                    {group.settings.visitorPreviewEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visitors Can See Media</span>
                  <Badge variant={group.settings.visitorCanSeeMedia ? 'default' : 'secondary'}>
                    {group.settings.visitorCanSeeMedia ? 'Allowed' : 'Blocked'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Join Approval</span>
                  <Badge variant={group.settings.requireJoinApproval ? 'default' : 'secondary'}>
                    {group.settings.requireJoinApproval ? 'Required' : 'Not Required'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Media Uploads</span>
                  <Badge variant={group.settings.allowMedia ? 'default' : 'secondary'}>
                    {group.settings.allowMedia ? 'Allowed' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Max Media Size</span>
                  <Badge variant="outline">
                    {group.settings.maxMediaSizeMB} MB
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Information */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-2 text-muted-foreground">
                {formatDate(group.createdAt)}
              </span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-2 text-muted-foreground">
                {formatDate(group.updatedAt)}
              </span>
            </div>
            <div>
              <span className="font-medium">Owner ID:</span>
              <span className="ml-2 text-muted-foreground">
                {group.ownerId}
              </span>
            </div>
            <div>
              <span className="font-medium">Created By:</span>
              <span className="ml-2 text-muted-foreground">
                {group.createdBy}
              </span>
            </div>
            {group.lastActivity && (
              <div>
                <span className="font-medium">Last Activity:</span>
                <span className="ml-2 text-muted-foreground">
                  {formatDate(group.lastActivity)}
                </span>
              </div>
            )}
            {group.flaggedContentCount !== undefined && (
              <div>
                <span className="font-medium">Flagged Content:</span>
                <Badge variant="destructive" className="ml-2">
                  {group.flaggedContentCount}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
