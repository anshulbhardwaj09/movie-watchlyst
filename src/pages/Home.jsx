import { useState, useEffect } from 'react';
import { getTrending } from '../services/tmdb';
import { PageTransition } from '../components/PageTransition';
import { Hero } from '../components/Hero';

export function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getTrending('day').then(data => {
      if(isMounted) {
        setTrending(data?.results || []);
      }
    }).catch(err => console.error("Trending error:", err));
    
    return () => { isMounted = false; };
  }, []);

  return (
    <PageTransition className="flex flex-col relative w-full h-full">
      <Hero movies={trending} />
    </PageTransition>
  );
}
