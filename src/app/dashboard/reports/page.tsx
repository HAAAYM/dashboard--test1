'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Check, X, Eye, Flag, AlertTriangle, MessageSquare, User, Users, FileText, Filter, MoreHorizontal, Loader2, Inbox, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock data for reports
const now = new Date();
const mockReports = [
  {
    id: '1',
    type: 'group',
    status: 'pending',
    priority: 'high',
    reason: 'spam',
    title: 'Inappropriate group content',
    reporter: { id: '1', name: 'Alice Johnson', email: 'alice@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
    target: { id: 'group_1', type: 'group', label: 'Study Group 101', preview: 'Group description violates community guidelines', groupId: 'group_1', groupName: 'Study Group 101' },
    source: 'groups',
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    tags: ['spam', 'guidelines']
  },
  {
    id: '2',
    type: 'user',
    status: 'resolved',
    priority: 'high',
    reason: 'harassment',
    title: 'User harassment',
    reporter: { id: '2', name: 'Dr. John Doe', email: 'john@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
    target: { id: 'user_5678', type: 'user', label: 'User #5678', preview: 'User sending inappropriate messages', authorId: 'user_5678', authorName: 'Mike Wilson' },
    source: 'users',
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    reviewedById: 'admin_1',
    reviewedByName: 'Admin User',
    tags: ['harassment', 'resolved']
  },
  {
    id: '3',
    type: 'group',
    status: 'dismissed',
    priority: 'medium',
    reason: 'inappropriate',
    title: 'Group message violation',
    reporter: { id: '3', name: 'Bob Smith', email: 'bob@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
    target: { id: 'group_9012', type: 'group_message', label: 'Study Group 9012', preview: 'Group message violates community guidelines', groupId: 'group_9012', groupName: 'Study Group 9012' },
    source: 'groups',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    reviewedById: 'admin_1',
    reviewedByName: 'Admin User',
    tags: ['dismissed', 'guidelines']
  },
  {
    id: '4',
    type: 'group',
    status: 'pending',
    priority: 'high',
    reason: 'spam',
    title: 'Inappropriate group image',
    reporter: { id: '4', name: 'Jane Smith', email: 'jane@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
    target: { id: 'group_1', type: 'group_image', label: 'Group Image', preview: 'Inappropriate image uploaded to group', groupId: 'group_1', groupName: 'Study Group 101' },
    source: 'groups',
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    tags: ['spam', 'inappropriate']
  },
  {
    id: '5',
    type: 'group',
    status: 'pending',
    priority: 'low',
    reason: 'guidelines',
    title: 'Library book violation',
    reporter: { id: '5', name: 'Carol White', email: 'carol@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol' },
    target: { id: 'library_456', type: 'library_book', label: 'Library Book #456', preview: 'Book content violates library guidelines', groupId: 'library_1', groupName: 'Main Library' },
    source: 'library',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    tags: ['library', 'guidelines']
  },
  {
    id: '6',
    type: 'group',
    status: 'resolved',
    priority: 'medium',
    reason: 'inappropriate',
    title: 'Group post violation',
    reporter: { id: '6', name: 'David Brown', email: 'david@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
    target: { id: 'post_789', type: 'group_post', label: 'Group Post #789', preview: 'Group post contains inappropriate content', authorId: 'user_789', authorName: 'Post Author', groupId: 'group_123', groupName: 'Science Group' },
    source: 'posts',
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    reviewedById: 'admin_1',
    reviewedByName: 'Admin User',
    tags: ['resolved', 'group']
  },
  {
    id: '7',
    type: 'user',
    status: 'pending',
    priority: 'low',
    reason: 'misinformation',
    title: 'User spreading misinformation',
    reporter: { id: '7', name: 'Emma Davis', email: 'emma@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
    target: { id: 'user_9999', type: 'user', label: 'User #9999', preview: 'User spreading false information', authorId: 'user_9999', authorName: 'Fake User' },
    source: 'users',
    createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    tags: ['misinformation', 'fake']
  },
  {
    id: '8',
    type: 'group',
    status: 'pending',
    priority: 'medium',
    reason: 'spam',
    title: 'Group comment violation',
    reporter: { id: '8', name: 'Frank Miller', email: 'frank@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank' },
    target: { id: 'comment_456', type: 'group_comment', label: 'Comment #456', preview: 'Inappropriate comment on group post', authorId: 'user_456', authorName: 'Comment Author', postId: 'post_123', postTitle: 'Study Materials Discussion', groupId: 'group_789', groupName: 'Math Group' },
    source: 'posts',
    createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    updatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    tags: ['spam', 'comment']
  },
  {
    id: '9',
    type: 'group',
    status: 'pending',
    priority: 'medium',
    reason: 'harassment',
    title: 'Another group post issue',
    reporter: { id: '9', name: 'Grace Lee', email: 'grace@university.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace' },
    target: { id: 'post_999', type: 'group_post', label: 'Group Post #999', preview: 'Harassment in group discussion', authorId: 'user_999', authorName: 'Troublemaker', groupId: 'group_456', groupName: 'Chemistry Group' },
    source: 'posts',
    createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    tags: ['harassment', 'group']
  }
];

export default function ReportsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'All Reports', icon: Flag },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'users', label: 'Users', icon: User },
    { id: 'library', label: 'Library', icon: FileText },
  ];

  const getReportTypeBadge = (report: any) => {
    const targetType = report.target?.type || report.type;
    switch (targetType) {
      case 'user':
        return <Badge className="bg-purple-100 text-purple-800"><User className="h-3 w-3 mr-1" />User</Badge>;
      case 'group':
        return <Badge className="bg-green-100 text-green-800"><Users className="h-3 w-3 mr-1" />Group</Badge>;
      case 'group_post':
        return <Badge className="bg-blue-100 text-blue-800"><MessageSquare className="h-3 w-3 mr-1" />Post</Badge>;
      case 'group_comment':
        return <Badge className="bg-teal-100 text-teal-800"><MessageSquare className="h-3 w-3 mr-1" />Comment</Badge>;
      case 'group_message':
        return <Badge className="bg-cyan-100 text-cyan-800"><MessageSquare className="h-3 w-3 mr-1" />Message</Badge>;
      case 'group_image':
        return <Badge className="bg-pink-100 text-pink-800"><FileText className="h-3 w-3 mr-1" />Image</Badge>;
      case 'library_book':
        return <Badge className="bg-orange-100 text-orange-800"><FileText className="h-3 w-3 mr-1" />Library</Badge>;
      default:
        return <Badge variant="outline">{targetType}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Computed filtered reports
  const filteredReports = useMemo(() => {
    let filtered = [...mockReports];

    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'groups':
          filtered = filtered.filter(report => 
            report.target.type === 'group' || 
            report.target.type === 'group_post' || 
            report.target.type === 'group_comment' ||
            report.target.type === 'group_message' || 
            report.target.type === 'group_image'
          );
          break;
        case 'users':
          filtered = filtered.filter(report => report.type === 'user');
          break;
        case 'library':
          filtered = filtered.filter(report => report.target.type === 'library_book');
          break;
        case 'content':
          // Content tab removed since everything is group-centric
          filtered = [];
          break;
      }
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchLower) ||
        report.reporter.name.toLowerCase().includes(searchLower) ||
        report.target.label.toLowerCase().includes(searchLower) ||
        report.reason.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.target.type === typeFilter);
    }

    return filtered;
  }, [activeTab, searchTerm, statusFilter, priorityFilter, typeFilter]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks > 0) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('sidebar.reports')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.reportsDescription')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            High Priority
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockReports.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Inbox className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockReports.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockReports.filter(r => r.status === 'resolved' && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockReports.filter(r => r.priority === 'high').length}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-primary/20"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] border-primary/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] border-primary/20">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] border-primary/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="group">Groups</SelectItem>
                <SelectItem value="group_post">Group Posts</SelectItem>
                <SelectItem value="group_comment">Group Comments</SelectItem>
                <SelectItem value="group_message">Group Messages</SelectItem>
                <SelectItem value="group_image">Group Images</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="library_book">Library</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports ({activeTab})</CardTitle>
              <CardDescription>
                Review and resolve user reports
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading reports...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-red-500">Error loading reports: {error}</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Inbox className="h-12 w-12 text-muted-foreground" />
              <div className="ml-4 text-center">
                <p className="text-lg font-medium text-muted-foreground">No reports found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.target.preview}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getReportTypeBadge(report)}
                        <div className="flex flex-col">
                          {report.target.type === 'group_comment' ? (
                            <>
                              <span className="text-sm font-medium">{report.target.label}</span>
                              <span className="text-xs text-muted-foreground">On: {report.target.postTitle}</span>
                              <span className="text-xs text-muted-foreground">Group: {report.target.groupName}</span>
                            </>
                          ) : report.target.type === 'group_post' ? (
                            <>
                              <span className="text-sm font-medium">{report.target.label}</span>
                              <span className="text-xs text-muted-foreground">Group: {report.target.groupName}</span>
                            </>
                          ) : (report.target.type === 'group_message' || report.target.type === 'group_image') ? (
                            <>
                              <span className="text-sm font-medium">{report.target.label}</span>
                              <span className="text-xs text-muted-foreground">Group: {report.target.groupName}</span>
                            </>
                          ) : (
                            <span className="text-sm">{report.target.label}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{report.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs">{report.reporter.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                        </div>
                        <span>{report.reporter.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatTimeAgo(report.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" title="View details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" title="Resolve">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Dismiss">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" title="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
