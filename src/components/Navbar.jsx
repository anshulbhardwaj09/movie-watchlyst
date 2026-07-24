import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { user, profile, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Logo className="h-7 sm:h-8" />
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-6">
          {!isLandingPage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 sm:gap-6 mr-2"
            >
              <NavLink to="/browse" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                Browse
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </NavLink>
              <NavLink to="/favorites" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                <Heart size={18} />
                <span className="hidden sm:inline">Favorites</span>
              </NavLink>
            </motion.div>
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors focus:outline-none"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-medium text-white truncate">{profile?.name || user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-full transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
