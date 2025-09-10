import React from 'react';
import App from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../styles/globals.css';

// Infer the props type from the App component for robustness
type MyAppProps = React.ComponentProps<typeof App>;

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;