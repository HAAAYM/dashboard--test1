'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, EyeOff, Trash2, MoreHorizontal, MessageSquare, Heart, Pin } from 'lucide-react';

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feed Posts Management</h1>
          <p className="text-muted-foreground">
            Moderate and manage all platform posts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Hidden
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <MessageSquare className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,189</div>
            <p className="text-xs text-muted-foreground">Currently visible</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden Posts</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Moderated content</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinned Posts</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Important announcements</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                Manage and moderate feed posts
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-2">
                      <Pin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Welcome to the Computer Science Department group!</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Feel free to share resources and ask questions. This is the official group for CS students and faculty...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">JD</span>
                    </div>
                    <span>Dr. John Doe</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">CS Department</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>45</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>12</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>Jan 1, 2024</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="space-y-2 max-w-md">
                    <p className="font-medium">Looking for study partners for the upcoming algorithms exam</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Anyone interested in forming a study group? I was thinking we could meet twice a week...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">AJ</span>
                    </div>
                    <span>Alice Johnson</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Study Group</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>5</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>3 days ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="space-y-2 max-w-md">
                    <p className="font-medium text-muted-foreground">[Hidden] Spam content detected</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      This post has been automatically hidden due to suspicious content...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs">??</span>
                    </div>
                    <span>Unknown User</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">General</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>0</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Hidden
                  </Badge>
                </TableCell>
                <TableCell>1 week ago</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
