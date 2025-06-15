
import { useRef, useCallback } from 'react';

interface UseDoubleClickOptions {
  onSingleClick?: () => void;
  onDoubleClick: () => void;
  delay?: number;
}

export const useDoubleClick = ({ onSingleClick, onDoubleClick, delay = 300 }: UseDoubleClickOptions) => {
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;
    console.log(`🖱️ Click count: ${clickCountRef.current}`);

    if (clickCountRef.current === 1) {
      // First click - start timer
      console.log('🖱️ Single click timer started.');
      timeoutRef.current = setTimeout(() => {
        // Reset if only single click within delay
        clickCountRef.current = 0;
        console.log('🖱️ Single click processed.');
        onSingleClick?.();
      }, delay);
    } else if (clickCountRef.current === 2) {
      // Double click detected
      console.log('🖱️ Double click detected!');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      clickCountRef.current = 0;
      onDoubleClick();
    }
  }, [onSingleClick, onDoubleClick, delay]);

  return handleClick;
};
