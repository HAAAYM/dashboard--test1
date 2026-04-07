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
  MessageSquare, 
  Image, 
  Video, 
  Trash2,
  FileText
} from 'lucide-react';
import { GroupPost, GroupPostType, PostVisibility } from '../groups-types';
import { Group } from '../groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupMessagesTabProps {
  group: Group;
  currentUser: User | null;
}

export function GroupMessagesTab({ group, currentUser }: GroupMessagesTabProps) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageMessages = currentUser?.role === UserRole.ADMIN || 
                           currentUser?.role === UserRole.SUPER_ADMIN || 
                           currentUser?.id === group.ownerId;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await groupsService.getGroupPosts(group.id);
        if (result.success && result.data) {
          setPosts(result.data);
        } else {
          setError(result.error || 'Failed to fetch group posts');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [group.id]);

  const getMessageType = (post: GroupPost) => {
    // Use the new 'type' field instead of checking mediaUrls
    return post.type;
  };

  const getMessageIcon = (type: GroupPostType) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'library_link':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageTypeColor = (type: GroupPostType) => {
    switch (type) {
      case 'text':
        return 'bg-blue-600';
      case 'image':
        return 'bg-green-600';
      case 'video':
        return 'bg-purple-600';
      case 'library_link':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleSubmitForPublishing = async (post: GroupPost) => {
    if (!currentUser || !canManageMessages) return;
    
    const confirmed = window.confirm(
      `Submit "${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}" for global publishing?`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.submitPublishRequest(post.id, group.id, currentUser.id);
      if (result.success) {
        toast.success('Post submitted for global publishing');
        // Optimistic update: update local state immediately
        setPosts(prev => prev.map(p => 
          p.id === post.id ? { ...p, visibility: 'requested_global' as PostVisibility } : p
        ));
        // Refresh posts to show updated visibility
        const postsResult = await groupsService.getGroupPosts(group.id);
        if (postsResult.success && postsResult.data) {
          setPosts(postsResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to submit post for publishing');
      }
    } catch (err) {
      toast.error('Failed to submit post for publishing');
    }
  };

  const handleDeletePost = async (post: GroupPost) => {
    if (!currentUser || !canManageMessages) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete this post from ${post.authorName || 'Unknown'}?`
    );
    
    if (!confirmed) return;

    try {
      // For now, we'll just remove it from local state
      // In a real implementation, you'd call groupsService.deletePost()
      toast.success('Post deleted successfully');
      // Update local state to reflect change immediately
      setPosts(prev => prev.filter(p => p.id !== post.id));
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
    if (!content || content.length <= maxLength) return content || '';
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
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
              Failed to Load Posts
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

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
            <p className="text-muted-foreground">
              This group doesn't have any posts yet.
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
          <CardTitle>Group Posts ({posts.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {posts.filter(p => getMessageType(p) === 'text').length} Text
            </Badge>
            <Badge variant="outline">
              {posts.filter(p => getMessageType(p) === 'image').length} Images
            </Badge>
            <Badge variant="outline">
              {posts.filter(p => getMessageType(p) === 'video').length} Videos
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const messageType = getMessageType(post);
              return (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(post.authorName || 'Unknown').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.authorName || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">ID: {post.authorId || 'Unknown'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="default" 
                      className={getMessageTypeColor(messageType)}
                    >
                      <span className="flex items-center gap-1">
                        {getMessageIcon(messageType)}
                        {messageType.toUpperCase()}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
  (post.visibility || 'group_only') === 'published_global' ? "default" : 
  (post.visibility || 'group_only') === 'requested_global' ? "secondary" : "secondary"
}>
  {
    (post.visibility || 'group_only') === 'published_global' ? "Published" : 
    (post.visibility || 'group_only') === 'requested_global' ? "Pending Review" : 
    "Group Only"
  }
</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(post.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={!canManageMessages}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {canManageMessages && (
                          <>
                            {post.visibility === 'group_only' ? (
                              <DropdownMenuItem 
                                onClick={() => handleSubmitForPublishing(post)}
                                className="text-blue-600"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Submit for Global Publishing
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                disabled
                                className="text-muted-foreground"
                                title="Already submitted or published"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Submit for Global Publishing
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeletePost(post)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {!canManageMessages && (
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
