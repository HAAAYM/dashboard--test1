'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Eye, Edit, Shield, Archive, Trash2, Users } from 'lucide-react';
import { Group, GroupType, GroupStatus } from './groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { usePermissionGuard } from '@/lib/permissions/guards';
import { PERMISSIONS } from '@/lib/permissions/permissions';
import { useGroups } from './groups-provider';

interface GroupsTableProps {
  currentUser: User | null;
  onGroupUpdated?: () => void;
  onViewDetails?: (group: Group) => void;
}

export function GroupsTable({ currentUser, onGroupUpdated, onViewDetails }: GroupsTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Group | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const { filteredGroups } = useGroups();

  const handleGroupClick = (groupId: string) => {
    router.push(`/dashboard/groups/${groupId}`);
  };

  const handleSort = (key: keyof Group) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

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

  const getActivityLevel = (group: Group) => {
    const messagesPerDay = group.messagesCount / Math.max(1, 
      (Date.now() - group.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (messagesPerDay > 10) return { level: 'High', color: 'text-green-600' };
    if (messagesPerDay > 2) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-gray-600' };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('name')}
          >
            Group Name
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('type')}
          >
            Type
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('status')}
          >
            Status
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('membersCount')}
          >
            Members
          </TableHead>
          <TableHead>Owner</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('lastActivity')}
          >
            Last Activity
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          const activity = getActivityLevel(group);
          
          return (
            <TableRow key={group.id} className="hover:bg-muted/30">
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>
                    {group.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div 
                    className="font-semibold hover:text-primary cursor-pointer transition-colors" 
                    onClick={() => handleGroupClick(group.id)}
                  >
                    {group.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {group.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="default" 
                  className={getTypeBadgeColor(group.type)}
                >
                  {group.type.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="default" 
                  className={getStatusBadgeColor(group.status)}
                >
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{group.membersCount}</span>
                  <span className="text-sm text-muted-foreground">
                    ({group.moderatorsCount} mods)
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  Owner: {group.ownerDisplayName || group.ownerId}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">
                    {group.lastActivity ? formatDate(group.lastActivity) : 'Never'}
                  </div>
                  <div className={`text-xs font-medium ${activity.color}`}>
                    Activity: {activity.level}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
