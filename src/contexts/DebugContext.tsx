
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DebugContextType {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  setDebugMode: (enabled: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

interface DebugProviderProps {
  children: React.ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Load debug mode preference from localStorage
    const savedDebugMode = localStorage.getItem('crd-debug-mode');
    if (savedDebugMode === 'true') {
      setIsDebugMode(true);
    }
  }, []);

  const toggleDebugMode = () => {
    const newDebugMode = !isDebugMode;
    setIsDebugMode(newDebugMode);
    localStorage.setItem('crd-debug-mode', newDebugMode.toString());
  };

  const setDebugMode = (enabled: boolean) => {
    setIsDebugMode(enabled);
    localStorage.setItem('crd-debug-mode', enabled.toString());
  };

  const value: DebugContextType = {
    isDebugMode,
    toggleDebugMode,
    setDebugMode,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};
