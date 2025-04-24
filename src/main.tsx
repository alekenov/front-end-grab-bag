
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create a new window property to hold the app configuration
declare global {
  interface Window {
    APP_CONFIG?: {
      API_URL: string;
      VERSION: string;
      ENV: 'development' | 'production';
    }
  }
}

// Load APP_CONFIG from window object or use defaults
if (!window.APP_CONFIG) {
  console.warn('APP_CONFIG not found, using default values');
  window.APP_CONFIG = {
    API_URL: '/api',
    VERSION: '1.0.0',
    ENV: 'production'
  };
}

createRoot(document.getElementById('root')!).render(<App />);
