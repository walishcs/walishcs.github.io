import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BlogDirectory } from './BlogDirectory';
import { getBlogTags, tagHref } from '../lib/blog-directory';

const posts = [
  {
    href: '/blog/test/',
    title: 'Test article',
    summary: '<unsafe>',
    publishedAt: '2026-06-01',
    formattedDate: 'June 1, 2026',
    tags: ['First', ' Second ', 'Second'],
  },
];

describe('blog directory rendering', () => {
  it('server-renders posts with dates and every tag link, escaping content', () => {
    const html = renderToStaticMarkup(
      <BlogDirectory posts={posts} tags={getBlogTags(posts)} />,
    );
    expect(html).toContain('href="/blog/test/"');
    expect(html).toContain('dateTime="2026-06-01"');
    expect(html).toContain('&lt;unsafe&gt;');
    expect(html).toContain(`href="${tagHref('Second')}"`);
    expect(html).toContain('aria-pressed="true"');
    expect(html).not.toContain('First tag');
  });
  it('provides empty-state copy without requiring content', () => {
    const html = renderToStaticMarkup(<BlogDirectory posts={[]} tags={[]} />);
    expect(html).toContain('Writing will appear here when published.');
    expect(html).toContain('No tags yet.');
  });
  it('marks the active tag and offers a way back to Blog', () => {
    const html = renderToStaticMarkup(
      <BlogDirectory
        posts={posts}
        tags={getBlogTags(posts)}
        activeTag="Second"
      />,
    );
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('Back to all blog posts');
  });
});
