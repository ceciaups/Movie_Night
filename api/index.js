//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
// const chatgpt = require("openai");

dotenv.config();
const chatgpt = require("../modules/chatgpt/api");
const tmdb = require("../modules/tmdb/api");

//set up Express app
const app = express();
const port = process.env.PORT || 8000;

//define important folders
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "../public")));

//PAGE ROUTES
app.get("", async (req, res) => {
  let movieList = await tmdb.searchMovie("avengers");
  res.render("index", { title: "Movies", movies: movieList.results });
});

app.get("/testing", (req, res) => {
  res.send("hello world");
});

app.get("/search/:title", async (req, res) => {
  let movieList = await tmdb.searchMovie(req.params.title);
  res.send(movieList);
});
app.get("/movie/:id", async (req, res) => {
  let movie = await tmdb.getMovieById(req.params.id);
  res.send(movie);
});
app.get("/genrelist", async (req, res) => {
  let genreList = await tmdb.getGenreList();
  res.send(genreList);
});
app.get("/movienight/:title1/:title2", async (req, res) => {
  let movieList = await chatgpt.chatCompletion(req.params.title1, req.params.title2);
  res.send(movieList);
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

module.exports = app;