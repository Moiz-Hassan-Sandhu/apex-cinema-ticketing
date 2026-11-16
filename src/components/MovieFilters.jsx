import React from 'react';
import { GENRES, FORMATS, AGE_RATINGS } from '../data/moviesData.js';

export function MovieFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedFormat,
  onFormatChange,
  selectedAgeRating,
  onAgeRatingChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResultsCount
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGenre !== 'All Genres' ||
    selectedFormat !== 'All Formats' ||
    selectedAgeRating !== 'All Ratings';

  return (
    <section className="movie-filters-card" aria-label="Movie Search and Filters">
      <div className="filter-search-row">
        <div className="search-input-box">
          <label htmlFor="movie-search">Search Movies, Directors, or Actors</label>
          <input
            id="movie-search"
            type="search"
            className="text-input"
            placeholder="Search by title, Nolan, Villeneuve, Zendaya, Batman..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <label htmlFor="movie-sort" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Sort Screenings
          </label>
          <select
            id="movie-sort"
            className="text-input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="featured">Featured Releases</option>
            <option value="rating-desc">Highest IMDb Rating ⭐</option>
            <option value="price-asc">Ticket Price: Low to High</option>
            <option value="price-desc">Ticket Price: High to Low</option>
            <option value="runtime-desc">Longest Runtime</option>
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="filter-pills-row">
        <span className="pills-label">Genre Category</span>
        <div className="pills-group" role="tablist" aria-label="Filter by genre">
          {GENRES.map(g => (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={selectedGenre === g}
              className={`filter-pill-btn ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => onGenreChange(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Screening Experience / Format Pills */}
      <div className="filter-pills-row">
        <span className="pills-label">Screening Experience</span>
        <div className="pills-group" role="tablist" aria-label="Filter by format">
          {FORMATS.map(f => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={selectedFormat === f}
              className={`filter-pill-btn ${selectedFormat === f ? 'active' : ''}`}
              onClick={() => onFormatChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Age Restriction Classification Pills */}
      <div className="filter-pills-row">
        <span className="pills-label">Age Restriction &amp; Certification</span>
        <div className="pills-group" role="tablist" aria-label="Filter by age rating">
          {AGE_RATINGS.map(r => {
            const isSelected = selectedAgeRating === r;
            const isAdult = r.includes('18+');
            const isTeen = r.includes('PG-13');
            const isFamily = r.includes('PG') && !isTeen;
            return (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`filter-pill-btn pill-rating ${isSelected ? 'active' : ''} ${isAdult ? 'pill-adult' : ''} ${isTeen ? 'pill-teen' : ''} ${isFamily ? 'pill-family' : ''}`}
                onClick={() => onAgeRatingChange(r)}
              >
                {isAdult && <span className="age-dot adult" aria-hidden="true">🔞 </span>}
                {isTeen && <span className="age-dot teen" aria-hidden="true">🟡 </span>}
                {isFamily && <span className="age-dot family" aria-hidden="true">🟢 </span>}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <span>
          Showing <strong>{totalResultsCount}</strong> movie screening{totalResultsCount === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              cursor: 'pointer',
              fontWeight: 700,
              textDecoration: 'underline'
            }}
          >
            Clear All Filters ✕
          </button>
        )}
      </div>
    </section>
  );
}
