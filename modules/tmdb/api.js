const tmdb = "https://api.themoviedb.org/3";
const api = `api_key=${process.env.TMBD_KEY}`;

async function searchMovie(title) {
  let reqUrl = `${tmdb}/search/movie?${api}&query=${title}`;

  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  
  return await response.json();
}

async function getMovieById(id) {
  let reqUrl = `${tmdb}/movie/${id}?${api}`;

  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  
  return await response.json();
}

module.exports = {
  searchMovie,
  getMovieById
};