import { describe, expect, it } from 'vitest';
import {
  comparePublicationYears,
  publicationYearLabel,
} from './publication-utils';

describe('publication year utilities', () => {
  it('orders special statuses before numeric years, then newest years', () => {
    const values = [2024, 'ongoing', 2026, 'to-appear', 2025] as const;

    expect([...values].sort(comparePublicationYears)).toEqual([
      'to-appear',
      'ongoing',
      2026,
      2025,
      2024,
    ]);
  });

  it('formats statuses and numeric years for display', () => {
    expect(publicationYearLabel('to-appear')).toBe('To appear');
    expect(publicationYearLabel('ongoing')).toBe('Ongoing');
    expect(publicationYearLabel(2026)).toBe('2026');
  });
});
