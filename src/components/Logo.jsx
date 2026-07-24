export function Logo({ className = "h-8" }) {
  return (
    <svg viewBox="0 0 180 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 4)">
        <rect width="32" height="32" rx="10" fill="url(#logo-gradient)" />
        <polygon points="13,10 23,16 13,22" fill="#fff" />
      </g>

      {/* Wordmark */}
      <text x="44" y="28" fontFamily="'Inter', 'Poppins', sans-serif" fontWeight="800" fontSize="24" fill="#fff" letterSpacing="-0.5">
        Watchlyst
      </text>
    </svg>
  );
}
