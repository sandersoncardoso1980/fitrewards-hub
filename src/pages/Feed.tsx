import { PostCard } from '@/components/PostCard';
import { mockPosts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Feed = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed Social</h1>
          <p className="text-muted-foreground">Compartilhe suas conquistas</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </div>

      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
