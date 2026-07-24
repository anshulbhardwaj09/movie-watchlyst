import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export function MovieCard({ movie, index = 0 }) {
  const { addFavorite, removeFavorite, isFavorite } = useStore();
  const favorite = isFavorite(movie.id);

  const toggleFavorite = (e) => {
    e.preventDefault(); 
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const imageUrl = getImageUrl(movie.poster_path, 'w500');
  const displayTitle = movie.title || movie.name;
  const displayDate = movie.release_date || movie.first_air_date;
  const releaseYear = displayDate ? displayDate.split('-')[0] : 'N/A';
  
  // Determine route based on media_type or if it has a 'name' (TV) vs 'title' (Movie)
  const mediaType = movie.media_type || (movie.name && !movie.title ? 'tv' : 'movie');
  const route = `/${mediaType}/${movie.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4, delay: (index % 20) * 0.05, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="group relative flex flex-col gap-2 rounded-xl h-full cursor-pointer"
    >
      <Link to={route} className="flex flex-col h-full focus:outline-none">
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700/50 group-hover:shadow-xl group-hover:border-accent/50 transition-all duration-300">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={displayTitle} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <button 
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors z-10"
          >
            <Heart 
              size={20} 
              className={cn("transition-colors", favorite ? "fill-red-500 text-red-500" : "text-white")} 
            />
          </button>
  
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
  
        <div className="flex flex-col px-1 mt-3">
          <h3 className="font-semibold text-white truncate" title={displayTitle}>{displayTitle}</h3>
          <p className="text-sm text-gray-400">{releaseYear}</p>
        </div>
      </Link>
    </motion.div>
  );
}
