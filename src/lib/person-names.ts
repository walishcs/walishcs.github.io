function normalizeName(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
}

interface PersonNameParts {
  family: string;
  given: string;
}

export function parsePersonName(value: string): PersonNameParts | null {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  const commaIndex = normalized.indexOf(',');
  if (commaIndex >= 0) {
    const family = normalized.slice(0, commaIndex).trim();
    const given = normalized.slice(commaIndex + 1).trim();
    return family && given ? { family, given } : null;
  }

  const parts = normalized.split(' ');
  if (parts.length < 2) return null;
  return {
    family: parts.at(-1)!,
    given: parts.slice(0, -1).join(' '),
  };
}

export function formatPersonName(value: string, index: number): string {
  const parsed = parsePersonName(value);
  if (!parsed) return value.trim();
  const family = parsed.family.toLocaleUpperCase();
  return index === 0
    ? `${family}, ${parsed.given}`
    : `${parsed.given} ${family}`;
}

export function isDefaultPersonName(name: string, defaultName = ''): boolean {
  const normalizedDefault = normalizeName(defaultName);
  return (
    Boolean(normalizedDefault) && normalizeName(name) === normalizedDefault
  );
}

export function resolvePersonNames(
  names: string[],
  defaultName = '',
  position?: number | null,
): string[] {
  const trimmedDefault = defaultName.trim();
  if (!trimmedDefault) {
    return names;
  }
  if (names.length === 0) return [trimmedDefault];
  if (position == null) return names;

  const otherNames = names.filter(
    (name) => !isDefaultPersonName(name, trimmedDefault),
  );
  const insertionIndex = Math.min(position - 1, otherNames.length);

  return [
    ...otherNames.slice(0, insertionIndex),
    trimmedDefault,
    ...otherNames.slice(insertionIndex),
  ];
}
