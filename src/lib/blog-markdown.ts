const LEADING_HEADING = /^#\s+(.+?)\s*#?\s*(?:\r?\n|$)/;

function normalizeHeading(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function prepareBlogMarkdown(
  body: string | undefined,
  title: string,
): string {
  const source = body?.replace(/^\uFEFF/, '').trimStart() ?? '';
  const match = source.match(LEADING_HEADING);

  if (match?.[1] && normalizeHeading(match[1]) === normalizeHeading(title)) {
    return source.slice(match[0].length).trimStart();
  }

  return source;
}
