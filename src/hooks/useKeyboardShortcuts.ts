
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      action: () => navigate('/'),
      description: 'Go to Home'
    },
    {
      key: 'g',
      action: () => navigate('/gallery'),
      description: 'Go to Gallery'
    },
    {
      key: 'c',
      action: () => navigate('/create'),
      description: 'Create new card'
    },
    {
      key: 's',
      action: () => navigate('/studio'),
      description: 'Go to Studio'
    },
    {
      key: 'f',
      action: () => navigate('/feed'),
      description: 'Go to Feed'
    },
    {
      key: '/',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus search'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // Show keyboard shortcuts modal
        console.log('Show keyboard shortcuts');
      },
      description: 'Show keyboard shortcuts'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (
          event.key === shortcut.key &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcuts };
};
