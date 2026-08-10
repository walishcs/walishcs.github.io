export const DEFAULT_SITE_THEME = 'stone';

export const SITE_THEME_OPTIONS = [
  { label: 'Stone', value: 'stone' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Matcha', value: 'matcha' },
  { label: 'Chocolate', value: 'chocolate' },
] as const;

export type SiteThemeName = (typeof SITE_THEME_OPTIONS)[number]['value'];

const siteThemeNames = new Set<string>(
  SITE_THEME_OPTIONS.map(({ value }) => value),
);

export function isSiteThemeName(value: unknown): value is SiteThemeName {
  return typeof value === 'string' && siteThemeNames.has(value);
}

export function resolveSiteThemeName(value: unknown): SiteThemeName {
  return isSiteThemeName(value) ? value : DEFAULT_SITE_THEME;
}
