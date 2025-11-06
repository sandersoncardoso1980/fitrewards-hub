import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Flame } from 'lucide-react';
import { TEST_CREDENTIALS } from '@/lib/mockData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const fillAdmin = () => {
    setEmail(TEST_CREDENTIALS.admin.email);
    setPassword(TEST_CREDENTIALS.admin.password);
  };

  const fillUser = () => {
    setEmail(TEST_CREDENTIALS.user.email);
    setPassword(TEST_CREDENTIALS.user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-glow">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-4 rounded-2xl">
              <Dumbbell className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            FitQuest
          </CardTitle>
          <CardDescription className="text-base">
            Entre para continuar sua jornada fitness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
              <Flame className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t space-y-3">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Contas de teste:
            </p>
            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={fillAdmin}
                className="w-full justify-start"
              >
                <span className="font-semibold">Admin:</span>
                <span className="ml-2 text-muted-foreground">{TEST_CREDENTIALS.admin.email}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={fillUser}
                className="w-full justify-start"
              >
                <span className="font-semibold">Usuário:</span>
                <span className="ml-2 text-muted-foreground">{TEST_CREDENTIALS.user.email}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
