import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likedBy.includes(user?.id || ''));
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      toast.success('Post curtido!');
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
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
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>{post.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.userName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
      </div>

      <img
        src={post.image}
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
            <span className="font-semibold">{likes}</span>
          </Button>
        </div>
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.userName}</span>
          {post.caption}
        </p>
      </div>
    </Card>
  );
}
