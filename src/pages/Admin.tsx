import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trophy, Users, Target, TrendingUp, Calendar, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Active challenges
      const { count: challengesCount } = await supabase
        .from('challenges')
        .select('*', { count: 'exact', head: true })
        .gte('end_date', new Date().toISOString().split('T')[0]);

      // Posts this month
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth);

      // Total challenge completions
      const { count: completionsCount } = await supabase
        .from('user_challenges')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true);

      return {
        usersCount: usersCount || 0,
        challengesCount: challengesCount || 0,
        postsCount: postsCount || 0,
        completionsCount: completionsCount || 0,
      };
    },
  });

  // Fetch top users
  const { data: topUsers } = useQuery({
    queryKey: ['top-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(5);
      return data;
    },
  });

  // Fetch recent activities
  const { data: recentChallenges } = useQuery({
    queryKey: ['recent-challenges'],
    queryFn: async () => {
      const { data } = await supabase
        .from('challenges')
        .select(`
          *,
          user_challenges (count)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('challenges')
        .insert({
          title,
          description,
          points: parseInt(points),
          start_date: startDate,
          end_date: endDate,
          created_by: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-challenges'] });
      setTitle('');
      setDescription('');
      setPoints('');
      setStartDate('');
      setEndDate('');
      toast.success('Desafio criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar desafio: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChallengeMutation.mutate();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <p className="text-muted-foreground">Gerencie desafios e acompanhe métricas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.usersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total de usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desafios Ativos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.challengesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.postsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Engajamento mensal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desafios Completados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total geral</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top 5 Alunos
            </CardTitle>
            <CardDescription>Melhores performers do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers?.map((user: any, index: number) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{user.points} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Desafios Recentes
            </CardTitle>
            <CardDescription>Últimos desafios criados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChallenges?.map((challenge: any) => (
                <div key={challenge.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{challenge.title}</p>
                    <p className="text-sm text-muted-foreground">{challenge.points} pontos</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {challenge.user_challenges?.[0]?.count || 0} participantes
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Challenge Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Criar Novo Desafio
          </CardTitle>
          <CardDescription>
            Adicione um novo desafio para motivar seus alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Desafio</Label>
              <Input
                id="title"
                placeholder="Ex: Desafio 30 Dias de Treino"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o desafio e seus objetivos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="500"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={createChallengeMutation.isPending}
            >
              {createChallengeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Criar Desafio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
