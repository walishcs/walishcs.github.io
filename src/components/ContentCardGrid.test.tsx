import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContentCardGrid } from './ContentCardGrid';

function renderMeta(meta: string, metaHasEmphasis = true) {
  return renderToStaticMarkup(
    <ContentCardGrid
      items={[
        { href: '/publications/test/', title: 'Test', meta, metaHasEmphasis },
      ]}
    />,
  );
}

describe('featured card metadata', () => {
  it('renders venue emphasis inside the existing supporting text', () => {
    expect(renderMeta('To appear · In *Proceedings*')).toContain(
      'To appear · In <em>Proceedings</em>',
    );
  });

  it('keeps escaped asterisks literal and escapes HTML', () => {
    const html = renderMeta('In \\*literal\\* and *<unsafe>*');
    expect(html).toContain('In *literal* and <em>&lt;unsafe&gt;</em>');
  });

  it('preserves plain metadata for other card types', () => {
    expect(renderMeta('*tag*', false)).toContain('*tag*');
    expect(renderMeta('Unmatched *venue')).toContain('Unmatched *venue');
  });
});
