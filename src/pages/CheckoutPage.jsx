import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { TimerWarningModal } from '../components/TimerWarningModal.jsx';
import { recordBookedSeats, fetchShowtimeSeats } from '../services/api.js';

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    toggleSeat,
    clearSeats,
    pricing,
    ageCheck,
    attendeeInfo,
    setAttendeeInfo,
    timerSeconds,
    isTimerRunning,
    extendTimer,
    resetBookingAfterOrder,
    seatConflicts,
    removeConflictingSeats,
    verifySeatAvailability
  } = useBooking();

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-verify seat availability on mount (Task 6.1 Conflict Recovery)
  useEffect(() => {
    if (selectedMovie && selectedShowtime) {
      fetchShowtimeSeats(selectedMovie.id, selectedShowtime.id)
        .then(seats => verifySeatAvailability(seats))
        .catch(console.error);
    }
  }, [selectedMovie, selectedShowtime, verifySeatAvailability]);

  // Field validation preserving valid input (FR10, Decision 3)
  const validateField = (name, value, allValues) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Attendee full name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 letters.';
        if (!/^[a-zA-Z\s.'-]+$/.test(value)) return 'Name can only contain alphabetic characters and spaces.';
        return null;

      case 'phone':
        if (!value.trim()) return 'Mobile number is required.';
        const clean = value.replace(/[\s-]/g, '');
        if (!/^03\d{9}$/.test(clean)) {
          return 'Enter a valid 11-digit mobile number (e.g. 03001234567).';
        }
        return null;

      case 'email':
        if (!value.trim()) return 'Email address is required for digital ticket dispatch.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Enter a valid email address (e.g. name@example.com).';
        }
        return null;

      case 'confirmedAge':
        if (selectedMovie?.rating === '18+' && !value) {
          return 'You must confirm that all attendees are at least 18 years old.';
        }
        return null;

      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setAttendeeInfo(prev => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const err = validateField(name, val, { ...attendeeInfo, [name]: val });
      setFormErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, val, attendeeInfo);
    setFormErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) return;

    // Validate all fields
    const errors = {
      fullName: validateField('fullName', attendeeInfo.fullName, attendeeInfo),
      phone: validateField('phone', attendeeInfo.phone, attendeeInfo),
      email: validateField('email', attendeeInfo.email, attendeeInfo),
      confirmedAge: validateField('confirmedAge', attendeeInfo.confirmedAge, attendeeInfo)
    };

    setFormErrors(errors);
    setTouched({ fullName: true, phone: true, email: true, confirmedAge: true });

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    // Operating Rule 2 check
    if (!ageCheck.isEligible) return;

    setIsSubmitting(true);

    // Record seats permanently so they appear reserved/unavailable if user returns
    recordBookedSeats(selectedMovie.id, selectedShowtime.id, selectedSeats.map(s => s.id));

    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const receipt = {
      bookingId,
      movie: selectedMovie,
      showtime: selectedShowtime,
      seats: [...selectedSeats],
      attendee: attendeeInfo,
      pricing,
      bookedAt: new Date().toISOString()
    };

    sessionStorage.setItem('apex_cinema_last_booking', JSON.stringify(receipt));

    setTimeout(() => {
      resetBookingAfterOrder();
      setIsSubmitting(false);
      navigate(`/confirmation/${bookingId}`);
    }, 600);
  };

  // Format time (MM:SS)
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // If no seats selected
  if (selectedSeats.length === 0) {
    return (
      <div className="state-box">
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎟️</div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>No Seats Currently Selected</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
          Your seat hold may have expired or you have not chosen seats yet. Please explore our movie schedule to select an auditorium showtime.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Movie Schedule &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div aria-labelledby="checkout-heading">
      <TimerWarningModal />

      <h1 id="checkout-heading" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
        Complete Ticket Reservation
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Step 5 of 7 in your cinema journey • 100% Upfront transparent pricing
      </p>

      {/* Seat-Hold Timer Indicator (Problem 2 UX Fix) */}
      <aside
        className={`seat-timer-bar ${timerSeconds <= 60 ? 'warning' : ''}`}
        aria-live="polite"
        role="timer"
      >
        <span>
          ⏱️ Seats Locked For You: <strong>{formatTime(timerSeconds)}</strong> remaining
        </span>
        <button
          type="button"
          onClick={extendTimer}
          style={{
            background: 'var(--accent-gold)',
            color: '#000',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          + Add 3 Mins
        </button>
      </aside>

      {/* Task 6.1 Conflict Banner */}
      {seatConflicts.length > 0 && (
        <section className="notice-advisory notice-advisory-adult" role="alert" style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--accent-crimson)', fontSize: '1.2rem', marginBottom: '8px' }}>
            ⚠️ Seat Availability Conflict Detected (Task 6.1)
          </h3>
          <p style={{ marginBottom: '12px' }}>
            One or more of your held seats have just been reserved by another customer at the box office:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
            {seatConflicts.map(c => (
              <li key={c.seatId} style={{ fontWeight: 700, color: '#fca5a5' }}>
                {c.reason}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              removeConflictingSeats();
              if (selectedMovie) navigate(`/movies/${selectedMovie.id}`);
            }}
          >
            Remove Conflicted Seats &amp; Pick Alternatives &rarr;
          </button>
        </section>
      )}

      <div className="checkout-grid">
        {/* Left Column: Form & Reserved Seats */}
        <div>
          {/* Reserved Seats Capsule */}
          <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px', marginBottom: '24px' }} aria-label="Reserved Seats List">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {selectedMovie?.title} ({selectedSeats.length} Seats)
              </h3>
              <button
                type="button"
                onClick={clearSeats}
                style={{ background: 'none', border: 'none', color: 'var(--accent-crimson)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Clear Selection
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {selectedSeats.map(seat => (
                <span
                  key={seat.id}
                  style={{
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--accent-gold)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {seat.id} ({seat.tier}) • PKR {seat.price}
                  <button
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                    aria-label={`Remove seat ${seat.id}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Auditorium: {selectedShowtime?.hall} • Showtime: {selectedShowtime?.time}
            </p>
          </section>

          {/* Controlled Attendee Form (FR09, FR10) */}
          <section className="form-panel" aria-label="Attendee Contact and Details">
            <h3 className="form-title">Attendee Details for Digital Ticket Dispatch</h3>

            <form onSubmit={handleSubmitBooking} noValidate>
              {/* Field 1: Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Primary Contact Full Name <span className="required-mark">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-control ${touched.fullName && formErrors.fullName ? 'has-error' : ''}`}
                  placeholder="e.g., Moiz Hassan"
                  value={attendeeInfo.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.fullName && Boolean(formErrors.fullName)}
                  aria-describedby={formErrors.fullName ? 'fullName-err' : undefined}
                  required
                />
                {touched.fullName && formErrors.fullName && (
                  <span id="fullName-err" className="error-text" role="alert">
                    {formErrors.fullName}
                  </span>
                )}
              </div>

              {/* Field 2: Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Pakistani Mobile Number <span className="required-mark">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-control ${touched.phone && formErrors.phone ? 'has-error' : ''}`}
                  placeholder="03001234567"
                  value={attendeeInfo.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.phone && Boolean(formErrors.phone)}
                  aria-describedby={formErrors.phone ? 'phone-err' : undefined}
                  required
                />
                {touched.phone && formErrors.phone && (
                  <span id="phone-err" className="error-text" role="alert">
                    {formErrors.phone}
                  </span>
                )}
              </div>

              {/* Field 3: Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address for QR e-Tickets <span className="required-mark">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${touched.email && formErrors.email ? 'has-error' : ''}`}
                  placeholder="e.g. moiz@example.com"
                  value={attendeeInfo.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.email && Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? 'email-err' : undefined}
                  required
                />
                {touched.email && formErrors.email && (
                  <span id="email-err" className="error-text" role="alert">
                    {formErrors.email}
                  </span>
                )}
              </div>

              {/* Ticket Concession Type */}
              <div className="form-group">
                <label htmlFor="ticketType" className="form-label">
                  Ticket Concession Type
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  className="form-control"
                  value={attendeeInfo.ticketType}
                  onChange={handleInputChange}
                >
                  <option value="standard">Standard General Admission</option>
                  <option value="student">Student Pass (Student Card Required)</option>
                  <option value="child_concession">Child / Family Concession (Under 12)</option>
                </select>
              </div>

              {/* Operating Rule 2: 18+ Age Declaration Checkbox */}
              {selectedMovie?.rating === '18+' && (
                <div style={{ background: 'var(--accent-crimson-bg)', border: '1px solid var(--accent-crimson)', padding: '14px', borderRadius: '8px', marginBottom: '18px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', color: '#fca5a5' }}>
                    <input
                      type="checkbox"
                      name="confirmedAge"
                      checked={attendeeInfo.confirmedAge}
                      onChange={handleInputChange}
                      style={{ marginTop: '3px', width: '18px', height: '18px' }}
                    />
                    <span>
                      <strong>Age Verification Declaration:</strong> I confirm that all attendees for this 18+ screening are 18 years of age or older and will carry physical CNIC/ID to the theater.
                    </span>
                  </label>
                  {touched.confirmedAge && formErrors.confirmedAge && (
                    <div className="error-text" style={{ marginTop: '8px' }}>
                      {formErrors.confirmedAge}
                    </div>
                  )}
                  {!ageCheck.isEligible && (
                    <div className="error-text" style={{ marginTop: '8px' }}>
                      ⚠️ {ageCheck.error}
                    </div>
                  )}
                </div>
              )}

              {/* Special Companion Notes */}
              <div className="form-group">
                <label htmlFor="specialNotes" className="form-label">
                  Special Accessibility / Wheelchair Notes (Optional)
                </label>
                <input
                  id="specialNotes"
                  name="specialNotes"
                  type="text"
                  className="form-control"
                  placeholder="e.g., wheelchair aisle access, booster seat requested"
                  value={attendeeInfo.specialNotes}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Upfront Calculated Summary (Decision 1, FR11, FR12) */}
        <aside className="summary-panel" aria-label="Transparent Pricing Summary">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Upfront Price Breakdown
          </h3>

          <div className="summary-row">
            <span>Tickets ({pricing.seatCount} seats):</span>
            <span>PKR {pricing.baseSubtotal.toLocaleString()}</span>
          </div>

          {pricing.isMatinee && (
            <div className="summary-row" style={{ color: 'var(--color-success)' }}>
              <span>Matinee Discount (Before 4 PM):</span>
              <span>- PKR {pricing.matineeDiscountTotal.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Digital Facility &amp; Audio Fee:</span>
            <span>
              {pricing.qualifiesForFreeFacilityFee ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 800 }}>FREE (Group of 4+ Seats)</span>
              ) : (
                `PKR ${pricing.facilityFeeTotal}`
              )}
            </span>
          </div>

          <div className="summary-row total">
            <span>Grand Total:</span>
            <span style={{ color: 'var(--accent-gold)' }}>
              PKR {pricing.grandTotal.toLocaleString()}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
            ✓ 100% Upfront Pricing • Zero unexpected surcharges at checkout
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmitBooking}
            disabled={!pricing.canProceed || !ageCheck.isEligible || isSubmitting || seatConflicts.length > 0}
            style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '1.05rem' }}
          >
            {isSubmitting ? 'Confirming with Box Office...' : seatConflicts.length > 0 ? 'Resolve Seat Conflicts Above' : `Confirm & Reserve • PKR ${pricing.grandTotal.toLocaleString()}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
