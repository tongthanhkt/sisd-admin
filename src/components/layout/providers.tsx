'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { ReduxProvider } from '../providers/redux-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ReduxProvider>{children}</ReduxProvider>
      </ActiveThemeProvider>
    </>
  );
}
