import React, { useState } from 'react';
import { getDemoSettings, saveDemoSettings } from '../services/api.js';

export function DemoControlBar({ onSettingsChanged }) {
  const [settings, setSettings] = useState(getDemoSettings);

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
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Reset Toggles
          </button>
        )}
      </div>
    </aside>
  );
}
