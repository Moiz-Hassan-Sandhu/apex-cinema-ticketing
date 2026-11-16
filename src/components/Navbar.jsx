import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';

export function Navbar() {
  const { selectedSeats, pricing, selectedMovie } = useBooking();

  return (
    <header className="site-header">
      {/* Upfront Price Transparency Banner (Problem 1 & Decision 1 UX Solution) */}
      <div className="price-transparency-banner" role="status">
        {selectedSeats.length === 0 ? (
          <span>
            🎟️ <strong>Apex Cinema Islamabad</strong> — Zero hidden surcharges • Early Matinee shows (before 4 PM) get <strong>PKR 250 OFF</strong> per ticket • Book 4+ seats for <strong>FREE Facility Charges</strong>
          </span>
        ) : pricing.qualifiesForFreeFacilityFee ? (
          <span>
            🎉 <strong>Group Booking Perk Unlocked!</strong> Digital facility charges waived (<strong>PKR 0 fee</strong>) for your {pricing.seatCount} seats.
          </span>
        ) : (
          <span>
            ℹ️ <strong>Transparent Pricing:</strong> {pricing.seatCount} seat{pricing.seatCount > 1 ? 's' : ''} selected • Add <strong>{pricing.seatsNeededForFreeFacility} more seat{pricing.seatsNeededForFreeFacility > 1 ? 's' : ''}</strong> to waive digital facility fees!
          </span>
        )}
      </div>

      <nav className="header-inner" aria-label="Primary Navigation">
        <Link to="/" className="brand-link" aria-label="Apex Cinema Lounge Homepage">
          <div className="brand-logo-icon">▲</div>
          <div className="brand-text">
            <h1>Apex Cinema Lounge</h1>
            <p className="brand-subtext">Centaurus &amp; F-8 • Islamabad</p>
          </div>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              end
            >
              Now Showing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rules"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              Operating Rules
            </NavLink>
          </li>
          <li>
            <Link
              to="/checkout"
              className="cart-pill"
              aria-label={`Reservation with ${selectedSeats.length} seats selected`}
            >
              <span>Seats: {selectedSeats.length}</span>
              {selectedSeats.length > 0 && (
                <span>• PKR {pricing.grandTotal.toLocaleString()}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
