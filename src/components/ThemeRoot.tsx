import { Theme, type ThemeMode } from '@astryxdesign/core/theme';
import { resolveSiteTheme } from '@/lib/site-theme';
import type { ReactNode } from 'react';

export function ThemeRoot({
  children,
  themeName,
}: {
  children: ReactNode;
  themeName?: unknown;
}) {
  return (
    <Theme
      theme={resolveSiteTheme(themeName)}
      mode={'system' satisfies ThemeMode}
    >
      {children}
    </Theme>
  );
}
