// Verification mock data - temporary solution until backend integration

export interface VerificationRequest {
  id: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  type: 'Student' | 'Doctor' | 'Faculty' | 'Staff';
  documents: number;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedByInitials?: string;
}

export interface VerificationStats {
  pendingRequests: number;
  approvedToday: number;
  rejectedToday: number;
  totalVerified: number;
}

export const verificationStats: VerificationStats = {
  pendingRequests: 23,
  approvedToday: 8,
  rejectedToday: 3,
  totalVerified: 847
};

export const verificationRequests: VerificationRequest[] = [
  {
    id: '1',
    userName: 'Alice Johnson',
    userEmail: 'alice@university.edu',
    userInitials: 'AJ',
    type: 'Student',
    documents: 1,
    submitted: '2 days ago',
    status: 'Pending'
  },
  {
    id: '2',
    userName: 'Dr. John Doe',
    userEmail: 'john.doe@university.edu',
    userInitials: 'JD',
    type: 'Doctor',
    documents: 1,
    submitted: '5 days ago',
    status: 'Approved',
    reviewedBy: 'Super Admin',
    reviewedByInitials: 'SA'
  },
  {
    id: '3',
    userName: 'Bob Wilson',
    userEmail: 'bob@university.edu',
    userInitials: 'BW',
    type: 'Faculty',
    documents: 2,
    submitted: '1 day ago',
    status: 'Rejected',
    reviewedBy: 'Jane Smith',
    reviewedByInitials: 'JS'
  }
];

export const verificationTypes = [
  'Student',
  'Doctor',
  'Faculty',
  'Staff'
];

export const verificationStatuses = [
  'Pending',
  'Approved',
  'Rejected'
];
