// Live Activity mock data - temporary solution until backend integration

export interface LiveStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  description: string;
  color: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  time: string;
  type: 'login' | 'post' | 'group' | 'verification' | 'download' | 'report';
  ip: string;
}

export interface TopPage {
  page: string;
  views: number;
  percentage: number;
}

export const liveStats: LiveStat[] = [
  {
    title: 'Online Users',
    value: '127',
    change: '+15%',
    icon: 'Users',
    description: 'Currently active',
    color: 'text-green-600',
  },
  {
    title: 'Active Sessions',
    value: '89',
    change: '+8%',
    icon: 'Activity',
    description: 'Engaged users',
    color: 'text-blue-600',
  },
  {
    title: 'New Posts',
    value: '23',
    change: '+12%',
    icon: 'MessageSquare',
    description: 'Last hour',
    color: 'text-purple-600',
  },
  {
    title: 'Page Views',
    value: '1,847',
    change: '+23%',
    icon: 'Eye',
    description: 'Last hour',
    color: 'text-orange-600',
  },
];

export const recentActivity: RecentActivity[] = [
  {
    id: '1',
    user: 'Alice Johnson',
    action: 'logged in',
    details: 'From New York, US',
    time: 'Just now',
    type: 'login',
    ip: '192.168.1.100',
  },
  {
    id: '2',
    user: 'Bob Wilson',
    action: 'posted in CS Department',
    details: 'Shared study resources',
    time: '2 minutes ago',
    type: 'post',
    ip: '192.168.1.101',
  },
  {
    id: '3',
    user: 'Carol Davis',
    action: 'joined Study Group',
    details: 'Advanced Algorithms',
    time: '5 minutes ago',
    type: 'group',
    ip: '192.168.1.102',
  },
  {
    id: '4',
    user: 'Dr. John Doe',
    action: 'approved verification',
    details: 'Student application',
    time: '8 minutes ago',
    type: 'verification',
    ip: '192.168.1.103',
  },
  {
    id: '5',
    user: 'David Brown',
    action: 'downloaded file',
    details: 'Algorithm Textbook PDF',
    time: '12 minutes ago',
    type: 'download',
    ip: '192.168.1.104',
  },
  {
    id: '6',
    user: 'Emma Wilson',
    action: 'created new group',
    details: 'Mathematics Study Circle',
    time: '15 minutes ago',
    type: 'group',
    ip: '192.168.1.105',
  },
  {
    id: '7',
    user: 'Frank Miller',
    action: 'submitted verification',
    details: 'Faculty documents',
    time: '18 minutes ago',
    type: 'verification',
    ip: '192.168.1.106',
  },
  {
    id: '8',
    user: 'Grace Lee',
    action: 'reported content',
    details: 'Inappropriate post',
    time: '22 minutes ago',
    type: 'report',
    ip: '192.168.1.107',
  },
];

export const topPages: TopPage[] = [
  { page: '/dashboard', views: 342, percentage: 18.5 },
  { page: '/groups/computer-science', views: 289, percentage: 15.6 },
  { page: '/users/profile', views: 234, percentage: 12.7 },
  { page: '/library/resources', views: 198, percentage: 10.7 },
  { page: '/posts/feed', views: 176, percentage: 9.5 },
];

export const activityTypes = [
  'login',
  'post',
  'group',
  'verification',
  'download',
  'report'
];
