function normalizeName(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
}

export function isDefaultPersonName(name: string, defaultName = ''): boolean {
  const normalizedDefault = normalizeName(defaultName);
  return (
    Boolean(normalizedDefault) && normalizeName(name) === normalizedDefault
  );
}

export function withDefaultPersonName(
  names: string[],
  defaultName = '',
): string[] {
  const trimmedDefault = defaultName.trim();
  if (
    !trimmedDefault ||
    names.some((name) => isDefaultPersonName(name, trimmedDefault))
  ) {
    return names;
  }
  return [trimmedDefault, ...names];
}
