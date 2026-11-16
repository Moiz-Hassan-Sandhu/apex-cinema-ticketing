/**
 * Apex Cinema Lounge - Asynchronous Mock API & Demonstration Control Service (FR14, Task 6.1)
 * Simulates real cinema API requests, latency, loading states, and edge-case triggers.
 */
import { MOVIES_DATA, generateHallSeats } from '../data/moviesData.js';

const DEMO_SETTINGS_KEY = 'apex_cinema_demo_settings_v1';

const defaultSettings = {
  simulateFailure: false,
  simulateChangedSeatAvailability: false,
  networkDelayMs: 400
};

export function getDemoSettings() {
  try {
    const raw = sessionStorage.getItem(DEMO_SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveDemoSettings(newSettings) {
  try {
    const current = getDemoSettings();
    const merged = { ...current, ...newSettings };
    sessionStorage.setItem(DEMO_SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return newSettings;
  }
}

/**
 * Fetch all currently screening movies with simulated network latency
 * @returns {Promise<Array>}
 */
export async function fetchMovies() {
  const settings = getDemoSettings();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (settings.simulateFailure) {
        return reject(new Error('Simulated Network Error (HTTP 503): Unable to connect to cinema ticketing box-office server. Please retry.'));
      }

      // Clone records to avoid mutating source
      const records = MOVIES_DATA.map(m => ({ ...m }));
      resolve(records);
    }, settings.networkDelayMs);
  });
}

/**
 * Fetch single movie by parameterized ID (FR02)
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function fetchMovieById(id) {
  const movies = await fetchMovies();
  const movie = movies.find(m => m.id === id);
  if (!movie) {
    const error = new Error(`Movie with ID "${id}" was not found in our theater schedule.`);
    error.status = 404;
    throw error;
  }
  return movie;
}

/**
 * Persist booked seats in browser storage so booked seats stay permanently reserved
 * across navigation and back-button clicks
 */
export function recordBookedSeats(movieId, showtimeId, seatIds = []) {
  try {
    const key = `apex_booked_${movieId}_${showtimeId}`;
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : [];
    const merged = Array.from(new Set([...existing, ...seatIds]));
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (err) {
    console.error('Failed to persist booked seats:', err);
  }
}

export function getBookedSeats(movieId, showtimeId) {
  try {
    const key = `apex_booked_${movieId}_${showtimeId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearAllBookedSeats() {
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('apex_booked_')) {
        localStorage.removeItem(k);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Fetch interactive hall seats for a showtime, supporting simulated conflicts
 * and persisting completed customer bookings as reserved
 * @param {string} movieId
 * @param {string} showtimeId
 * @returns {Promise<Array>}
 */
export async function fetchShowtimeSeats(movieId, showtimeId) {
  const settings = getDemoSettings();
  const movie = await fetchMovieById(movieId);

  // Default reserved seats
  let reservedList = ['A3', 'B4', 'B5', 'C6', 'E3', 'E4'];

  // Add all actually booked seats from confirmed transactions
  const confirmedBookings = getBookedSeats(movieId, showtimeId);
  reservedList = Array.from(new Set([...reservedList, ...confirmedBookings]));

  // Edge case toggle: simulate someone else taking seats C3 and C4 in real-time
  if (settings.simulateChangedSeatAvailability) {
    reservedList.push('C3', 'C4', 'D4');
  }

  return generateHallSeats(movie.basePrice, reservedList);
}
