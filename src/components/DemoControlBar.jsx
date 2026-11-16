import React, { useState } from 'react';
import { getDemoSettings, saveDemoSettings, clearAllBookedSeats } from '../services/api.js';

export function DemoControlBar({ onSettingsChanged }) {
  const [settings, setSettings] = useState(getDemoSettings);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleFailure = (e) => {
    const updated = saveDemoSettings({ simulateFailure: e.target.checked });
    setSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
  };

  const handleToggleSeatConflict = (e) => {
    const updated = saveDemoSettings({ simulateChangedSeatAvailability: e.target.checked });
    setSettings(updated);
    if (onSettingsChanged) onSettingsChanged(updated);
  };

  const handleReset = () => {
    const defaults = saveDemoSettings({
      simulateFailure: false,
      simulateChangedSeatAvailability: false
    });
    setSettings(defaults);
    if (onSettingsChanged) onSettingsChanged(defaults);
  };

  const handleClearBookedSeats = () => {
    clearAllBookedSeats();
    window.location.reload();
  };

  if (isCollapsed) {
    return (
      <div style={{ background: '#05060a', borderBottom: '1px solid var(--border-color)', padding: '4px 20px', textAlign: 'right' }}>
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          🛠️ Show Task 6.1 Examiner Controls ▼
        </button>
      </div>
    );
  }

  return (
    <aside className="demo-control-toolbar" aria-label="Instructor Demonstration Controls">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="demo-badge">TASK 6.1 DEMO CONTROLS</span>
        <span>Examiner Edge-Case Verification:</span>
      </div>

      <div className="demo-toggles-group">
        <label className="demo-label">
          <input
            type="checkbox"
            checked={settings.simulateFailure}
            onChange={handleToggleFailure}
          />
          <span>Simulate Network Failure (HTTP 503)</span>
        </label>

        <label className="demo-label">
          <input
            type="checkbox"
            checked={settings.simulateChangedSeatAvailability}
            onChange={handleToggleSeatConflict}
          />
          <span>Simulate Conflicting Seat Lock (Edge Case)</span>
        </label>

        <button
          type="button"
          onClick={handleClearBookedSeats}
          title="Reset all test seat bookings from browser storage"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.74rem',
            cursor: 'pointer'
          }}
        >
          🧹 Clear Booked Seats
        </button>

        {(settings.simulateFailure || settings.simulateChangedSeatAvailability) && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'var(--accent-crimson)',
              color: '#fff',
              border: 'none',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Reset Toggles
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
          title="Minimize toolbar"
        >
          ▲ Hide
        </button>
      </div>
    </aside>
  );
}
