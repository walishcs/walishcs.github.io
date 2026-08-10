import type { DefinedTheme } from '@astryxdesign/core/theme';
import { chocolateTheme as chocolateSourceTheme } from '@astryxdesign/theme-chocolate';
import { matchaTheme as matchaSourceTheme } from '@astryxdesign/theme-matcha';
import { neutralTheme as neutralSourceTheme } from '@astryxdesign/theme-neutral';
import { stoneTheme as stoneSourceTheme } from '@astryxdesign/theme-stone';
import { resolveSiteThemeName, type SiteThemeName } from './site-theme-options';

// Published `/built` entries currently contain extensionless icon imports that
// Node cannot resolve during Astro's static render. The matching theme CSS is
// loaded globally, so marking source objects as built avoids runtime injection.
const asBuiltTheme = (theme: DefinedTheme): DefinedTheme => ({
  ...theme,
  __built: true,
});

const siteThemes = {
  stone: asBuiltTheme(stoneSourceTheme),
  neutral: asBuiltTheme(neutralSourceTheme),
  matcha: asBuiltTheme(matchaSourceTheme),
  chocolate: asBuiltTheme(chocolateSourceTheme),
} satisfies Record<SiteThemeName, DefinedTheme>;

export function resolveSiteTheme(value: unknown): DefinedTheme {
  return siteThemes[resolveSiteThemeName(value)];
}
