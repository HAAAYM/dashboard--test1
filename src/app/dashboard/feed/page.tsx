'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Image, Video, Search } from 'lucide-react';
import { groupsService } from '@/features/groups/groups-service';
import { GroupPost } from '@/features/groups/groups-types';

export default function GlobalFeedPage() {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [groupNames, setGroupNames] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get all groups
        const groupsResult = await groupsService.getGroups();
        if (!groupsResult.success || !groupsResult.data) {
          setError('Failed to fetch groups');
          return;
        }

        // Create group name mapping
        const groupNameMap: Record<string, string> = {};
        groupsResult.data.forEach(group => {
          groupNameMap[group.id] = group.name;
        });

        // Fetch all group posts in parallel
        const postPromises = groupsResult.data.map(async (group) => {
          try {
            const postsResult = await groupsService.getGroupPosts(group.id);
            if (postsResult.success && postsResult.data) {
              const publishedPosts = postsResult.data.filter(
                post => post.visibility === 'published_global'
              );
              return publishedPosts.map(post => ({ post, groupName: group.name }));
            }
            return [];
          } catch (err) {
            console.error(`Failed to fetch posts for group ${group.name}:`, err);
            return [];
          }
        });

        // Wait for all requests to complete
        const allGroupResults = await Promise.all(postPromises);
        
        // Flatten results and extract posts with group context
        const postsWithGroup: Array<{ post: GroupPost; groupName: string }> = [];
        allGroupResults.forEach(groupResult => {
          postsWithGroup.push(...groupResult);
        });

        // Sort by newest first with safe date handling
        postsWithGroup.sort((a, b) => {
          const dateA = a.post.createdAt ? new Date(a.post.createdAt).getTime() : 0;
          const dateB = b.post.createdAt ? new Date(b.post.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        // Extract posts and group names
        const finalPosts = postsWithGroup.map(item => item.post);
        const finalGroupNames: Record<string, string> = {};
        postsWithGroup.forEach(item => {
          finalGroupNames[item.post.id] = item.groupName;
        });

        setPosts(finalPosts);
        setGroupNames(finalGroupNames);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Apply search filter to final aggregated and sorted posts
  const filteredPosts = posts.filter(post => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    return !debouncedSearchTerm || 
      (post.authorName || '').toLowerCase().includes(searchLower) ||
      (post.content || '').toLowerCase().includes(searchLower);
  });

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Global Feed</h1>
        <p className="text-muted-foreground">Posts published across all groups</p>
      </div>

      {/* Feed Toolbar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </Badge>
              {totalPages > 1 && (
                <Badge variant="outline">
                  Page {currentPage} of {totalPages}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Published Posts</h3>
              <p className="text-muted-foreground">
                No posts have been published globally yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 && debouncedSearchTerm.trim() ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try a different keyword
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {(post.authorName || 'Unknown').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{post.authorName || 'Unknown'}</span>
                        <Badge 
                          variant="default" 
                          className={getMessageTypeColor(post.type)}
                        >
                          <span className="flex items-center gap-1">
                            {getMessageIcon(post.type)}
                            {post.type?.toUpperCase()}
                          </span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {groupNames[post.id] || 'Unknown Group'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {(post.content || 'No content').substring(0, 300)}
                        {(post.content || 'No content').length > 300 ? '...' : ''}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Published globally
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
