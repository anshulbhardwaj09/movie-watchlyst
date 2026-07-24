import axios from 'axios';

const API_KEY = process.env.VITE_TMDB_API_KEY;

axios.get(`https://api.tmdb.org/3/trending/movie/day`, {
  params: { api_key: API_KEY }
})
.then(res => {
  console.log("SUCCESS using api.tmdb.org! Count:", res.data.results.length);
})
.catch(err => {
  console.error("ERROR api.tmdb.org:", err.message);
});
