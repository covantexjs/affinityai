import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TestAppWrapper from './TestAppWrapper';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <TestAppWrapper />
  </StrictMode>
);