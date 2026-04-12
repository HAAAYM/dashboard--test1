'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Users2, 
  Settings, 
  FileText, 
  Database,
  Plus,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

const mockPermissions: Permission[] = [
  {
    id: 'dashboard_view',
    name: 'View Dashboard',
    description: 'View dashboard and analytics',
    category: 'Dashboard',
    icon: FileText
  },
  {
    id: 'admin_view',
    name: 'Admin Panel',
    description: 'Access admin panel',
    category: 'Admin',
    icon: Shield
  },
  {
    id: 'admin_users_manage',
    name: 'Manage Admin Users',
    description: 'Manage admin users and roles',
    category: 'Admin',
    icon: Shield
  },
  {
    id: 'admin_roles_manage',
    name: 'Manage Roles',
    description: 'Configure user roles',
    category: 'Admin',
    icon: Shield
  },
  {
    id: 'users_view',
    name: 'View Users',
    description: 'View user list and profiles',
    category: 'Users',
    icon: Users
  },
  {
    id: 'users_create',
    name: 'Create Users',
    description: 'Create new user accounts',
    category: 'Users',
    icon: Users
  },
  {
    id: 'users_edit',
    name: 'Edit Users',
    description: 'Edit user accounts',
    category: 'Users',
    icon: Users
  },
  {
    id: 'users_delete',
    name: 'Delete Users',
    description: 'Remove user accounts',
    category: 'Users',
    icon: Users
  },
  {
    id: 'users_ban',
    name: 'Ban Users',
    description: 'Ban or unban users',
    category: 'Users',
    icon: Users
  },
  {
    id: 'users_assign_roles',
    name: 'Assign Roles',
    description: 'Assign roles to users',
    category: 'Users',
    icon: Users
  },
  {
    id: 'groups_view',
    name: 'View Groups',
    description: 'View group list and details',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'groups_create',
    name: 'Create Groups',
    description: 'Create new groups',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'groups_edit',
    name: 'Edit Groups',
    description: 'Edit group information',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'groups_delete',
    name: 'Delete Groups',
    description: 'Remove groups',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'groups_moderate',
    name: 'Moderate Groups',
    description: 'Moderate group content',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'groups_assign_moderators',
    name: 'Assign Moderators',
    description: 'Assign group moderators',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'library_view',
    name: 'View Library',
    description: 'View library resources',
    category: 'Library',
    icon: FileText
  },
  {
    id: 'library_create',
    name: 'Create Library Content',
    description: 'Create library resources',
    category: 'Library',
    icon: FileText
  },
  {
    id: 'library_edit',
    name: 'Edit Library Content',
    description: 'Edit library resources',
    category: 'Library',
    icon: FileText
  },
  {
    id: 'library_delete',
    name: 'Delete Library Content',
    description: 'Remove library resources',
    category: 'Library',
    icon: FileText
  },
  {
    id: 'library_manage_categories',
    name: 'Manage Categories',
    description: 'Manage library categories',
    category: 'Library',
    icon: FileText
  },
  {
    id: 'reports_view',
    name: 'View Reports',
    description: 'View reports list',
    category: 'Reports',
    icon: FileText
  },
  {
    id: 'reports_review',
    name: 'Review Reports',
    description: 'Review and process reports',
    category: 'Reports',
    icon: FileText
  },
  {
    id: 'reports_resolve',
    name: 'Resolve Reports',
    description: 'Mark reports as resolved',
    category: 'Reports',
    icon: FileText
  },
  {
    id: 'reports_dismiss',
    name: 'Dismiss Reports',
    description: 'Dismiss reports',
    category: 'Reports',
    icon: FileText
  },
  {
    id: 'reports_delete',
    name: 'Delete Reports',
    description: 'Remove reports',
    category: 'Reports',
    icon: FileText
  },
  {
    id: 'verification_view',
    name: 'View Verification',
    description: 'View verification requests',
    category: 'Verification',
    icon: FileText
  },
  {
    id: 'verification_approve',
    name: 'Approve Verification',
    description: 'Approve verification requests',
    category: 'Verification',
    icon: FileText
  },
  {
    id: 'verification_reject',
    name: 'Reject Verification',
    description: 'Reject verification requests',
    category: 'Verification',
    icon: FileText
  },
  {
    id: 'verification_assign',
    name: 'Assign Verification',
    description: 'Assign verification requests',
    category: 'Verification',
    icon: FileText
  }
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and control',
    permissions: mockPermissions.map(p => p.id),
    color: 'bg-red-600'
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Content moderation and group management',
    permissions: [
      'dashboard_view', 'users_view',
      'groups_view', 'groups_edit', 'groups_moderate',
      'library_view', 'library_edit',
      'reports_view', 'reports_review', 'reports_resolve', 'reports_dismiss',
      'verification_view', 'verification_approve', 'verification_reject'
    ],
    color: 'bg-blue-600'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to dashboard',
    permissions: ['dashboard_view'],
    color: 'bg-gray-600'
  }
];

export function PermissionsManager() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [roles, setRoles] = useState(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(mockRoles[0]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  const categories = Array.from(new Set(permissions.map(p => p.category)));

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (!selectedRole) return;

    const updatedPermissions = checked
      ? [...selectedRole.permissions, permissionId]
      : selectedRole.permissions.filter(p => p !== permissionId);

    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    
    // Update roles array
    setRoles(prev => prev.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleName,
      description: newRoleDescription,
      permissions: [],
      color: 'bg-purple-600'
    };

    setRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const handleDeleteRole = (roleId: string) => {
    if (roleId === 'admin') return; // Cannot delete admin role
    
    setRoles(prev => prev.filter(role => role.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(mockRoles[0]);
    }
  };

  const handleDuplicateRole = (role: Role) => {
    const duplicatedRole: Role = {
      ...role,
      id: `${role.id}_copy`,
      name: `${role.name} (Copy)`
    };
    setRoles(prev => [...prev, duplicatedRole]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Permissions & Roles</h2>
        <p className="text-muted-foreground">
          Manage user roles and their associated permissions
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Roles Management */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Roles List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Roles
                </CardTitle>
                <CardDescription>
                  Create and manage user roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Role */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New role name..."
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Role description..."
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                  />
                </div>

                {/* Roles List */}
                <div className="space-y-2">
                  {roles.map(role => (
                    <div
                      key={role.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRole?.id === role.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${role.color}`} />
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateRole(role);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {role.id !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions */}
            {selectedRole && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {selectedRole.name} Permissions
                  </CardTitle>
                  <CardDescription>
                    Configure permissions for this role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categories.map(category => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {getPermissionsByCategory(category).map(permission => {
                          const Icon = permission.icon;
                          const isChecked = selectedRole.permissions.includes(permission.id);
                          
                          return (
                            <div key={permission.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={permission.id}
                                checked={isChecked}
                                onCheckedChange={(checked: boolean) => handlePermissionToggle(permission.id, checked)}
                              />
                              <div className="flex items-center gap-2 flex-1">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor={permission.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{permission.name}</div>
                                  <div className="text-sm text-muted-foreground">{permission.description}</div>
                                </Label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permissions Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                All Permissions
              </CardTitle>
              <CardDescription>
                Overview of all available permissions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Used by Roles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map(permission => {
                      const rolesUsingPermission = roles.filter(role => 
                        role.permissions.includes(permission.id)
                      );
                      
                      return (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <permission.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{permission.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{permission.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {permission.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {rolesUsingPermission.map(role => (
                                <Badge key={role.id} variant="secondary" className="text-xs">
                                  {role.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
