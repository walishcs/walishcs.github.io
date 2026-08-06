export interface InlineEmphasisPart {
  text: string;
  italic: boolean;
}

function unescapeAsterisks(value: string): string {
  return value.replace(/\\\*/g, '*');
}

/**
 * Parses `*text*` as italic text while allowing `\*` to escape an asterisk.
 * Unmatched delimiters remain literal so metadata never disappears silently.
 */
export function parseInlineEmphasis(value: string): InlineEmphasisPart[] {
  const delimiters: number[] = [];

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '\\' && value[index + 1] === '*') {
      index += 1;
      continue;
    }
    if (value.slice(index, index + 2) === '**') {
      index += 1;
      continue;
    }
    if (value[index] === '*') {
      delimiters.push(index);
    }
  }

  if (delimiters.length % 2 !== 0) {
    return [{ text: unescapeAsterisks(value), italic: false }];
  }

  const parts: InlineEmphasisPart[] = [];
  let cursor = 0;
  let italic = false;

  for (const delimiter of delimiters) {
    const text = unescapeAsterisks(value.slice(cursor, delimiter));
    if (text) parts.push({ text, italic });
    italic = !italic;
    cursor = delimiter + 1;
  }

  const trailingText = unescapeAsterisks(value.slice(cursor));
  if (trailingText) parts.push({ text: trailingText, italic });
  return parts;
}
