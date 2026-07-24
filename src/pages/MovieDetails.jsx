import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowLeft, Heart, Play, ExternalLink } from 'lucide-react';
import { getMovieDetails, getImageUrl } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { PageTransition } from '../components/PageTransition';

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavorite, addFavorite, removeFavorite } = useStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    window.scrollTo(0, 0); 
    getMovieDetails(id)
      .then(data => {
        if(isMounted) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if(isMounted) {
          setError("Failed to load movie details.");
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-8">
        <div className="h-[40vh] bg-gray-800 rounded-xl"></div>
        <div className="flex gap-8 px-4">
          <div className="w-64 h-96 bg-gray-800 rounded-xl -mt-20 hidden md:block border-4 border-gray-900"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-gray-800 rounded w-1/2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
            <div className="h-24 bg-gray-800 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return <div className="text-center text-red-500 py-10">{error || "Movie not found"}</div>;
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const favorite = isFavorite(movie.id);

  const toggleFavorite = () => {
    if (favorite) removeFavorite(movie.id);
    else addFavorite(movie);
  };

  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 10) || [];
  
  // 1. Trailer
  const trailer = movie.videos?.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube");

  // 2. Providers (US Region)
  const providersData = movie['watch/providers']?.results?.US;
  const tmdbLink = providersData?.link;
  const streamProviders = providersData?.flatrate || [];
  const rentProviders = providersData?.rent || [];
  const buyProviders = providersData?.buy || [];
  const hasProviders = streamProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0;

  const renderProviderSection = (title, providers) => {
    if (!providers || providers.length === 0) return null;
    return (
      <div className="mb-4 sm:mb-0 flex-shrink-0">
        <h3 className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-widest">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {providers.map(provider => (
            <a 
              key={provider.provider_id} 
              href={tmdbLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative"
              title={provider.provider_name}
            >
              <img 
                src={getImageUrl(provider.logo_path, 'w92')} 
                alt={provider.provider_name} 
                className="w-12 h-12 rounded-xl border-2 border-gray-700 group-hover:border-accent transition-colors"
              />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageTransition className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full rounded-2xl overflow-hidden bg-gray-800">
        {backdropUrl && (
          <>
            <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </>
        )}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-colors z-10"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-8 -mt-16 sm:-mt-24 md:-mt-32 relative z-10">
        {/* Poster */}
        <div className="w-48 md:w-72 flex-shrink-0 mx-auto md:mx-0">
          <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-gray-900 bg-gray-800">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
            )}
          </div>
          <button 
            onClick={toggleFavorite}
            className="w-full mt-4 py-3 flex items-center justify-center gap-2 rounded-xl font-medium transition-all bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
          >
            <Heart className={cn("transition-colors", favorite ? "fill-red-500 text-red-500" : "")} size={20} />
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 pt-2 md:pt-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300 mb-8">
            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">
              <Star size={16} className="fill-yellow-500" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Clock size={16} />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              <Calendar size={16} />
              <span>{movie.release_date?.split('-')[0]}</span>
            </div>
            {movie.genres?.map(g => (
              <span key={g.id} className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full">
                {g.name}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-white mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-10">
            {movie.overview}
          </p>

          {/* Where to Watch */}
          <div className="mb-10 p-6 bg-gray-800/50 rounded-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Where to Watch <span className="text-sm font-normal text-gray-500">(US)</span>
              </h2>
              {tmdbLink && hasProviders && (
                <a href={tmdbLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors text-sm font-medium flex items-center gap-1">
                  View all <ExternalLink size={14} />
                </a>
              )}
            </div>
            
            {hasProviders ? (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                {renderProviderSection("Stream", streamProviders)}
                {renderProviderSection("Rent", rentProviders)}
                {renderProviderSection("Buy", buyProviders)}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Not currently available to stream, rent, or buy in your region.</p>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailer && (
        <div className="px-4 md:px-8 mt-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Play className="text-accent fill-accent/20" size={28} /> Official Trailer
          </h2>
          <div className="aspect-video w-full max-w-4xl rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="px-4 md:px-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar touch-pan-x">
            {cast.map(actor => (
              <div key={actor.id} className="w-[120px] sm:w-[140px] flex-shrink-0 snap-start text-center">
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 mb-2 border border-gray-800">
                  {actor.profile_path ? (
                    <img src={getImageUrl(actor.profile_path, 'w200')} alt={actor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                  )}
                </div>
                <p className="font-semibold text-sm text-white truncate" title={actor.name}>{actor.name}</p>
                <p className="text-xs text-gray-400 truncate" title={actor.character}>{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="px-4 md:px-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar touch-pan-x">
            {recommendations.map((rec, i) => (
              <div key={rec.id} className="w-[160px] sm:w-[200px] flex-shrink-0 snap-start">
                <MovieCard movie={rec} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
