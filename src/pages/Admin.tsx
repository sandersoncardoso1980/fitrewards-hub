import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Desafio criado com sucesso!');
    // Reset form
    setTitle('');
    setDescription('');
    setPoints('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <p className="text-muted-foreground">Gerencie desafios e recompensas</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">23</CardTitle>
            <CardDescription>Alunos Ativos</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Desafios Ativos</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">18</CardTitle>
            <CardDescription>Posts Este Mês</CardDescription>
          </CardHeader>
        </Card>
      </div>

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

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Desafio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
