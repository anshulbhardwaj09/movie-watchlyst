import { useStore } from '../store/useStore';
import { MovieCard } from '../components/MovieCard';
import { PageTransition } from '../components/PageTransition';

export function Favorites() {
  const { favorites } = useStore();

  return (
    <PageTransition>
      <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-gray-800/30 rounded-2xl border border-gray-800">
          <p className="text-xl font-medium text-white mb-2">No favorites yet</p>
          <p className="text-sm">Click the heart icon on any movie to save it to your watchlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
