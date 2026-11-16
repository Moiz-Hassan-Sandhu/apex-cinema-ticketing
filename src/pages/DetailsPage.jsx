import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMovieById, fetchShowtimeSeats } from '../services/api.js';
import { useBooking } from '../context/BookingContext.jsx';
import { SeatMap } from '../components/SeatMap.jsx';
import { MAX_SEATS_PER_BOOKING } from '../rules/bookingRules.js';

export function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [hallSeats, setHallSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    selectedMovie,
    setSelectedMovie,
    selectedShowtime,
    setSelectedShowtime,
    selectedSeats,
    clearSeats,
    pricing,
    verifySeatAvailability
  } = useBooking();

  // Load movie data by ID
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchMovieById(id)
      .then(data => {
        if (isMounted) {
          setMovie(data);
          setSelectedMovie(data);
          // Default to first showtime if not set
          const initialShow = data.showtimes[0];
          setSelectedShowtime(initialShow);

          // Fetch seats for this showtime
          return fetchShowtimeSeats(data.id, initialShow.id);
        }
      })
      .then(seats => {
        if (isMounted && seats) {
          setHallSeats(seats);
          verifySeatAvailability(seats);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message || 'Movie details could not be retrieved.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, setSelectedMovie, setSelectedShowtime, verifySeatAvailability]);

  // Handle changing showtime
  const handleShowtimeSelect = async (showtime) => {
    setSelectedShowtime(showtime);
    clearSeats(); // Clear seats when switching showtime
    try {
      const seats = await fetchShowtimeSeats(movie.id, showtime.id);
      setHallSeats(seats);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="state-box" aria-live="polite">
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎞️</div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Loading Movie Details &amp; Auditorium Map...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Connecting to auditorium seating controller for movie ID "{id}".</p>
      </div>
    );
  }

  // Parameterized Route Fallback (FR02)
  if (error || !movie) {
    return (
      <div className="state-box" role="alert">
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❓</div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>Screening Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
          We could not find any active movie screening matching reference <strong>"{id}"</strong>. It may have concluded its theatrical run.
        </p>
        <Link to="/" className="btn btn-primary">
          &larr; Return to Movie Schedule
        </Link>
      </div>
    );
  }

  return (
    <article aria-labelledby="details-title" className="details-page-wrapper">
      <Link to="/" className="btn btn-outline back-schedule-btn">
        &larr; Back to Movie Schedule
      </Link>

      <div className="details-hero-layout">
        {/* Left: Poster */}
        <div className="details-poster-box">
          <img
            src={movie.poster}
            alt={movie.title}
            className="details-poster-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Right: Film Specifications & Notices */}
        <div className="details-info-box">
          <div className="details-badges-row">
            <span className={`badge-age ${movie.rating === '18+' ? 'adult' : movie.rating === 'PG-13' ? 'teen' : 'all'}`}>
              {movie.rating}
            </span>
            <span className="badge-format">{movie.format}</span>
            <span className="badge-genre-tag">
              {movie.genre}
            </span>
          </div>

          <h1 id="details-title" className="details-film-title">
            {movie.title}
          </h1>

          <div className="details-specs-bar">
            <span>⏱️ {movie.runtime}</span>
            <span>⭐ {movie.imdbRating} / 10 ({movie.reviewsCount} reviews)</span>
            <span>🗣️ {movie.language}</span>
          </div>

          <p className="details-synopsis">
            {movie.synopsis}
          </p>

          <div className="details-credits">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          </div>

          {/* Operating Rule 2 Advisory */}
          {movie.rating === '18+' && (
            <div className="notice-advisory notice-advisory-adult" role="note">
              <strong>🔞 Operating Rule 2 (Adult Film Restriction):</strong>
              This screening is classified 18+. All attendees must be 18 years or older. You will be required to confirm attendee age eligibility at checkout.
            </div>
          )}

          {/* Operating Rule 1 Notice */}
          <div className="notice-advisory notice-advisory-capacity" role="note">
            <strong>Operating Rule 1 (Fair Capacity Allocation):</strong>
            To prevent ticket scalping, each transaction is restricted to a maximum of <strong>{MAX_SEATS_PER_BOOKING} seats</strong>.
          </div>

          {/* Showtime Selection */}
          <div className="details-showtimes-section">
            <h3 className="section-subtitle">
              Select Showtime Today:
            </h3>
            <div className="showtimes-selector-grid">
              {movie.showtimes.map(st => {
                const isSelected = selectedShowtime?.id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleShowtimeSelect(st)}
                    className={`showtime-select-btn ${isSelected ? 'active' : ''}`}
                  >
                    <div className="showtime-time">{st.time}</div>
                    <div className="showtime-hall">{st.hall}</div>
                    {st.isMatinee && (
                      <span className="matinee-tag">
                        ★ Matinee (PKR 250 OFF)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seating Map (FR07) */}
      <div className="seating-step-header">
        <h3 className="seating-step-title">
          Step 4: Select Your Seats ({selectedSeats.length} / {MAX_SEATS_PER_BOOKING} Selected)
        </h3>
        <p className="seating-step-desc">
          Click any available seat below to lock your reservation. Standard seats are rows A-D; luxury VIP leather recliners are rows E-F (+PKR 200).
        </p>
      </div>

      <SeatMap hallSeats={hallSeats} />

      {/* Sticky Bottom Action Bar for Easy Mobile/Desktop Proceeding */}
      <div className="sticky-booking-bar">
        <div>
          <div className="booking-bar-seats">
            Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}</strong>
          </div>
          <div className="booking-bar-total">
            Total: PKR {pricing.grandTotal.toLocaleString()}
            {pricing.isMatinee && selectedSeats.length > 0 && (
              <span className="booking-bar-savings">
                (Includes PKR {pricing.matineeDiscountTotal} Matinee Savings)
              </span>
            )}
          </div>
        </div>

        <div className="booking-bar-actions">
          {selectedSeats.length > 0 && (
            <button type="button" className="btn btn-outline" onClick={clearSeats}>
              Clear Seats
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-proceed-checkout"
            disabled={selectedSeats.length === 0}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Attendee Details &rarr;
          </button>
        </div>
      </div>
    </article>
  );
}
