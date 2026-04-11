'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

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
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'moderator', label: 'Moderator', description: 'Content management access' },
  { value: 'user', label: 'User', description: 'Basic read access' }
];

const permissionCategories = [
  {
    id: 'users',
    label: 'Users',
    description: 'Control user management',
    permissions: [
      { value: 'users_read', label: 'View Users', description: 'View user list and profiles' },
      { value: 'users_write', label: 'Add/Edit Users', description: 'Create and edit user accounts' },
      { value: 'users_delete', label: 'Delete Users', description: 'Remove user accounts' }
    ]
  },
  {
    id: 'groups',
    label: 'Groups',
    description: 'Control group management',
    permissions: [
      { value: 'groups_read', label: 'View Groups', description: 'View group list and details' },
      { value: 'groups_write', label: 'Add/Edit Groups', description: 'Create and edit groups' },
      { value: 'groups_delete', label: 'Delete Groups', description: 'Remove groups' },
      { value: 'groups_delete_posts', label: 'Delete Group Posts', description: 'Remove posts from groups' }
    ]
  },
  {
    id: 'library',
    label: 'Library',
    description: 'Control library resources',
    permissions: [
      { value: 'library_read', label: 'View Library', description: 'View library resources' },
      { value: 'library_write', label: 'Add/Edit Resources', description: 'Create and edit library resources' },
      { value: 'library_delete', label: 'Delete Resources', description: 'Remove library resources' },
      { value: 'library_manage_categories', label: 'Manage Categories', description: 'Create and edit library categories' }
    ]
  }
];

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    position: user?.position || '',
    status: user?.status || 'active',
    password: '',
    confirmPassword: '',
    permissions: user?.permissions || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['users']);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelectAll = (categoryId: string, checked: boolean) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryPermissions = category.permissions.map(p => p.value);
    setFormData(prev => {
      let newPermissions = [...prev.permissions];
      
      if (checked) {  
        // Add all category permissions
        categoryPermissions.forEach(perm => {
          if (!newPermissions.includes(perm)) {
            newPermissions.push(perm);
          }
        });
      } else {
        // Remove all category permissions
        newPermissions = newPermissions.filter(perm => !categoryPermissions.includes(perm));
      }
      
      return { ...prev, permissions: newPermissions };
    });
  };

  const isCategorySelected = (categoryId: string) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const categoryPermissions = category.permissions.map(p => p.value);
    return categoryPermissions.every(perm => formData.permissions.includes(perm));
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const categoryPermissions = category.permissions.map(p => p.value);
    const selectedCount = categoryPermissions.filter(perm => formData.permissions.includes(perm)).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

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

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
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
        lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0]
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
              {user ? 'Update user information and permissions' : 'Create a new user account with specific permissions'}
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

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions</h3>
            <div className="space-y-3">
              {permissionCategories.map(category => {
                const isExpanded = expandedCategories.includes(category.id);
                const isSelected = isCategorySelected(category.id);
                const isPartial = isCategoryPartiallySelected(category.id);
                
                return (
                  <div key={category.id} className="border rounded-lg">
                    <div 
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked: boolean) => {
                          handleCategorySelectAll(category.id, checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium cursor-pointer">
                            {category.label}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            ({category.permissions.length} permissions)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {isExpanded && (
                      <div className="border-t p-3 space-y-2 bg-muted/20">
                        {category.permissions.map(permission => (
                          <div key={permission.value} className="flex items-start space-x-3 pl-6">
                            <Checkbox
                              id={permission.value}
                              checked={formData.permissions.includes(permission.value)}
                              onCheckedChange={(checked: boolean) => handlePermissionChange(permission.value, checked)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={permission.value} className="font-medium text-sm">
                                {permission.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
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
