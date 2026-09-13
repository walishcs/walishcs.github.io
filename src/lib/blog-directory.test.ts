import { describe, expect, it } from 'vitest';
import { filterPublished } from './collection-utils';
import {
  getBlogArchive,
  getBlogTags,
  normalizeTags,
  searchBlogTags,
  selectBlogPosts,
  tagHref,
  tagSize,
  tagValue,
  type BlogDirectoryPost,
} from './blog-directory';

const post = (
  title: string,
  publishedAt: string,
  tags: string[] = [],
): BlogDirectoryPost => ({
  title,
  href: `/blog/${title}/`,
  summary: '',
  formattedDate: publishedAt,
  publishedAt,
  tags,
});
const posts = [
  post('older', '2025-02-01', ['Writing']),
  post('newest', '2026-06-15', ['Research', 'Methods', ' Methods ', '']),
  post('untagged', '2026-01-01'),
  post('same-month', '2026-06-01', ['Research']),
  post('oldest', '2025-01-01', ['Research']),
];

describe('blog archives', () => {
  it('lists only occupied months, newest first, with counts', () => {
    expect(getBlogArchive(posts)).toEqual([
      {
        year: '2026',
        count: 3,
        months: [
          { value: '2026-06', label: 'June', count: 2 },
          { value: '2026-01', label: 'January', count: 1 },
        ],
      },
      {
        year: '2025',
        count: 2,
        months: [
          { value: '2025-02', label: 'February', count: 1 },
          { value: '2025-01', label: 'January', count: 1 },
        ],
      },
    ]);
  });
  it('filters a month and restores every post when cleared without mutating input', () => {
    const original = [...posts];
    expect(
      selectBlogPosts(posts, { month: '2026-06' }).map((p) => p.title),
    ).toEqual(['newest', 'same-month']);
    expect(selectBlogPosts(posts, { month: '' }).map((p) => p.title)).toEqual([
      'newest',
      'same-month',
      'untagged',
      'older',
      'oldest',
    ]);
    expect(selectBlogPosts(posts, { month: '2026-05' })).toEqual([]);
    expect(posts).toEqual(original);
  });
  it('uses only the selected tag for its archive and supports the second tag', () => {
    const selected = selectBlogPosts(posts, { tag: 'Methods' });
    expect(selected.map((p) => p.title)).toEqual(['newest']);
    expect(getBlogArchive(selected)[0]?.count).toBe(1);
    expect(
      selectBlogPosts(posts, { tag: 'Research', month: '2026-06' }),
    ).toHaveLength(2);
  });
  it('keeps drafts and future dates out of all public indexes', () => {
    const candidates = [
      ...posts.map((p) => ({ ...p, draft: false })),
      { ...post('draft', '2024-12-01', ['Draft only']), draft: true },
      { ...post('future', '2099-12-01', ['Future only']), draft: false },
    ];
    const published = filterPublished(candidates, {
      isDraft: (p) => p.draft,
      publishedAt: (p) => p.publishedAt,
      now: new Date('2026-09-13'),
    });
    expect(published).toHaveLength(posts.length);
    expect(getBlogTags(published).map((t) => t.label)).toEqual([
      'Research',
      'Methods',
      'Writing',
    ]);
    expect(getBlogArchive(published).map((y) => y.year)).toEqual([
      '2026',
      '2025',
    ]);
  });
  it('handles empty collections and untagged posts', () => {
    expect(getBlogArchive([])).toEqual([]);
    expect(getBlogTags([])).toEqual([]);
    expect(selectBlogPosts([])).toEqual([]);
    expect(getBlogTags([post('untagged', '2026-01-01')])).toEqual([]);
  });
});

describe('blog tags', () => {
  it('normalizes whitespace, ignores empty tags, deduplicates per post, preserves case', () => {
    expect(normalizeTags([' ', ' Research ', 'Research', 'research'])).toEqual([
      'Research',
      'research',
    ]);
    expect(
      getBlogTags(posts).map(({ label, count }) => ({ label, count })),
    ).toEqual([
      { label: 'Research', count: 3 },
      { label: 'Methods', count: 1 },
      { label: 'Writing', count: 1 },
    ]);
  });
  it('searches names case-insensitively and clears the search', () => {
    const tags = getBlogTags(posts);
    expect(searchBlogTags(tags, '  METH ').map((t) => t.label)).toEqual([
      'Methods',
    ]);
    expect(searchBlogTags(tags, 'missing')).toEqual([]);
    expect(searchBlogTags(tags, '')).toEqual(tags);
  });
  it('uses three bounded font sizes, with equal single-use tags at body size', () => {
    expect([1, 2, 3].map((count) => tagSize(count, 3))).toEqual([
      'sm',
      'base',
      'lg',
    ]);
    expect(tagSize(1, 1)).toBe('base');
  });
  it('creates reversible path segments without case-insensitive collisions', () => {
    const labels = [
      'Research',
      'research',
      'RESEARCH',
      'a/b',
      'a b',
      'a-b',
      'a~2fb',
      '%2F',
      '中文',
      'C++',
      '..',
      '#',
      '?',
      'é',
      'e\u0301',
      '👩‍💻',
    ];
    const values = labels.map(tagValue);
    expect(new Set(values.map((v) => v.toLowerCase())).size).toBe(
      labels.length,
    );
    for (const [index, value] of values.entries()) {
      expect(value).toMatch(/^[a-z0-9_~-]+$/);
      expect(decodeURIComponent(value.replace(/~/g, '%'))).toBe(labels[index]);
      expect(
        new URL(tagHref(labels[index]!), 'https://example.com').pathname,
      ).toBe(`/tags/${value}/`);
    }
  });
});
