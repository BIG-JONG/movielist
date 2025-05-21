const movieTitleInput = document.getElementById('movie-title-input');
const searchButton = document.getElementById('search-button');
const moviesListContainer = document.getElementById('movies-list');

const movieDetailModal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
const modalTitle = document.getElementById('movieDetailModalLabel');
const modalPoster = document.getElementById('modalPoster');
const modalRating = document.getElementById('modalRating');
const modalOverview = document.getElementById('modalOverview');
const modalReleaseDate = document.getElementById('modalReleaseDate');


function displayMovies(movies) {
  moviesListContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    moviesListContainer.innerHTML = '<p class="text-center col-12">검색 결과가 없습니다.</p>';
    return;
  }

  movies.forEach(movie => {


    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    const movieElement = `
      <div class="col movie-card-item">
        <div class="card h-100">
          <img src="${posterUrl}" class="card-img-top poster-image" alt="${movie.title} 포스터">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">
                평점: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </small>
            </p>
            <div class="mt-auto">
                <button type="button" class="btn btn-info btn-sm w-100 view-details-btn" data-movie-id="${movie.id}">
                    More Information
                </button>
            </div>
          </div>
        </div>
      </div>
    `;
    moviesListContainer.innerHTML += movieElement;
  });

  gsap.from(".movie-card-item", {
    opacity: 0,
    y: 50,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
  });

  gsap.from(".poster-image", {
    scale: 0.8,
    opacity: 0,
    delay: 0.3,
    duration: 0.7,
    ease: "back.out(1.7)",
    stagger: {
        each: 0.1,
        from: "random"
    }
  });

  const posterImages = document.querySelectorAll('.poster-image');

  posterImages.forEach(img => {
      img.addEventListener('mouseenter', () => {
          gsap.to(img, {
              scale: 1.05,
              rotationZ: 3,
              duration: 0.3,
              ease: "power1.out"
          });
      });

      img.addEventListener('mouseleave', () => {
          gsap.to(img, {
              scale: 1,
              rotationZ: 0,
              duration: 0.3,
              ease: "power1.out"
          });
      });
  });

  const detailButtons = document.querySelectorAll('.view-details-btn');

  detailButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const movieId = parseInt(event.target.dataset.movieId);
      const movie = movieList.results.find(m => m.id === movieId);

      if (movie) {
        showMovieDetails(movie);
      }
    });
  });
}

function showMovieDetails(movie) {
  modalTitle.textContent = movie.title || '제목 없음';
  modalPoster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';
  modalPoster.alt = movie.title || '영화 포스터';
  modalRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  modalOverview.textContent = movie.overview || '줄거리 정보 없음.';
  modalReleaseDate.textContent = movie.release_date || '개봉일 정보 없음';

  movieDetailModal.show();
}

displayMovies(movieList.results);

function filterAndDisplayMovies(searchTerm) {
    if (searchTerm === '') {
        displayMovies(movieList.results);
        return;
    }
    const filteredMovies = movieList.results.filter(movie => {
        return movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    displayMovies(filteredMovies);
}

searchButton.addEventListener('click', () => {
    const searchTerm = movieTitleInput.value.trim();
    filterAndDisplayMovies(searchTerm);
});

movieTitleInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.click();
    }
});
