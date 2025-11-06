import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeCardProps {
  challenge: any;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const userChallenge = challenge.user_challenges?.find((uc: any) => uc.user_id === user?.id);
  const isParticipating = !!userChallenge;
  const isCompleted = userChallenge?.completed;
  
  const [participating, setParticipating] = useState(isParticipating);

  const participateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setParticipating(true);
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Você entrou no desafio!');
    },
    onError: (error: any) => {
      toast.error('Erro ao participar: ' + error.message);
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_challenges')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('challenge_id', challenge.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Desafio completado! Pontos adicionados à sua conta!');
    },
    onError: (error: any) => {
      toast.error('Erro ao completar desafio: ' + error.message);
    },
  });

  const handleParticipate = () => {
    participateMutation.mutate();
  };

  const handleComplete = () => {
    completeMutation.mutate();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const participantsCount = challenge.user_challenges?.length || 0;

  return (
    <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="h-24 w-24 text-white/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-4 right-4 bg-gradient-primary border-0">
          <Trophy className="mr-1 h-3 w-3" />
          {challenge.points} pts
        </Badge>
        {isCompleted && (
          <Badge className="absolute top-4 left-4 bg-green-500 border-0">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completado
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {challenge.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participantsCount}</span>
          </div>
        </div>

        {!participating ? (
          <Button 
            onClick={handleParticipate}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={participateMutation.isPending}
          >
            {participateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trophy className="mr-2 h-4 w-4" />
            )}
            Participar do Desafio
          </Button>
        ) : isCompleted ? (
          <Button 
            variant="outline"
            className="w-full"
            disabled
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            Desafio Completado
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            className="w-full bg-green-500 hover:bg-green-600 transition-colors"
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Marcar como Completado
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
