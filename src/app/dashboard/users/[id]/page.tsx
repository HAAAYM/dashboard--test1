'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Users, 
  AlertTriangle, 
  Shield, 
  Clock, 
  MessageSquare,
  Edit,
  Ban,
  UserX,
  Eye,
  Award,
  TrendingUp,
  Activity,
  ChevronRight,
  Send
} from 'lucide-react';

// Local types for this page only
interface UserGroup {
  id: number;
  name: string;
  type: string;
  members: number;
  role: string;
  joinedAt: string;
}

interface UserWarning {
  id: number;
  type: string;
  description: string;
  date: string;
  severity: string;
  status: string;
}

interface UserActivity {
  id: number;
  type: string;
  description: string;
  date: string;
  details: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  college: string;
  department: string;
  major: string;
  year: string;
  studentId: string;
  status: string;
  verified: boolean;
  joinDate: string;
  lastLogin: string;
  accountAge: string;
  posts: number;
  comments: number;
  likes: number;
  warnings: number;
  reports: number;
  groups: UserGroup[];
  warningHistory: UserWarning[];
  activities: UserActivity[];
}

// Mock user data - in real app this would come from API
const mockUserData = {
  id: 1,
  name: 'Ahmed Mohammed',
  email: 'ahmed.mohammed@student.edu',
  phone: '+966 50 123 4567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
  role: 'student',
  college: 'Engineering',
  department: 'Computer Science',
  major: 'Software Engineering',
  year: '3rd Year',
  studentId: 'CS2021001',
  status: 'active',
  verified: true,
  joinDate: '2024-01-10',
  lastLogin: '2024-01-15 14:30',
  accountAge: '5 days',
  posts: 45,
  comments: 128,
  likes: 234,
  warnings: 2,
  reports: 1,
  groups: [
    {
      id: 1,
      name: 'Computer Science Students',
      type: 'department',
      members: 245,
      role: 'member',
      joinedAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Programming Club',
      type: 'club',
      members: 89,
      role: 'moderator',
      joinedAt: '2024-01-12'
    },
    {
      id: 3,
      name: 'Study Group - Data Structures',
      type: 'study',
      members: 12,
      role: 'admin',
      joinedAt: '2024-01-11'
    },
    {
      id: 4,
      name: 'University Gaming Community',
      type: 'social',
      members: 156,
      role: 'member',
      joinedAt: '2024-01-13'
    }
  ],
  warningHistory: [
    {
      id: 1,
      type: 'inappropriate_content',
      description: 'Posted inappropriate language in group discussion',
      date: '2024-01-14',
      severity: 'medium',
      status: 'active'
    },
    {
      id: 2,
      type: 'spam_behavior',
      description: 'Multiple similar posts in short time period',
      date: '2024-01-13',
      severity: 'low',
      status: 'resolved'
    }
  ],
  activities: [
    {
      id: 1,
      type: 'post_created',
      description: 'Created a new post in Computer Science Students group',
      date: '2024-01-15 13:45',
      details: 'Asked about final exam preparation tips'
    },
    {
      id: 2,
      type: 'comment_added',
      description: 'Commented on study materials',
      date: '2024-01-15 11:20',
      details: 'Provided helpful resources for algorithms'
    },
    {
      id: 3,
      type: 'group_joined',
      description: 'Joined University Gaming Community',
      date: '2024-01-13 16:30',
      details: 'Became a member of the group'
    }
  ]
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserData>(mockUserData as UserData);
  const [messageDialogOpen, setMessageDialogOpen] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<{
    title: string;
    message: string;
    type: string;
    priority: string;
  }>({
    title: '',
    message: '',
    type: 'notification',
    priority: 'medium'
  });

  const handleSendMessage = () => {
    setMessageDialogOpen(true);
  };

  const handleSendDirectMessage = () => {
    // In real app, this would send the message via API
    console.log('Sending message to user:', userId, messageData);
    
    // Reset form and close dialog
    setMessageData({
      title: '',
      message: '',
      type: 'notification',
      priority: 'medium'
    });
    setMessageDialogOpen(false);
    
    // Show success message (in real app)
    alert('Message sent successfully!');
  };

  const handleBanUser = () => {
    if (confirm('Are you sure you want to ban this user?')) {
      setUser((prev: UserData) => ({ ...prev, status: 'banned' }));
    }
  };

  const handleSuspendUser = () => {
    if (confirm('Are you sure you want to suspend this user?')) {
      setUser((prev: UserData) => ({ ...prev, status: 'suspended' }));
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student':
        return <Badge className="bg-blue-100 text-blue-800">Student</Badge>;
      case 'faculty':
        return <Badge className="bg-purple-100 text-purple-800">Faculty</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGroupRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-orange-100 text-orange-800">Moderator</Badge>;
      case 'member':
        return <Badge className="bg-gray-100 text-gray-800">Member</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getWarningSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
            <p className="text-muted-foreground">
              Comprehensive view of user information, activities, and management options
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send Message to {user.name}
                </DialogTitle>
                <DialogDescription>
                  Send a message to this user. Choose the message type and priority.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Title</label>
                  <Input
                    placeholder="Enter message title..."
                    value={messageData.title}
                    onChange={(e) => setMessageData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Type</label>
                  <Select value={messageData.type} onValueChange={(value) => setMessageData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="instruction">Instructions</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="general">General Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={messageData.priority} onValueChange={(value) => setMessageData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Content</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={messageData.message}
                    onChange={(e) => setMessageData((prev: typeof messageData) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendDirectMessage}
                  disabled={!messageData.title || !messageData.message}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleSuspendUser}>
            <UserX className="h-4 w-4 mr-2" />
            Suspend
          </Button>
          <Button variant="destructive" onClick={handleBanUser}>
            <Ban className="h-4 w-4 mr-2" />
            Ban User
          </Button>
        </div>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Basic user details and account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-4xl">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
                {user.verified && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{user.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{user.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                  <p className="font-mono">{user.studentId}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">College</label>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p>{user.college}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p>{user.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Major</label>
                  <p>{user.major}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year/Position</label>
                  <p>{user.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{user.joinDate}</p>
                    <span className="text-sm text-muted-foreground">({user.accountAge} ago)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{user.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.posts}</div>
            <p className="text-xs text-muted-foreground">Total posts created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.comments}</div>
            <p className="text-xs text-muted-foreground">Total comments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.likes}</div>
            <p className="text-xs text-muted-foreground">Total likes received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{user.warnings}</div>
            <p className="text-xs text-muted-foreground">Active warnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Groups Membership
          </CardTitle>
          <CardDescription>
            Groups this user is a member of and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.groups.map((group: UserGroup) => (
              <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.members} members - Joined {group.joinedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getGroupRoleBadge(group.role)}
                  <Badge variant="outline" className="text-xs">
                    {group.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warnings and Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Warnings & Reports
          </CardTitle>
          <CardDescription>
            User warnings and reports history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.warningHistory.map((warning: UserWarning) => (
              <div key={warning.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold capitalize">{warning.type.replace('_', ' ')}</h4>
                    {getWarningSeverityBadge(warning.severity)}
                    <Badge variant={warning.status === 'active' ? 'destructive' : 'secondary'}>
                      {warning.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{warning.description}</p>
                  <p className="text-xs text-muted-foreground">{warning.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest user activities and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.activities.map((activity: UserActivity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold capitalize">{activity.type.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
