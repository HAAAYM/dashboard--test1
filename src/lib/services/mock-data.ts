import { User, Group, Post, VerificationRequest, Report, LibraryFile, ActivityLog, AuditLog, AIBotSettings, DashboardStats, UserStatus } from '@/types';
import { UserRole } from '@/lib/permissions/roles';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@edumate.com',
    displayName: 'Super Admin',
    role: UserRole.SUPER_ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    status: 'active',
  },
  {
    id: '2',
    email: 'john.doe@university.edu',
    displayName: 'Dr. John Doe',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '3',
    email: 'jane.smith@university.edu',
    displayName: 'Jane Smith',
    role: UserRole.MODERATOR,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: new Date('2024-02-01'),
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: '4',
    email: 'student1@university.edu',
    displayName: 'Alice Johnson',
    role: UserRole.VIEWER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    createdAt: new Date('2024-02-15'),
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Computer Science Department',
    description: 'Official group for CS students and faculty',
    adminId: '2',
    memberCount: 245,
    isPrivate: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    tags: ['computer-science', 'department', 'official'],
  },
  {
    id: '2',
    name: 'Study Group - Advanced Algorithms',
    description: 'Weekly study sessions for algorithm practice',
    adminId: '4',
    memberCount: 32,
    isPrivate: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['study-group', 'algorithms', 'cs'],
  },
];

const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '2',
    content: 'Welcome to the Computer Science Department group! Feel free to share resources and ask questions.',
    groupId: '1',
    likesCount: 45,
    commentsCount: 12,
    isPinned: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'active',
  },
  {
    id: '2',
    authorId: '4',
    content: 'Looking for study partners for the upcoming algorithms exam. Anyone interested?',
    groupId: '2',
    likesCount: 8,
    commentsCount: 5,
    isPinned: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

const mockVerificationRequests: VerificationRequest[] = [
  {
    id: '1',
    userId: '4',
    type: 'student',
    documents: [
      {
        id: '1',
        name: 'student_id.pdf',
        url: '/files/student_id.pdf',
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: '2',
    type: 'doctor',
    documents: [
      {
        id: '2',
        name: 'medical_license.pdf',
        url: '/files/medical_license.pdf',
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    status: 'approved',
    reviewedBy: '1',
    reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const mockReports: Report[] = [
  {
    id: '1',
    reporterId: '3',
    targetType: 'post',
    targetId: '2',
    reason: 'Inappropriate content',
    description: 'The post contains spam links',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: '2',
    reporterId: '2',
    targetType: 'user',
    targetId: '4',
    reason: 'Harassment',
    description: 'User sending inappropriate messages',
    status: 'resolved',
    resolvedBy: '1',
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

const mockLibraryFiles: LibraryFile[] = [
  {
    id: '1',
    name: 'Algorithm Textbook PDF',
    description: 'Comprehensive guide to algorithms and data structures',
    url: '/files/algorithms_textbook.pdf',
    type: 'application/pdf',
    size: 15728640, // 15MB
    uploadedBy: '2',
    categoryId: 'cs-resources',
    tags: ['algorithms', 'textbook', 'computer-science'],
    downloadCount: 156,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Study Schedule Template',
    description: 'Weekly study schedule template for students',
    url: '/files/study_schedule.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 524288, // 512KB
    uploadedBy: '3',
    tags: ['template', 'schedule', 'productivity'],
    downloadCount: 89,
    createdAt: new Date('2024-02-01'),
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '4',
    action: 'login',
    resource: 'auth',
    resourceId: '4',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: '2',
    action: 'create_post',
    resource: 'post',
    resourceId: '1',
    details: { groupId: '1', contentLength: 120 },
    createdAt: new Date('2024-01-01'),
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    adminId: '1',
    action: 'approve_verification',
    targetResource: 'verification_request',
    targetId: '2',
    oldValue: { status: 'pending' },
    newValue: { status: 'approved' },
    ipAddress: '192.168.1.1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    adminId: '1',
    action: 'resolve_report',
    targetResource: 'report',
    targetId: '2',
    oldValue: { status: 'pending' },
    newValue: { status: 'resolved' },
    ipAddress: '192.168.1.1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const mockAIBotSettings: AIBotSettings = {
  id: '1',
  isEnabled: true,
  responseStyle: 'professional',
  allowedTopics: ['academics', 'schedules', 'general', 'support'],
  blockedTopics: ['politics', 'religion', 'inappropriate'],
  maxResponseLength: 500,
  responseDelay: 1000,
  lastUpdatedBy: '1',
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
};

const mockDashboardStats: DashboardStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalGroups: 45,
  totalPosts: 1234,
  pendingVerifications: 23,
  pendingReports: 8,
  totalFiles: 156,
  onlineUsers: 127,
};

export const mockDataService = {
  getUsers: () => Promise.resolve(mockUsers),
  getGroups: () => Promise.resolve(mockGroups),
  getPosts: () => Promise.resolve(mockPosts),
  getVerificationRequests: () => Promise.resolve(mockVerificationRequests),
  getReports: () => Promise.resolve(mockReports),
  getLibraryFiles: () => Promise.resolve(mockLibraryFiles),
  getActivityLogs: () => Promise.resolve(mockActivityLogs),
  getAuditLogs: () => Promise.resolve(mockAuditLogs),
  getAIBotSettings: () => Promise.resolve(mockAIBotSettings),
  getDashboardStats: () => Promise.resolve(mockDashboardStats),
  
  // Simulate API delays
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),
};
