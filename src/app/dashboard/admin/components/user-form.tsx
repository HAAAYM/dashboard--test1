'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    position: string;
    status: string;
    lastLogin: string;
    permissions: string[];
  };
  onSave: (userData: any) => void;
  onCancel: () => void;
}

const roles = [
  { 
    value: 'admin', 
    label: 'Administrator', 
    description: 'Full system access and control',
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
    value: 'moderator', 
    label: 'Moderator', 
    description: 'Content moderation and group management',
    permissions: [
      'dashboard_view', 'users_view',
      'groups_view', 'groups_edit', 'groups_moderate',
      'library_view', 'library_edit',
      'reports_view', 'reports_review', 'reports_resolve', 'reports_dismiss',
      'verification_view', 'verification_approve', 'verification_reject'
    ]
  },
  { 
    value: 'viewer', 
    label: 'Viewer', 
    description: 'Read-only access to dashboard',
    permissions: [
      'dashboard_view'
    ]
  }
];

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'viewer',
    position: user?.position || '',
    status: user?.status || 'active',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRolePermissions = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.permissions : [];
  };

  const selectedRole = roles.find(r => r.value === formData.role);
  const rolePermissions = getRolePermissions(formData.role);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData: any = {
        ...formData,
        id: user?.id || Date.now(),
        lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0],
        permissions: rolePermissions
      };

      // Remove password fields if not changed
      if (user && !formData.password) {
        delete userData.password;
        delete userData.confirmPassword;
      } else {
        delete userData.confirmPassword;
      }

      onSave(userData);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user ? 'Edit User' : 'Add New User'}</CardTitle>
            <CardDescription>
              {user ? 'Update user information and role' : 'Create a new user account with predefined role permissions'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter user name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position/Job Title</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Enter position or job title"
                />
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Role and Status</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div>{role.label}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Password */}
          {!user && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Password</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Permissions Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Role Permissions</h3>
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">{selectedRole?.label}</span>
                <span className="text-sm text-muted-foreground">({rolePermissions.length} permissions)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selectedRole?.description}</p>
              
              <div className="grid gap-2">
                {rolePermissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono text-xs">{permission}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Permissions are automatically assigned based on the selected role.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
