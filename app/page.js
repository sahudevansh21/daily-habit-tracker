'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [todayCompletions, setTodayCompletions] = useState({});

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  useEffect(() => {
    // Load habits
    const storedHabits = JSON.parse(localStorage.getItem('dailyHabitTrackerHabits')) || [];
    setHabits(storedHabits);

    // Load today's completions
    const todayDate = getTodayDateString();
    const storedCompletions = JSON.parse(localStorage.getItem('dailyHabitTrackerCompletions')) || {};
    setTodayCompletions(storedCompletions[todayDate] || {});
  }, []);

  useEffect(() => {
    // Save today's completions whenever they change
    const todayDate = getTodayDateString();
    const storedCompletions = JSON.parse(localStorage.getItem('dailyHabitTrackerCompletions')) || {};
    localStorage.setItem('dailyHabitTrackerCompletions', JSON.stringify({
      ...storedCompletions,
      [todayDate]: todayCompletions,
    }));
  }, [todayCompletions]);

  const toggleHabitCompletion = (habitId) => {
    setTodayCompletions(prev => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  const calculateStreak = (habitId) => {
    const completions = JSON.parse(localStorage.getItem('dailyHabitTrackerCompletions')) || {};
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      let isCompleted;

      if (dateString === getTodayDateString()) {
        // For the current day, use the live state
        isCompleted = todayCompletions[habitId];
      } else {
        // For past days, use the stored completions
        isCompleted = completions[dateString] && completions[dateString][habitId];
      }

      if (isCompleted) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to the previous day
      } else {
        // Streak broken or reached a day not completed
        break;
      }
    }
    return streak;
  };

  return (
    <div className="container">
      <h1 className="page-title">Daily Dashboard</h1>
      <p className="page-description">Mark your habits complete for today and see your current streak!</p>

      {habits.length === 0 ? (
        <div className="glass-card flex-center empty-state">
          <p>No habits defined yet. <Link href="/manage-habits" className="gradient-text text-link">Add your first habit!</Link></p>
        </div>
      ) : (
        <div className="habit-grid">
          {habits.map(habit => (
            <div key={habit.id} className={`glass-card habit-card ${todayCompletions[habit.id] ? 'completed' : ''}`}>
              <h2 className="habit-title">{habit.name}</h2>
              <div className="habit-meta">
                <span className="habit-streak">Current Streak: {calculateStreak(habit.id)} day{calculateStreak(habit.id) !== 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={() => toggleHabitCompletion(habit.id)}
                className={`btn-toggle ${todayCompletions[habit.id] ? 'btn-completed' : ''}`}
              >
                {todayCompletions[habit.id] ? 'Completed Today!' : 'Mark Complete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
