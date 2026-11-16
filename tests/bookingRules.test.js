import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSeatCapacity,
  MAX_SEATS_PER_BOOKING,
  validateAgeEligibility,
  calculateBookingPricing,
  MATINEE_DISCOUNT_PER_TICKET,
  STANDARD_FACILITY_FEE_PER_TICKET
} from '../src/rules/bookingRules.js';

describe('Operating Rule 1: Seat Capacity Limitation (Task 6.2 Unit Tests)', () => {
  // Case 1: Ordinary valid input
  it('should pass for an ordinary valid seat count (3 seats)', () => {
    const result = validateSeatCapacity(3);
    assert.equal(result.isValid, true);
    assert.equal(result.error, null);
    assert.equal(result.code, 'OK');
  });

  // Case 2: Boundary case exactly at the rule limit (6 seats)
  it('should pass for a seat count exactly at the boundary limit (6 seats)', () => {
    const result = validateSeatCapacity(MAX_SEATS_PER_BOOKING);
    assert.equal(result.isValid, true);
    assert.equal(result.error, null);
    assert.equal(result.code, 'OK');
  });

  // Case 3: Breaking input exceeding the rule limit (7 seats)
  it('should fail and return a clear error for a quantity exceeding the limit (7 seats)', () => {
    const result = validateSeatCapacity(7);
    assert.equal(result.isValid, false);
    assert.match(result.error, /Booking limit reached/);
    assert.equal(result.code, 'ERR_EXCEEDS_CAPACITY');
  });

  // Case 4: Breaking input below the minimum allowed quantity (0 seats)
  it('should fail for a seat count of 0', () => {
    const result = validateSeatCapacity(0);
    assert.equal(result.isValid, false);
    assert.equal(result.code, 'ERR_BELOW_MINIMUM');
  });

  // Case 5: Non-integer input
  it('should fail for fractional seat quantities (2.5 seats)', () => {
    const result = validateSeatCapacity(2.5);
    assert.equal(result.isValid, false);
    assert.equal(result.code, 'ERR_NON_INTEGER');
  });
});

describe('Operating Rule 2: 18+ Age Rating Eligibility', () => {
  it('should allow 18+ booking when age is explicitly confirmed', () => {
    const result = validateAgeEligibility('18+', true, 'standard');
    assert.equal(result.isEligible, true);
    assert.equal(result.error, null);
  });

  it('should reject 18+ booking when age declaration is unchecked', () => {
    const result = validateAgeEligibility('18+', false, 'standard');
    assert.equal(result.isEligible, false);
    assert.match(result.error, /must confirm that all attendees are 18 years/);
  });

  it('should reject child concession tickets for 18+ screenings', () => {
    const result = validateAgeEligibility('18+', true, 'child_concession');
    assert.equal(result.isEligible, false);
    assert.match(result.error, /Child concession tickets are not permitted/);
  });

  it('should automatically allow non-restricted films (e.g., PG-13 or PG)', () => {
    const result = validateAgeEligibility('PG-13', false, 'child_concession');
    assert.equal(result.isEligible, true);
  });
});

describe('Operating Rule 3: Upfront Pricing, Matinee Discount & Group Perk', () => {
  it('should apply PKR 250 matinee discount per seat for shows before 4:00 PM', () => {
    const seats = [{ price: 1200 }, { price: 1200 }];
    const pricing = calculateBookingPricing(seats, '13:30'); // 1:30 PM
    assert.equal(pricing.isMatinee, true);
    assert.equal(pricing.matineeDiscountTotal, 2 * MATINEE_DISCOUNT_PER_TICKET); // 500
    assert.equal(pricing.facilityFeeTotal, 2 * STANDARD_FACILITY_FEE_PER_TICKET); // 200
    assert.equal(pricing.grandTotal, 2400 - 500 + 200); // 2100
  });

  it('should charge standard base price with standard facility fee for evening shows', () => {
    const seats = [{ price: 1200 }, { price: 1200 }];
    const pricing = calculateBookingPricing(seats, '19:45'); // 7:45 PM
    assert.equal(pricing.isMatinee, false);
    assert.equal(pricing.matineeDiscountTotal, 0);
    assert.equal(pricing.facilityFeeTotal, 200);
    assert.equal(pricing.grandTotal, 2600);
  });

  it('should waive the facility fee (PKR 0) for group bookings of 4 or more seats', () => {
    const seats = [{ price: 1000 }, { price: 1000 }, { price: 1000 }, { price: 1000 }];
    const pricing = calculateBookingPricing(seats, '20:00');
    assert.equal(pricing.qualifiesForFreeFacilityFee, true);
    assert.equal(pricing.facilityFeeTotal, 0);
    assert.equal(pricing.grandTotal, 4000);
  });
});
