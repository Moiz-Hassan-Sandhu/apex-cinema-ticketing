import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function MovieCard({ movie }) {
  const [imgSrc, setImgSrc] = useState(movie.poster);

  const getAgeClass = (rating) => {
    if (rating === '18+') return 'adult';
    if (rating === 'PG-13') return 'teen';
    return 'all';
  };

  const handleImgError = () => {
    setImgSrc('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80');
  };

  return (
    <article className="movie-card" aria-labelledby={`movie-${movie.id}`}>
      <div className="movie-poster-box">
        <img
          src={imgSrc}
          alt={`Poster for ${movie.title}`}
          className="movie-poster-img"
          loading="lazy"
          onError={handleImgError}
        />
        <div className="poster-scrim" aria-hidden="true" />
        <div className="poster-top-badges">
          {/* Decision 3 Solution: Explicit Age Rating & Format Badges on Cards */}
          <span className={`badge-age ${getAgeClass(movie.rating)}`}>
            {movie.rating}
          </span>
          <span className="badge-format">
            {movie.format}
          </span>
        </div>
      </div>

      <div className="movie-card-content">
        <div className="movie-card-header">
          <div>
            <h3 id={`movie-${movie.id}`} className="movie-card-title">
              <Link to={`/movies/${movie.id}`} className="movie-title-link">
                {movie.title}
              </Link>
            </h3>
            <span className="movie-card-director">Dir. {movie.director}</span>
          </div>
          <div className="price-tag-group">
            <span className="movie-card-price">
              PKR {movie.basePrice.toLocaleString()}
            </span>
            <span className="price-upfront-note">Upfront Total</span>
          </div>
        </div>

        {/* Decision 3 Solution: Visible Runtime & Genre Tags */}
        <div className="movie-specs-row">
          <span>⏱️ {movie.runtime}</span>
          <span>⭐ {movie.imdbRating} ({movie.reviewsCount})</span>
          <span>🎭 {movie.genre}</span>
        </div>

        <p className="movie-synopsis">{movie.synopsis}</p>

        <div className="movie-card-actions">
          <span className="showtimes-count-pill">
            {movie.showtimes.length} showtimes today
          </span>
          <Link to={`/movies/${movie.id}`} className="btn btn-primary btn-select-seats">
            Select Seats &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
