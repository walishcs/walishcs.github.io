import { describe, expect, it } from 'vitest';
import { normalizeGoogleAnalyticsMeasurementId } from './google-analytics';

describe('normalizeGoogleAnalyticsMeasurementId', () => {
  it('normalizes a valid GA4 measurement ID', () => {
    expect(normalizeGoogleAnalyticsMeasurementId('  g-ab12cd34  ')).toBe(
      'G-AB12CD34',
    );
  });

  it.each([undefined, null, '', 'UA-12345', 'G-', 'G-invalid id'])(
    'rejects an absent or invalid measurement ID: %s',
    (value) => {
      expect(normalizeGoogleAnalyticsMeasurementId(value)).toBeNull();
    },
  );
});
