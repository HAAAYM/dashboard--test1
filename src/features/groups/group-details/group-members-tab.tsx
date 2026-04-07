'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Crown, 
  Shield, 
  User,
  UserX,
  Ban
} from 'lucide-react';
import { GroupMember, GroupRole, GroupMemberStatus } from '../groups-types';
import { Group } from '../groups-types';
import { User as UserType } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupMembersTabProps {
  group: Group;
  currentUser: UserType | null;
  onMemberUpdated?: () => void;
}

export function GroupMembersTab({ group, currentUser, onMemberUpdated }: GroupMembersTabProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageMembers = currentUser?.role === UserRole.ADMIN || 
                          currentUser?.role === UserRole.SUPER_ADMIN || 
                          currentUser?.id === group.ownerId;

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await groupsService.getGroupMembers(group.id);
        if (result.success && result.data) {
          setMembers(result.data);
        } else {
          setError(result.error || 'Failed to fetch group members');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [group.id, onMemberUpdated]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePromoteMember = async (member: GroupMember) => {
    if (!currentUser || !canManageMembers) return;
    
    const confirmed = window.confirm(
      `Promote ${member.user.displayName} from ${member.role} to moderator?`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.updateGroupMemberRole(
        group.id, 
        member.userId, 
        'moderator',
        currentUser.id
      );
      
      if (result.success) {
        toast.success(`${member.user.displayName} promoted to moderator`);
        // Update local state immediately for UI reactivity
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.userId === member.userId ? { ...m, role: 'moderator' } : m
          )
        );
        onMemberUpdated?.();
      } else {
        toast.error(result.error || 'Failed to promote member');
      }
    } catch (err) {
      toast.error('Failed to promote member');
    }
  };

  const handleDemoteMember = async (member: GroupMember) => {
    if (!currentUser || !canManageMembers) return;
    
    const confirmed = window.confirm(
      `Demote ${member.user.displayName} from ${member.role} to member?`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.updateGroupMemberRole(
        group.id, 
        member.userId, 
        'member',
        currentUser.id
      );
      
      if (result.success) {
        toast.success(`${member.user.displayName} demoted to member`);
        // Update local state immediately for UI reactivity
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.userId === member.userId ? { ...m, role: 'member' } : m
          )
        );
        onMemberUpdated?.();
      } else {
        toast.error(result.error || 'Failed to demote member');
      }
    } catch (err) {
      toast.error('Failed to demote member');
    }
  };

  const handleRemoveMember = async (member: GroupMember) => {
    if (!currentUser || !canManageMembers) return;
    
    const confirmed = window.confirm(
      `Remove ${member.user.displayName} from group?`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.removeGroupMember(
        group.id, 
        member.userId,
        currentUser.id
      );
      
      if (result.success) {
        toast.success(`${member.user.displayName} removed from group`);
        // Update local state immediately for UI reactivity
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.userId === member.userId ? { ...m, status: 'left' } : m
          )
        );
        onMemberUpdated?.();
      } else {
        toast.error(result.error || 'Failed to remove member');
      }
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handleBanMember = async (member: GroupMember) => {
    if (!currentUser || !canManageMembers) return;
    
    const confirmed = window.confirm(
      `Ban ${member.user.displayName} from group? They will not be able to rejoin.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.banGroupMember(
        group.id, 
        member.userId,
        currentUser.id
      );
      
      if (result.success) {
        toast.success(`${member.user.displayName} banned from group`);
        // Update local state immediately for UI reactivity
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.userId === member.userId ? { ...m, status: 'banned' } : m
          )
        );
        onMemberUpdated?.();
      } else {
        toast.error(result.error || 'Failed to ban member');
      }
    } catch (err) {
      toast.error('Failed to ban member');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading members...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Failed to Load Members
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Group Members ({members.filter(m => m.status !== 'left').length})</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {members.filter(m => m.status !== 'left' && m.role === 'owner').length} Owner
            </Badge>
            <Badge variant="outline">
              {members.filter(m => m.status !== 'left' && m.role === 'moderator').length} Moderators
            </Badge>
            <Badge variant="outline">
              {members.filter(m => m.status !== 'left' && m.role === 'member').length} Members
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.filter(m => m.status !== 'left').map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.avatar} alt={member.user.displayName} />
                      <AvatarFallback>
                        {member.user.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.user.displayName}</div>
                      <div className="text-sm text-muted-foreground">ID: {member.userId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <Badge variant="outline" className={getRoleColor(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(member.joinedAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={!canManageMembers}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {canManageMembers && (
                        <>
                          {member.role === 'member' && (
                            <DropdownMenuItem onClick={() => handlePromoteMember(member)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Promote to Moderator
                            </DropdownMenuItem>
                          )}
                          
                          {member.role === 'moderator' && (
                            <DropdownMenuItem onClick={() => handleDemoteMember(member)}>
                              <User className="h-4 w-4 mr-2" />
                              Demote to Member
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member)}
                            className="text-orange-600"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Remove from Group
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleBanMember(member)}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban from Group
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {!canManageMembers && (
                        <DropdownMenuItem disabled className="text-muted-foreground">
                          Insufficient permissions
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}