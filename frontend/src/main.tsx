import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';
import App from './app';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
      <Toaster
        closeButton
        position='bottom-right'
        richColors
      />
    </StrictMode>
  );
}
