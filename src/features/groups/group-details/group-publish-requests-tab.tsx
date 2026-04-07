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
  Check, 
  X, 
  Image as ImageIcon,
  Video as VideoIcon,
  FileText
} from 'lucide-react';
import { PublishRequest, GroupPost } from '../groups-types';
import { Group } from '../groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupPublishRequestsTabProps {
  group: Group;
  currentUser: User | null;
}

export function GroupPublishRequestsTab({ group, currentUser }: GroupPublishRequestsTabProps) {
  const [requests, setRequests] = useState<PublishRequest[]>([]);
  const [posts, setPosts] = useState<Record<string, GroupPost>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageRequests = currentUser?.role === UserRole.ADMIN || 
                           currentUser?.role === UserRole.SUPER_ADMIN || 
                           currentUser?.id === group.ownerId;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await groupsService.getPublishRequests(group.id);
        if (result.success && result.data) {
          setRequests(result.data);
          
          // Fetch posts to show actual post information
          const postsResult = await groupsService.getGroupPosts(group.id);
          if (postsResult.success && postsResult.data) {
            const postsMap: Record<string, GroupPost> = {};
            postsResult.data.forEach(post => {
              postsMap[post.id] = post;
            });
            setPosts(postsMap);
          }
        } else {
          setError(result.error || 'Failed to fetch publish requests');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [group.id]);

  const getStatusColor = (status: PublishRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'approved':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleApproveRequest = async (request: PublishRequest) => {
    if (!currentUser || !canManageRequests) return;
    
    const confirmed = window.confirm(
      `Approve publish request from ${request.requestedBy}? This will make the post visible globally.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.approvePublishRequest(request.id, currentUser.id);
      if (result.success) {
        toast.success('Publish request approved');
        // Refresh requests to show updated status
        const updatedRequests = await groupsService.getPublishRequests(group.id);
        if (updatedRequests.success && updatedRequests.data) {
          setRequests(updatedRequests.data);
        }
      } else {
        toast.error(result.error || 'Failed to approve request');
      }
    } catch (err) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (request: PublishRequest) => {
    if (!currentUser || !canManageRequests) return;
    
    const confirmed = window.confirm(
      `Reject publish request from ${request.requestedBy}? The post will remain group-only.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.rejectPublishRequest(request.id, currentUser.id);
      if (result.success) {
        toast.success('Publish request rejected');
        // Refresh requests to show updated status
        const updatedRequests = await groupsService.getPublishRequests(group.id);
        if (updatedRequests.success && updatedRequests.data) {
          setRequests(updatedRequests.data);
        }
      } else {
        toast.error(result.error || 'Failed to reject request');
      }
    } catch (err) {
      toast.error('Failed to reject request');
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
              <p className="text-muted-foreground">Loading publish requests...</p>
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
              Failed to Load Publish Requests
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

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Publish Requests Found</h3>
            <p className="text-muted-foreground">
              This group doesn't have any pending publish requests.
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
          <CardTitle>Publish Requests ({requests.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {requests.filter(req => req.status === 'pending').length} Pending
            </Badge>
            <Badge variant="outline">
              {requests.filter(req => req.status === 'approved').length} Approved
            </Badge>
            <Badge variant="outline">
              {requests.filter(req => req.status === 'rejected').length} Rejected
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Post Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const relatedPost = posts[request.postId];
              return (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {request.requestedBy.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{request.requestedBy}</div>
                      <div className="text-sm text-muted-foreground">Requester</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    {relatedPost ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{relatedPost.authorName}</span>
                          <span className="text-xs text-muted-foreground">• {relatedPost.type}</span>
                        </div>
                        <p className="text-sm">{relatedPost.content.substring(0, 100)}{relatedPost.content.length > 100 ? '...' : ''}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Post not found
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {relatedPost ? relatedPost.type.toUpperCase() : 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(request.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="default" 
                    className={getStatusColor(request.status)}
                  >
                    {request.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {request.reviewedAt ? formatDate(request.reviewedAt) : 'Not reviewed'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={!canManageRequests}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {request.status === 'pending' && canManageRequests && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleApproveRequest(request)}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve Request
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRejectRequest(request)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject Request
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {request.status !== 'pending' && (
                        <DropdownMenuItem disabled className="text-muted-foreground">
                          Request already {request.status}
                        </DropdownMenuItem>
                      )}
                      
                      {!canManageRequests && (
                        <DropdownMenuItem disabled className="text-muted-foreground">
                          Insufficient permissions
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
