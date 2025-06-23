
import { useState, useEffect, useCallback } from 'react';
import type { FeedType } from './use-feed-types';
import type { Memory } from '@/types/memory';

export function useFeed(userId?: string) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMemories = useCallback(async (
    currentPage: number,
    feedType: FeedType
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock memories data - replace with actual API calls
      const mockMemories: Memory[] = [];
      
      if (currentPage === 1) {
        setMemories(mockMemories);
      } else {
        setMemories(prev => [...prev, ...mockMemories]);
      }
      
      setHasMore(false); // No more data for now
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetFeed = useCallback(() => {
    setPage(1);
    setMemories([]);
    setHasMore(true);
    setError(null);
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      // fetchMemories would be called externally with the new page
    }
  };

  useEffect(() => {
    // Auto-fetch when component mounts
    fetchMemories(1, 'forYou');
  }, [fetchMemories]);

  return {
    memories,
    loading,
    error,
    hasMore,
    loadMore,
    page,
    setPage,
    fetchMemories,
    resetFeed
  };
}
