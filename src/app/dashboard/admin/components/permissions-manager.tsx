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
    id: 'read_dashboard',
    name: 'Read Dashboard',
    description: 'View dashboard and analytics',
    category: 'Dashboard',
    icon: FileText
  },
  {
    id: 'write_dashboard',
    name: 'Write Dashboard',
    description: 'Create and edit dashboard content',
    category: 'Dashboard',
    icon: FileText
  },
  {
    id: 'read_users',
    name: 'Read Users',
    description: 'View user list and profiles',
    category: 'Users',
    icon: Users
  },
  {
    id: 'write_users',
    name: 'Write Users',
    description: 'Create and edit user accounts',
    category: 'Users',
    icon: Users
  },
  {
    id: 'delete_users',
    name: 'Delete Users',
    description: 'Remove user accounts',
    category: 'Users',
    icon: Users
  },
  {
    id: 'access_groups',
    name: 'Groups Access',
    description: 'Access and manage groups',
    category: 'Groups',
    icon: Users2
  },
  {
    id: 'manage_permissions',
    name: 'Manage Permissions',
    description: 'Configure user permissions and roles',
    category: 'System',
    icon: Shield
  },
  {
    id: 'system_settings',
    name: 'System Settings',
    description: 'Modify system configuration',
    category: 'System',
    icon: Settings
  },
  {
    id: 'database_access',
    name: 'Database Access',
    description: 'Direct database operations',
    category: 'System',
    icon: Database
  }
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: mockPermissions.map(p => p.id),
    color: 'bg-red-600'
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Content management access',
    permissions: ['read_dashboard', 'write_dashboard', 'read_users', 'write_users'],
    color: 'bg-blue-600'
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Content editing access',
    permissions: ['read_dashboard', 'write_dashboard'],
    color: 'bg-green-600'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read_dashboard'],
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
