import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  validateSeatCapacity,
  calculateBookingPricing,
  validateAgeEligibility,
  MAX_SEATS_PER_BOOKING
} from '../rules/bookingRules.js';

const BookingContext = createContext(null);
const STORAGE_KEY = 'apex_cinema_booking_v1';
const INITIAL_TIMER_SECONDS = 300; // 5 minutes standard hold

export function BookingProvider({ children }) {
  // 1. Restore saved state from LocalStorage (FR13)
  const [selectedMovie, setSelectedMovie] = useState(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_movie`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [selectedShowtime, setSelectedShowtime] = useState(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_showtime`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [selectedSeats, setSelectedSeats] = useState(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_seats`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Attendee Form State (FR09) - Preserved across timer expiry!
  const [attendeeInfo, setAttendeeInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    ticketType: 'standard', // 'standard' | 'student' | 'child_concession'
    confirmedAge: false,
    specialNotes: ''
  });

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  // Seat-Hold Timer State (Problem 2 Fix)
  const [timerSeconds, setTimerSeconds] = useState(INITIAL_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [seatConflicts, setSeatConflicts] = useState([]);

  // Toast Notification helper
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Save selection to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_movie`, JSON.stringify(selectedMovie));
      localStorage.setItem(`${STORAGE_KEY}_showtime`, JSON.stringify(selectedShowtime));
      localStorage.setItem(`${STORAGE_KEY}_seats`, JSON.stringify(selectedSeats));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [selectedMovie, selectedShowtime, selectedSeats]);

  // Manage Seat-Hold Timer (Problem 2)
  useEffect(() => {
    let interval = null;

    if (selectedSeats.length > 0) {
      setIsTimerRunning(true);
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Timer expired! Release seats, but PRESERVE customer form details
            clearInterval(interval);
            setIsTimerRunning(false);
            setSelectedSeats([]);
            showNotification('Your 5-minute seat hold has expired. Please re-select your preferred seats.', 'error');
            return INITIAL_TIMER_SECONDS;
          }

          // Trigger warning prompt at 60s remaining
          if (prev === 60) {
            setShowExtensionModal(true);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      setIsTimerRunning(false);
      setTimerSeconds(INITIAL_TIMER_SECONDS);
      setShowExtensionModal(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSeats.length, showNotification]);

  // Extend timer by 3 minutes (180s)
  const extendTimer = useCallback(() => {
    setTimerSeconds(prev => prev + 180);
    setShowExtensionModal(false);
    showNotification('Seat hold extended by 3 minutes!', 'success');
  }, [showNotification]);

  // Select/Unselect Seat with Operating Rule 1 enforcement (Max 6)
  const toggleSeat = useCallback((seat) => {
    let outcome = { success: false, error: null };

    setSelectedSeats(prevSeats => {
      const isAlreadySelected = prevSeats.some(s => s.id === seat.id);

      if (isAlreadySelected) {
        // Deselect
        outcome = { success: true, error: null };
        return prevSeats.filter(s => s.id !== seat.id);
      }

      // Check Operating Rule 1 (Capacity limit)
      const proposedCount = prevSeats.length + 1;
      const validation = validateSeatCapacity(proposedCount, MAX_SEATS_PER_BOOKING);

      if (!validation.isValid) {
        outcome = { success: false, error: validation.error };
        return prevSeats; // Immutable reject
      }

      outcome = { success: true, error: null };
      return [...prevSeats, seat];
    });

    if (!outcome.success && outcome.error) {
      showNotification(outcome.error, 'error');
    }
  }, [showNotification]);

  // Clear all selected seats
  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
    setSeatConflicts([]);
    setTimerSeconds(INITIAL_TIMER_SECONDS);
    showNotification('Seat selection cleared.', 'info');
  }, [showNotification]);

  // Complete checkout & clear booking
  const resetBookingAfterOrder = useCallback(() => {
    setSelectedSeats([]);
    setSelectedShowtime(null);
    setSelectedMovie(null);
    setTimerSeconds(INITIAL_TIMER_SECONDS);
    setSeatConflicts([]);
  }, []);

  // Verify seat selections against live hall data (Task 6.1 Conflict Recovery)
  const verifySeatAvailability = useCallback((currentHallSeats) => {
    if (!currentHallSeats || selectedSeats.length === 0) {
      setSeatConflicts([]);
      return;
    }

    const conflicts = [];
    selectedSeats.forEach(userSeat => {
      const liveSeat = currentHallSeats.find(s => s.id === userSeat.id);
      if (liveSeat && liveSeat.isReserved) {
        conflicts.push({
          seatId: userSeat.id,
          reason: `Seat ${userSeat.id} has just been reserved by another customer.`
        });
      }
    });

    setSeatConflicts(conflicts);
  }, [selectedSeats]);

  // 1-Click Resolve seat conflicts
  const removeConflictingSeats = useCallback(() => {
    const conflictIds = seatConflicts.map(c => c.seatId);
    setSelectedSeats(prev => prev.filter(s => !conflictIds.includes(s.id)));
    setSeatConflicts([]);
    showNotification('Conflicting reserved seats were removed. You can pick replacement seats.', 'info');
  }, [seatConflicts, showNotification]);

  // Derived Pricing Summary (Operating Rule 3)
  const pricing = useMemo(() => {
    return calculateBookingPricing(selectedSeats, selectedShowtime?.time || '19:00');
  }, [selectedSeats, selectedShowtime]);

  // Derived Age Eligibility Check (Operating Rule 2)
  const ageCheck = useMemo(() => {
    if (!selectedMovie) return { isEligible: true, error: null };
    return validateAgeEligibility(
      selectedMovie.rating,
      attendeeInfo.confirmedAge,
      attendeeInfo.ticketType
    );
  }, [selectedMovie, attendeeInfo.confirmedAge, attendeeInfo.ticketType]);

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedShowtime,
    setSelectedShowtime,
    selectedSeats,
    toggleSeat,
    clearSeats,
    resetBookingAfterOrder,
    pricing,
    ageCheck,
    attendeeInfo,
    setAttendeeInfo,
    timerSeconds,
    isTimerRunning,
    showExtensionModal,
    setShowExtensionModal,
    extendTimer,
    seatConflicts,
    verifySeatAvailability,
    removeConflictingSeats,
    notification,
    showNotification
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
