'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Filter,
  MoreHorizontal,
  Settings,
  Eye,
  Ban,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { UserForm } from './components/user-form';

// Mock data - in real app this would come from API
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@edumate.com',
    role: 'admin',
    position: 'System Administrator',
    status: 'active',
    lastLogin: '2024-01-15',
    permissions: [
      'dashboard_view', 'admin_view', 'admin_users_manage', 'admin_roles_manage',
      'users_view', 'users_create', 'users_edit', 'users_delete', 'users_ban', 'users_assign_roles',
      'groups_view', 'groups_create', 'groups_edit', 'groups_delete', 'groups_moderate', 'groups_assign_moderators',
      'library_view', 'library_create', 'library_edit', 'library_delete', 'library_manage_categories',
      'reports_view', 'reports_review', 'reports_resolve', 'reports_dismiss', 'reports_delete',
      'verification_view', 'verification_approve', 'verification_reject', 'verification_assign'
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@edumate.com',
    role: 'moderator',
    position: 'Content Manager',
    status: 'active',
    lastLogin: '2024-01-14',
    permissions: [
      'dashboard_view', 'users_view',
      'groups_view', 'groups_edit', 'groups_moderate',
      'library_view', 'library_edit',
      'reports_view', 'reports_review', 'reports_resolve', 'reports_dismiss',
      'verification_view', 'verification_approve', 'verification_reject'
    ]
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@edumate.com',
    role: 'viewer',
    position: 'Library Assistant',
    status: 'inactive',
    lastLogin: '2024-01-10',
    permissions: ['dashboard_view']
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@edumate.com',
    role: 'moderator',
    position: 'Group Coordinator',
    status: 'active',
    lastLogin: '2024-01-15',
    permissions: [
      'dashboard_view', 'users_view',
      'groups_view', 'groups_edit', 'groups_moderate',
      'library_view', 'library_edit',
      'reports_view', 'reports_review', 'reports_resolve', 'reports_dismiss',
      'verification_view', 'verification_approve', 'verification_reject'
    ]
  }
];

const roles = [
  { value: 'admin', label: 'Administrator', color: 'bg-red-600' },
  { value: 'moderator', label: 'Moderator', color: 'bg-blue-600' },
  { value: 'viewer', label: 'Viewer', color: 'bg-gray-600' }
];

const permissions = [
  { value: 'read', label: 'Read Only' },
  { value: 'write', label: 'Read & Write' },
  { value: 'delete', label: 'Full Access' }
];

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

  // User action handlers
  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
    // In real app, this would open edit form
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' }
        : user
    ));
  };

  const handleBanUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' }
        : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };
  const [editingUser, setEditingUser] = useState(null);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role info
  const getRoleInfo = (role: string) => roles.find(r => r.value === role) || roles[2];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions for the admin dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-xs text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'moderator').length}
                </p>
                <p className="text-xs text-muted-foreground">Moderators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Add, edit, and manage user accounts and permissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Permissions Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.position || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleInfo.color}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.permissions.length} permissions
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleSuspendUser(user.id)}
                              className={user.status === 'suspended' ? 'text-green-600' : 'text-yellow-600'}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {user.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleBanUser(user.id)}
                              className={user.status === 'banned' ? 'text-green-600' : 'text-red-600'}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === 'banned' ? 'Unban User' : 'Ban User'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Form */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm
              onSave={(userData) => {
                // In real app, this would save to API
                console.log('Saving user:', userData);
                setShowAddUser(false);
              }}
              onCancel={() => setShowAddUser(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
