
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DebugContextValue {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  setDebugMode: (enabled: boolean) => void;
}

const DebugContext = createContext<DebugContextValue | null>(null);

interface DebugProviderProps {
  children: React.ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Enable debug mode in development or if explicitly enabled
    const debugEnabled = process.env.NODE_ENV === 'development' || 
                        localStorage.getItem('cardshow-debug') === 'true';
    setIsDebugMode(debugEnabled);
  }, []);

  const toggleDebugMode = () => {
    const newValue = !isDebugMode;
    setIsDebugMode(newValue);
    localStorage.setItem('cardshow-debug', newValue.toString());
  };

  const setDebugMode = (enabled: boolean) => {
    setIsDebugMode(enabled);
    localStorage.setItem('cardshow-debug', enabled.toString());
  };

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode, setDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugContext = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebugContext must be used within DebugProvider');
  }
  return context;
};

// Export useDebug as an alias for compatibility
export const useDebug = useDebugContext;
