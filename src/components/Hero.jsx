import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';
import { Logo } from './Logo';

const Column = ({ movies, direction, speed, className = '' }) => {
  // Duplicate array once to allow a smooth 0 to -50% loop
  const duplicated = [...movies, ...movies];
  
  return (
    <div className={`w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0 flex flex-col overflow-hidden ${className}`}>
      <div 
        className={`flex flex-col gap-4 w-full ${direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'}`}
        style={{ animationDuration: speed }}
      >
        {duplicated.map((m, i) => (
          <div key={`${m.id}-${i}`} className="w-full aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-gray-800/50">
             {m.poster_path && (
               <img 
                 src={getImageUrl(m.poster_path, 'w185')} 
                 alt="" 
                 className="w-full h-full object-cover opacity-60" 
                 loading="lazy" 
               />
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function Hero({ movies }) {
  const navigate = useNavigate();

  const hasMovies = movies && movies.length >= 15;

  // Create deterministic unique columns by shifting the array
  const col1 = hasMovies ? [...movies].reverse() : [];
  const col2 = hasMovies ? [...movies.slice(5), ...movies.slice(0, 5)] : [];
  const col3 = hasMovies ? [...movies.slice(10), ...movies.slice(0, 10)] : [];
  const col4 = hasMovies ? [...movies.slice(15), ...movies.slice(0, 15)] : [];
  const col5 = hasMovies ? [...movies.slice(3), ...movies.slice(0, 3)] : [];

  const handleExplore = () => {
    navigate('/browse');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-center rounded-3xl overflow-hidden mb-12 border border-gray-800/50">
      {/* Background Poster Wall */}
      {hasMovies && (
        <div className="absolute inset-0 z-0 flex gap-4 p-4 transform-gpu scale-100 md:scale-110 pointer-events-none">
          <Column movies={col1} direction="up" speed="120s" />
          <Column movies={col2} direction="down" speed="90s" />
          <Column movies={col3} direction="up" speed="150s" />
          <Column movies={col4} direction="down" speed="110s" className="hidden md:flex" />
          <Column movies={col5} direction="up" speed="130s" className="hidden lg:flex" />
        </div>
      )}

      {/* Gradients */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />

      {/* Text Panel */}
      <motion.div 
        className="relative z-10 w-full md:w-[60%] lg:w-[50%] px-6 md:px-16 flex flex-col items-center text-center md:items-start md:text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Logo className="h-10" />
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Your next obsession is waiting.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
          Watchlyst curates the world's most talked-about movies. Explore trending hits, unearth hidden gems, and build your ultimate watchlist—all in one place.
        </motion.p>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExplore}
          className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow duration-300 cursor-pointer"
        >
          Find Movies
        </motion.button>
      </motion.div>
    </div>
  );
}
