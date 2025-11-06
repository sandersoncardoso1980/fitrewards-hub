import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';

const Ranking = () => {
  const { data: rankedUsers, isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-primary" />;
    if (index === 1) return <Medal className="h-5 w-5 text-secondary" />;
    if (index === 2) return <Award className="h-5 w-5 text-accent" />;
    return null;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-gradient-primary border-0';
    if (index === 1) return 'bg-gradient-secondary border-0';
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ranking Mensal</h1>
        <p className="text-muted-foreground">Top alunos do mês atual</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <CardDescription>
            Os melhores performers do mês serão recompensados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankedUsers && rankedUsers.length > 0 ? (
              rankedUsers.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                    </div>
                  </div>
                  <Badge className={getRankBadge(index)}>
                    {user.points} pts
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum usuário no ranking ainda
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ranking;
