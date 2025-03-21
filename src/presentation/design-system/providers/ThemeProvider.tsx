'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { colors } from '@/presentation/design-system/domain/theme';

const theme = {
  colors: {
    brand: colors.brand,
    background: colors.background,
    text: colors.text,
    border: colors.border,
    status: colors.status,
    label: colors.labels,
    surface: colors.surface,
    interaction: colors.interaction,
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <StyledThemeProvider theme={theme as any}>{children}</StyledThemeProvider>;
}