const tmdb = "https://api.themoviedb.org/3";
const key = `api_key=${process.env.TMBD_KEY}`;

async function searchMovie(title) {
  let reqUrl = `${tmdb}/search/movie?${key}&query=${title}`;

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
  let reqUrl = `${tmdb}/movie/${id}?${key}`;

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

async function getGenreList() {
  let reqUrl = `${tmdb}/genre/movie/list?${key}`;

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
  getMovieById,
  getGenreList
};