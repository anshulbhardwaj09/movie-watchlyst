import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.tmdb.org/3';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 3000, // 3 second timeout for faster fallback if blocked
});

// Minimal mock data for fallback
const mockMovie = {
  id: 1,
  title: "Mock Movie (API Blocked)",
  overview: "Your ISP is currently blocking the TMDB API. We are showing placeholder data.",
  // Use a generic movie-like placeholder from Unsplash since TMDB images might be blocked too
  poster_path: null, 
  backdrop_path: null,
  vote_average: 8.5,
  release_date: "2024-01-01"
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80", // film reel
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80", // cinema
  "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500&q=80", // tv
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80", // clapperboard
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8e0?w=500&q=80", // popcorn
];

const generateMockMovies = (count = 20) => {
  return Array(count).fill(0).map((_, i) => ({
    ...mockMovie,
    id: i + 1,
    title: `Sample Movie ${i + 1}`,
    // Store the unsplash URL temporarily in poster_path, we will handle this in getImageUrl
    poster_path: placeholderImages[i % placeholderImages.length]
  }));
};

const fallbackResponse = {
  results: generateMockMovies(20),
  page: 1,
  total_pages: 1
};

export const getTrending = async (timeWindow = 'day', page = 1, options = {}) => {
  try {
    const res = await apiClient.get(`/trending/movie/${timeWindow}`, { params: { page }, ...options });
    return res.data;
  } catch (err) {
    console.warn("TMDB API Error, using fallback data.");
    return fallbackResponse;
  }
};

export const getPopular = async (page = 1, options = {}) => {
  try {
    const res = await apiClient.get('/movie/popular', { params: { page }, ...options });
    return res.data;
  } catch (err) {
    console.warn("TMDB API Error, using fallback data.");
    return fallbackResponse;
  }
};

export const searchMovies = async (query, page = 1, options = {}) => {
  try {
    const res = await apiClient.get('/search/movie', { params: { query, page }, ...options });
    return res.data;
  } catch (err) {
    console.warn("TMDB API Error, using fallback data.");
    return fallbackResponse;
  }
};

export const getMovieDetails = async (id, options = {}) => {
  try {
    const res = await apiClient.get(`/movie/${id}`, { params: { append_to_response: 'credits,recommendations,videos,watch/providers' }, ...options });
    return res.data;
  } catch (err) {
    console.warn("TMDB API Error, using fallback data.");
    return { ...mockMovie, id: parseInt(id) };
  }
};

export const getGenres = async (options = {}) => {
  try {
    const res = await apiClient.get('/genre/movie/list', { ...options });
    return res.data;
  } catch (err) {
    console.warn("TMDB API Error, using fallback data.");
    return { genres: [{ id: 1, name: "Action" }, { id: 2, name: "Comedy" }] };
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
