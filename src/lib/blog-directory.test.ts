import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BLOG_DIRECTORY_MODE,
  groupBlogPosts,
  type BlogDirectoryPost,
} from './blog-directory';

const posts: BlogDirectoryPost[] = [
  {
    href: '/blog/newest/',
    title: 'Newest',
    summary: '',
    publishedAt: '2026-06-01',
    formattedDate: 'June 1, 2026',
    tags: ['Research', 'Methods'],
  },
  {
    href: '/blog/older/',
    title: 'Older',
    summary: '',
    publishedAt: '2025-02-01',
    formattedDate: 'February 1, 2025',
    tags: ['Writing'],
  },
  {
    href: '/blog/untagged/',
    title: 'Untagged',
    summary: '',
    publishedAt: '2026-01-01',
    formattedDate: 'January 1, 2026',
    tags: [],
  },
  {
    href: '/blog/research-older/',
    title: 'Research older',
    summary: '',
    publishedAt: '2025-01-01',
    formattedDate: 'January 1, 2025',
    tags: ['Research'],
  },
];

describe('blog directory grouping', () => {
  it('defaults to grouping posts by year', () => {
    expect(DEFAULT_BLOG_DIRECTORY_MODE).toBe('year');
  });

  it('uses only the first tag, sorts groups, and leaves untagged last', () => {
    const groups = groupBlogPosts(posts, 'tag');

    expect(groups.map((group) => group.label)).toEqual([
      'Research',
      'Writing',
      'Untagged',
    ]);
    expect(groups[0]?.posts.map((post) => post.title)).toEqual([
      'Newest',
      'Research older',
    ]);
    expect(groups.flatMap((group) => group.posts)).toHaveLength(posts.length);
  });

  it('groups by year newest first and keeps posts newest first', () => {
    const groups = groupBlogPosts(posts, 'year');

    expect(groups.map((group) => group.label)).toEqual(['2026', '2025']);
    expect(groups[0]?.posts.map((post) => post.title)).toEqual([
      'Newest',
      'Untagged',
    ]);
  });
});
