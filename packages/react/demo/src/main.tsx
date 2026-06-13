import React from 'react';
import ReactDOM from 'react-dom/client';
import '@libra-design/tokens/css';
import { ThemeProvider } from './theme-provider';
import { App } from './app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
