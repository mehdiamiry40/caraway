import { blogPosts, type BlogPost } from "@/data/blog-posts";

type ScoredPost = {
  post: BlogPost;
  score: number;
  time: number;
};

function overlapCount(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const set = new Set(a);
  let count = 0;
  for (const item of b) {
    if (set.has(item)) count += 1;
  }
  return count;
}

function parseTime(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

export function getSmartRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);

  const candidates = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.isIndexable,
  );

  if (candidates.length === 0) return [];

  const scored: ScoredPost[] = candidates.map((post) => {
    let score = 0;
    if (current) {
      if (post.category === current.category) score += 3;
      score += 2 * overlapCount(post.relatedServices, current.relatedServices);
      score += 2 * overlapCount(post.relatedSuburbs, current.relatedSuburbs);
    }
    return { post, score, time: parseTime(post.updatedAt || post.date) };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.time - a.time;
  });

  return scored.slice(0, limit).map((entry) => entry.post);
}
