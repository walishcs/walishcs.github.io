import { describe, expect, it } from 'vitest';
import {
  formatPersonName,
  isDefaultPersonName,
  parsePersonName,
  resolvePersonNames,
} from './person-names';

describe('person names', () => {
  it('recognizes inverted and display-name forms as the same person', () => {
    expect(
      isDefaultPersonName('SONG, Walis Hian-chi', 'Walis Hian-chi Song'),
    ).toBe(true);
  });

  it('parses comma and natural-order names consistently', () => {
    expect(parsePersonName('SONG, Walis Hian-chi')).toEqual({
      family: 'SONG',
      given: 'Walis Hian-chi',
    });
    expect(parsePersonName('Walis Hian-chi SONG')).toEqual({
      family: 'SONG',
      given: 'Walis Hian-chi',
    });
  });

  it('formats the first name as family-first and later names as given-first', () => {
    expect(formatPersonName('Walis Hian-chi Song', 0)).toBe(
      'SONG, Walis Hian-chi',
    );
    expect(formatPersonName('Zeitoun, Elizabeth', 1)).toBe('Elizabeth ZEITOUN');
    expect(formatPersonName('Mononym', 0)).toBe('Mononym');
  });

  it('uses the configured name as the sole author for an empty list', () => {
    expect(resolvePersonNames([], 'Walis Hian-chi Song')).toEqual([
      'Walis Hian-chi Song',
    ]);
  });

  it('does not inject the configured name into a non-empty list without a position', () => {
    expect(resolvePersonNames(['Co-author'], 'Walis Hian-chi Song')).toEqual([
      'Co-author',
    ]);
  });

  it('inserts the configured name at the requested position', () => {
    expect(
      resolvePersonNames(
        ['First author', 'Third author'],
        'Walis Hian-chi Song',
        2,
      ),
    ).toEqual(['First author', 'Walis Hian-chi Song', 'Third author']);
  });

  it('removes an equivalent name before repositioning it', () => {
    expect(
      resolvePersonNames(
        ['Co-author', 'SONG, Walis Hian-chi'],
        'Walis Hian-chi Song',
        1,
      ),
    ).toEqual(['Walis Hian-chi Song', 'Co-author']);
  });
});
