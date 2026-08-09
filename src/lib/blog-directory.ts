export type BlogDirectoryMode = 'tag' | 'year';

export interface BlogDirectoryPost {
  href: string;
  title: string;
  summary: string;
  publishedAt: string;
  formattedDate: string;
  tags: string[];
}

export interface BlogDirectoryGroup {
  id: string;
  label: string;
  posts: BlogDirectoryPost[];
}

const UNTAGGED_LABEL = 'Untagged';

function groupId(mode: BlogDirectoryMode, label: string, index: number) {
  const slug = label
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '');

  return `${mode}-${slug || 'group'}-${index + 1}`;
}

export function groupBlogPosts(
  posts: BlogDirectoryPost[],
  mode: BlogDirectoryMode,
): BlogDirectoryGroup[] {
  const sortedPosts = [...posts].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
  const groups = new Map<string, BlogDirectoryPost[]>();

  for (const post of sortedPosts) {
    const firstTag = post.tags[0]?.trim();
    const label =
      mode === 'tag'
        ? firstTag || UNTAGGED_LABEL
        : post.publishedAt.slice(0, 4);
    const group = groups.get(label) ?? [];
    group.push(post);
    groups.set(label, group);
  }

  const labels = [...groups.keys()].sort((left, right) => {
    if (mode === 'year') return right.localeCompare(left);
    if (left === UNTAGGED_LABEL) return 1;
    if (right === UNTAGGED_LABEL) return -1;
    return left.localeCompare(right, 'en', { sensitivity: 'base' });
  });

  return labels.map((label, index) => ({
    id: groupId(mode, label, index),
    label,
    posts: groups.get(label) ?? [],
  }));
}
