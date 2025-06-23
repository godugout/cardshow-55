
import { useState, useEffect } from 'react';
import type { FeedType } from './use-feed-types';
import type { Memory } from '@/types/memory';

export function useFeed(feedType: FeedType) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    const loadFeedData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock memories data
        const mockMemories: Memory[] = [];
        
        setMemories(mockMemories);
        setHasMore(false);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedData();
  }, [feedType]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return {
    memories,
    loading,
    error,
    hasMore,
    loadMore,
    page,
  };
}
