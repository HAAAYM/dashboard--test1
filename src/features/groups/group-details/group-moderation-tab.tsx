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
  AlertTriangle, 
  Check, 
  Trash2,
  Shield
} from 'lucide-react';
import { GroupPost } from '../groups-types';
import { Group } from '../groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupModerationTabProps {
  group: Group;
  currentUser: User | null;
}

export function GroupModerationTab({ group, currentUser }: GroupModerationTabProps) {
  const [flaggedPosts, setFlaggedPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canModerate = currentUser?.role === UserRole.ADMIN || 
                     currentUser?.role === UserRole.SUPER_ADMIN || 
                     currentUser?.id === group.ownerId;

  useEffect(() => {
    const fetchFlaggedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await groupsService.getPostsByVisibility(group.id, 'requested_global');
        if (result.success && result.data) {
          setFlaggedPosts(result.data);
        } else {
          setError(result.error || 'Failed to fetch flagged posts');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedPosts();
  }, [group.id]);

  const handleApprovePost = async (post: GroupPost) => {
    if (!currentUser || !canModerate) return;
    
    const confirmed = window.confirm(
      `Approve this flagged post from ${post.authorName}? This will remove the flag.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.approveFlaggedPost(post.id, currentUser.id);
      
      if (result.success) {
        toast.success(`Post approved and flag removed`);
        // Update local state to reflect change immediately
        setFlaggedPosts(prev => prev.filter(p => p.id !== post.id));
      } else {
        toast.error(result.error || 'Failed to approve post');
      }
    } catch (err) {
      toast.error('Failed to approve post');
    }
  };

  const handleDeletePost = async (post: GroupPost) => {
    if (!currentUser || !canModerate) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete this flagged post from ${post.authorName}? This cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.deleteFlaggedPost(post.id, currentUser.id);
      
      if (result.success) {
        toast.success('Flagged post deleted successfully');
        // Update local state to reflect change immediately
        setFlaggedPosts(prev => prev.filter(p => p.id !== post.id));
      } else {
        toast.error(result.error || 'Failed to delete post');
      }
    } catch (err) {
      toast.error('Failed to delete post');
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

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading flagged posts...</p>
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
              Failed to Load Moderation Queue
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

  if (flaggedPosts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Flagged Posts</h3>
            <p className="text-muted-foreground">
              All posts in this group are safe. No moderation needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Moderation Queue ({flaggedPosts.length})
          </CardTitle>
          <Badge variant="destructive">
            {flaggedPosts.length} posts need review
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedPosts.map((post) => (
              <TableRow key={post.id} className="border-orange-200">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-800">
                        {post.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.authorName}</div>
                      <div className="text-sm text-muted-foreground">ID: {post.authorId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm text-orange-800 bg-orange-50 p-2 rounded">
                      {truncateContent(post.content, 150)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {post.visibility === 'published_global' ? 'Global' : post.visibility === 'requested_global' ? 'Requested' : 'Group Only'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(post.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={post.visibility === 'published_global' ? "default" : "secondary"}>
                    {post.visibility === 'published_global' ? "Published" : "Group Only"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={!canModerate}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {canModerate && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleApprovePost(post)}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve Anyway
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeletePost(post)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {!canModerate && (
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
