'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dailyHabitTrackerHabits');
      localStorage.removeItem('dailyHabitTrackerCompletions');
      alert('All habit data has been cleared!');
      window.location.reload(); // Reload to reflect changes
    }
    setShowClearModal(false);
  };

  return (
    <div className="container">
      <h1 className="page-title">Settings</h1>
      <p className="page-description">Manage your application preferences and data.</p>

      <div className="glass-card settings-section">
        <h2>Data Management</h2>
        <p>This action will permanently delete all your habits and their completion history. This cannot be undone.</p>
        <button onClick={() => setShowClearModal(true)} className="btn-danger">Clear All Data</button>
      </div>

      {showClearModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h3>Confirm Data Deletion</h3>
            <p>Are you absolutely sure you want to clear all your habit data? This action is irreversible.</p>
            <div className="modal-actions">
              <button onClick={handleClearAllData} className="btn-danger">Yes, Delete All</button>
              <button onClick={() => setShowClearModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
