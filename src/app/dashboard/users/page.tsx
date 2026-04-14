'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Ban, 
  UserX, 
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { db } from '@/lib/firebase/client-config';
import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Define user type from Firestore
type FirestoreUser = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  username?: string;
  role: string;
  verificationStatus: string;
  isStudentVerified: boolean;
  isDoctorVerified: boolean;
  academicId?: string;
  college?: string;
  specializationName?: string;
  batchNumber?: string;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  profileImage?: string;
  phone?: string;
  status?: string;
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);
  const [editForm, setEditForm] = useState<Partial<FirestoreUser>>({});
  const [saving, setSaving] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      console.log('🔍 USERS PAGE: Starting to fetch real users from Firestore...');
      
      try {
        // Test 1: Check if we can access the users collection
        console.log('🔍 USERS PAGE: Testing users collection access...');
        const testQuery = query(collection(db, 'users'), limit(1));
        const testSnapshot = await getDocs(testQuery);
        console.log('🔍 USERS PAGE: Collection access test - Found', testSnapshot.docs.length, 'documents');
        
        // Test 2: Check if we have any users at all
        const countQuery = query(collection(db, 'users'), limit(5));
        const countSnapshot = await getDocs(countQuery);
        console.log('🔍 USERS PAGE: Sample users found:', countSnapshot.docs.length);
        
        if (countSnapshot.docs.length > 0) {
          const sampleDoc = countSnapshot.docs[0];
          console.log('🔍 USERS PAGE: Sample user data:', {
            id: sampleDoc.id,
            fullName: sampleDoc.data().fullName,
            email: sampleDoc.data().email,
            username: sampleDoc.data().username,
            role: sampleDoc.data().role,
            college: sampleDoc.data().college,
            hasCreatedAt: !!sampleDoc.data().createdAt
          });
        }
        
        // Test 3: Try the main query with orderBy
        console.log('🔍 USERS PAGE: Executing main query with orderBy...');
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(100) // Limit to 100 users for performance
        );
        
        const snapshot = await getDocs(usersQuery);
        console.log('🔍 USERS PAGE: Main query successful - Found', snapshot.docs.length, 'users');
        
        const usersData: FirestoreUser[] = snapshot.docs.map(doc => {
          const data = doc.data();
          const user = {
            id: doc.id,
            uid: data.uid || '',
            fullName: data.fullName || '',
            email: data.email || '',
            username: data.username,
            role: data.role || 'student',
            verificationStatus: data.verificationStatus || 'pending',
            isStudentVerified: data.isStudentVerified || false,
            isDoctorVerified: data.isDoctorVerified || false,
            academicId: data.academicId,
            college: data.college,
            specializationName: data.specializationName,
            batchNumber: data.batchNumber,
            createdAt: data.createdAt || Timestamp.now(),
            lastLoginAt: data.lastLoginAt,
            profileImage: data.profileImage,
            phone: data.phone,
            status: data.status || 'active'
          };
          
          // Log first few users for verification
          if (snapshot.docs.indexOf(doc) < 3) {
            console.log('🔍 USERS PAGE: User', snapshot.docs.indexOf(doc) + 1, ':', {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              username: user.username,
              role: user.role,
              college: user.college,
              academicId: user.academicId,
              isStudentVerified: user.isStudentVerified,
              isDoctorVerified: user.isDoctorVerified
            });
          }
          
          return user;
        });
        
        console.log('🔍 USERS PAGE: Successfully mapped', usersData.length, 'users from Firestore');
        console.log('✅ USERS PAGE: REAL DATA CONFIRMED - No fallback to mock data');
        
        setUsers(usersData);
        
      } catch (error) {
        console.error('❌ USERS PAGE: Error fetching users:', error);
        console.error('❌ USERS PAGE: Error details:', error instanceof Error ? error.stack : 'Unknown error');
        
        // Check if it's a permission error
        if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
          console.error('❌ USERS PAGE: FIRESTORE PERMISSION ERROR - Check security rules');
        }
        
        // Check if it's an index error
        if (error instanceof Error && error.message.includes('index')) {
          console.error('❌ USERS PAGE: FIRESTORE INDEX ERROR - Need to create index');
        }
        
        // Check if it's an orderBy error
        if (error instanceof Error && error.message.includes('orderBy')) {
          console.error('❌ USERS PAGE: ORDERBY ERROR - Check createdAt field');
        }
        
        // DO NOT FALLBACK TO MOCK DATA - Keep empty to show real issues
        setUsers([]);
        
      } finally {
        console.log('🔍 USERS PAGE: Fetch completed, setting loading to false');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (userId: string) => {
    console.log('🔍 USERS PAGE: Navigating to user profile:', userId);
    router.push(`/dashboard/users/${userId}`);
  };

  const handleEditUser = (user: FirestoreUser) => {
    console.log('🔍 USERS PAGE: Opening edit modal for user:', user.id);
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      username: user.username,
      phone: user.phone,
      college: user.college,
      specializationName: user.specializationName,
      academicId: user.academicId,
      role: user.role,
      status: user.status || 'active',
      verificationStatus: user.verificationStatus,
      isStudentVerified: user.isStudentVerified,
      isDoctorVerified: user.isDoctorVerified
    });
    setEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !editForm) return;
    
    setSaving(true);
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const updateData: any = {
        fullName: editForm.fullName,
        username: editForm.username,
        phone: editForm.phone,
        college: editForm.college,
        specializationName: editForm.specializationName,
        academicId: editForm.academicId,
        role: editForm.role,
        status: editForm.status,
        verificationStatus: editForm.verificationStatus,
        isStudentVerified: editForm.isStudentVerified,
        isDoctorVerified: editForm.isDoctorVerified,
        updatedAt: Timestamp.now()
      };
      
      // Protect admin role - only allow existing admins to set admin role
      if (editForm.role === 'admin' && selectedUser.role !== 'admin') {
        console.log('🔒 USERS PAGE: Blocking non-admin from setting admin role');
        alert('Only existing admins can assign admin role');
        setSaving(false);
        return;
      }
      
      await updateDoc(userRef, updateData);
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === selectedUser.id ? { ...u, ...updateData } : u
      ));
      
      console.log('✅ USERS PAGE: User updated successfully:', selectedUser.id);
      setEditModalOpen(false);
      setSelectedUser(null);
      setEditForm({});
      
    } catch (error) {
      console.error('❌ USERS PAGE: Error updating user:', error);
      alert('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSuspendUser = async (user: FirestoreUser) => {
    if (!confirm(`Are you sure you want to suspend ${user.fullName}?`)) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        status: 'suspended',
        suspendedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === user.id ? { ...u, status: 'suspended' } : u
      ));
      
      console.log('✅ USERS PAGE: User suspended successfully:', user.id);
      
    } catch (error) {
      console.error('❌ USERS PAGE: Error suspending user:', error);
      alert('Failed to suspend user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleBanUser = async (user: FirestoreUser) => {
    if (!confirm(`Are you sure you want to ban ${user.fullName}? This action cannot be undone.`)) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        status: 'banned',
        bannedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === user.id ? { ...u, status: 'banned' } : u
      ));
      
      console.log('✅ USERS PAGE: User banned successfully:', user.id);
      
    } catch (error) {
      console.error('❌ USERS PAGE: Error banning user:', error);
      alert('Failed to ban user: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  const getVerificationBadge = (user: FirestoreUser) => {
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

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Never';
    return timestamp.toDate().toLocaleDateString();
  };

  const formatDateTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Never';
    return timestamp.toDate().toLocaleString();
  };

  const getCollegeBadge = (college: string) => {
    switch (college) {
      case 'Engineering':
        return <Badge className="bg-indigo-100 text-indigo-800">Engineering</Badge>;
      case 'Medicine':
        return <Badge className="bg-emerald-100 text-emerald-800">Medicine</Badge>;
      case 'Administrative Sciences':
        return <Badge className="bg-amber-100 text-amber-800">Admin Sciences</Badge>;
      default:
        return <Badge variant="outline">{college}</Badge>;
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.academicId && user.academicId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesCollege = collegeFilter === 'all' || user.college === collegeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    // Log search activity
    if (searchTerm && searchTerm.length > 2) {
      console.log('🔍 USERS PAGE: Search for "', searchTerm, '" - Found', users.filter(u => 
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.academicId && u.academicId.toLowerCase().includes(searchTerm.toLowerCase()))
      ).length, 'matches');
    }
    
    return matchesSearch && matchesRole && matchesCollege && matchesStatus;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const verifiedUsers = users.filter(u => u.isStudentVerified || u.isDoctorVerified).length;
  const fullyVerifiedUsers = users.filter(u => u.isStudentVerified && u.isDoctorVerified).length;
  
  // Log statistics for verification
  console.log('📊 USERS PAGE: Statistics:', {
    totalUsers,
    activeUsers,
    verifiedUsers,
    fullyVerifiedUsers,
    searchTerm,
    roleFilter,
    collegeFilter,
    statusFilter,
    filteredResults: filteredUsers.length
  });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered users in the system
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">Verified accounts</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Verified</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fullyVerifiedUsers}</div>
            <p className="text-xs text-muted-foreground">Student & Doctor verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, username, or academic ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-primary/20"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px] border-primary/20">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-[180px] border-primary/20">
                <SelectValue placeholder="College" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Administrative Sciences">Admin Sciences</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] border-primary/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Click on a user to view their detailed profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">College</th>
                  <th className="text-left p-4 font-medium">Specialization</th>
                  <th className="text-left p-4 font-medium">Academic ID</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Verification</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center">
                      <div className="text-muted-foreground">Loading users...</div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center">
                      <div className="text-muted-foreground">No users found</div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-primary/10 hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profileImage} alt={user.fullName} />
                            <AvatarFallback>
                              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.username && (
                              <div className="text-xs text-muted-foreground">@{user.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4">
                        {user.college ? (
                          <Badge className="bg-indigo-100 text-indigo-800">{user.college}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.specializationName || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.academicId || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user.status || 'active')}
                      </td>
                      <td className="p-4">
                        {getVerificationBadge(user)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => handleSuspendUser(user)}
                            disabled={user.status === 'suspended'}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleBanUser(user)}
                            disabled={user.status === 'banned'}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.fullName}</DialogTitle>
            <DialogDescription>
              Update user information and verification status. All changes will be saved to Firestore.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editForm.fullName || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editForm.username || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={selectedUser?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={editForm.role || 'student'} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status || 'active'} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  value={editForm.college || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, college: e.target.value }))}
                  placeholder="Enter college"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specializationName">Specialization</Label>
                <Input
                  id="specializationName"
                  value={editForm.specializationName || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, specializationName: e.target.value }))}
                  placeholder="Enter specialization"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academicId">Academic ID</Label>
                <Input
                  id="academicId"
                  value={editForm.academicId || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, academicId: e.target.value }))}
                  placeholder="Enter academic ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verificationStatus">Verification Status</Label>
                <Select value={editForm.verificationStatus || 'pending'} onValueChange={(value) => setEditForm(prev => ({ ...prev, verificationStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Verification Switches */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Verification Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isStudentVerified">Student Verified</Label>
                  <p className="text-sm text-muted-foreground">Student account has been verified</p>
                </div>
                <Switch
                  id="isStudentVerified"
                  checked={editForm.isStudentVerified || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isStudentVerified: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isDoctorVerified">Doctor Verified</Label>
                  <p className="text-sm text-muted-foreground">Doctor account has been verified</p>
                </div>
                <Switch
                  id="isDoctorVerified"
                  checked={editForm.isDoctorVerified || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isDoctorVerified: checked }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
