'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Key, 
  Mail, 
  Bell,
  Shield,
  LogOut,
  Edit
} from 'lucide-react';

interface UserProfileProps {
  user?: {
    id: number;
    name: string;
    email: string;
    position: string;
    role: string;
    avatar?: string;
    status: string;
    lastLogin: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Mock current user - in real app this would come from auth
  const currentUser = user || {
    id: 1,
    name: 'Dr. Ahmed Mohammed',
    email: 'ahmed@edumate.com',
    position: 'عميد كلية الهندسة',
    role: 'admin',
    avatar: '',
    status: 'active',
    lastLogin: '2024-01-15'
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Status indicator */}
            <div className={`absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-background ${
              currentUser.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          {/* User Info */}
          <div>
            <CardTitle className="text-xl">{currentUser.name}</CardTitle>
            <CardDescription className="text-base font-medium text-foreground">
              {currentUser.position}
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">إعدادات سريعة</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // In real app, this would open password change modal
                console.log('Change password');
              }}
            >
              <Key className="h-4 w-4 mr-2" />
              تغيير كلمة المرور
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // In real app, this would open email change modal
                console.log('Change email');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              تغيير الإيميل
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // In real app, this would open notification settings
                console.log('Notification settings');
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              إعدادات الإشعارات
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // In real app, this would open full settings
                console.log('Full settings');
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات الكاملة
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الحالة:</span>
            <span className={`font-medium ${
              currentUser.status === 'active' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {currentUser.status === 'active' ? 'نشط' : 'غير نشط'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">آخر تسجيل دخول:</span>
            <span className="font-medium">{currentUser.lastLogin}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">البريد الإلكتروني:</span>
            <span className="font-medium text-xs">{currentUser.email}</span>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => {
            // In real app, this would handle logout
            console.log('Logout');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          تسجيل الخروج
        </Button>
      </CardContent>
    </Card>
  );
}
