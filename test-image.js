import axios from 'axios';

axios.get(`https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4v6EDv85R.jpg`, { responseType: 'arraybuffer' })
.then(res => {
  console.log("SUCCESS using image.tmdb.org! Bytes:", res.data.length);
})
.catch(err => {
  console.error("ERROR image.tmdb.org:", err.message);
});
