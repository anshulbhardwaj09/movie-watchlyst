import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { MovieDetails } from './pages/MovieDetails';
import { Favorites } from './pages/Favorites';
import { Search } from './pages/Search';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const entries = performance.getEntriesByType("navigation");
    if (entries.length > 0) {
      const isReload = entries[0].type === "reload";
      if (isReload && location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, []); // Empty dependency array ensures this only runs once on initial app mount

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
