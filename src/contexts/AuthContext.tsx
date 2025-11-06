import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers, TEST_CREDENTIALS } from '@/lib/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('fitquest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check admin credentials
    if (email === TEST_CREDENTIALS.admin.email && password === TEST_CREDENTIALS.admin.password) {
      const adminUser = mockUsers.find(u => u.role === 'admin');
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem('fitquest_user', JSON.stringify(adminUser));
        toast.success('Login realizado com sucesso!');
        return true;
      }
    }

    // Check user credentials
    if (email === TEST_CREDENTIALS.user.email && password === TEST_CREDENTIALS.user.password) {
      const regularUser = mockUsers.find(u => u.email === email);
      if (regularUser) {
        setUser(regularUser);
        localStorage.setItem('fitquest_user', JSON.stringify(regularUser));
        toast.success('Login realizado com sucesso!');
        return true;
      }
    }

    toast.error('Email ou senha incorretos');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitquest_user');
    toast.success('Logout realizado com sucesso');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
