// Notifications mock data - temporary solution until backend integration

export interface Notification {
  id: number;
  type: 'message' | 'warning' | 'announcement' | 'reminder' | 'alert';
  title: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
  priority: 'high' | 'medium' | 'low';
  category: 'system' | 'security' | 'account';
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Admin',
    content: 'You have received a new message regarding your account status.',
    sender: 'System Admin',
    recipient: 'Ahmed Mohammed',
    timestamp: '2024-01-15 14:30',
    status: 'unread',
    priority: 'high',
    category: 'system'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Account Warning',
    content: 'Your account has been flagged for unusual activity. Please review your recent actions.',
    sender: 'System',
    recipient: 'Fatima Al-Rashid',
    timestamp: '2024-01-15 12:15',
    status: 'read',
    priority: 'medium',
    category: 'security'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'System Maintenance',
    content: 'Scheduled maintenance will occur tonight at 2:00 AM. Please save your work.',
    sender: 'IT Department',
    recipient: 'All Users',
    timestamp: '2024-01-15 10:00',
    status: 'read',
    priority: 'low',
    category: 'system'
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Profile Update Reminder',
    content: 'Please update your profile information to ensure accurate account details.',
    sender: 'System',
    recipient: 'Omar Khalil',
    timestamp: '2024-01-14 16:45',
    status: 'unread',
    priority: 'medium',
    category: 'account'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Security Alert',
    content: 'New login detected from unrecognized device. Please verify if this was you.',
    sender: 'Security System',
    recipient: 'Sara Ahmed',
    timestamp: '2024-01-14 09:30',
    status: 'unread',
    priority: 'high',
    category: 'security'
  }
];

export const notificationTypes = [
  'message',
  'warning',
  'announcement',
  'reminder',
  'alert'
];

export const notificationStatuses = [
  'unread',
  'read',
  'archived'
];

export const notificationPriorities = [
  'high',
  'medium',
  'low'
];

export const notificationCategories = [
  'system',
  'security',
  'account'
];
