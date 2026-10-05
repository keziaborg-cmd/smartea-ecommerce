import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog/posts";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="mb-5 font-display text-2xl text-verde-escuro">Artigos relacionados</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
