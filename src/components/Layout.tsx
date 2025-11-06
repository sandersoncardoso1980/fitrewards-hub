import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Home, Trophy, Users, LogOut, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FitQuest
            </h1>
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Feed
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/challenges')}
                className="gap-2"
              >
                <Trophy className="h-4 w-4" />
                Desafios
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/ranking')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Ranking
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="gap-2 text-primary"
                >
                  <PlusCircle className="h-4 w-4" />
                  Admin
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.points} pontos
                </p>
              </div>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="container flex items-center justify-around h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/challenges')}
          >
            <Trophy className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/ranking')}
          >
            <Users className="h-5 w-5" />
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="text-primary"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
