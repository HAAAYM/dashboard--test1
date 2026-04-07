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
  Image, 
  Video, 
  Trash2,
  Download,
  FileText
} from 'lucide-react';
import { GroupPost } from '../groups-types';
import { Group } from '../groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupMediaTabProps {
  group: Group;
  currentUser: User | null;
}

export function GroupMediaTab({ group, currentUser }: GroupMediaTabProps) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageMedia = currentUser?.role === UserRole.ADMIN || 
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

  // Filter posts that have media content
  const postsWithMedia = posts.filter(post => 
    (post.type === 'image' || post.type === 'video') || 
    (post.type === 'library_link' && post.libraryLinkUrl)
  );

  const getMediaContent = (post: GroupPost) => {
    switch (post.type) {
      case 'image':
        return 'Image content';
      case 'video':
        return 'Video content';
      case 'library_link':
        return post.libraryLinkUrl || 'No link';
      default:
        return post.content;
    }
  };

  const getMediaType = (post: GroupPost) => {
    switch (post.type) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      default:
        return 'unknown';
    }
  };

  const getMediaTypeColor = (type: 'image' | 'video') => {
    switch (type) {
      case 'image':
        return 'bg-green-600';
      case 'video':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleDeletePost = async (post: GroupPost) => {
    if (!currentUser || !canManageMedia) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete this post with media from ${post.authorName}?`
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

  const handleDownload = (url: string) => {
    // In a real implementation, this would trigger a download
    window.open(url, '_blank');
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
              <p className="text-muted-foreground">Loading media...</p>
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
              Failed to Load Media
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

  if (postsWithMedia.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Media Found</h3>
            <p className="text-muted-foreground">
              This group doesn't have any posts with media files yet.
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
          <CardTitle>Group Media ({postsWithMedia.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {postsWithMedia.filter(post => post.type === 'image').length} Images
            </Badge>
            <Badge variant="outline">
              {postsWithMedia.filter(post => post.type === 'video').length} Videos
            </Badge>
            <Badge variant="outline">
              {postsWithMedia.filter(post => post.type === 'library_link').length} Library Links
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Media Files</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postsWithMedia.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
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
                        <p className="text-sm">{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}</p>
                        {post.type === 'library_link' && post.libraryLinkUrl && (
                          <div className="mt-2">
                            <a href={post.libraryLinkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                              View Library Resource →
                            </a>
                          </div>
                        )}
                      </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {(() => {
                      switch (post.type) {
                        case 'image':
                          return (
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4 text-blue-600" />
                              <span className="text-xs text-muted-foreground">Image</span>
                            </div>
                          );
                        case 'video':
                          return (
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-purple-600" />
                              <span className="text-xs text-muted-foreground">Video</span>
                            </div>
                          );
                        case 'library_link':
                          return (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-muted-foreground">Library Link</span>
                            </div>
                          );
                        default:
                          return (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-xs text-muted-foreground">Text</span>
                            </div>
                          );
                      }
                    })()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={post.visibility === 'published_global' ? "default" : "secondary"}>
                    {post.visibility === 'published_global' ? "Published" : "Group Only"}
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
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => post.type === 'library_link' && post.libraryLinkUrl ? window.open(post.libraryLinkUrl, '_blank') : null}>
                        <Download className="h-4 w-4 mr-2" />
                        {post.type === 'library_link' ? 'Open Link' : 'Download'}
                      </DropdownMenuItem>
                      
                      {canManageMedia && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleDeletePost(post)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {!canManageMedia && (
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
