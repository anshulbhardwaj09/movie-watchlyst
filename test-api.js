import axios from 'axios';

const API_KEY = process.env.VITE_TMDB_API_KEY;
console.log("API KEY:", API_KEY ? "EXISTS" : "MISSING");

axios.get(`https://api.themoviedb.org/3/trending/movie/day`, {
  params: { api_key: API_KEY }
})
.then(res => {
  console.log("SUCCESS. Movies count:", res.data.results.length);
})
.catch(err => {
  console.error("ERROR:", err.response ? err.response.data : err.message);
});
