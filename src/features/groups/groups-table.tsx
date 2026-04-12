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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 font-medium"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Group Name
                {sortConfig.key === 'name' && (
                  <span className="text-xs text-muted-foreground">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 font-medium"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-1">
                Type
                {sortConfig.key === 'type' && (
                  <span className="text-xs text-muted-foreground">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 font-medium"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                {sortConfig.key === 'status' && (
                  <span className="text-xs text-muted-foreground">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 font-medium"
              onClick={() => handleSort('membersCount')}
            >
              <div className="flex items-center gap-1">
                Members
                {sortConfig.key === 'membersCount' && (
                  <span className="text-xs text-muted-foreground">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="font-medium">Owner</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 font-medium"
              onClick={() => handleSort('lastActivity')}
            >
              <div className="flex items-center gap-1">
                Last Activity
                {sortConfig.key === 'lastActivity' && (
                  <span className="text-xs text-muted-foreground">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {sortedGroups.map((group) => {
          const activity = getActivityLevel(group);
          
          return (
            <TableRow key={group.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="py-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback className="text-sm font-medium">
                    {group.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="py-3">
                <div className="space-y-1">
                  <div 
                    className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors" 
                    onClick={() => handleGroupClick(group.id)}
                  >
                    {group.name}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <Badge 
                  variant="default" 
                  className={`${getTypeBadgeColor(group.type)} text-xs font-medium px-2 py-1`}
                >
                  {group.type.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                <Badge 
                  variant="default" 
                  className={`${getStatusBadgeColor(group.status)} text-xs font-medium px-2 py-1`}
                >
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{group.membersCount}</span>
                  </div>
                  {group.moderatorsCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {group.moderatorsCount} mods
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="text-sm text-muted-foreground">
                  ID: {group.ownerId}
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="space-y-2">
                  <div className="text-sm">
                    {group.lastActivity ? formatDate(group.lastActivity) : 'Never'}
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${activity.color === 'text-green-600' ? 'bg-green-100 text-green-700' : activity.color === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                    {activity.level} Activity
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3 text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-muted/50 transition-colors"
                  onClick={() => handleGroupClick(group.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
