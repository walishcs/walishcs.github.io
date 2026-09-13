export interface BlogDirectoryPost {
  href: string;
  title: string;
  summary: string;
  publishedAt: string;
  formattedDate: string;
  tags: string[];
}

export interface BlogTag {
  value: string;
  label: string;
  href: string;
  count: number;
}

export interface BlogArchiveYear {
  year: string;
  count: number;
  months: { value: string; label: string; count: number }[];
}

export function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

// Escape uppercase letters too: case-distinct tags must produce distinct files
// even on case-insensitive filesystems. Escape '~' before using it for bytes.
export function tagValue(tag: string): string {
  return Array.from(tag.trim(), (character) => {
    if (/^[a-z0-9_-]$/.test(character)) return character;
    return Array.from(
      new TextEncoder().encode(character),
      (byte) => `~${byte.toString(16).padStart(2, '0')}`,
    ).join('');
  }).join('');
}

export function tagHref(tag: string): string {
  return `/tags/${tagValue(tag)}/`;
}

export function getBlogTags(posts: BlogDirectoryPost[]): BlogTag[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of normalizeTags(post.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([label, count]) => ({
      value: tagValue(label),
      label,
      href: tagHref(label),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'en'));
}

export function searchBlogTags(tags: BlogTag[], query: string): BlogTag[] {
  const search = query.trim().toLowerCase();
  return tags.filter((tag) => tag.label.toLowerCase().includes(search));
}

export function tagSize(count: number, maximum: number): 'sm' | 'base' | 'lg' {
  if (maximum <= 1) return 'base';
  if (count / maximum > 2 / 3) return 'lg';
  return count / maximum > 1 / 3 ? 'base' : 'sm';
}

export function selectBlogPosts(
  posts: BlogDirectoryPost[],
  { tag, month }: { tag?: string; month?: string } = {},
): BlogDirectoryPost[] {
  return posts
    .filter(
      (post) =>
        (tag === undefined || normalizeTags(post.tags).includes(tag)) &&
        (!month || post.publishedAt.slice(0, 7) === month),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogArchive(posts: BlogDirectoryPost[]): BlogArchiveYear[] {
  const years = new Map<string, Map<string, number>>();
  for (const post of posts) {
    const year = post.publishedAt.slice(0, 4);
    const month = post.publishedAt.slice(0, 7);
    const months = years.get(year) ?? new Map<string, number>();
    months.set(month, (months.get(month) ?? 0) + 1);
    years.set(year, months);
  }
  return [...years]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, months]) => ({
      year,
      count: [...months.values()].reduce((sum, count) => sum + count, 0),
      months: [...months]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([value, count]) => ({
          value,
          label: new Intl.DateTimeFormat('en', {
            month: 'long',
            timeZone: 'UTC',
          }).format(new Date(`${value}-01T00:00:00Z`)),
          count,
        })),
    }));
}
