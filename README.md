# Watchlyst 🎬

A modern, immersive movie recommendation web application built with React, Vite, Tailwind CSS, and Supabase. Watchlyst allows users to browse trending and popular movies, search for specific titles, save favorites to their personal watchlist, and curate their own profile.

## 🚀 Live Demo

**[Insert Vercel Live Demo URL Here]**

## ✨ Features

- **Immersive UI:** A stunning, cinematic dark-mode interface with frosted glass effects and dynamic backgrounds.
- **Supabase Authentication:** Secure email/password and Google OAuth login.
- **Personalized Profiles:** Users can curate their favorite movie genres, synced directly to their Supabase profile.
- **Persistent Watchlist:** Save your favorite movies to your personal "My Watchlyst" list.
- **TMDB Integration:** Real-time data from the official Movie Database (TMDB) API, including full movie details, trailers, and cast.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **State Management:** Zustand, React Context
- **Routing:** React Router v7
- **Authentication & DB:** Supabase
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API:** TMDB (The Movie Database)

## 📦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd watchlyst
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on the provided `.env.example` file. You will need:
   - `VITE_TMDB_API_KEY`: Get this from [TMDB API Settings](https://developer.themoviedb.org/docs/getting-started)
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Project Anon/Public Key

4. **Database Setup (Supabase):**
   Execute the required SQL script located in `implementation_plan.md` in your Supabase SQL Editor to create the `profiles` table and configure Row Level Security (RLS).
   
   Ensure that the **Google Provider** is enabled in your Supabase Authentication settings.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment (Vercel)

This project is optimized for deployment on Vercel. 
1. Push the code to a GitHub repository.
2. Import the project in the Vercel dashboard.
3. Add the three Environment Variables (`VITE_TMDB_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy! Client-side routing is handled automatically.
