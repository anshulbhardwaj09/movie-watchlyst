export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto py-8 text-center text-gray-400">
      <div className="max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} Watchlyst. Powered by TMDB API.</p>
      </div>
    </footer>
  );
}
