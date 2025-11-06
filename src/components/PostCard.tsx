import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isLiked = post.post_likes?.some((like: any) => like.user_id === user?.id);
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.post_likes?.length || 0);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id,
          });

        if (error) throw error;
      }
    },
    onMutate: () => {
      // Optimistic update
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    },
    onError: () => {
      // Revert on error
      setLiked(liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
      toast.error('Erro ao curtir post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const timeAgo = (date: string) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'agora há pouco';
    if (hours === 1) return '1 hora atrás';
    if (hours < 24) return `${hours} horas atrás`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '1 dia atrás' : `${days} dias atrás`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback>{post.profiles?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.profiles?.name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
          </div>
        </div>
      </div>

      <img
        src={post.image_url}
        alt="Post"
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              'gap-2 transition-all',
              liked && 'text-primary'
            )}
          >
            <Heart
              className={cn('h-5 w-5', liked && 'fill-current')}
            />
            <span className="font-semibold">{likesCount}</span>
          </Button>
        </div>
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.profiles?.name}</span>
          {post.caption}
        </p>
      </div>
    </Card>
  );
}
