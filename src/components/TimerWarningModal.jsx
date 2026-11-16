import React from 'react';
import { useBooking } from '../context/BookingContext.jsx';

export function TimerWarningModal() {
  const { showExtensionModal, setShowExtensionModal, extendTimer, timerSeconds } = useBooking();

  if (!showExtensionModal) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="timer-modal-title">
      <div className="modal-box">
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
        <h3 id="timer-modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
          Seat Reservation Expiring Soon!
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
          You have <strong>{timerSeconds} seconds</strong> remaining before your temporary seat lock is released back to the general audience. Would you like extra time to finish entering your details?
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={extendTimer}
          >
            + Extend 3 Minutes
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowExtensionModal(false)}
          >
            I'm Ready to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
