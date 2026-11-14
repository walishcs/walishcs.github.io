import { describe, expect, it } from 'vitest';
import { buildBlogSeriesNavigation } from './blog-series';
import { filterPublished } from './collection-utils';

const post = (id: string, draft = false, publishedAt = '2020-01-01') => ({
  id,
  data: { title: `Post ${id}`, draft, publishedAt },
});
const series = (posts: (string | null)[], id = 'guide') => ({
  id,
  data: { title: 'A guide', posts },
});

describe('blog series navigation', () => {
  it('uses editor order instead of publication order and links both ways', () => {
    const navigation = buildBlogSeriesNavigation(
      [series(['c', 'a', 'b'])],
      [post('a'), post('b'), post('c')],
    );
    expect(navigation.get('a')).toEqual({
      title: 'A guide',
      position: 2,
      total: 3,
      previous: { title: 'Post c', href: '/blog/c/' },
      next: { title: 'Post b', href: '/blog/b/' },
    });
    expect(navigation.get('c')?.previous).toBeUndefined();
    expect(navigation.get('c')?.next?.href).toBe('/blog/a/');
    expect(navigation.get('b')?.previous?.href).toBe('/blog/a/');
    expect(navigation.get('b')?.next).toBeUndefined();
  });

  it('skips drafts, future posts, missing references and empty selections', () => {
    const posts = filterPublished(
      [
        post('a'),
        post('draft', true),
        post('future', false, '2099-01-01'),
        post('b'),
      ],
      {
        isDraft: (entry) => entry.data.draft,
        publishedAt: (entry) => entry.data.publishedAt,
        now: new Date('2026-11-14T00:00:00Z'),
      },
    );
    const navigation = buildBlogSeriesNavigation(
      [series(['a', 'draft', 'future', 'deleted', null, 'b'])],
      posts,
    );
    expect([...navigation.keys()]).toEqual(['a', 'b']);
    expect(navigation.get('a')?.next?.href).toBe('/blog/b/');
    expect(navigation.get('b')?.position).toBe(2);
    expect(navigation.get('b')?.total).toBe(2);
    expect(JSON.stringify([...navigation])).not.toMatch(/draft|future|deleted/);
  });

  it('omits navigation for absent or empty series and single public posts', () => {
    expect(buildBlogSeriesNavigation([], [post('a')]).size).toBe(0);
    expect(buildBlogSeriesNavigation([series([])], []).size).toBe(0);
    expect(
      buildBlogSeriesNavigation([series(['a', 'missing'])], [post('a')]).size,
    ).toBe(0);
  });

  it('keeps separate series isolated and leaves unassigned posts alone', () => {
    const navigation = buildBlogSeriesNavigation(
      [series(['a', 'b']), series(['c', 'd'], 'other')],
      ['a', 'b', 'c', 'd', 'unassigned'].map((id) => post(id)),
    );
    expect(navigation.get('b')?.next).toBeUndefined();
    expect(navigation.get('c')?.previous).toBeUndefined();
    expect(navigation.has('unassigned')).toBe(false);
  });

  it('rejects duplicates within a series, including unavailable references', () => {
    expect(() => buildBlogSeriesNavigation([series(['a', 'a'])], [])).toThrow(
      'Blog post "a" is listed more than once',
    );
  });

  it('rejects ambiguous membership in multiple series', () => {
    expect(() =>
      buildBlogSeriesNavigation(
        [series(['a']), series(['a'], 'other')],
        [post('a')],
      ),
    ).toThrow('blog series "guide" and "other"');
  });
});
