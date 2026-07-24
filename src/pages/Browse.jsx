import { useState, useEffect, useCallback } from 'react';
import { getTrending, getPopular } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PageTransition } from '../components/PageTransition';

export function Browse() {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('day');

  const [popular, setPopular] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Trending
  useEffect(() => {
    let isMounted = true;
    setTrendingLoading(true);
    getTrending(timeWindow).then(data => {
      if(isMounted) {
        setTrending(data?.results || []);
        setTrendingLoading(false);
      }
    }).catch(err => {
      if(isMounted) {
        console.error("Trending error:", err);
        setTrendingLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [timeWindow]);

  // Fetch Popular
  useEffect(() => {
    let isMounted = true;
    setPopularLoading(true);
    setError(null);
    getPopular(page).then(data => {
      if(isMounted) {
        const results = data?.results || [];
        setPopular(prev => page === 1 ? results : [...prev, ...results]);
        setHasMore(data?.page < data?.total_pages);
        setPopularLoading(false);
      }
    }).catch(err => {
      if(isMounted) {
        console.error("Popular error:", err);
        setError(err.message || "Failed to load popular movies. Please check your API key or network connection.");
        setPopularLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [page]);

  const loadMore = useCallback(() => {
    if (!popularLoading) {
      setPage(p => p + 1);
    }
  }, [popularLoading]);

  const observerRef = useInfiniteScroll(hasMore, loadMore, popularLoading);

  return (
    <PageTransition className="flex flex-col gap-12 relative">
      <div id="explore-section" className="flex flex-col gap-12">
        {/* Trending Section */}
        <section className="relative z-10 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Trending</h2>
          <div className="flex bg-gray-800 rounded-full p-1">
            <button 
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${timeWindow === 'day' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setTimeWindow('day')}
            >
              Today
            </button>
            <button 
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${timeWindow === 'week' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setTimeWindow('week')}
            >
              This Week
            </button>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar touch-pan-x">
          {trendingLoading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="w-[160px] sm:w-[200px] flex-shrink-0 snap-start">
                <SkeletonCard />
              </div>
            ))
          ) : (
            trending.map((movie, i) => (
              <div key={movie.id} className="w-[160px] sm:w-[200px] flex-shrink-0 snap-start">
                <MovieCard movie={movie} index={i} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popular Section */}
      <section className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {popular.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
          ))}
          
          {popularLoading && Array(10).fill(0).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
        </div>
        
        <div ref={observerRef} className="h-10 w-full mt-4 flex items-center justify-center">
          {/* Invisible target for IntersectionObserver */}
        </div>
      </section>
      </div>
    </PageTransition>
  );
}
