export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  points: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  startDate: string;
  endDate: string;
  image: string;
  createdBy: string;
  participants: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  completed: boolean;
  completedAt?: string;
}
