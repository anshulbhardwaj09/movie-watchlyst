import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { searchMovies } from '../services/tmdb';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { PageTransition } from '../components/PageTransition';

export function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const fetchFn = (opts) => debouncedQuery ? searchMovies(debouncedQuery, 1, opts) : Promise.resolve({ results: [] });

  const { data, loading, error } = useFetch(fetchFn, [debouncedQuery]);
  const results = data?.results || [];

  return (
    <PageTransition className="flex flex-col gap-8">
      <div className="relative w-full max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
          type="text" 
          autoFocus
          placeholder="Type to search for a movie..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all shadow-lg"
        />
      </div>

      <div>
        {loading && debouncedQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(10).fill(0).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center">
            Error searching movies. Please try again.
          </div>
        )}

        {!loading && debouncedQuery && results.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400 bg-gray-800/30 rounded-2xl border border-gray-800">
            <p className="text-xl font-medium text-white mb-2">No results found</p>
            <p>Try adjusting your search query.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
        
        {!debouncedQuery && (
           <div className="text-center py-20 text-gray-500">
             <SearchIcon className="mx-auto mb-4 opacity-50" size={48} />
             <p className="text-lg">Discover your next favorite movie.</p>
           </div>
        )}
      </div>
    </PageTransition>
  );
}
