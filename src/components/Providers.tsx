'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
};

// = ({ children }: Props) => {
//   return <SessionProvider>{children}</SessionProvider>;
// };

export default Providers;
