import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChallengeCard } from '@/components/ChallengeCard';
import { Loader2 } from 'lucide-react';

const Challenges = () => {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          profiles:created_by (
            name
          ),
          user_challenges (
            user_id,
            completed
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Desafios Ativos</h1>
        <p className="text-muted-foreground">Complete desafios e ganhe pontos!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge: any) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum desafio ativo no momento
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
