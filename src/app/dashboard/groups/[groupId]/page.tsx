'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Settings, Eye, MessageSquare, Image, FileText, Shield, Flag } from 'lucide-react';
import { Group } from '@/features/groups/groups-types';
import { groupsService } from '@/features/groups/groups-service';
import { GroupOverview } from '@/features/groups/group-details/group-overview';
import { GroupMembersTab } from '@/features/groups/group-details/group-members-tab';
import { GroupSettings } from '@/features/groups/group-details/group-settings';
import { GroupMessagesTab } from '@/features/groups/group-details/group-messages-tab';
import { GroupMediaTab } from '@/features/groups/group-details/group-media-tab';
import { GroupPublishRequestsTab } from '@/features/groups/group-details/group-publish-requests-tab';
import { GroupModerationTab } from '@/features/groups/group-details/group-moderation-tab';
import { GroupReportsTab } from '@/features/groups/group-details/group-reports-tab';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

// Mock current user - in real app this would come from auth context
const mockCurrentUser: User = {
  id: '2',
  email: 'john.doe@university.edu',
  displayName: 'Dr. John Doe',
  role: UserRole.ADMIN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  createdAt: new Date('2024-01-15'),
  lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  status: 'active',
};

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupId = params.groupId as string;

  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) {
        setError('Group ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await groupsService.getGroupById(groupId);
        if (result.success && result.data) {
          setGroup(result.data);
        } else {
          setError(result.error || 'Failed to fetch group');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleGroupUpdated = () => {
    // Refetch group data when updates occur to get latest state
    if (groupId) {
      groupsService.getGroupById(groupId).then(result => {
        if (result.success && result.data) {
          setGroup(result.data);
        }
      });
    }
  };

  const handleBack = () => {
    router.push('/dashboard/groups');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading group details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">
                {error || 'Group not found'}
              </h2>
              <p className="text-muted-foreground mb-4">
                The group you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={handleBack}>
                Return to Groups
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
            <p className="text-muted-foreground">
              Manage group settings, members, and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="default" 
            className={group.type === 'public' ? 'bg-green-600' : 'bg-blue-600'}
          >
            {group.type.toUpperCase()}
          </Badge>
          <Badge 
            variant="default" 
            className={
              group.status === 'active' ? 'bg-green-600' : 
              group.status === 'suspended' ? 'bg-orange-600' : 
              group.status === 'archived' ? 'bg-gray-600' : 'bg-red-600'
            }
          >
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="relative w-full">
          <div className="overflow-x-auto border-b">
            <div className="flex w-full min-w-max">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Image className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="publish-requests" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <FileText className="h-4 w-4" />
                Publish Requests
              </TabsTrigger>
              <TabsTrigger value="moderation" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Shield className="h-4 w-4" />
                Moderation
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Flag className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 px-3 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-all duration-200">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </div>
          </div>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 p-4">
          <GroupOverview group={group} />
        </TabsContent>
        <TabsContent value="members" className="space-y-6 p-4">
          <GroupMembersTab 
            group={group} 
            currentUser={mockCurrentUser}
            onMemberUpdated={handleGroupUpdated}
          />
        </TabsContent>
        <TabsContent value="messages" className="space-y-6 p-4">
          <GroupMessagesTab 
            group={group} 
            currentUser={mockCurrentUser}
          />
        </TabsContent>
        <TabsContent value="media" className="space-y-6 p-4">
          <GroupMediaTab 
            group={group} 
            currentUser={mockCurrentUser}
          />
        </TabsContent>
        <TabsContent value="publish-requests" className="space-y-6 p-4">
          <GroupPublishRequestsTab 
            group={group} 
            currentUser={mockCurrentUser}
          />
        </TabsContent>
        <TabsContent value="moderation" className="space-y-6 p-4">
          <GroupModerationTab 
            group={group} 
            currentUser={mockCurrentUser}
          />
        </TabsContent>
        <TabsContent value="reports" className="space-y-6 p-4">
          <GroupReportsTab 
            group={group} 
            currentUser={mockCurrentUser}
          />
        </TabsContent>
        <TabsContent value="settings" className="space-y-6 p-4">
          <GroupSettings 
            group={group} 
            currentUser={mockCurrentUser}
            onSettingsUpdated={handleGroupUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
