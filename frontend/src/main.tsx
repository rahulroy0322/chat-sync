import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './app';
import { ModeProvider } from './components/app/logic/themes/mode';

import './index.css';
import './themes/default.theme.css';
import './themes/blue.theme.css';
import './themes/green.theme.css';
import './themes/rose.theme.css';
import './themes/violet.theme.css';
import { ThemeProvider } from './components/app/logic/themes/theme';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ModeProvider>
        <ThemeProvider>
          <App />
          <Toaster
            closeButton
            position='bottom-right'
            richColors
          />
        </ThemeProvider>
      </ModeProvider>
    </StrictMode>
  );
}
