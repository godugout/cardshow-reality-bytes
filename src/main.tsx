
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GamificationProvider } from '@/components/gamification/GamificationProvider';

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <GamificationProvider>
        <App />
      </GamificationProvider>
    </AuthProvider>
  </ErrorBoundary>
);
