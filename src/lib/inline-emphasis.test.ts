import { describe, expect, it } from 'vitest';
import { parseInlineEmphasis } from './inline-emphasis';

describe('inline emphasis', () => {
  it('renders text between single asterisks as italic', () => {
    expect(parseInlineEmphasis('Conference *Proceedings*')).toEqual([
      { text: 'Conference ', italic: false },
      { text: 'Proceedings', italic: true },
    ]);
  });

  it('keeps escaped asterisks literal', () => {
    expect(parseInlineEmphasis('Use \\*literally\\*')).toEqual([
      { text: 'Use *literally*', italic: false },
    ]);
  });

  it('keeps unmatched delimiters visible', () => {
    expect(parseInlineEmphasis('Unfinished *venue')).toEqual([
      { text: 'Unfinished *venue', italic: false },
    ]);
  });
});
