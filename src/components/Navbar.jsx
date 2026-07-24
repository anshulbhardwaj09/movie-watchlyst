import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { user, profile, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={closeMenus} className="flex items-center transition-opacity hover:opacity-80">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Logo className="h-7 sm:h-8" />
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {!isLandingPage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex items-center gap-6 mr-2"
            >
              <NavLink to="/browse" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                Browse
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                <Search size={18} />
                <span>Search</span>
              </NavLink>
              <NavLink to="/favorites" className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                <Heart size={18} />
                <span>Favorites</span>
              </NavLink>
            </motion.div>
          )}

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
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
                        onClick={closeMenus}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button 
                        onClick={() => {
                          closeMenus();
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
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-gray-950 border-b border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {!isLandingPage && (
                <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
                  <NavLink to="/browse" onClick={closeMenus} className={({ isActive }) => `text-base font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                    Browse
                  </NavLink>
                  <NavLink to="/search" onClick={closeMenus} className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                    <Search size={18} />
                    <span>Search</span>
                  </NavLink>
                  <NavLink to="/favorites" onClick={closeMenus} className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>
                    <Heart size={18} />
                    <span>Favorites</span>
                  </NavLink>
                </div>
              )}
              
              <div className="flex flex-col gap-3 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-white truncate">{profile?.name || user.email}</span>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={closeMenus}
                      className="flex items-center gap-2 text-base text-gray-300 hover:text-white transition-colors"
                    >
                      <User size={18} /> Profile
                    </Link>
                    <button 
                      onClick={() => {
                        closeMenus();
                        signOut();
                      }}
                      className="flex items-center gap-2 text-base text-red-400 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={closeMenus} className="text-base font-medium text-gray-300 hover:text-white transition-colors">
                      Login
                    </Link>
                    <Link to="/signup" onClick={closeMenus} className="text-base font-medium text-center bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-xl transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
