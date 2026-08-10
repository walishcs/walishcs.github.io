import { describe, expect, it } from 'vitest';
import { resolveSiteTheme } from './site-theme';
import {
  DEFAULT_SITE_THEME,
  SITE_THEME_OPTIONS,
  resolveSiteThemeName,
} from './site-theme-options';

describe('site themes', () => {
  it.each(SITE_THEME_OPTIONS)('resolves the $label theme', ({ value }) => {
    expect(resolveSiteThemeName(value)).toBe(value);
    expect(resolveSiteTheme(value).name).toBe(value);
    expect(resolveSiteTheme(value).__built).toBe(true);
  });

  it('falls back to Stone for missing or unsupported values', () => {
    expect(resolveSiteThemeName(undefined)).toBe(DEFAULT_SITE_THEME);
    expect(resolveSiteThemeName('gothic')).toBe(DEFAULT_SITE_THEME);
    expect(resolveSiteTheme('gothic').name).toBe(DEFAULT_SITE_THEME);
  });
});
