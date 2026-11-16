import React from 'react';
import { Link } from 'react-router-dom';
import {
  MAX_SEATS_PER_BOOKING,
  MATINEE_DISCOUNT_PER_TICKET,
  STANDARD_FACILITY_FEE_PER_TICKET,
  GROUP_FREE_FEE_SEAT_THRESHOLD
} from '../rules/bookingRules.js';

export function RulesPage() {
  return (
    <article style={{ maxWidth: '960px', margin: '0 auto' }} aria-labelledby="rules-title">
      <h1 id="rules-title" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
        Business Profile &amp; Operating Rules
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>
        Apex Cinema Lounge &amp; Event Hub • Islamabad • CS4032 Web Programming Assignment 02
      </p>

      {/* 2.1 Business Profile */}
      <section className="form-panel" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', marginBottom: '16px' }}>
          2.1 Business Profile
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Business Identity:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Apex Cinema Lounge &amp; Event Hub — Boutique cinema and screening theater.</p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Primary Audience:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Moviegoers, students, and families in Islamabad &amp; Rawalpindi.</p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Operating Area:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Centaurus Mall &amp; Sector F-8, Islamabad (Physical auditoriums &amp; digital reservations).</p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Main Customer Task:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Discover movies, compare age ratings/runtimes, lock seats, and complete booking.</p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Business Goal:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Eliminate checkout abandonment caused by surprise fees, and provide a seamless mobile seat booking flow.</p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Offerings:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>12 feature films across 4 formats (IMAX 3D, Dolby Atmos, VIP Lounge, Standard 2D).</p>
          </div>
        </div>
      </section>

      {/* 2.2 Three Operating Rules */}
      <section className="form-panel" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', marginBottom: '16px' }}>
          2.2 Three Operating Rules (Task 2 &amp; Task 6.2)
        </h2>

        {/* Rule 1 */}
        <div style={{ borderLeft: '4px solid var(--accent-gold)', paddingLeft: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
            Rule 1 (Availability or Capacity): Fair Seat Allocation Limit [Numerical Limit]
          </h3>
          <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>1. Exact Condition:</strong> A customer can select a maximum of <strong>{MAX_SEATS_PER_BOOKING} seats</strong> per transaction per screening.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>2. Where User is Told:</strong> Movie details notice box, seating map legend, and live seat counter.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>3. Application Response:</strong> Selecting a 7th seat is prevented, displaying a warning toast and disallowing further increments.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>4. Boundary Cases:</strong> 6 seats is valid (exact limit); 7 seats is rejected with error <code>ERR_EXCEEDS_CAPACITY</code>.
          </p>
          <p style={{ marginTop: '6px', fontStyle: 'italic', color: 'var(--accent-gold)' }}>
            ✓ Verified with automated test in <code>tests/bookingRules.test.js</code> via <code>node --test</code>.
          </p>
        </div>

        {/* Rule 2 */}
        <div style={{ borderLeft: '4px solid var(--accent-crimson)', paddingLeft: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
            Rule 2 (Eligibility or Compatibility): 18+ Adult Screening Age Restriction
          </h3>
          <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>1. Exact Condition:</strong> Films classified as <strong>18+ Restricted</strong> require an explicit attendee age confirmation declaration. Child concession tickets cannot be chosen for 18+ screenings.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>2. Where User is Told:</strong> Prominent crimson 18+ badge on cards, details page alert, and mandatory declaration checkbox in checkout.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>3. Application Response:</strong> The checkout button is disabled until the age checkbox is checked; choosing child tickets triggers an incompatibility error.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>4. Boundary Cases:</strong> Non-adult films (PG, PG-13) allow any ticket type without requiring declaration; 18+ films block submission if unchecked.
          </p>
        </div>

        {/* Rule 3 */}
        <div style={{ borderLeft: '4px solid var(--color-success)', paddingLeft: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
            Rule 3 (Pricing or Fulfilment): Upfront Pricing, Matinee Discounts &amp; Group Perks [Numerical Limit]
          </h3>
          <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>1. Exact Condition:</strong> Matinee shows (before 4:00 PM) receive an automatic <strong>PKR {MATINEE_DISCOUNT_PER_TICKET} discount</strong> per ticket. Bookings of <strong>{GROUP_FREE_FEE_SEAT_THRESHOLD} or more tickets</strong> waive the digital facility fee entirely (PKR 0 fee; otherwise PKR {STANDARD_FACILITY_FEE_PER_TICKET} per ticket).
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>2. Where User is Told:</strong> Top sticky header banner, showtime buttons, and checkout summary card.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>3. Application Response:</strong> Fee discounts update in real-time as seats are selected; zero surprise charges appear at payment.
          </p>
          <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#fff' }}>4. Boundary Cases:</strong> 3 seats incur PKR 300 fee; exactly 4 seats unlock PKR 0 fee waiver.
          </p>
        </div>
      </section>

      {/* Task 3 Summary */}
      <section className="form-panel">
        <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', marginBottom: '16px' }}>
          3. Investigated Problems on Bookme.pk &amp; Architectural Decisions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Decision 1 (Information Hierarchy): Upfront Cost Transparency</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Eliminated Bookme.pk's practice of hiding convenience/service fees until the final payment step by calculating all fees, matinee discounts, and group perks live on screen.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Decision 2 (Interaction &amp; State): Resilient Seat Hold Timer</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Eliminated abrupt timer session wipes by providing a 60-second grace extension prompt and strictly preserving customer form details in state even on timeout.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: '#fff' }}>Decision 3 (Content Comparison &amp; Mobile): Rich Movie Comparison Cards</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Eliminated Bookme.pk's bare movie cards by displaying age ratings, exact runtimes, and format pills on every card, integrated with multi-facet filters.
            </p>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>
          &larr; Return to Movie Schedule
        </Link>
      </div>
    </article>
  );
}
