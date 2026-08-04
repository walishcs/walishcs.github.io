type DateValue = string | Date | null | undefined;

function timestamp(value: DateValue): number {
  if (!value) return 0;
  const result = new Date(value).getTime();
  return Number.isNaN(result) ? 0 : result;
}

export function sortByDateDesc<T>(
  items: T[],
  readDate: (item: T) => DateValue,
): T[] {
  return [...items].sort(
    (a, b) => timestamp(readDate(b)) - timestamp(readDate(a)),
  );
}

export function filterPublished<T>(
  items: T[],
  options: {
    isDraft: (item: T) => boolean;
    publishedAt: (item: T) => DateValue;
    now?: Date;
  },
): T[] {
  const now = (options.now ?? new Date()).getTime();
  return items.filter(
    (item) =>
      !options.isDraft(item) && timestamp(options.publishedAt(item)) <= now,
  );
}

export function selectFeatured<T>(
  items: T[],
  isFeatured: (item: T) => boolean,
  limit = 3,
): T[] {
  return items.filter(isFeatured).slice(0, limit);
}

export function groupByYear<T>(items: T[], readYear: (item: T) => number) {
  return items.reduce<Record<number, T[]>>((groups, item) => {
    const year = readYear(item);
    groups[year] ??= [];
    groups[year].push(item);
    return groups;
  }, {});
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * safePageSize;
  return items.slice(start, start + safePageSize);
}
