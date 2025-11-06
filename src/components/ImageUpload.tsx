import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  userId: string;
}

export function ImageUpload({ onUploadComplete, userId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao fazer upload da imagem: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('image-upload')?.click()}
        disabled={uploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Enviando...' : 'Selecionar Imagem'}
      </Button>
    </div>
  );
}
