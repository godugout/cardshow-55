
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import App from './App.tsx'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import './index.css'

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Add error boundary wrapper
const AppWithErrorBoundary = () => {
  try {
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <App />
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('App initialization error:', error);
    return (
      <div className="min-h-screen bg-[#141416] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Loading Error</h1>
          <p className="mb-4">The application encountered an initialization error.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
};

ReactDOM.createRoot(rootElement).render(<AppWithErrorBoundary />);
