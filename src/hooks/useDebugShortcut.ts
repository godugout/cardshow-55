
import { useEffect } from 'react';
import { useDebug } from '@/contexts/DebugContext';

export const useDebugShortcut = () => {
  const { toggleDebugMode } = useDebug();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+D (or Cmd+Shift+D on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDebugMode();
      }
    };

    // Only add shortcut in development mode
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [toggleDebugMode]);
};
