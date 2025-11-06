import { User, Challenge, Post } from '@/types';

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin Academia',
    email: 'admin@fitquest.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    points: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user1',
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    points: 1250,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user2',
    name: 'Ana Santos',
    email: 'ana@email.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    points: 980,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user3',
    name: 'João Costa',
    email: 'joao@email.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    points: 1520,
    createdAt: new Date().toISOString(),
  },
];

// Test credentials
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@fitquest.com',
    password: 'admin123',
  },
  user: {
    email: 'carlos@email.com',
    password: 'user123',
  },
};

export const mockChallenges: Challenge[] = [
  {
    id: 'ch1',
    title: '30 Dias de Treino Consecutivo',
    description: 'Complete 30 dias de treino sem faltar nenhum dia',
    points: 500,
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    createdBy: 'admin1',
    participants: 23,
  },
  {
    id: 'ch2',
    title: 'Desafio Cardio Extremo',
    description: 'Faça 10 treinos de cardio intenso no mês',
    points: 300,
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    createdBy: 'admin1',
    participants: 18,
  },
  {
    id: 'ch3',
    title: 'Meta de Força',
    description: 'Aumente sua carga em 20% nos exercícios principais',
    points: 400,
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    createdBy: 'admin1',
    participants: 15,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'user3',
    userName: 'João Costa',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    caption: 'Treino de pernas pesado hoje! 💪 #LegDay #FitQuest',
    likes: 24,
    likedBy: ['user1', 'user2'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2',
    userId: 'user2',
    userName: 'Ana Santos',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    caption: 'Novo PR no supino! 🎯 Desafio de força em andamento',
    likes: 31,
    likedBy: ['user1', 'user3'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p3',
    userId: 'user1',
    userName: 'Carlos Silva',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    caption: 'Cardio matinal para começar o dia! ☀️🏃‍♂️',
    likes: 18,
    likedBy: ['user2'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];
