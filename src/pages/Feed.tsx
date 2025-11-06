import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Feed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Fetch posts with profiles
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar_url
          ),
          post_likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !imageUrl || !caption) {
        throw new Error('Preencha todos os campos');
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          caption: caption,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCaption('');
      setImageUrl('');
      setOpen(false);
      toast.success('Post criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar post: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed Social</h1>
          <p className="text-muted-foreground">Compartilhe suas conquistas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Imagem</Label>
                {imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setImageUrl('')}
                      className="w-full"
                    >
                      Remover imagem
                    </Button>
                  </div>
                ) : (
                  <ImageUpload
                    onUploadComplete={setImageUrl}
                    userId={user?.id || ''}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Legenda</Label>
                <Textarea
                  id="caption"
                  placeholder="Conte sobre sua conquista..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={createPostMutation.isPending || !imageUrl}
              >
                {createPostMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Publicar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum post ainda. Seja o primeiro a compartilhar!
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
