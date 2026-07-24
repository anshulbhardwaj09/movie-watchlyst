import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTrending, getDiscover, getGenres } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PageTransition } from '../components/PageTransition';
import { FilterBar } from '../components/FilterBar';
import { SearchX } from 'lucide-react';

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params State
  const type = searchParams.get('type') || 'movie';
  const language = searchParams.get('lang') || '';
  const sort = searchParams.get('sort') || 'popularity.desc';
  const genresParam = searchParams.get('genres') || '';
  const genres = genresParam ? genresParam.split(',') : [];

  const [availableGenres, setAvailableGenres] = useState([]);
  
  // Trending State
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('day');

  // Discover State
  const [discover, setDiscover] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Handlers for FilterBar
  const setParam = (key, value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      // Reset to page 1 when filters change (we'll do this via effect, or here)
      return prev;
    }, { replace: true });
    setPage(1); // explicitly reset page on filter change
    setDiscover([]); // clear current results
  };

  const handleTypeChange = (newType) => {
    setParam('type', newType);
    // Clearing genres because movie and tv genres have different IDs
    setSearchParams(prev => {
      prev.delete('genres');
      return prev;
    }, { replace: true });
  };
  
  const handleLanguageChange = (newLang) => setParam('lang', newLang);
  const handleSortChange = (newSort) => setParam('sort', newSort);
  const handleGenresChange = (genreId) => {
    let newGenres = [...genres];
    if (newGenres.includes(genreId)) {
      newGenres = newGenres.filter(g => g !== genreId);
    } else {
      newGenres.push(genreId);
    }
    setParam('genres', newGenres.join(','));
  };

  const handleClearAll = () => {
    setSearchParams(prev => {
      prev.delete('lang');
      prev.delete('genres');
      return prev;
    }, { replace: true });
    setPage(1);
    setDiscover([]);
  };

  // Fetch Genres when Type changes
  useEffect(() => {
    let isMounted = true;
    getGenres(type).then(data => {
      if (isMounted && data?.genres) {
        setAvailableGenres(data.genres);
      }
    });
    return () => { isMounted = false; };
  }, [type]);

  // Fetch Trending
  useEffect(() => {
    let isMounted = true;
    setTrendingLoading(true);
    getTrending(type, timeWindow).then(data => {
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
  }, [type, timeWindow]);

  // Fetch Discover
  useEffect(() => {
    let isMounted = true;
    setDiscoverLoading(true);
    setError(null);

    const params = {
      page,
      sort_by: sort,
      ...(language && { with_original_language: language }),
      ...(genresParam && { with_genres: genresParam })
    };

    getDiscover(type, params).then(data => {
      if(isMounted) {
        const results = data?.results || [];
        setDiscover(prev => page === 1 ? results : [...prev, ...results]);
        setHasMore(data?.page < data?.total_pages);
        setDiscoverLoading(false);
      }
    }).catch(err => {
      if(isMounted) {
        console.error("Discover error:", err);
        setError(err.message || "Failed to load movies. Please check your network connection.");
        setDiscoverLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [type, language, sort, genresParam, page]);

  const loadMore = useCallback(() => {
    if (!discoverLoading) {
      setPage(p => p + 1);
    }
  }, [discoverLoading]);

  const observerRef = useInfiniteScroll(hasMore, loadMore, discoverLoading);

  return (
    <PageTransition className="flex flex-col gap-12 relative">
      <div id="explore-section" className="flex flex-col gap-12">
        {/* Trending Section */}
        <section className="relative z-10 pt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trending {type === 'tv' ? 'Series' : 'Movies'}</h2>
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

        {/* FilterBar Section */}
        <section className="relative z-30">
          <FilterBar 
            type={type}
            onTypeChange={handleTypeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            genres={genres}
            onGenresChange={handleGenresChange}
            sort={sort}
            onSortChange={handleSortChange}
            availableGenres={availableGenres}
            onClearAll={handleClearAll}
          />
        </section>

        {/* Discover Results Section */}
        <section className="relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!discoverLoading && discover.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-800/20 rounded-2xl border border-gray-800">
              <SearchX size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400">Try adjusting your filters or clearing them to see more {type === 'tv' ? 'series' : 'movies'}.</p>
              <button 
                onClick={handleClearAll}
                className="mt-6 px-6 py-2 bg-accent hover:bg-accent/80 text-white rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {discover.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
              ))}
              
              {discoverLoading && Array(10).fill(0).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </div>
          )}
          
          <div ref={observerRef} className="h-10 w-full mt-4 flex items-center justify-center">
            {/* Invisible target for IntersectionObserver */}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
