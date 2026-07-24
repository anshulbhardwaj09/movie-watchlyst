import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, Film, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getGenres } from '../services/tmdb';

export function Profile() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Fetch available genres from TMDB
    getGenres().then(data => {
      if (data?.genres) setGenres(data.genres);
    });
  }, []);

  useEffect(() => {
    // Sync profile genres to local state when profile loads
    if (profile?.favorite_genres) {
      setSelectedGenres(profile.favorite_genres);
    }
  }, [profile]);

  if (authLoading) return <div className="min-h-screen"></div>;
  if (!user) return <Navigate to="/login" replace />;

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    const { error } = await updateProfile({ favorite_genres: selectedGenres });
    setIsSaving(false);
    if (error) {
      setSaveMessage('Error saving profile');
    } else {
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-white/10 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile?.name || user.email}</h2>
              <p className="text-gray-400 text-sm mt-1">Watchlyst Member</p>
            </div>
            
            <Link 
              to="/favorites" 
              className="mt-6 w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl transition-colors"
            >
              <Heart size={18} className="text-accent" />
              My Watchlyst
            </Link>
          </div>

          {/* Right Column: Preferences */}
          <div className="w-full md:w-2/3 flex flex-col border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
            <div className="mb-6 flex items-center gap-3">
              <Film className="text-accent" />
              <h3 className="text-xl font-bold text-white">Favorite Genres</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              Select the genres you love the most. We'll use this to tailor your movie recommendations in the future!
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {genres.map(genre => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]' 
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
                    }`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className={`text-sm transition-opacity ${saveMessage ? 'opacity-100' : 'opacity-0'} ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {saveMessage}
              </span>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
