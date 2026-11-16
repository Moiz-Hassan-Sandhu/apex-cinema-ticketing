# Web Programming (CS4032) — Assignment 02 Report
## Business Website Development Using React
**National University of Computer and Emerging Sciences, Islamabad Campus**

---

### Section 1: Student and Project Details

| Field | Detail |
|---|---|
| **Student Name** | Moiz Hassan |
| **Roll Number** | [Your Roll Number - e.g., 24I-XXXX] |
| **Section** | [Your Section - e.g., A / B] |
| **Business Name** | Apex Cinema Lounge & Event Hub |
| **Business Domain** | Cinema & Event Ticket Booking |
| **Public GitHub Repository** | [https://github.com/your-username/apex-cinema-lounge](https://github.com/your-username/apex-cinema-lounge) |
| **Live Deployed Application** | [https://apex-cinema-lounge.vercel.app](https://apex-cinema-lounge.vercel.app) |
| **Final Submission Commit Hash** | `[Insert final commit hash here]` |

---

### Section 2: Business Profile

* **Business Identity:** **Apex Cinema Lounge & Event Hub** — A modern boutique cinema and screening theater featuring IMAX 70mm, 64-channel Dolby Atmos, and VIP luxury lounges.
* **Primary Audience:** Movie enthusiasts, university students, and families in Islamabad & Rawalpindi seeking premium cinema experiences with transparent booking.
* **Operating Area:** Centaurus Mall & Sector F-8 Lounge, Islamabad.
* **Main Customer Task:** Discover current movies, compare age ratings, runtimes, and formats, select seats on an interactive seat map, enter attendee details, and reserve digital e-tickets.
* **Business Goal:** Maximize ticket sales by eliminating checkout bounce rates caused by surprise convenience fees, and provide a seamless mobile seat-booking flow.
* **Theatrical Offerings:** 12 featured film screenings across 4 formats (IMAX 3D, Dolby Atmos, VIP Lounge, Standard 2D), complete with runtimes, IMDb ratings, age ratings, and showtimes.

---

### Section 3: Operating Rules

#### Rule 1: Availability or Capacity — Fair Seat Allocation Limit (Numerical Limit)
1. **Exact Condition:** Maximum of 6 seats per transaction per screening to prevent scalping.
2. **Where User is Told:** Details page notice box, seat map legend, and live seat counter.
3. **Application Response:** Selecting a 7th seat is prevented, displaying a warning toast and disallowing further increments.
4. **Boundary Case:** 6 seats is valid (exact limit); 7 seats is rejected with error `ERR_EXCEEDS_CAPACITY`.

#### Rule 2: Eligibility or Compatibility — 18+ Adult Screening Age Restriction
1. **Exact Condition:** Films classified as 18+ Restricted require an explicit attendee age confirmation declaration. Child concession tickets cannot be chosen for 18+ screenings.
2. **Where User is Told:** Prominent crimson 18+ badge on cards, details page alert, and mandatory declaration checkbox in checkout.
3. **Application Response:** The checkout button is disabled until the age checkbox is checked; choosing child tickets triggers an incompatibility error.
4. **Boundary Case:** Non-adult films (PG, PG-13) allow any ticket type without requiring declaration; 18+ films block submission if unchecked.

#### Rule 3: Pricing or Fulfilment — Upfront Pricing, Matinee Discounts & Group Perks (Numerical Limit)
1. **Exact Condition:** Matinee shows (before 4:00 PM) receive an automatic PKR 250 discount per ticket. Bookings of 4 or more tickets waive the digital facility fee entirely (PKR 0 fee; otherwise PKR 100 per ticket).
2. **Where User is Told:** Top sticky header banner, showtime buttons, and checkout summary card.
3. **Application Response:** Fee discounts update in real-time as seats are selected; zero surprise charges appear at payment.
4. **Boundary Case:** 3 seats incur PKR 300 fee; exactly 4 seats unlock PKR 0 fee waiver.

---

### Section 4: Reference-Site Investigation

**Reference Website Investigated:** **Bookme.pk** (`https://bookme.pk/movies`)

| Problem # | Investigated Problem | Affected User Task | Observed Difficulty | Possible Business Consequence | How Our Website Addresses It |
|---|---|---|---|---|---|
| **Problem 1** | **Hidden Convenience Surcharge on Final Payment Screen** | Reviewing ticket costs and finalizing booking | Ticket price is advertised at PKR 1,000, but an unannounced "Service/Convenience Fee" (PKR 50-100/ticket) appears only on the payment screen. | Unexpected surcharges trigger customer frustration and high cart abandonment at the payment gateway. | **100% Upfront Pricing:** Complete fee breakdown, PKR 250 matinee discount, and group waiver shown upfront before asking for personal details. |
| **Problem 2** | **Silent Seat-Hold Timer Expiry & Data Wipe** | Entering attendee information during seat hold | The 5-minute seat hold timer expires silently without warning or extension option, abruptly releasing seats and clearing all typed attendee data. | Users lose their seats and progress if they take slightly longer to enter details, causing drop-offs. | **Resilient Seat Hold with Extension:** Visual timer with "Need more time?" prompt at 60s (+3 min extension). Even on expiry, attendee form inputs are strictly preserved in state. |
| **Problem 3** | **Movie Cards Lack Critical Comparison Info** | Browsing and comparing movies | Movie cards only show posters and titles; they omit age ratings (PG, 18+), duration, genre tags, and formats (IMAX, 3D). | Customers cannot evaluate suitability without opening each movie individually, causing high friction and accidental booking of age-inappropriate films. | **Rich Comparison Cards:** Every card displays runtime, age badges, format badges, and genre tags with live multi-facet filters. |

*(Insert the 3 screenshots: `case1_hidden_fees.png`, `case2_seat_timer.png`, `case3_cards_missing_info.png` in your final PDF)*

---

### Section 5: Frontend Decisions

*(Extracted directly from `DECISIONS.md`)*
1. **Decision 1 (Information Hierarchy):** 100% Upfront Transparent Fee Meter & Live Calculated Surcharges.
   * *Alternative:* Footer fine-print disclaimer or popup at payment.
   * *Tradeoff:* Consumes 36px vertical screen space for the header meter.
   * *Code Location:* `src/components/Navbar.jsx`, `src/rules/bookingRules.js`, `src/pages/CheckoutPage.jsx`.
2. **Decision 2 (Interaction & State):** Resilient Seat-Hold Timer with Visual Countdown, Grace Extension, and State Preservation.
   * *Alternative:* Silent session expiration with automatic redirect to homepage.
   * *Tradeoff:* Requires managing interval timers and cleanup in React `useEffect`.
   * *Code Location:* `src/context/BookingContext.jsx`, `src/components/TimerWarningModal.jsx`, `src/pages/CheckoutPage.jsx`.
3. **Decision 3 (Content Comparison & Mobile Layout):** Rich Multi-Facet Movie Comparison Cards with Integrated Filter Navigation.
   * *Alternative:* Minimalist poster cards with hover tooltips (fails on mobile touchscreens).
   * *Tradeoff:* Increases card height and visual density.
   * *Code Location:* `src/components/MovieCard.jsx`, `src/components/MovieFilters.jsx`, `src/pages/HomePage.jsx`.

---

### Section 6: Implemented Application

*(Insert annotated screenshots of your completed application running locally or deployed:)*
1. **Homepage & Schedule:** Showing multi-facet filter pills, movie cards with age/runtime tags, and top price transparency banner.
2. **Movie Details View (`/movies/movie-01`):** Showing film specifications, director, cast, showtimes, Rule 1 capacity notice, and Rule 2 18+ advisory.
3. **Interactive Auditorium Seat Map:** Showing curved screen, Rows A-F, standard vs. VIP recliners, and live seat counter.
4. **Checkout Page (`/checkout`):** Showing controlled attendee form, live countdown timer bar, and upfront calculated price breakdown.
5. **Confirmation E-Ticket Screen (`/confirmation/:id`):** Showing confirmed booking ID, e-ticket QR code, hall, and seat summary.
6. **Mobile View (390px):** Tested in Chrome DevTools showing responsive single-column layout, touch-friendly buttons ($\ge$ 44px), and zero horizontal overflow.
7. **Examiner Demo Control Bar:** Showing simulated 503 network retry and conflicting seat lock toggles.

---

### Section 7: Verification

#### 1. Edge-Case Verification Checklist

| Edge Case | User Action | Expected Behaviour | Observed Behaviour | Result |
|---|---|---|---|---|
| **Loading Failure & Retry (Task 6.1)** | Check "Simulate Network Failure (HTTP 503)" in demo bar, reload schedule. | Displays clear error container with working "Retry Connection" button. | Error displayed; unchecking and clicking retry restores schedule without page refresh. | **PASS** |
| **Seat Availability Conflict (Task 6.1)** | Pick seats C3/C4, check "Simulate Conflicting Seat Lock" in demo bar. | Displays conflict banner, locks checkout, and offers 1-click removal. | Conflict detected immediately; 1-click button clears unavailable seats and allows re-selection. | **PASS** |
| **Invalid Movie URL Route (FR02)** | Navigate manually to `/movies/nonexistent-film-99`. | Displays accessible 404 "Screening Not Found" state with link to schedule. | Fallback container rendered cleanly; "Return to Movie Schedule" button works. | **PASS** |
| **Empty Search Filter (FR15)** | Search for `"xyzrandomquery"`. | Shows friendly empty search state with "Clear All Search Filters" button. | Explains no films matched and single click clears query. | **PASS** |
| **Invalid Form Input & Preservation (FR10)** | Submit checkout with 1-letter name and bad mobile number. | Highlights erroneous fields with specific helper text; preserves valid input. | Specific inline errors appear beneath fields; valid email and notes remain intact. | **PASS** |

#### 2. Automated Business-Rule Test Result (Task 6.2)
* **Command Executed:** `node --test tests/bookingRules.test.js`
* **Test Runner:** Node.js built-in test runner (`node:test`, `node:assert/strict`)
* **Test Cases Covered:**
  * Ordinary valid seat count (`count = 3` &rarr; PASS)
  * Boundary seat count exactly at limit (`count = 6` &rarr; PASS)
  * Breaking seat count exceeding limit (`count = 7` &rarr; REJECTED with `ERR_EXCEEDS_CAPACITY`)
  * Boundary seat count below minimum (`count = 0` &rarr; REJECTED with `ERR_BELOW_MINIMUM`)
  * Fractional seat count (`count = 2.5` &rarr; REJECTED with `ERR_NON_INTEGER`)
  * 18+ booking with age confirmed (&rarr; PASS)
  * 18+ booking with age unconfirmed (&rarr; REJECTED)
  * 18+ booking with child concession ticket (&rarr; REJECTED)
  * Non-adult film (PG-13) concession (&rarr; PASS)
  * Matinee showtime pricing (< 4 PM &rarr; PKR 250 discount applied)
  * Evening showtime pricing (&ge; 4 PM &rarr; standard pricing)
  * Group booking (&ge; 4 seats &rarr; PKR 0 facility fee waiver applied)
* **Execution Summary:** 12 passed, 0 failed, 0 errors (duration: ~120ms).

---

### Section 8: Limitations

* **Payment Gateway Simulation:** Payment details are simulated; real bank card and merchant transactions are excluded in accordance with the frontend assignment scope.
* **Local Storage Dependency:** Booking preferences and recent selections are persisted locally in browser `localStorage`. Clearing browser cache restores defaults.
