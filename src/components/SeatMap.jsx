import React from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { MAX_SEATS_PER_BOOKING } from '../rules/bookingRules.js';

export function SeatMap({ hallSeats = [] }) {
  const { selectedSeats, toggleSeat, showNotification } = useBooking();

  // Group seats by row letter ('A', 'B', 'C', 'D', 'E', 'F')
  const rowsMap = hallSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(rowsMap).sort();

  const handleSeatClick = (seat) => {
    if (seat.isReserved) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (!isSelected && selectedSeats.length >= MAX_SEATS_PER_BOOKING) {
      showNotification(`Maximum ${MAX_SEATS_PER_BOOKING} seats allowed per transaction.`, 'error');
      return;
    }

    toggleSeat(seat);
  };

  return (
    <section className="seat-map-wrapper" aria-label="Auditorium Seating Plan">
      {/* Visual Curved Cinema Screen */}
      <div className="cinema-screen-curve" aria-hidden="true" />
      <div className="cinema-screen-text">All Eyes This Way • Cinema Screen</div>

      {/* Rows Grid */}
      <div className="seats-grid" role="group" aria-label="Seat Selection Grid">
        {rows.map(rowLetter => (
          <div key={rowLetter} className="seat-row">
            <span className="row-label" aria-hidden="true">{rowLetter}</span>

            <div className="seat-buttons-row">
              {rowsMap[rowLetter].map(seat => {
                const isSelected = selectedSeats.some(s => s.id === seat.id);
                const isVip = seat.tier.includes('VIP');
                return (
                  <React.Fragment key={seat.id}>
                    <button
                      type="button"
                      className={`seat-btn ${isVip ? 'vip' : ''} ${isSelected ? 'selected' : ''} ${seat.isReserved ? 'reserved' : ''}`}
                      disabled={seat.isReserved}
                      onClick={() => handleSeatClick(seat)}
                      aria-label={`Seat ${seat.id}, ${seat.tier}, PKR ${seat.price}${seat.isReserved ? ', reserved' : ''}${isSelected ? ', selected' : ''}`}
                      aria-pressed={isSelected}
                      title={`Seat ${seat.id} (${seat.tier}) - PKR ${seat.price}`}
                    >
                      <span className="seat-icon-cushion" aria-hidden="true" />
                      <span className="seat-num">{seat.number}</span>
                    </button>
                    {/* Architectural Center Aisle Gap between Seat 4 and 5 */}
                    {seat.number === 4 && <div className="seat-center-aisle" aria-hidden="true">AISLE</div>}
                  </React.Fragment>
                );
              })}
            </div>

            <span className="row-label" aria-hidden="true">{rowLetter}</span>
          </div>
        ))}
      </div>

      {/* Accessible Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-color)' }} />
          <span>Available (Standard)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'var(--bg-surface-raised)', border: '1px solid #a855f7' }} />
          <span>VIP Recliner (+PKR 200)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'var(--accent-gold)' }} />
          <span>Your Selected Seat</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#1e293b' }} />
          <span>Reserved / Unavailable</span>
        </div>
      </div>
    </section>
  );
}
