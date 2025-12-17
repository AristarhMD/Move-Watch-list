const formEl = document.querySelector(".form-container");
const mainEl = document.querySelector("main");
const api_key = ProcessingInstruction.env.API_KEY;

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

mainEl.addEventListener("click", (e) => {
  if (e.target.classList[0] === "read-more") {
    e.target.parentNode.classList.toggle("hidden");

    e.target.parentNode.parentNode
      .querySelector(".more-text")
      .classList.toggle("hidden");
  }

  if (e.target.classList[0] === "read-less") {
    e.target.parentNode.classList.toggle("hidden");

    e.target.parentNode.parentNode
      .querySelector(".less-text")
      .classList.toggle("hidden");
  }

  if (e.target.classList[0] === "add-to-watchlist") {
    addToStorage(e);
  }
});

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputValue = document.querySelector("#movie-search").value;

  const movieData = await getMovie(inputValue);

  const markUpForMovie = await generateMarkUp(movieData);

  mainEl.innerHTML = markUpForMovie;
});

async function getMovie(movie) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&api_key=${api_key}`
    );
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.log(err);
  }
}

async function generateMarkUp(movie) {
  const movieWithGenre = getGenreDescription(movie);
  const moviesWithDuration = await getDurationMovie(movieWithGenre);

  const generatedMarkUp = moviesWithDuration
    .map((movie) => {
      const btn =
        movie.overview.length <= 130
          ? ""
          : `<button class="read-more description-btn"> ...Read More</button>`;

      return `
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
                  ${movie.vote_average.toFixed(1)}
              </span>
              </h3>
              <div class="duration-and-genre">
                  <p class="duration">${movie.duration} min</p>
                  <p class="genre">${movie.genre}</p>
                  <button class="add-to-watchlist" data-movie-id=${movie.id}>
                      <span>
                      <i class="fa-solid fa-circle-plus"></i>
                      </span>
                      Watchlist
                  </button>
              </div>
              <div class="movie-details-description">
                <p class="less-text">
                ${movie.overview.slice(0, 130)}
                ${btn}
                <p class="more-text hidden">${movie.overview}
                <button class="read-less description-btn">Read Less</button>
                </p>
                <span class="more-text hidden">${movie.overview.slice(130)} 
                
                </span>
                </p>
                
              </div>
          </div>
      </div>`;
    })
    .join("");

  return generatedMarkUp;
}

async function getDurationMovie(movies) {
  const movieWithDuration = await Promise.all(
    movies.map(async (movie) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}`
        );
        const data = await res.json();
        return { ...movie, duration: data.runtime };
      } catch (err) {
        console.error(err);
      }
    })
  );
  return movieWithDuration;
}

function getGenreDescription(movies) {
  const moviesWithGenres = movies.map((movie) => {
    const movieGenre = allGenres
      .filter((genres) => movie.genre_ids.includes(genres.id))
      .map((objGenre) => objGenre.name)
      .join(", ");
    return { ...movie, genre: movieGenre };
  });

  return moviesWithGenres;
}

async function addToStorage(e) {
  const id = e.target.dataset.movieId;

  let initialStorage = JSON.parse(localStorage.getItem("watchlist")) || [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
    );
    const data = await res.json();

    const genre = data.genres.map((genreObj) => genreObj.name).join(", ");
    const movieData = {
      ...data,
      duration: data.runtime,
      genre: genre,
    };

    initialStorage.push(movieData);

    localStorage.setItem("watchlist", JSON.stringify(initialStorage));
  } catch (err) {
    console.error(err);
  }
}
