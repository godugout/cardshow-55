
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotificationProvider } from '@/components/common/NotificationCenter'
import { DebugProvider } from '@/contexts/DebugContext'
import App from './App.tsx'
import { AuthProvider } from './features/auth/providers/AuthProvider'
import { Toaster } from 'sonner'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && window.location.pathname.startsWith('/cardshow')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/cardshow-sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DebugProvider>
            <NotificationProvider>
              <TooltipProvider>
                <App />
                <Toaster 
                  position="top-center"
                  expand={false}
                  richColors
                  closeButton
                  duration={3000}
                  toastOptions={{
                    style: {
                      marginTop: '60px', // Avoid overlapping with top navigation
                    },
                    className: 'toast-center'
                  }}
                />
              </TooltipProvider>
            </NotificationProvider>
          </DebugProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
