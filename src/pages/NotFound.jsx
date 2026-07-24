import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="bg-accent hover:bg-accent-hover text-white font-medium py-3 px-8 rounded-full transition-colors inline-block"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
