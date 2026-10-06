"use client";

import { useState } from "react";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABEL, type BlogCategory } from "@/data/blog-categories";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog/posts";

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState<BlogCategory | "todas">("todas");
  const filtered = filter === "todas" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          onClick={() => setFilter("todas")}
          className={`rounded-pill px-4 py-2 text-sm font-bold transition ${
            filter === "todas" ? "bg-verde-escuro text-creme" : "border border-borda-clara text-tinta/70"
          }`}
        >
          Todas
        </button>
        {BLOG_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-pill px-4 py-2 text-sm font-bold transition ${
              filter === category ? "bg-verde-escuro text-creme" : "border border-borda-clara text-tinta/70"
            }`}
          >
            {BLOG_CATEGORY_LABEL[category]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-tinta/60">Nenhum artigo nessa categoria ainda.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
