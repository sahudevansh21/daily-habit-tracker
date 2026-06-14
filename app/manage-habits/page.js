'use client';

import { useState, useEffect } from 'react';

export default function ManageHabitsPage() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState('');

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem('dailyHabitTrackerHabits')) || [];
    setHabits(storedHabits);
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyHabitTrackerHabits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now().toString(), // Simple unique ID
        name: newHabitName.trim(),
        createdAt: new Date().toISOString(),
      };
      setHabits(prev => [...prev, newHabit]);
      setNewHabitName('');
    }
  };

  const startEditHabit = (habit) => {
    setEditingHabitId(habit.id);
    setEditingHabitName(habit.name);
  };

  const saveEditHabit = () => {
    if (editingHabitName.trim() && editingHabitId) {
      setHabits(prev => prev.map(h =>
        h.id === editingHabitId ? { ...h, name: editingHabitName.trim() } : h
      ));
      setEditingHabitId(null);
      setEditingHabitName('');
    }
  };

  const cancelEditHabit = () => {
    setEditingHabitId(null);
    setEditingHabitName('');
  };

  const deleteHabit = (habitId) => {
    if (confirm('Are you sure you want to delete this habit? All associated progress will be lost.')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
      // Also clear completions for this habit if desired (optional, but good for data integrity)
      const storedCompletions = JSON.parse(localStorage.getItem('dailyHabitTrackerCompletions')) || {};
      for (const date in storedCompletions) {
        if (storedCompletions[date][habitId]) {
          delete storedCompletions[date][habitId];
        }
      }
      localStorage.setItem('dailyHabitTrackerCompletions', JSON.stringify(storedCompletions));
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Habits</h1>
      <p className="page-description">Add, edit, or remove your daily habits.</p>

      <div className="glass-card">
        <h2>Add New Habit</h2>
        <form onSubmit={addHabit} className="form-group">
          <label htmlFor="new-habit-name">Habit Name</label>
          <input
            id="new-habit-name"
            type="text"
            className="form-control"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Habit</button>
        </form>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Your Habits</h2>
        {habits.length === 0 ? (
          <p className="text-muted">You haven't added any habits yet.</p>
        ) : (
          <ul className="habit-list">
            {habits.map(habit => (
              <li key={habit.id} className="habit-item">
                {editingHabitId === habit.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editingHabitName}
                    onChange={(e) => setEditingHabitName(e.target.value)}
                  />
                ) : (
                  <span className="habit-item-name">{habit.name}</span>
                )}
                <div className="habit-actions">
                  {editingHabitId === habit.id ? (
                    <>
                      <button onClick={saveEditHabit} className="btn-primary">Save</button>
                      <button onClick={cancelEditHabit} className="btn-secondary">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditHabit(habit)} className="btn-secondary">Edit</button>
                      <button onClick={() => deleteHabit(habit.id)} className="btn-danger">Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
