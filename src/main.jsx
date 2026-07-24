import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';
import './index.css';

const REQUIRED_ENVS = [
  { key: 'VITE_TMDB_API_KEY', name: 'TMDB API Key' },
  { key: 'VITE_SUPABASE_URL', name: 'Supabase URL' },
  { key: 'VITE_SUPABASE_ANON_KEY', name: 'Supabase Anon Key' }
];

const missingEnvs = REQUIRED_ENVS.filter(env => !import.meta.env[env.key]);

const root = createRoot(document.getElementById('root'));

if (missingEnvs.length > 0) {
  root.render(
    <div style={{ padding: '2rem', color: '#ff4a4a', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Missing Environment Variables</h1>
      <p style={{ marginBottom: '1rem' }}>The application cannot start because the following required environment variables are missing:</p>
      <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem' }}>
        {missingEnvs.map(env => (
          <li key={env.key} style={{ marginBottom: '0.5rem' }}>
            <strong>{env.key}</strong> ({env.name})
          </li>
        ))}
      </ul>
      <p>Please add these to your <code>.env</code> file in the project root and restart the development server.</p>
    </div>
  );
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
