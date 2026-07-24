import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(hasMore, onLoadMore, isLoading) {
  const observerTarget = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;
    
    const option = { rootMargin: '200px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  return observerTarget;
}
