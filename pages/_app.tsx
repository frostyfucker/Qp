import React from 'react';
// FIX: Changed named import to default import for AppProps based on the error message.
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
