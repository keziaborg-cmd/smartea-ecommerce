import { BLOG_CATEGORY_LABEL, BLOG_CATEGORY_STYLE, type BlogCategory } from "@/data/blog-categories";

export function CategoryBadge({ category }: { category: BlogCategory }) {
  const style = BLOG_CATEGORY_STYLE[category];
  return (
    <span className={`inline-block rounded-pill px-3.5 py-1 text-xs font-bold text-white ${style.solid}`}>
      {BLOG_CATEGORY_LABEL[category]}
    </span>
  );
}
