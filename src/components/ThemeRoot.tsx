import { Theme, type ThemeMode } from '@astryxdesign/core/theme';
import { stoneTheme as stoneSourceTheme } from '@astryxdesign/theme-stone';
import type { ReactNode } from 'react';

// Stone 0.2.0's published `/built` entry has an extensionless ESM import that
// Node cannot resolve during Astro's static render. The official CSS is still
// loaded globally; marking the identical source theme as built prevents a
// duplicate runtime style injection without changing any theme tokens.
const stoneTheme = { ...stoneSourceTheme, __built: true } as const;

export function ThemeRoot({ children }: { children: ReactNode }) {
  return (
    <Theme theme={stoneTheme} mode={'system' satisfies ThemeMode}>
      {children}
    </Theme>
  );
}
