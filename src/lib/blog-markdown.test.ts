import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BlogMarkdown } from '../components/BlogMarkdown';
import { prepareBlogMarkdown } from './blog-markdown';

describe('prepareBlogMarkdown', () => {
  it('removes a leading heading that duplicates the page title', () => {
    expect(
      prepareBlogMarkdown(
        '# An article title\n\n## First section\n\nBody text.',
        'An article title',
      ),
    ).toBe('## First section\n\nBody text.');
  });

  it('keeps a leading heading with different content', () => {
    const body = '# A distinct heading\n\nBody text.';

    expect(prepareBlogMarkdown(body, 'The page title')).toBe(body);
  });

  it('handles empty content', () => {
    expect(prepareBlogMarkdown(undefined, 'The page title')).toBe('');
  });

  it('renders article structure with Astryx Markdown', () => {
    const html = renderToStaticMarkup(
      createElement(BlogMarkdown, {
        body: '## Section\n\n- Bullet\n\n1. Numbered',
      }),
    );

    expect(html).toContain('<h2');
    expect(html).toContain('data-list-style="disc"');
    expect(html).toContain('data-list-style="decimal"');
  });
});
