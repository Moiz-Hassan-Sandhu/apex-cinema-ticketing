# Apex Cinema Lounge & Event Hub

**CS4032 Web Programming — Assignment 02: Business Website Development Using React**  
**National University of Computer and Emerging Sciences, Islamabad Campus**  
**Program:** BS Cyber Security | **Semester:** Fall 2026  

---

## 1. Student & Project Details

* **Student Name:** Moiz Hassan
* **Roll Number:** [Insert Your Roll Number - e.g. 24I-2096]
* **Section:** A
* **Business Domain:** Cinema & Event Ticket Booking
* **Reference Platform Investigated:** Bookme.pk (`https://bookme.pk/movies`)
* **Public GitHub Repository:** [https://github.com/Moiz-Hassan-Sandhu/apex-cinema-ticketing](https://github.com/Moiz-Hassan-Sandhu/apex-cinema-ticketing)
* **Live Deployment Link:** [https://apex-cinema-ticketing.vercel.app](https://apex-cinema-ticketing.vercel.app)
* **Final Commit Hash:** `4e8bd39c56969b7aee280a4753724c4c6a3c1367`

---

## 2. Project Description

**Apex Cinema Lounge & Event Hub** is a boutique cinema and theatrical screening web application built for moviegoers in Islamabad and Rawalpindi. The platform addresses three critical usability and interaction defects identified in Pakistan's primary digital ticketing platform (**Bookme.pk**):

1. **Hidden Surcharges at Checkout (Decision 1):** Bookme.pk conceals digital facility charges until the final payment page. Apex Cinema implements **100% upfront pricing**, a persistent fee transparency meter, PKR 250 early matinee discounts, and a free facility fee waiver for group bookings of 4+ tickets.
2. **Silent Seat-Hold Timer Expiry (Decision 2):** Bookme.pk and Cinepax abruptly wipe selected seats and typed customer form fields when temporary hold timers expire. Apex Cinema features a visual countdown timer with an interactive 60-second grace extension prompt, and strictly **preserves customer form inputs** in state even if a hold times out.
3. **Information Deficiency on Listing Cards (Decision 3):** Bookme.pk movie cards omit runtimes, age ratings, and formats. Apex Cinema features **rich comparison cards** displaying explicit age badges (PG, PG-13, 18+), duration, format tags (IMAX 3D, Dolby Atmos), and synchronized multi-facet filters.

All styling is handcrafted using **authored CSS** without external UI component libraries, complying strictly with course requirements.

---

## 3. Installation, Development, Build & Test Commands

### Prerequisites
* **Node.js:** v18.0.0 or later (Tested on Node.js v24.19.0)
* **npm:** v9.0.0 or later

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (runs at http://localhost:3000)
npm run dev

# 3. Execute automated business-rule unit tests (Node.js built-in test runner)
npm test
# Or direct command:
node --test tests/bookingRules.test.js

# 4. Compile production build bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 4. Main Routes & Feature Summary

| Route | View Component | Key Features & Functional Requirements |
|---|---|---|
| `/` | `HomePage.jsx` | Async mock loader with loading spinner (FR14), real-time search across title/director/cast (FR04), genre and format filter pills (FR05), rich comparison cards with age/runtime tags (Decision 3), and empty search state guidance (FR15). |
| `/movies/:id` | `DetailsPage.jsx` | Parameterized movie route (FR02) with 404 fallback for invalid IDs. Shows synopsis, cast, director, runtime, showtime selector, interactive seat map with 6-seat capacity enforcement (FR06, FR07), and **Rule 2 (18+ rating)** advisory. |
| `/checkout` | `CheckoutPage.jsx` | Selection review (FR07, FR08). Controlled form with 4+ fields and real-time inline validation preserving valid input (FR09, FR10). Active seat-hold countdown timer with 60s extension prompt (Decision 2). Upfront calculated summary (FR11, FR12). |
| `/confirmation/:bookingId` | `ConfirmationPage.jsx` | Clear confirmation screen (FR16) displaying unique booking reference ID, showtime, hall, seat numbers, attendee info, and digital e-ticket QR code. |
| `/rules` | `RulesPage.jsx` | Comprehensive documentation page detailing business profile, the three operating rules, boundary conditions, and viva defense rationale. |
| `*` | `NotFoundPage` (in `App.jsx`) | Accessible 404 page with navigation fallback. |

---

## 5. Three Operating Rules (Task 2 & Task 6.2)

### Rule 1: Fair Seat Allocation Limit [Availability / Capacity - Numerical Limit]
* **Condition:** Customers can select a maximum of **6 seats** per transaction per screening to prevent scalping.
* **Where Communicated:** Details page notice box, seat map legend, and live seat counter.
* **App Enforcement:** Selecting a 7th seat is blocked with an alert toast; direct invalid inputs return `ERR_EXCEEDS_CAPACITY`.
* **Boundary Cases:** 6 seats is valid (exact limit); 7 seats is rejected.
* **Automated Unit Test:** Tested via `node --test tests/bookingRules.test.js` (passed).

### Rule 2: 18+ Adult Screening Age Restriction [Eligibility / Compatibility]
* **Condition:** Screenings classified as **18+ Restricted** require an explicit attendee age confirmation declaration. Child concession tickets cannot be chosen for 18+ screenings.
* **Where Communicated:** Crimson 18+ badge on cards, details page alert, and mandatory declaration checkbox in checkout.
* **App Enforcement:** Form prevents order confirmation until age checkbox is checked; choosing child tickets triggers an incompatibility error.
* **Boundary Cases:** Non-adult films (PG, PG-13) allow any ticket type without requiring declaration; 18+ films block submission if unchecked.

### Rule 3: Upfront Pricing, Matinee Discounts & Group Perks [Pricing / Fulfilment - Numerical Limit]
* **Condition:** Matinee shows (before 4:00 PM) receive an automatic **PKR 250 discount** per ticket. Bookings of **4 or more tickets** waive the digital facility fee entirely (PKR 0 fee; otherwise PKR 100 per ticket).
* **Where Communicated:** Top sticky header banner, showtime buttons, and checkout summary card.
* **App Enforcement:** All discounts and fees update in real time; zero surprise fees appear at payment.
* **Boundary Cases:** 3 seats incur PKR 300 fee; exactly 4 seats unlock PKR 0 fee waiver.

---

## 6. Instructions for Reproducing Edge Cases (Task 6.1)

A dedicated **"TASK 6.1 DEMO CONTROLS"** toolbar is fixed at the top of the interface:

1. **Simulate Network Failure (503) & Working Retry:**
   * In the top Demo bar, check **"Simulate Network Failure (HTTP 503)"**.
   * Reload the page or navigate to Schedule. The app displays an accessible error container: *"Box Office Connection Failed (HTTP 503)"*.
   * Uncheck the box and click **"🔄 Retry Connection"**. The schedule recovers immediately without full page reload.

2. **Simulate Conflicting Seat Lock / Changed Availability:**
   * Pick seats `C3` and `C4` for a movie.
   * In the top Demo bar, check **"Simulate Conflicting Seat Lock"**.
   * Reload or navigate to checkout. A prominent warning banner appears: *"⚠️ Seat Availability Conflict Detected: Seat C3 has just been reserved by another customer."*
   * Click **"Remove Conflicted Seats & Reselect"** to auto-clean your selection and re-enable reservation.

3. **Seat-Hold Countdown Timer & Grace Extension:**
   * Select 2 seats and proceed to `/checkout`.
   * Observe the 5-minute countdown timer ticking down in the header bar.
   * When the timer reaches 60s (or click **"+ Add 3 Mins"**), a modal dialog prompts: *"Seat Reservation Expiring Soon! Would you like extra time?"*. Clicking "+ Extend 3 Minutes" adds 180 seconds.
   * If the timer runs out, seats are released, but all typed attendee form information remains intact!

4. **Invalid Parameterized Route (`/movies/invalid-id`):**
   * Navigate manually to `/movies/unknown-film-99`.
   * Displays an accessible *"Screening Not Found"* error screen with a button linking back to the schedule.

5. **Empty Search Filter Results (FR15):**
   * Search for `"xyzrandom99"` in the movie search bar.
   * Displays a dedicated empty state explaining that no films matched, with a 1-click *"Clear All Search Filters"* button.

---

## 7. Concept Map

| Course Concept | Relevant Files | Primary Component or Function |
|---|---|---|
| **Parameterized Routing & Fallbacks** | `src/App.jsx`, `src/pages/DetailsPage.jsx` | `useParams`, `Routes`, `Route`, `Link`, `NavLink`, `NotFoundPage` |
| **URL Search State Synchronization** | `src/pages/HomePage.jsx`, `src/components/MovieFilters.jsx` | `useSearchParams`, `updateQuery`, `MovieFilters` |
| **Asynchronous Mock Loader & Latency** | `src/services/api.js`, `src/pages/HomePage.jsx` | `fetchMovies()`, `fetchMovieById()`, `Promise`, `async/await` |
| **Shared Global Context & Persistence** | `src/context/BookingContext.jsx` | `BookingProvider`, `useBooking`, `createContext`, `localStorage` |
| **Controlled Form & Inline Validation** | `src/pages/CheckoutPage.jsx` | `attendeeInfo`, `formErrors`, `touched`, `validateField`, `handleInputChange` |
| **Derived Summary Calculation** | `src/rules/bookingRules.js`, `src/pages/CheckoutPage.jsx` | `calculateBookingPricing()`, `useMemo` |
| **Pure JS Operating Rule & Unit Testing** | `src/rules/bookingRules.js`, `tests/bookingRules.test.js` | `validateSeatCapacity()`, `node:test`, `node:assert/strict` |
| **Interactive Cinema Seat Map** | `src/components/SeatMap.jsx` | Accessible grid, VIP tier distinction, touch targets $\ge$ 44px |
| **Responsive Authored CSS** | `src/styles/main.css` | Media queries for 390px (mobile) and 1280px (desktop), CSS Custom Properties |
