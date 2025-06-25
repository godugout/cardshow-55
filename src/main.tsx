
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotificationProvider } from '@/components/common/NotificationCenter'
import { DebugProvider } from '@/contexts/DebugContext'
import App from './App.tsx'
import { Toaster } from 'sonner'
import './index.css'

// Enhanced PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register the main service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('SW registered:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available!');
              window.dispatchEvent(new CustomEvent('sw-update-available'));
            }
          });
        }
      });

      // Register for background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        console.log('Background sync supported');
      }

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        // Don't auto-request, let the user decide via PWA prompt
        console.log('Notifications available');
      }

    } catch (error) {
      console.log('SW registration failed:', error);
    }
  });
}

// Enhanced error tracking
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Track error in analytics
  window.dispatchEvent(new CustomEvent('analytics-error', {
    detail: {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    }
  }));
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Track error in analytics
  window.dispatchEvent(new CustomEvent('analytics-error', {
    detail: {
      type: 'unhandledrejection',
      reason: event.reason?.toString(),
    }
  }));
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>,
)
