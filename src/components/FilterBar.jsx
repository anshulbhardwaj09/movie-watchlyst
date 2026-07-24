import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';

export const LANGUAGES = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Indian (Hindi)', value: 'hi' },
  { label: 'South Indian', value: 'te,ta,ml,kn' },
  { label: 'Korean', value: 'ko' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];

export const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Rating', value: 'vote_average.desc' },
  { label: 'Release Date', value: 'release_date.desc' },
];

function Dropdown({ label, options, value, onChange, multi = false, selectedIds = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = multi
    ? label
    : options.find(o => o.value === value)?.label || label;

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors border border-gray-700 text-white"
      >
        {displayLabel}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto custom-scrollbar bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
          <div className="p-2 flex flex-col gap-1">
            {options.map((opt) => {
              if (multi) {
                const isSelected = selectedIds.includes(opt.id.toString());
                return (
                  <label key={opt.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer text-sm text-gray-200">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onChange(opt.id.toString())}
                      className="rounded border-gray-600 text-accent focus:ring-accent bg-gray-800"
                    />
                    {opt.name}
                  </label>
                );
              }

              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${value === opt.value ? 'bg-accent text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterBar({ type, onTypeChange, language, onLanguageChange, genres, onGenresChange, sort, onSortChange, availableGenres, onClearAll }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeLangLabel = LANGUAGES.find(l => l.value === language)?.label;
  const activeGenres = availableGenres.filter(g => genres.includes(g.id.toString()));

  const hasFilters = language !== '' || genres.length > 0;

  const filtersContent = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
      {/* Type Toggle */}
      <div className="flex bg-gray-800 rounded-xl p-1 w-full sm:w-auto">
        <button 
          className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === 'movie' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => onTypeChange('movie')}
        >
          Movies
        </button>
        <button 
          className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === 'tv' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => onTypeChange('tv')}
        >
          TV Series
        </button>
      </div>

      <div className="w-px h-8 bg-gray-700 hidden sm:block"></div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        <Dropdown 
          label="Sort By" 
          options={SORT_OPTIONS} 
          value={sort} 
          onChange={onSortChange} 
        />
        <Dropdown 
          label="Language" 
          options={LANGUAGES} 
          value={language} 
          onChange={onLanguageChange} 
        />
        <Dropdown 
          label="Genres" 
          options={availableGenres} 
          multi={true}
          selectedIds={genres}
          onChange={onGenresChange} 
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Bar */}
      <div className="hidden sm:flex items-center justify-between">
        {filtersContent}
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="sm:hidden flex items-center justify-between">
        <button 
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          <Filter size={16} />
          Filters & Sorting
        </button>
      </div>

      {/* Mobile Drawer Content */}
      {mobileDrawerOpen && (
        <div className="sm:hidden p-4 bg-gray-800/50 rounded-2xl border border-gray-700 flex flex-col gap-4">
          {filtersContent}
        </div>
      )}

      {/* Active Filter Chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {language !== '' && (
            <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/20">
              {activeLangLabel}
              <button onClick={() => onLanguageChange('')} className="hover:text-white transition-colors">
                <X size={12} />
              </button>
            </div>
          )}
          
          {activeGenres.map(g => (
            <div key={g.id} className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/20">
              {g.name}
              <button onClick={() => onGenresChange(g.id.toString())} className="hover:text-white transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}

          <button 
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-white underline px-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
