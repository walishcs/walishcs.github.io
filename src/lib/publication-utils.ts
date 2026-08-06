export const publicationYearStatuses = ['to-appear', 'ongoing'] as const;

export type PublicationYearStatus = (typeof publicationYearStatuses)[number];
export type PublicationYear = number | PublicationYearStatus;

const statusRank: Record<PublicationYearStatus, number> = {
  'to-appear': 2,
  ongoing: 1,
};

export function comparePublicationYears(
  first: PublicationYear,
  second: PublicationYear,
): number {
  const firstRank = typeof first === 'number' ? 0 : statusRank[first];
  const secondRank = typeof second === 'number' ? 0 : statusRank[second];

  if (firstRank !== secondRank) return secondRank - firstRank;
  if (typeof first === 'number' && typeof second === 'number') {
    return second - first;
  }
  return 0;
}

export function publicationYearLabel(year: PublicationYear): string {
  if (year === 'to-appear') return 'To appear';
  if (year === 'ongoing') return 'Ongoing';
  return String(year);
}
