import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (movie) => {
        const currentFavorites = get().favorites;
        if (!currentFavorites.find((m) => m.id === movie.id)) {
          set({ favorites: [...currentFavorites, movie] });
        }
      },
      removeFavorite: (movieId) => {
        set({ favorites: get().favorites.filter((m) => m.id !== movieId) });
      },
      isFavorite: (movieId) => {
        return get().favorites.some((m) => m.id === movieId);
      }
    }),
    {
      name: 'movie-favorites-storage',
    }
  )
);
