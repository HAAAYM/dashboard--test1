
// Library mock data - temporary solution until backend integration

export interface LibraryFile {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'image' | 'video' | 'other';
  category: string;
  size: string;
  uploadedBy: string;
  uploadedByInitials: string;
  uploadDate: string;
  downloads: number;
  tags: string[];
}

export interface LibraryStats {
  totalFiles: number;
  totalDownloads: number;
  storageUsed: string;
  storagePercentage: string;
  totalCategories: number;
  activeCategories: number;
  documents: number;
  images: number;
  videos: number;
  other: number;
}

export const libraryStats: LibraryStats = {
  totalFiles: 156,
  totalDownloads: 2847,
  storageUsed: '2.1 GB',
  storagePercentage: '65% of 10GB limit',
  totalCategories: 12,
  activeCategories: 8,
  documents: 89,
  images: 45,
  videos: 18,
  other: 4
};

export const libraryFiles: LibraryFile[] = [
  {
    id: '1',
    name: 'Algorithm Textbook PDF',
    description: 'Comprehensive guide to algorithms and data structures',
    type: 'document',
    category: 'CS Resources',
    size: '15 MB',
    uploadedBy: 'Dr. John Doe',
    uploadedByInitials: 'JD',
    uploadDate: 'Jan 15, 2024',
    downloads: 156,
    tags: ['algorithms', 'textbook', 'computer-science']
  },
  {
    id: '2',
    name: 'Study Schedule Template',
    description: 'Weekly study schedule template for students',
    type: 'document',
    category: 'Templates',
    size: '512 KB',
    uploadedBy: 'Jane Smith',
    uploadedByInitials: 'JS',
    uploadDate: 'Feb 1, 2024',
    downloads: 89,
    tags: ['template', 'schedule', 'productivity']
  },
  {
    id: '3',
    name: 'Campus Map',
    description: 'Interactive campus map with building locations',
    type: 'image',
    category: 'General',
    size: '3.2 MB',
    uploadedBy: 'Alice Johnson',
    uploadedByInitials: 'AJ',
    uploadDate: 'Feb 10, 2024',
    downloads: 234,
    tags: ['map', 'campus', 'navigation']
  }
];

export const libraryCategories = [
  'CS Resources',
  'Templates',
  'General',
  'Mathematics',
  'Engineering',
  'Medicine',
  'Business',
  'Arts',
  'Science',
  'Literature',
  'Other'
];
