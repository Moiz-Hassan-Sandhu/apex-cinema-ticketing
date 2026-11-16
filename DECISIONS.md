# Frontend Architecture Decisions (DECISIONS.md)

**Project:** Apex Cinema Lounge & Event Hub  
**Course:** CS4032 Web Programming — Assignment 02  
**Domain:** Cinema & Event Ticket Booking  
**Reference Website:** Bookme.pk (`https://bookme.pk/movies`)  
**Reference Website:** Bookme.pk (`https://web.cinepax.com/`)
---

## Decision 1: 100% Upfront Transparent Fee Meter & Live Calculated Surcharges

* **Field: Problem**  
  On reference ticketing platforms (Bookme.pk `https://bookme.pk/movies`), ticket prices are advertised on movie selection screens without indicating auxiliary surcharges. Customers proceed through movie selection, seat picking, and fill out full personal contact information, only to find that an unexpected "Service Fee / Convenience Charge" (PKR 50 to 100 per ticket) is appended at the final payment step. This late pricing shock causes friction and cart abandonment.

* **Field: Decision (Information Hierarchy)**  
  Implement an upfront, transparent cost calculation architecture. A persistent fee meter and itemized cost breakdown are rendered on every screen (movie details, seat selection, and checkout). All fees (including ticket prices, early-bird matinee discounts of PKR 250, and facility charges) are calculated dynamically before any attendee information is requested. Furthermore, booking 4 or more seats automatically unlocks a "Free Facility Charge" perk (PKR 0 fee), visibly rewarded in the header.

* **Field: Alternative**  
  Display a generic fine-print disclaimer in the website footer or show a modal popup on the final payment button. This alternative was rejected because it still fails to give the customer exact numbers upfront.

* **Field: Reason**  
  Upfront price transparency builds trust, aligns customer expectations with actual costs, and reduces bounce rates at the payment gateway step.

* **Field: Tradeoff**  
  Consumes modest vertical screen real estate (approximately 36px) for the sticky fee transparency banner and requires real-time reactive calculation in React state.

* **Field: Code Location**  
  - `src/components/Navbar.jsx` (`.price-transparency-banner`)
  - `src/rules/bookingRules.js` (`calculateBookingPricing`)
  - `src/pages/CheckoutPage.jsx` (`.summary-panel`)

* **Field: Evidence**  
  - Reference Evidence: `evidence_screenshots/case1_hidden_fees.png` showing surprise fees appended on Bookme.pk payment gateway.  
  - Implementation: User selects seats; the live summary displays exact ticket totals, facility fees, and applied matinee discounts immediately with zero hidden surcharges.

---

## Decision 2: Resilient Seat-Hold Timer with Visual Countdown, Grace Extension, and State Preservation

* **Field: Problem**  
  On reference cinema platforms (Bookme.pk and Cinepax), selecting seats initiates a temporary lock countdown timer (typically 5 to 7 minutes). If the timer elapses while the user is typing their contact details, selecting payment options, or reviewing terms, the system abruptly releases the reserved seats, reloads the page, and completely wipes all typed attendee data without any warning prompt or opportunity to extend.

* **Field: Decision (Interaction & State Behaviour)**  
  Implement a resilient, user-friendly seat-hold state machine in React context:
  1. A clear visual countdown timer with color-coded warning states (green &rarr; amber &rarr; pulsing red when under 1 minute).
  2. When 60 seconds remain, an accessible modal prompt appears: *"Your seat reservation expires in 1 minute. Need more time?"*, offering a single-click 3-minute grace extension.
  3. If the timer does expire, all customer input fields (Full Name, Phone Number, Email, Ticket Concession) are strictly **preserved in component state**, and the user is gently guided to re-select seats rather than having their entire form destroyed.

* **Field: Alternative**  
  Silent session expiration with automatic redirect to the homepage. While simpler to implement, it leads to customer anger and repeated data entry.

* **Field: Reason**  
  Cinema customers often need to double-check their schedule or coordinate seat preferences with friends/family. Providing a grace extension and preserving form state prevents customer drop-offs and eliminates repetitive typing.

* **Field: Tradeoff**  
  Requires managing interval timers in React `useEffect`, synchronizing timeout cleanup on unmount, and handling timer pauses/extensions.

* **Field: Code Location**  
  - `src/context/BookingContext.jsx` (`timerSeconds`, `extendTimer`, `isWarning`, `handleExpire`)
  - `src/components/TimerWarningModal.jsx`
  - `src/pages/CheckoutPage.jsx` (`attendeeForm` state persistence)

* **Field: Evidence**  
  - Reference Evidence: `evidence_screenshots/case2_seat_timer.png` showing abrupt timer bar on reference platform.  
  - Implementation: When timer drops below 60s, a non-intrusive alert prompts for a 3-minute extension; expiring frees seats but keeps customer form details intact.

---

## Decision 3: Rich Multi-Facet Movie Comparison Cards with Integrated Filter Navigation

* **Field: Problem**  
  On reference platforms (Bookme.pk movie catalog), movie listing cards show only the poster graphic and the title. Critical decision-making attributes—such as Age Rating (PG-13, 18+ Adult), Duration / Runtime (e.g. 2h 30m), Genre tags, and available Screening Formats (IMAX 3D, Dolby Atmos, VIP)—are completely absent from the listing grid. Customers cannot compare films without manually opening every individual movie page one-by-one.

* **Field: Decision (Information Hierarchy & Comparison)**  
  Re-architect the movie discovery card into a comprehensive comparison component. Each card explicitly displays:
  1. Prominent Age Rating Badge (PG, PG-13, 18+ Restricted) with descriptive tooltips.
  2. Exact movie duration in hours and minutes.
  3. Screening format tags (IMAX, 3D, Dolby Atmos).
  4. Genre pills and customer review score.
  5. Multi-facet filters (Genre, Format, Date) that work simultaneously with live text search and URL search parameter synchronization (`useSearchParams`).

* **Field: Alternative**  
  Keeping minimalist poster cards and relying on hover tooltips. This fails on mobile touchscreens where hover interactions do not exist.

* **Field: Reason**  
  Moviegoers (particularly parents and groups with tight schedules) need to immediately assess whether a movie is age-appropriate and fits their evening timeline without tedious page navigation.

* **Field: Tradeoff**  
  Increases card height and visual density, requiring careful typographical hierarchy and authored CSS grid layouts to remain neat at both 390px (mobile) and 1280px (desktop).

* **Field: Code Location**  
  - `src/components/MovieCard.jsx`
  - `src/components/MovieFilters.jsx`
  - `src/pages/HomePage.jsx`
  - `src/styles/main.css` (`.movie-card`, `.badge-rating`, `.format-tag`)

* **Field: Evidence**  
  - Reference Evidence: `evidence_screenshots/case3_cards_missing_info.png` showing reference cards lacking runtime, age ratings, and format tags.  
  - Implementation: Catalog shows comprehensive tags and allows instant filtering by genre and format with live match count.
