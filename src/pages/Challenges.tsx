import { ChallengeCard } from '@/components/ChallengeCard';
import { mockChallenges } from '@/lib/mockData';

const Challenges = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Desafios Ativos</h1>
        <p className="text-muted-foreground">Complete desafios e ganhe pontos!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};

export default Challenges;
