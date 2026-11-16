/**
 * Apex Cinema Lounge - Business Operating Rules Module
 * CS4032 Web Programming Assignment 02
 * 
 * Contains pure functions enforcing business boundaries:
 * 1. Rule 1: Capacity Limit (Numerical limit) - Max 6 seats per transaction
 * 2. Rule 2: Eligibility & Compatibility - 18+ Adult movie age restrictions
 * 3. Rule 3: Pricing & Fulfilment (Numerical limit) - Upfront pricing, PKR 250 matinee discount, free facility fee for >=4 seats
 */

export const MAX_SEATS_PER_BOOKING = 6;
export const MATINEE_HOUR_CUTOFF = 16; // 4:00 PM
export const MATINEE_DISCOUNT_PER_TICKET = 250;
export const STANDARD_FACILITY_FEE_PER_TICKET = 100;
export const GROUP_FREE_FEE_SEAT_THRESHOLD = 4;

/**
 * Operating Rule 1: Availability & Capacity
 * Validates the number of selected seats for a single transaction.
 * 
 * Boundary conditions:
 * - 1 to 6: valid
 * - 6: valid (exact boundary)
 * - >6: invalid (breaks rule)
 * - <=0: invalid
 * 
 * @param {number} count - Desired number of seats
 * @param {number} maxAllowed - Maximum capacity limit (default 6)
 * @returns {{ isValid: boolean, error: string | null, code: string }}
 */
export function validateSeatCapacity(count, maxAllowed = MAX_SEATS_PER_BOOKING) {
  const num = Number(count);

  if (!Number.isInteger(num)) {
    return {
      isValid: false,
      error: 'Seat count must be a whole integer.',
      code: 'ERR_NON_INTEGER'
    };
  }

  if (num < 1) {
    return {
      isValid: false,
      error: 'Please select at least 1 seat to proceed.',
      code: 'ERR_BELOW_MINIMUM'
    };
  }

  if (num > maxAllowed) {
    return {
      isValid: false,
      error: `Booking limit reached: You can select a maximum of ${maxAllowed} seats per transaction.`,
      code: 'ERR_EXCEEDS_CAPACITY'
    };
  }

  return {
    isValid: true,
    error: null,
    code: 'OK'
  };
}

/**
 * Operating Rule 2: Eligibility & Age Rating Compatibility
 * Movies rated 18+ require customer age confirmation and cannot be booked
 * under child/concession ticket types.
 * 
 * @param {string} movieRating - e.g. '18+' | 'PG-13' | 'PG'
 * @param {boolean} hasConfirmedAge - User checkbox confirmation
 * @param {string} ticketType - 'standard' | 'student' | 'child_concession'
 * @returns {{ isEligible: boolean, error: string | null }}
 */
export function validateAgeEligibility(movieRating, hasConfirmedAge = false, ticketType = 'standard') {
  if (movieRating === '18+') {
    if (ticketType === 'child_concession') {
      return {
        isEligible: false,
        error: 'Child concession tickets are not permitted for 18+ Restricted screenings.'
      };
    }

    if (!hasConfirmedAge) {
      return {
        isEligible: false,
        error: 'You must confirm that all attendees are 18 years of age or older for this screening.'
      };
    }
  }

  return {
    isEligible: true,
    error: null
  };
}

/**
 * Operating Rule 3: Upfront Pricing, Matinee Discounts & Group Facility Waiver
 * Calculates exact transparent totals without surprise late fees.
 * 
 * @param {Array} selectedSeats - Array of seat objects { id, type, price }
 * @param {string} showtimeStr - e.g. '13:30' or '19:45'
 * @returns {{
 *   seatCount: number,
 *   baseSubtotal: number,
 *   isMatinee: boolean,
 *   matineeDiscountTotal: number,
 *   facilityFeeTotal: number,
 *   qualifiesForFreeFacilityFee: boolean,
 *   seatsNeededForFreeFacility: number,
 *   grandTotal: number,
 *   canProceed: boolean,
 *   errorMessage: string | null
 * }}
 */
export function calculateBookingPricing(selectedSeats = [], showtimeStr = '19:00') {
  const seatCount = Array.isArray(selectedSeats) ? selectedSeats.length : 0;
  const baseSubtotal = (selectedSeats || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  // Parse showtime hour (e.g. '13:30' -> 13)
  const hour = parseInt(showtimeStr.split(':')[0], 10) || 19;
  const isMatinee = hour < MATINEE_HOUR_CUTOFF;

  // Matinee discount: PKR 250 off per ticket if before 4 PM
  const matineeDiscountTotal = isMatinee ? seatCount * MATINEE_DISCOUNT_PER_TICKET : 0;

  // Group facility fee waiver: >= 4 seats waives facility fee
  const qualifiesForFreeFacilityFee = seatCount >= GROUP_FREE_FEE_SEAT_THRESHOLD;
  const seatsNeededForFreeFacility = qualifiesForFreeFacilityFee ? 0 : GROUP_FREE_FEE_SEAT_THRESHOLD - seatCount;
  const facilityFeeTotal = qualifiesForFreeFacilityFee ? 0 : seatCount * STANDARD_FACILITY_FEE_PER_TICKET;

  const grandTotal = Math.max(0, baseSubtotal - matineeDiscountTotal + facilityFeeTotal);

  let errorMessage = null;
  if (seatCount === 0) {
    errorMessage = 'Please select at least 1 seat.';
  } else if (seatCount > MAX_SEATS_PER_BOOKING) {
    errorMessage = `Booking exceeds the maximum allowance of ${MAX_SEATS_PER_BOOKING} seats.`;
  }

  return {
    seatCount,
    baseSubtotal,
    isMatinee,
    matineeDiscountTotal,
    facilityFeeTotal,
    qualifiesForFreeFacilityFee,
    seatsNeededForFreeFacility,
    grandTotal,
    canProceed: seatCount >= 1 && seatCount <= MAX_SEATS_PER_BOOKING,
    errorMessage
  };
}
