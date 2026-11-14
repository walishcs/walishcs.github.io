import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BlogSeriesNavigation } from './BlogSeriesNavigation';

describe('blog series navigation markup', () => {
  const navigation = {
    title: 'Reading & writing',
    position: 2,
    total: 3,
    previous: { title: 'Introduction', href: '/blog/introduction/' },
    next: { title: 'Conclusion', href: '/blog/conclusion/' },
  };

  it('renders real, descriptive links without hydration and excludes them from search', () => {
    const html = renderToStaticMarkup(
      <BlogSeriesNavigation navigation={navigation} />,
    );
    expect(html).toContain(
      '<nav aria-label="Series navigation" data-pagefind-ignore="true">',
    );
    expect(html).toMatch(
      /<a(?=[^>]*href="\/blog\/introduction\/")(?=[^>]*rel="prev")[^>]*>/,
    );
    expect(html).toMatch(
      /<a(?=[^>]*href="\/blog\/conclusion\/")(?=[^>]*rel="next")[^>]*>/,
    );
    expect(html).toContain('Previous: Introduction');
    expect(html).toContain('Next: Conclusion');
    expect(html).toContain('Series: Reading &amp; writing');
    expect(html).toContain('Part 2 of 3');
  });

  it('omits unavailable sides instead of rendering disabled links', () => {
    const first = renderToStaticMarkup(
      <BlogSeriesNavigation
        navigation={{ ...navigation, previous: undefined }}
      />,
    );
    const last = renderToStaticMarkup(
      <BlogSeriesNavigation navigation={{ ...navigation, next: undefined }} />,
    );
    expect(first).not.toContain('rel="prev"');
    expect(first).toContain('rel="next"');
    expect(last).toContain('rel="prev"');
    expect(last).not.toContain('rel="next"');
  });

  it('omits the landmark when no neighboring public article exists', () => {
    expect(renderToStaticMarkup(<BlogSeriesNavigation />)).toBe('');
    expect(
      renderToStaticMarkup(
        <BlogSeriesNavigation
          navigation={{ ...navigation, previous: undefined, next: undefined }}
        />,
      ),
    ).toBe('');
  });
});
