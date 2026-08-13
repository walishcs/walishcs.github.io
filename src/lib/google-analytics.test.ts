import { describe, expect, it } from 'vitest';
import {
  OPTIONAL_GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN,
  normalizeGoogleAnalyticsMeasurementId,
} from './google-analytics';

describe('optional Google Analytics measurement ID field', () => {
  it.each(['', 'G-AB12CD34', 'g-ab12cd34'])(
    'accepts an empty or valid value: %s',
    (value) => {
      expect(OPTIONAL_GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN.test(value)).toBe(
        true,
      );
    },
  );

  it.each(['UA-12345', 'G-', 'G-invalid id'])(
    'rejects an invalid non-empty value: %s',
    (value) => {
      expect(OPTIONAL_GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN.test(value)).toBe(
        false,
      );
    },
  );
});

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
