import React from 'react';
// FIX: The error indicates `AppProps` is not a named export. Changed to a default import as suggested.
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
