import React from 'react';
// FIX: Changed AppProps import to a default import to resolve a module resolution error.
import type AppProps from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
