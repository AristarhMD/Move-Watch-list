const mainWatchlistEl = document.querySelector(".watchlist-main");

window.onload = getFromStorage();

function getFromStorage() {
  const storageData = JSON.parse(localStorage.getItem("watchlist"));

  if (!storageData || storageData.length === 0) {
    return (mainWatchlistEl.innerHTML = `
        <div class="watchlist-container">
          <p>Your watchlist is looking a little empty...</p>
          <button class="to-search-page-btn">
            <a class="watchlist-link" href="index.html">
              <i class="fa-solid fa-circle-plus"></i>
              Let’s add some movies!
            </a>
          </button>
        </div>
      `);
  }

  const generatedMarkUp = storageData
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
                        <button class="remove-from-watchlist" 
                                data-movie-id=${movie.id}>
                            <span>
                            <i class="fa-solid fa-circle-minus"></i>
                            </span>
                            Remove
                        </button>
                    </div>
                    <div class="movie-details-description">
                      <p class="less-text">
                      ${movie.overview.slice(0, 130)}
                      ${btn}
                      <p class="more-text hidden">${movie.overview}
                      <button class="read-less description-btn">Read Less</button>
                      </p>
                      <span class="more-text hidden">${movie.overview.slice(
                        130
                      )} 
                      
                      </span>
                      </p>
                      
                    </div>
                </div>
            </div>`;
    })
    .join("");

  mainWatchlistEl.innerHTML = generatedMarkUp;
}

mainWatchlistEl.addEventListener("click", (e) => {
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

  if (e.target.classList[0] === "remove-from-watchlist") {
    removeFromStorage(e);
  }
});

function removeFromStorage(e) {
  const targetId = Number(e.target.dataset.movieId);

  const initialStorage = JSON.parse(localStorage.getItem("watchlist")) || [];
  const updatedWatchlist = initialStorage.filter(
    (movie) => movie.id !== targetId
  );

  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  getFromStorage();
}
