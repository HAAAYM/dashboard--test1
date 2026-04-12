// Posts mock data - temporary solution until backend integration

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  group: string;
  likes: number;
  comments: number;
  status: 'active' | 'hidden';
  posted: string;
  isPinned: boolean;
}

export interface PostsStats {
  totalPosts: number;
  activePosts: number;
  hiddenPosts: number;
  pinnedPosts: number;
}

export const postsStats: PostsStats = {
  totalPosts: 1234,
  activePosts: 1189,
  hiddenPosts: 45,
  pinnedPosts: 12
};

export const posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to the Computer Science Department group!',
    content: 'Feel free to share resources and ask questions. This is the official group for CS students and faculty...',
    author: 'Dr. John Doe',
    authorInitials: 'JD',
    group: 'CS Department',
    likes: 45,
    comments: 12,
    status: 'active',
    posted: 'Jan 1, 2024',
    isPinned: true
  },
  {
    id: '2',
    title: 'Looking for study partners for the upcoming algorithms exam',
    content: 'Anyone interested in forming a study group? I was thinking we could meet twice a week...',
    author: 'Alice Johnson',
    authorInitials: 'AJ',
    group: 'Study Group',
    likes: 8,
    comments: 5,
    status: 'active',
    posted: '3 days ago',
    isPinned: false
  },
  {
    id: '3',
    title: '[Hidden] Spam content detected',
    content: 'This post has been automatically hidden due to suspicious content...',
    author: 'Unknown User',
    authorInitials: '??',
    group: 'General',
    likes: 0,
    comments: 0,
    status: 'hidden',
    posted: '1 week ago',
    isPinned: false
  }
];

export const postStatuses = [
  'active',
  'hidden'
];

export const postGroups = [
  'CS Department',
  'Study Group',
  'General',
  'Mathematics',
  'Engineering',
  'Medicine',
  'Business',
  'Arts'
];
