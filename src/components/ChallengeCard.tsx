import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Challenge } from '@/types';
import { toast } from 'sonner';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const handleParticipate = () => {
    toast.success('Você entrou no desafio!');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-4 right-4 bg-gradient-primary border-0">
          <Trophy className="mr-1 h-3 w-3" />
          {challenge.points} pts
        </Badge>
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
            <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{challenge.participants}</span>
          </div>
        </div>

        <Button 
          onClick={handleParticipate}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          Participar do Desafio
        </Button>
      </CardContent>
    </Card>
  );
}
