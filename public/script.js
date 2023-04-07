window.onload = async function() {

  genreList = (await getGenreList()).genres;

  const input1 = document.getElementById("input-1");
  const input2 = document.getElementById("input-2");

  // Search Enginer
  input1.addEventListener('input', () => { searchMovie("1"); });
  input2.addEventListener('input', () => { searchMovie("2"); });

  // Delete search result if focus out
  input1.addEventListener('focusout', () => { displaySearch("", "1"); });
  input2.addEventListener('focusout', () => { displaySearch("", "2"); });

  input1.addEventListener('mouseover', () => { toggleSearch("1"); });
  input2.addEventListener('mouseover', () => { toggleSearch("2"); });

  input1.addEventListener('mouseout', () => { toggleSearch("1"); });
  input2.addEventListener('mouseout', () => { toggleSearch("2"); });
}

var searchNumber = 10;
var resultNumber = 10;
var genreList = [];

async function searchMovie(user) {
  title = document.getElementById("input-" + user).value.trim().replace(/\s+/g, '+');

  if (title) {
    // Display search result
    var data = await findMovie(title);
    displaySearch(data, user);
  }
  else {
    // Delete search result if no input
    displaySearch("", user);
    return false;
  }

}

function displaySearch(data, user) {

  var search = document.getElementById("search-container");

  // Display search result
  if (data) {
    search.innerHTML = "";
    var count = (data.total_results < searchNumber) ? data.total_results : searchNumber;
    
    if (!count) {
      search.innerHTML = "No movie found!"
    }

    let skip = 0;
    for (var j = 0; j < count; j++) {
      let result = document.createElement("button");
      let poster = document.createElement("img");
      let description = document.createElement("div");

      skip += findNextValidMovie(j + skip, data);
      let i = j + skip;

      if (i < 20) {
        poster.classList.add("search-poster");
        poster.src = "https://image.tmdb.org/t/p/w500/" + data.results[i].poster_path;
        poster.alt = "Poster of " + data.results[i].title;

        description.innerHTML = data.results[i].title + "</br>";
        description.innerHTML += data.results[i].release_date;
  
        result.appendChild(poster);
        result.appendChild(description);
        result.classList.add("search-item");
        result.id = data.results[i].id;
        result.onclick = () => { displaySelect(user, result.id, poster.src) };

        search.appendChild(result);
      }
    }
    search.style.display = "block";
  }
  // Delete search result if no input
  else {
    let input = document.getElementById("input-" + user);
    input.value = "";
    if (!search.matches(":hover")) {
      search.style.display = "none";
    }
  }

}

// Find next valid movie in data which has release date earlier than today, and also poster
function findNextValidMovie(id, data) {
  let found = false;
  let next = -1;

  do {
    next++;
    var currentData = data.results[id + next];
    let currentDate = new Date().toJSON().slice(0, 10);

    if (!currentData) {
      found = true;
    }
    else if (!currentData.release_date) {
    }
    else if (currentData.release_date > currentDate) {
    }
    else if (!currentData.poster_path) {
    }
    else {
      found = true;
    }
  } while (!found);

  return next;
}

// Display selected movie's poster
function displaySelect(user, id, src) {
  let search = document.getElementById("search-container");
  let posterImg = document.getElementById("poster-img-" + user);
  let input = document.getElementById("input-" + user);

  if (!posterImg) {
    let poster = document.getElementById("poster-" + user);
    
    posterImg = document.createElement("img");
    posterImg.classList.add("poster-img-" + user);
    posterImg.id = id;
    posterImg.src = src;
    posterImg.style.width = "100%";
    posterImg.style.height = "100%";
    posterImg.style.objectFit = "cover";

    poster.innerHTML = "";
    poster.style.display = "flex";
    poster.style.alignItems = "center";
    poster.appendChild(posterImg);
  }
  else {
    posterImg.id = id;
    posterImg.src = src;
    posterImg.style.width = "100%";
    posterImg.style.height = "100%";
    posterImg.style.objectFit = "cover";
  }

  input.placeholder = "Choose Again";
  movieNight();

  search.style.display = "none";
}

// movie-item style
function toggleSearch(user) {
  let poster = document.getElementById("poster-" + user);
  let input = document.getElementById("input-" + user);

  input.classList.toggle("hover-input");
  poster.classList.toggle("hover-input");
}

// Generate movie from ChatGPT
async function movieNight() {

  let posterImg1 = document.getElementsByClassName("poster-img-1")[0];
  let posterImg2 = document.getElementsByClassName("poster-img-2")[0];

  if (posterImg1 && posterImg2) {
    // Loading state
    let plus = document.getElementById("plus");
    let message = document.getElementById("message-container");
    let result = document.getElementById("result-container");
    plus.classList.add("rotate");
    message.innerHTML = "Getting 10 movies for tonight...";
    result.innerHTML = "";

    let name1 = (await getMovie(posterImg1.id)).title;
    let name2 = (await getMovie(posterImg2.id)).title;

    var response = await fetch(`/movienight/${name1.replace(/\s+/g, '+')}/${name2.replace(/\s+/g, '+')}`);
    var data = await response.text();
    await displayResult(data);
  
    plus.classList.remove("rotate");
    message.innerHTML = "10 movies for tonight:";
  }
}

// Display resulted movie
async function displayResult(data) {
  let delimiter = /\d+\.\s/;
  let movies = data.split(delimiter);
  movies.shift();

  let result = document.getElementById("result-container");

  for (var i = 0; i < resultNumber; i++) {
    let movie = movies[i].trim().replace(/\s+/g, '+');
    if (movie[movie.length - 1] === ".") {
      movie = movie.slice(0, -1);
    }
    let iData = await findMovie(movie);

    if (iData) {
      let result = document.getElementById("result-container");
      if (iData.total_results) {
        let resultMovie = document.createElement("div");
        let poster = document.createElement("img");
        let description = document.createElement("div");

        poster.classList.add("result-poster");
        poster.src = "https://image.tmdb.org/t/p/w500/" + iData.results[0].poster_path;
        poster.alt = "Poster of " + iData.results[0].title;

        let title = document.createElement("h3");
        title.innerHTML = iData.results[0].title + " (" + iData.results[0].release_date + ")";
        description.appendChild(title);

        let rating = document.createElement("p");
        rating.innerHTML = Math.round(iData.results[0].vote_average * 100) / 100 + "/10.00";
        description.appendChild(rating);

        let overview = document.createElement("p");
        overview.innerHTML = iData.results[0].overview;
        description.appendChild(overview);

        let genre = document.createElement("p");
        for (let j = 0; j < iData.results[0].genre_ids.length; j++) {
          if (j) {
            genre.innerHTML += " | ";
          }
          for (let k = 0; k < genreList.length; k++) {
            if (iData.results[0].genre_ids[j] == genreList[k].id) {
              genre.innerHTML += genreList[k].name;
            }
          }
        }
        description.appendChild(genre);
        description.classList.add("result-desciption");
  
        resultMovie.appendChild(poster);
        resultMovie.appendChild(description);
        resultMovie.classList.add("result-item");
        resultMovie.classList.add("result-item-" + (i % 2 + 1));
        resultMovie.id = iData.results[0].id;

        result.appendChild(resultMovie);
      }
    }
  }

  result.style.display = "block";
}

async function findMovie(title) {
  var response = await fetch(`/search/${title}`);
  return await response.json();
}

async function getMovie(id) {
  var response = await fetch(`/movie/${id}`);
  return await response.json();
}

async function getGenreList() {
  var response = await fetch(`/genrelist`);
  return await response.json();
}
