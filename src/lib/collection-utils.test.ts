import { describe, expect, it } from 'vitest';
import {
  filterPublished,
  groupByYear,
  paginateItems,
  selectFeatured,
  sortByDateDesc,
} from './collection-utils';

describe('collection utilities', () => {
  it('sorts valid dates newest first and leaves missing dates last', () => {
    const entries = [
      { id: 'missing', date: null },
      { id: 'older', date: '2025-01-01' },
      { id: 'newer', date: '2026-01-01' },
    ];

    expect(
      sortByDateDesc(entries, (entry) => entry.date).map((entry) => entry.id),
    ).toEqual(['newer', 'older', 'missing']);
  });

  it('excludes drafts and future-dated posts', () => {
    const entries = [
      { id: 'published', draft: false, date: '2026-01-01' },
      { id: 'draft', draft: true, date: '2026-01-01' },
      { id: 'future', draft: false, date: '2027-01-01' },
    ];

    const result = filterPublished(entries, {
      isDraft: (entry) => entry.draft,
      publishedAt: (entry) => entry.date,
      now: new Date('2026-06-01T00:00:00Z'),
    });

    expect(result.map((entry) => entry.id)).toEqual(['published']);
  });

  it('selects featured entries in source order and applies a limit', () => {
    const entries = [
      { id: 'a', featured: true },
      { id: 'b', featured: false },
      { id: 'c', featured: true },
    ];

    expect(selectFeatured(entries, (entry) => entry.featured, 1)).toEqual([
      entries[0],
    ]);
  });

  it('groups entries by numeric year', () => {
    const entries = [
      { id: 'a', year: 2026 },
      { id: 'b', year: 2025 },
      { id: 'c', year: 2026 },
    ];

    expect(groupByYear(entries, (entry) => entry.year)).toEqual({
      2025: [entries[1]],
      2026: [entries[0], entries[2]],
    });
  });

  it('paginates items with a stable five-item page size', () => {
    const entries = Array.from({ length: 12 }, (_, index) => index + 1);

    expect(paginateItems(entries, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginateItems(entries, 2, 5)).toEqual([6, 7, 8, 9, 10]);
    expect(paginateItems(entries, 3, 5)).toEqual([11, 12]);
  });
});
