// http://www.omdbapi.com/?apikey=a7323cd&t=${input_info}

const formEl = document.querySelector(".form-container");
const mainEl = document.querySelector("main");

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.querySelector("#movie-search").value;

  const movieData = await getMovie(inputValue);

  const markUpForMovie = await generateMarkUp(movieData);

  console.log(movieData);

  mainEl.innerHTML = markUpForMovie;
});

async function getMovie(movie) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${movie}`,
    options
  );
  const data = await res.json();
  return data;
}

async function generateMarkUp(movie) {
  const allGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
  const firstFive = await movie.results.slice(0, 5);
  const generatedMarkUp = await firstFive
    .map(
      (movie) => `
        <div class="movie">
            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="Poster of the ${movie.title}"
                class="movie-poster"
            />
            <div class="movie-details">
                <h3 class="general-title">
                ${movie.title}
                <span class="general-star">
                    <i class="fa-solid fa-star" style="color: #ffd43b"></i>
                    ${movie.vote_average}
                </span>
                </h3>

                <div class="duration-and-genre">
                    <p class="duration">${movie.id}</p>
                    <p class="genre">${movie.genre_ids.join(",")}</p>
                    <button class="add-to-watchlist">
                        <span>
                        <i class="fa-solid fa-circle-plus"></i>
                        </span>
                        Watchlist
                    </button>
                </div>
                <p class="movie-description">${movie.overview}</p>
            </div>
        </div>`
    )
    .join("");

  return generatedMarkUp;
}
