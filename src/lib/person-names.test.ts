import { describe, expect, it } from 'vitest';
import { isDefaultPersonName, withDefaultPersonName } from './person-names';

describe('person names', () => {
  it('recognizes inverted and display-name forms as the same person', () => {
    expect(
      isDefaultPersonName('SONG, Walis Hian-chi', 'Walis Hian-chi Song'),
    ).toBe(true);
  });

  it('adds the configured name once when it is absent', () => {
    expect(withDefaultPersonName(['Co-author'], 'Walis Hian-chi Song')).toEqual(
      ['Walis Hian-chi Song', 'Co-author'],
    );
    expect(
      withDefaultPersonName(['SONG, Walis Hian-chi'], 'Walis Hian-chi Song'),
    ).toEqual(['SONG, Walis Hian-chi']);
  });
});
