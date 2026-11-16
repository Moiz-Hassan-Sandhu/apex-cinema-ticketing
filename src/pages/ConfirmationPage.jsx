import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export function ConfirmationPage() {
  const { bookingId } = useParams();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('apex_cinema_last_booking');
      if (stored) {
        setReceipt(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }} aria-labelledby="confirm-heading">
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '2px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 16px auto' }} aria-hidden="true">
        ✓
      </div>

      <span className="hero-tagline" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
        Reservation Confirmed &amp; Seats Locked
      </span>

      <h1 id="confirm-heading" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '12px', marginBottom: '8px', color: '#fff' }}>
        Enjoy the Show!
      </h1>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
        Your booking <strong>#{bookingId}</strong> has been confirmed with the Apex Cinema box-office. A digital QR ticket receipt has been generated.
      </p>

      {receipt ? (
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{receipt.movie.title}</h3>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
                {receipt.movie.format} • {receipt.movie.rating} • {receipt.movie.runtime}
              </p>
            </div>
            <div style={{ background: '#fff', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#000', fontWeight: 900, display: 'block' }}>E-TICKET QR</span>
              <div style={{ width: '50px', height: '50px', background: '#000', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                [QR]
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.875rem', marginBottom: '16px' }}>
            <div><strong>Auditorium:</strong> {receipt.showtime?.hall}</div>
            <div><strong>Showtime:</strong> {receipt.showtime?.time}</div>
            <div><strong>Primary Attendee:</strong> {receipt.attendee.fullName}</div>
            <div><strong>Contact:</strong> {receipt.attendee.phone}</div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Reserved Seats ({receipt.seats.length}):</strong>{' '}
              <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>
                {receipt.seats.map(s => `${s.id} (${s.tier})`).join(', ')}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
              <span>Base Ticket Price:</span>
              <span>PKR {receipt.pricing.baseSubtotal.toLocaleString()}</span>
            </div>
            {receipt.pricing.isMatinee && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px', color: 'var(--color-success)' }}>
                <span>Matinee Discount:</span>
                <span>- PKR {receipt.pricing.matineeDiscountTotal.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
              <span>Digital Facility Charge:</span>
              <span>{receipt.pricing.facilityFeeTotal === 0 ? 'FREE (Group Perk)' : `PKR ${receipt.pricing.facilityFeeTotal}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '10px' }}>
              <span>Total Paid:</span>
              <span>PKR {receipt.pricing.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Booking Reference: <strong>#{bookingId}</strong>
        </div>
      )}

      <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>
        &larr; Return to Schedule
      </Link>
    </div>
  );
}
