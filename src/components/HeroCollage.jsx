import { getImageUrl } from '../services/tmdb';

export function HeroCollage({ movies }) {
  if (!movies || movies.length === 0) return null;

  // Use up to 14 posters to create a dense background grid
  const collageMovies = movies.slice(0, 14);

  return (
    <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden z-[-5] pointer-events-none">
      <div className="absolute inset-0 flex flex-wrap gap-4 opacity-30 animate-pan-collage transform-gpu">
        {collageMovies.map((movie, i) => (
          <div 
            key={`${movie.id}-${i}`}
            className="w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0"
          >
            {movie.poster_path && (
              <img 
                src={getImageUrl(movie.poster_path, 'w500')} 
                alt="" 
                className="w-full h-full object-cover opacity-60"
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Heavy blur filter */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gray-900/40" />
      
      {/* Fade to page background at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-900/60 to-gray-900" />
    </div>
  );
}
