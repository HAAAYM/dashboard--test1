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
  Flag, 
  Check, 
  X,
  AlertTriangle,
  User
} from 'lucide-react';
import { Report, GroupPost } from '../groups-types';
import { Group } from '../groups-types';
import { groupsService } from '../groups-service';
import { User as UserType } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { toast } from 'sonner';

interface GroupReportsTabProps {
  group: Group;
  currentUser: UserType | null;
}

export function GroupReportsTab({ group, currentUser }: GroupReportsTabProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<Record<string, GroupPost>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageReports = currentUser?.role === UserRole.ADMIN || 
                          currentUser?.role === UserRole.SUPER_ADMIN || 
                          currentUser?.id === group.ownerId;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch pending reports
        const reportsResult = await groupsService.getPendingReports(group.id);
        if (reportsResult.success && reportsResult.data) {
          setReports(reportsResult.data);
          
          // Fetch posts to show reported content
          const postsResult = await groupsService.getGroupPosts(group.id);
          if (postsResult.success && postsResult.data) {
            const postsMap: Record<string, GroupPost> = {};
            postsResult.data.forEach(post => {
              postsMap[post.id] = post;
            });
            setPosts(postsMap);
          }
        } else {
          setError(reportsResult.error || 'Failed to fetch reports');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [group.id]);

  const handleResolveReport = async (report: Report) => {
    if (!currentUser || !canManageReports) return;
    
    const confirmed = window.confirm(
      `Resolve this report? This will delete the reported post from ${posts[report.postId]?.authorName || 'unknown'}. This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.resolveReport(report.id, currentUser.id);
      
      if (result.success) {
        toast.success('Report resolved and post deleted');
        // Update local state to reflect change immediately
        setReports(prev => prev.filter(r => r.id !== report.id));
        // Remove the reported post from posts map
        setPosts(prev => {
          const newPosts = { ...prev };
          delete newPosts[report.postId];
          return newPosts;
        });
      } else {
        toast.error(result.error || 'Failed to resolve report');
      }
    } catch (err) {
      toast.error('Failed to resolve report');
    }
  };

  const handleDismissReport = async (report: Report) => {
    if (!currentUser || !canManageReports) return;
    
    const confirmed = window.confirm(
      `Dismiss this report? The reported post from ${posts[report.postId]?.authorName || 'unknown'} will remain visible.`
    );
    
    if (!confirmed) return;

    try {
      const result = await groupsService.dismissReport(report.id, currentUser.id);
      
      if (result.success) {
        toast.success('Report dismissed');
        // Update local state to reflect change immediately
        setReports(prev => prev.filter(r => r.id !== report.id));
      } else {
        toast.error(result.error || 'Failed to dismiss report');
      }
    } catch (err) {
      toast.error('Failed to dismiss report');
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
              <p className="text-muted-foreground">Loading reports...</p>
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
              Failed to Load Reports
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

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Flag className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Reports</h3>
            <p className="text-muted-foreground">
              No reports need review at this time.
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
            <Flag className="h-5 w-5 text-red-600" />
            Pending Reports ({reports.length})
          </CardTitle>
          <Badge variant="destructive">
            {reports.length} reports need review
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported Post</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => {
              const reportedPost = posts[report.postId];
              return (
                <TableRow key={report.id} className="border-red-200">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {report.reporterName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{report.reporterName}</div>
                        <div className="text-sm text-muted-foreground">ID: {report.reporterId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reportedPost ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-orange-100 text-orange-800 text-xs">
                              {reportedPost.authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{reportedPost.authorName}</span>
                        </div>
                        <div className="max-w-md">
                          <p className="text-sm text-red-800 bg-red-50 p-2 rounded">
                            {truncateContent(reportedPost.content, 120)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Post not found (may have been deleted)
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="text-xs">
                      {report.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(report.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={!canManageReports}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {canManageReports && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleResolveReport(report)}
                              className="text-red-600"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Resolve (Delete Post)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDismissReport(report)}
                              className="text-green-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {!canManageReports && (
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
