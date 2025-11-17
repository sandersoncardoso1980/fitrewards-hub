import { CalorieScanner } from '@/components/CalorieScanner';

const CalorieReader = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Leitor de Calorias</h1>
        <p className="text-muted-foreground">
          Use IA para descobrir quantas calorias tem no seu prato
        </p>
      </div>
      <CalorieScanner />
    </div>
  );
};

export default CalorieReader;
