import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Flame, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSettingUpDemo, setIsSettingUpDemo] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const setupDemoUsers = async () => {
    setIsSettingUpDemo(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-demo-users');
      
      if (error) throw error;
      
      toast.success('Usuários de exemplo criados com sucesso!');
      console.log('Demo users setup:', data);
    } catch (error: any) {
      toast.error('Erro ao criar usuários: ' + error.message);
    } finally {
      setIsSettingUpDemo(false);
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setLoginEmail(email);
    setLoginPassword(password);
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(signupEmail, signupPassword, signupName);
    if (success) {
      navigate('/');
    }
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
          <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Users className="h-4 w-4" />
              <span>Logins Rápidos de Exemplo</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('admin@fitquest.com', 'admin123')}
                className="w-full justify-start"
              >
                <span className="font-mono text-xs">admin@fitquest.com</span>
                <span className="ml-auto text-xs text-muted-foreground">Admin</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('user1@fitquest.com', 'user123')}
                className="w-full justify-start"
              >
                <span className="font-mono text-xs">user1@fitquest.com</span>
                <span className="ml-auto text-xs text-muted-foreground">Usuário</span>
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={setupDemoUsers}
              disabled={isSettingUpDemo}
              className="w-full"
            >
              {isSettingUpDemo ? 'Configurando...' : 'Criar Usuários de Exemplo'}
            </Button>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Flame className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Flame className="mr-2 h-4 w-4" />
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
