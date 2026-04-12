// Profile mock data - temporary solution until backend integration

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  position: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  joinedDate: string;
  department: string;
  employeeId: string;
}

export interface StaffTab {
  id: string;
  title: string;
  icon: any;
  description: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  isCurrent: boolean;
}

export interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  icon: any;
}

export interface ImportantNotification {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface RecentNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export const currentUser: CurrentUser = {
  id: 1,
  name: 'Dr. Ahmed Mohammed',
  email: 'ahmed.mohammed@university.edu',
  position: 'Dean of Engineering',
  role: 'admin',
  avatar: '',
  status: 'active',
  lastLogin: '2024-01-15 14:30',
  joinedDate: '2023-06-15',
  department: 'College of Engineering',
  employeeId: 'EMP-2023-001'
};

export const staffTabs: StaffTab[] = [
  {
    id: 'devices',
    title: 'Connected Devices',
    icon: 'Smartphone',
    description: 'Manage and monitor connected devices'
  },
  {
    id: 'overview',
    title: 'Staff Information & Activity',
    icon: 'User',
    description: 'Staff profile, information and recent dashboard activity'
  },
  {
    id: 'settings',
    title: 'Settings & Notifications',
    icon: 'Settings',
    description: 'Account settings, security and important notifications'
  }
];

export const connectedDevices: ConnectedDevice[] = [
  {
    id: '1',
    name: 'Chrome - Windows',
    type: 'desktop',
    lastUsed: 'Current session',
    isCurrent: true
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    type: 'mobile',
    lastUsed: '2 hours ago',
    isCurrent: false
  },
  {
    id: '3',
    name: 'Firefox - Mac',
    type: 'desktop',
    lastUsed: 'Yesterday',
    isCurrent: false
  }
];

export const recentActivity: RecentActivity[] = [
  {
    id: '1',
    action: 'Dashboard Login',
    timestamp: '2024-01-15 14:30',
    icon: 'Activity'
  },
  {
    id: '2',
    action: 'User Management Access',
    timestamp: '2024-01-15 13:45',
    icon: 'Users'
  },
  {
    id: '3',
    action: 'Permission Update',
    timestamp: '2024-01-15 11:20',
    icon: 'Shield'
  }
];

export const importantNotifications: ImportantNotification[] = [
  {
    id: '1',
    title: 'System Security Alerts',
    description: 'Critical security issues only',
    status: 'active'
  },
  {
    id: '2',
    title: 'Emergency System Updates',
    description: 'System maintenance and updates',
    status: 'active'
  },
  {
    id: '3',
    title: 'User Management Alerts',
    description: 'Critical user account issues',
    status: 'active'
  }
];

export const recentNotifications: RecentNotification[] = [
  {
    id: '1',
    title: 'System Update Completed',
    description: 'Dashboard system has been updated successfully',
    timestamp: '2024-01-15 10:30',
    color: 'blue'
  },
  {
    id: '2',
    title: 'New User Registration',
    description: '3 new staff accounts pending approval',
    timestamp: '2024-01-15 09:15',
    color: 'yellow'
  },
  {
    id: '3',
    title: 'Backup Completed',
    description: 'Daily backup completed successfully',
    timestamp: '2024-01-15 08:00',
    color: 'green'
  }
];
