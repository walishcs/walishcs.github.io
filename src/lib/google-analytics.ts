export const GOOGLE_ANALYTICS_TAG_ID_HELP_URL =
  'https://support.google.com/analytics/answer/9539598';

export const GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export function normalizeGoogleAnalyticsMeasurementId(
  value: string | null | undefined,
) {
  const measurementId = value?.trim().toUpperCase() ?? '';

  return GOOGLE_ANALYTICS_MEASUREMENT_ID_PATTERN.test(measurementId)
    ? measurementId
    : null;
}
