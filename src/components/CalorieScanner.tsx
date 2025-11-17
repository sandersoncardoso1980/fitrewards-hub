import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { Camera, Loader2, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function CalorieScanner() {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error('Por favor, faça upload de uma imagem primeiro');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const { data, error } = await supabase.functions.invoke('analyze-calories', {
        body: { imageUrl }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
      toast.success('Análise concluída!');
    } catch (error: any) {
      console.error('Erro ao analisar:', error);
      toast.error('Erro ao analisar a imagem: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImageUrl('');
    setAnalysis('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-primary" />
          <CardTitle>Leitor de Calorias</CardTitle>
        </div>
        <CardDescription>
          Envie uma foto do seu prato e descubra quantas calorias ele tem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!imageUrl ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg p-8 space-y-4">
            <Camera className="h-16 w-16 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Faça upload de uma foto do prato</p>
              <p className="text-sm text-muted-foreground">
                A IA irá analisar os alimentos e estimar as calorias
              </p>
            </div>
            {user && <ImageUpload onUploadComplete={setImageUrl} userId={user.id} />}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Prato para análise"
                className="w-full h-auto max-h-[400px] object-contain bg-muted"
              />
            </div>

            {analysis && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Análise Nutricional
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {analysis}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Analisar Calorias
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isAnalyzing}
              >
                Nova Foto
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
