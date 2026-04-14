'use client';

import { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase/client-config';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Firestore user type
type FirestoreUserProfile = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  username?: string;
  phone?: string;
  profileImage?: string;
  role: string;
  college?: string;
  specializationName?: string;
  academicId?: string;
  batchNumber?: string;
  status: string;
  verificationStatus: string;
  isStudentVerified: boolean;
  isDoctorVerified: boolean;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  updatedAt?: Timestamp;
  suspendedAt?: Timestamp;
  bannedAt?: Timestamp;
  // Activity statistics (mock for now, can be fetched from other collections later)
  posts?: number;
  comments?: number;
  likes?: number;
  warnings?: number;
  reports?: number;
};

// Activity types for rich profile
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

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<FirestoreUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<{
    posts: number;
    comments: number;
    likes: number;
    warnings: number;
    reports: number;
    groups: UserGroup[];
    warningsHistory: UserWarning[];
    activities: UserActivity[];
  }>({
    posts: 0,
    comments: 0,
    likes: 0,
    warnings: 0,
    reports: 0,
    groups: [] as UserGroup[],
    warningsHistory: [] as UserWarning[],
    activities: [] as UserActivity[]
  });
  const [activityLoading, setActivityLoading] = useState(true);
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

  // Helper functions (moved before usage)
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'Never';
    return timestamp.toDate().toLocaleDateString();
  };

  const formatDateTime = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'Never';
    return timestamp.toDate().toLocaleString();
  };

  // Fetch user activity data from Firestore
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!user) return;
      
      console.log('🔍 USER PROFILE: Fetching activity data for user:', user.id);
      setActivityLoading(true);
      
      try {
        const activityData = {
          posts: 0,
          comments: 0,
          likes: 0,
          warnings: 0,
          reports: 0,
          groups: [] as UserGroup[],
          warningsHistory: [] as UserWarning[],
          activities: [] as UserActivity[]
        };
        
        // Try to fetch posts count
        try {
          const postsQuery = query(
            collection(db, 'posts'),
            where('userId', '==', user.uid),
            limit(100)
          );
          const postsSnapshot = await getDocs(postsQuery);
          activityData.posts = postsSnapshot.docs.length;
          console.log('🔍 USER PROFILE: Found', activityData.posts, 'posts for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: Posts collection not found or error:', error);
        }
        
        // Try to fetch comments count
        try {
          const commentsQuery = query(
            collection(db, 'comments'),
            where('userId', '==', user.uid),
            limit(100)
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          activityData.comments = commentsSnapshot.docs.length;
          console.log('🔍 USER PROFILE: Found', activityData.comments, 'comments for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: Comments collection not found or error:', error);
        }
        
        // Try to fetch likes count
        try {
          const likesQuery = query(
            collection(db, 'likes'),
            where('userId', '==', user.uid),
            limit(100)
          );
          const likesSnapshot = await getDocs(likesQuery);
          activityData.likes = likesSnapshot.docs.length;
          console.log('🔍 USER PROFILE: Found', activityData.likes, 'likes for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: Likes collection not found or error:', error);
        }
        
        // Try to fetch warnings count
        try {
          const warningsQuery = query(
            collection(db, 'user_warnings'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          const warningsSnapshot = await getDocs(warningsQuery);
          activityData.warnings = warningsSnapshot.docs.length;
          activityData.warningsHistory = warningsSnapshot.docs.map(doc => ({
            id: parseInt(doc.id),
            type: doc.data().type || 'warning',
            description: doc.data().description || 'Warning issued',
            date: formatDate(doc.data().createdAt || Timestamp.now()),
            severity: doc.data().severity || 'medium',
            status: doc.data().status || 'active'
          }));
          console.log('🔍 USER PROFILE: Found', activityData.warnings, 'warnings for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: User warnings collection not found or error:', error);
        }
        
        // Try to fetch groups membership
        try {
          const groupsQuery = query(
            collection(db, 'user_groups'),
            where('userId', '==', user.uid),
            limit(10)
          );
          const groupsSnapshot = await getDocs(groupsQuery);
          activityData.groups = groupsSnapshot.docs.map(doc => ({
            id: parseInt(doc.id),
            name: doc.data().groupName || 'Unknown Group',
            type: doc.data().groupType || 'group',
            members: doc.data().memberCount || 0,
            role: doc.data().role || 'member',
            joinedAt: formatDate(doc.data().joinedAt || Timestamp.now())
          }));
          console.log('🔍 USER PROFILE: Found', activityData.groups.length, 'groups for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: User groups collection not found or error:', error);
        }
        
        // Try to fetch recent activities
        try {
          const activitiesQuery = query(
            collection(db, 'user_activities'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          const activitiesSnapshot = await getDocs(activitiesQuery);
          activityData.activities = activitiesSnapshot.docs.map(doc => ({
            id: parseInt(doc.id),
            type: doc.data().type || 'activity',
            description: doc.data().description || 'User activity',
            date: formatDateTime(doc.data().createdAt || Timestamp.now()),
            details: doc.data().details || 'Activity details'
          }));
          console.log('🔍 USER PROFILE: Found', activityData.activities.length, 'activities for user');
        } catch (error) {
          console.log('🔍 USER PROFILE: User activities collection not found or error:', error);
        }
        
        setActivityData(activityData);
        console.log('✅ USER PROFILE: Activity data loaded for user:', user.id);
        
      } catch (error) {
        console.error('❌ USER PROFILE: Error fetching activity data:', error);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityData();
  }, [user]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      console.log('🔍 USER PROFILE: Fetching user data for:', userId);
      
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProfile: FirestoreUserProfile = {
            id: userDoc.id,
            uid: userData?.uid || '',
            fullName: userData?.fullName || '',
            email: userData?.email || '',
            username: userData?.username,
            phone: userData?.phone,
            profileImage: userData?.profileImage,
            role: userData?.role || 'student',
            college: userData?.college,
            specializationName: userData?.specializationName,
            academicId: userData?.academicId,
            batchNumber: userData?.batchNumber,
            status: userData?.status || 'active',
            verificationStatus: userData?.verificationStatus || 'pending',
            isStudentVerified: userData?.isStudentVerified || false,
            isDoctorVerified: userData?.isDoctorVerified || false,
            createdAt: userData?.createdAt || Timestamp.now(),
            lastLoginAt: userData?.lastLoginAt,
            updatedAt: userData?.updatedAt,
            suspendedAt: userData?.suspendedAt,
            bannedAt: userData?.bannedAt,
            // Activity statistics (will be fetched from other collections)
            posts: activityData.posts,
            comments: activityData.comments,
            likes: activityData.likes,
            warnings: activityData.warnings,
            reports: activityData.reports
          };
          
          console.log('✅ USER PROFILE: User data loaded:', userProfile);
          setUser(userProfile);
          
        } else {
          console.log('❌ USER PROFILE: User not found:', userId);
        }
        
      } catch (error) {
        console.error('❌ USER PROFILE: Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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

  const handleBanUser = async () => {
    if (!user || !confirm('Are you sure you want to ban this user? This action cannot be undone.')) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        status: 'banned',
        bannedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setUser(prev => prev ? { ...prev, status: 'banned' } : null);
      console.log('✅ USER PROFILE: User banned successfully:', user.id);
      
    } catch (error) {
      console.error('❌ USER PROFILE: Error banning user:', error);
      alert('Failed to ban user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSuspendUser = async () => {
    if (!user || !confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        status: 'suspended',
        suspendedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setUser(prev => prev ? { ...prev, status: 'suspended' } : null);
      console.log('✅ USER PROFILE: User suspended successfully:', user.id);
      
    } catch (error) {
      console.error('❌ USER PROFILE: Error suspending user:', error);
      alert('Failed to suspend user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student':
        return <Badge className="bg-blue-100 text-blue-800">Student</Badge>;
      case 'faculty':
        return <Badge className="bg-purple-100 text-purple-800">Faculty</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
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

  const getVerificationBadge = (user: FirestoreUserProfile) => {
    if (user.isStudentVerified && user.isDoctorVerified) {
      return <Badge className="bg-green-100 text-green-800">Fully Verified</Badge>;
    } else if (user.isStudentVerified) {
      return <Badge className="bg-blue-100 text-blue-800">Student Verified</Badge>;
    } else if (user.isDoctorVerified) {
      return <Badge className="bg-purple-100 text-purple-800">Doctor Verified</Badge>;
    } else {
      return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  const getAccountAge = (createdAt: Timestamp) => {
    const now = new Date();
    const created = createdAt.toDate();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist or has been deleted.</p>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

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
                  Send Message to {user.fullName}
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
                <AvatarImage src={user.profileImage} alt={user.fullName} />
                <AvatarFallback className="text-4xl">
                  {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
                {getVerificationBadge(user)}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-semibold">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{user.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>@{user.username || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Academic ID</label>
                  <p className="font-mono">{user.academicId || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">College</label>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p>{user.college || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p>{user.specializationName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Batch</label>
                  <p>{user.batchNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(user.createdAt)}</p>
                    <span className="text-sm text-muted-foreground">({getAccountAge(user.createdAt)} ago)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDateTime(user.lastLoginAt)}</p>
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
            <div className="text-2xl font-bold">{activityLoading ? '...' : activityData.posts}</div>
            <p className="text-xs text-muted-foreground">Total posts created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLoading ? '...' : activityData.comments}</div>
            <p className="text-xs text-muted-foreground">Total comments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLoading ? '...' : activityData.likes}</div>
            <p className="text-xs text-muted-foreground">Total likes received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activityLoading ? '...' : activityData.warnings}</div>
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
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading groups...</p>
              </div>
            ) : activityData.groups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No groups found</p>
              </div>
            ) : (
              activityData.groups.map((group: UserGroup) => (
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
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading warnings...</p>
              </div>
            ) : activityData.warningsHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No warnings found</p>
              </div>
            ) : (
              activityData.warningsHistory.map((warning: UserWarning) => (
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
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            ) : activityData.activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activities found</p>
              </div>
            ) : (
              activityData.activities.map((activity: UserActivity) => (
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
