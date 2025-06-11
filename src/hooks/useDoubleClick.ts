
import { useCallback, useRef } from 'react';

interface UseDoubleClickOptions {
  onDoubleClick: () => void;
  onSingleClick?: () => void;
  delay?: number;
}

export const useDoubleClick = ({ onDoubleClick, onSingleClick, delay = 300 }: UseDoubleClickOptions) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout>();
  const clickCountRef = useRef(0);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {
        onSingleClick?.();
      } else if (clickCountRef.current === 2) {
        onDoubleClick();
      }
      clickCountRef.current = 0;
    }, delay);
  }, [onDoubleClick, onSingleClick, delay]);

  return handleClick;
};
