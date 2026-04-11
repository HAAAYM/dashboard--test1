'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AlertTriangle
} from 'lucide-react';

// Mock users data - in real app this would come from API
const mockUsers = [
  {
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
    status: 'active',
    verified: true,
    joinDate: '2024-01-10',
    lastLogin: '2024-01-15 14:30',
    posts: 45,
    comments: 128,
    likes: 234,
    warnings: 2,
    reports: 1
  },
  {
    id: 2,
    name: 'Fatima Al-Rashid',
    email: 'fatima.alrashid@student.edu',
    phone: '+966 50 234 5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    role: 'student',
    college: 'Engineering',
    department: 'Computer Science',
    major: 'Artificial Intelligence',
    year: '2nd Year',
    status: 'active',
    verified: true,
    joinDate: '2024-01-08',
    lastLogin: '2024-01-15 11:20',
    posts: 67,
    comments: 189,
    likes: 412,
    warnings: 0,
    reports: 0
  },
  {
    id: 3,
    name: 'Omar Khalil',
    email: 'omar.khalil@student.edu',
    phone: '+966 50 345 6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=omar',
    role: 'student',
    college: 'Engineering',
    department: 'Information Technology',
    major: 'Information Technology',
    year: '4th Year',
    status: 'suspended',
    verified: true,
    joinDate: '2024-01-05',
    lastLogin: '2024-01-13 09:15',
    posts: 23,
    comments: 87,
    likes: 156,
    warnings: 3,
    reports: 2
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    email: 'sara.ahmed@student.edu',
    phone: '+966 50 456 7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
    role: 'student',
    college: 'Engineering',
    department: 'Computer Science',
    major: 'Interior Design',
    year: '1st Year',
    status: 'active',
    verified: false,
    joinDate: '2024-01-12',
    lastLogin: '2024-01-15 16:45',
    posts: 12,
    comments: 45,
    likes: 78,
    warnings: 0,
    reports: 0
  },
  {
    id: 5,
    name: 'Khalid Hassan',
    email: 'khalid.hassan@student.edu',
    phone: '+966 50 567 8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=khalid',
    role: 'student',
    college: 'Medicine',
    department: 'General Medicine',
    major: 'General Medicine',
    year: '3rd Year',
    status: 'active',
    verified: true,
    joinDate: '2024-01-09',
    lastLogin: '2024-01-15 13:30',
    posts: 34,
    comments: 156,
    likes: 289,
    warnings: 1,
    reports: 0
  }
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewUser = (userId: number) => {
    router.push(`/dashboard/users/${userId}`);
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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesCollege = collegeFilter === 'all' || user.college === collegeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesCollege && matchesStatus;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const verifiedUsers = users.filter(u => u.verified).length;
  const totalWarnings = users.reduce((sum, u) => sum + u.warnings, 0);

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
            <CardTitle className="text-sm font-medium">Total Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalWarnings}</div>
            <p className="text-xs text-muted-foreground">Active warnings</p>
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
                  placeholder="Search users by name, email, or major..."
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
                  <th className="text-left p-4 font-medium">Major</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Verified</th>
                  <th className="text-left p-4 font-medium">Last Login</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-primary/10 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      {getCollegeBadge(user.college)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{user.major}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4">
                      <Badge variant={user.verified ? "default" : "secondary"}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{user.lastLogin}</div>
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
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700">
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Ban className="h-4 w-4 mr-2" />
                          Ban
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
