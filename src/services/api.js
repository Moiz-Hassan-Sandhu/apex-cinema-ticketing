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
 * Fetch interactive hall seats for a showtime, supporting simulated conflicts
 * @param {string} movieId
 * @param {string} showtimeId
 * @returns {Promise<Array>}
 */
export async function fetchShowtimeSeats(movieId, showtimeId) {
  const settings = getDemoSettings();
  const movie = await fetchMovieById(movieId);

  // Default reserved seats
  let reservedList = ['A3', 'B4', 'B5', 'C6', 'E3', 'E4'];

  // Edge case toggle: simulate someone else taking seats C3 and C4 in real-time
  if (settings.simulateChangedSeatAvailability) {
    reservedList.push('C3', 'C4', 'D4');
  }

  return generateHallSeats(movie.basePrice, reservedList);
}
