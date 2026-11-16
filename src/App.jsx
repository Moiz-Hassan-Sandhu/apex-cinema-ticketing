import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookingProvider, useBooking } from './context/BookingContext.jsx';
import { DemoControlBar } from './components/DemoControlBar.jsx';
import { Navbar } from './components/Navbar.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { DetailsPage } from './pages/DetailsPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { ConfirmationPage } from './pages/ConfirmationPage.jsx';
import { RulesPage } from './pages/RulesPage.jsx';

function ToastContainer() {
  const { notification } = useBooking();
  if (!notification) return null;

  return (
    <div
      className={`toast-notice ${notification.type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{notification.message}</span>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="state-box" role="alert">
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧭</div>
      <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>Page Not Found (404)</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto' }}>
        The cinema screen or route you requested does not exist. Please return to the movie schedule.
      </p>
      <Link to="/" className="btn btn-primary">
        &larr; Back to Schedule
      </Link>
    </div>
  );
}

export function AppContent() {
  return (
    <div className="app-wrapper">
      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Task 6.1 Demonstration Control Bar */}
      <DemoControlBar onSettingsChanged={() => window.location.reload()} />

      {/* Primary Header & Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<DetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Semantic Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-content">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Apex Cinema Lounge &amp; Event Hub
            </h3>
            <p style={{ maxWidth: '380px' }}>
              Boutique cinema screening theater in Islamabad. Experience IMAX 70mm, 64-channel Dolby Atmos, and 100% upfront pricing.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              &copy; {new Date().getFullYear()} Apex Cinema Lounge. All rights reserved. (Simulated Academic Project)
            </p>
          </div>
          <div>
            <strong style={{ color: '#fff' }}>Theaters &amp; Showtimes:</strong>
            <p>Centaurus Mall &amp; Sector F-8 Lounge, Islamabad</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Showtimes: 11:30 AM – 11:45 PM Daily
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </BrowserRouter>
  );
}
