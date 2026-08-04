export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function formatDateRange(
  start?: string | null,
  end?: string | null,
): string {
  if (!start && !end) return '';
  const format = (value: string) =>
    new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(value));

  if (start && end) return `${format(start)} – ${format(end)}`;
  if (start) return `${format(start)} – Present`;
  return `Through ${format(end!)}`;
}

export function labelFromSlug(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
