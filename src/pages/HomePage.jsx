import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../services/api.js';
import { MovieFilters } from '../components/MovieFilters.jsx';
import { MovieCard } from '../components/MovieCard.jsx';
import { useBooking } from '../context/BookingContext.jsx';

export function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const selectedGenre = searchParams.get('genre') || 'All Genres';
  const selectedFormat = searchParams.get('format') || 'All Formats';
  const selectedAgeRating = searchParams.get('rating') || 'All Ratings';
  const sortBy = searchParams.get('sort') || 'featured';

  const { seatConflicts, removeConflictingSeats } = useBooking();

  // Async mock loader (FR14)
  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      setError(err.message || 'Unable to load movie schedule from box office.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // URL Query Sync Helpers (Decision 1 & State Management)
  const updateQuery = (key, val, defaultVal) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === defaultVal) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (val) => updateQuery('q', val, '');
  const handleGenreChange = (val) => updateQuery('genre', val, 'All Genres');
  const handleFormatChange = (val) => updateQuery('format', val, 'All Formats');
  const handleAgeChange = (val) => updateQuery('rating', val, 'All Ratings');
  const handleSortChange = (val) => updateQuery('sort', val, 'featured');

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Filter & Sort Logic (FR04, FR05)
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    // 1. Text Search across title, director, cast
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.cast.some(actor => actor.toLowerCase().includes(q))
      );
    }

    // 2. Genre Filter
    if (selectedGenre !== 'All Genres') {
      result = result.filter(m => m.genre === selectedGenre);
    }

    // 3. Format Filter
    if (selectedFormat !== 'All Formats') {
      result = result.filter(m => m.format === selectedFormat);
    }

    // 4. Age Rating Filter
    if (selectedAgeRating !== 'All Ratings') {
      result = result.filter(m => {
        if (selectedAgeRating === '18+' || selectedAgeRating === '18+ Adults Only') {
          return m.rating === '18+';
        }
        if (selectedAgeRating === 'PG-13' || selectedAgeRating === 'Teens (PG-13)') {
          return m.rating === 'PG-13';
        }
        if (selectedAgeRating === 'PG' || selectedAgeRating === 'Family (PG)') {
          return m.rating === 'PG';
        }
        return m.rating === selectedAgeRating;
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating-desc') return b.imdbRating - a.imdbRating;
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'runtime-desc') return b.runtime.localeCompare(a.runtime);
      return 0;
    });

    return result;
  }, [movies, searchQuery, selectedGenre, selectedFormat, selectedAgeRating, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-cinema" aria-labelledby="hero-title">
        <span className="hero-tagline">Premium Boutique Cinema Experience</span>
        <h2 id="hero-title" className="hero-title">
          The Ultimate Screenings in Islamabad &amp; Rawalpindi.
        </h2>
        <p className="hero-desc">
          Featuring IMAX 70mm, 64-channel Dolby Atmos, and luxury VIP recliner lounges.
          Experience 100% upfront pricing with zero hidden surcharges and transparent seat hold reservations.
        </p>
      </section>

      {/* Task 6.1 Conflict Banner */}
      {seatConflicts.length > 0 && (
        <section className="state-box" role="alert" style={{ borderColor: 'var(--accent-crimson)', padding: '20px' }}>
          <h3 style={{ color: 'var(--accent-crimson)', marginBottom: '8px' }}>
            ⚠️ Seat Availability Conflict Detected
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            One or more of your held seats have been acquired in kitchen inventory/box-office:
          </p>
          <ul style={{ listStyle: 'none', marginBottom: '16px' }}>
            {seatConflicts.map(c => (
              <li key={c.seatId} style={{ color: '#fca5a5', fontWeight: 600 }}>
                {c.reason}
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-danger" onClick={removeConflictingSeats}>
            Remove Conflicted Seats &amp; Reselect
          </button>
        </section>
      )}

      {/* Loading State (FR14) */}
      {loading && (
        <div className="state-box" aria-live="polite">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎬</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Connecting to Box Office Schedule...</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Retrieving movie screening showtimes, formats, and auditorium seating charts.</p>
        </div>
      )}

      {/* Error State with Retry Button (FR14) */}
      {!loading && error && (
        <div className="state-box" role="alert" style={{ borderColor: 'var(--accent-crimson)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ color: 'var(--accent-crimson)', fontSize: '1.3rem', marginBottom: '8px' }}>
            Box Office Connection Failed
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadCatalog}>
            🔄 Retry Connection
          </button>
        </div>
      )}

      {/* Loaded Movies Grid */}
      {!loading && !error && (
        <>
          <MovieFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
            selectedAgeRating={selectedAgeRating}
            onAgeRatingChange={handleAgeChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
            totalResultsCount={filteredAndSortedMovies.length}
          />

          {/* Empty Filter State (FR15) */}
          {filteredAndSortedMovies.length === 0 ? (
            <div className="state-box">
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Matching Movie Screenings Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
                We couldn't find any films matching "{searchQuery || selectedGenre || selectedFormat}".
                Try clearing your filters or selecting another genre category.
              </p>
              <button type="button" className="btn btn-outline" onClick={handleResetFilters}>
                Clear All Search Filters
              </button>
            </div>
          ) : (
            <div className="movies-grid" role="region" aria-label="Movies Catalog">
              {filteredAndSortedMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
