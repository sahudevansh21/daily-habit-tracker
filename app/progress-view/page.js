'use client';
import Link from 'next/link';

import { useState, useEffect, useMemo } from 'react';

export default function ProgressViewPage() {
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [completions, setCompletions] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem('dailyHabitTrackerHabits')) || [];
    setHabits(storedHabits);
    if (storedHabits.length > 0) {
      setSelectedHabitId(storedHabits[0].id);
    }

    const storedCompletions = JSON.parse(localStorage.getItem('dailyHabitTrackerCompletions')) || {};
    setCompletions(storedCompletions);
  }, []);

  const selectedHabit = useMemo(() => habits.find(h => h.id === selectedHabitId), [habits, selectedHabitId]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

  const generateCalendarDays = (year, month, habitId) => {
    const numDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    const todayDateString = new Date().toISOString().split('T')[0];

    // Empty cells for the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ type: 'empty' });
    }

    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const isCompleted = completions[dateString] && completions[dateString][habitId];
      const isToday = dateString === todayDateString;
      days.push({ day: i, type: 'day', isCompleted, isToday });
    }
    return days;
  };

  const calendarDays = useMemo(() => {
    return selectedHabitId ? generateCalendarDays(currentYear, currentMonth, selectedHabitId) : [];
  }, [selectedHabitId, currentYear, currentMonth, completions]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const calculateStats = (habitId) => {
    if (!habitId) return { totalCompletions: 0, currentStreak: 0, longestStreak: 0 };

    let totalCompletions = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedDates = Object.keys(completions).sort().reverse(); // Newest first
    const todayDateString = new Date().toISOString().split('T')[0];
    let lastDateWasCompleted = false; // Tracks if the previous day was completed for streak calculation

    for (let i = 0; i < sortedDates.length; i++) {
      const dateString = sortedDates[i];
      const date = new Date(dateString);

      const isCompletedToday = completions[dateString] && completions[dateString][habitId];
      if (isCompletedToday) {
        totalCompletions++;
      }

      // Streak calculation
      if (dateString === todayDateString) {
        // Today's completion determines if current streak is active today
        if (isCompletedToday) {
          tempStreak = 1; // Start counting if today completed
          lastDateWasCompleted = true;
        } else {
          // If today not completed, current streak effectively ends yesterday
          longestStreak = Math.max(longestStreak, tempStreak); // Save any streak up to yesterday
          tempStreak = 0;
          lastDateWasCompleted = false;
        }
      } else if (lastDateWasCompleted && date.getTime() === new Date(new Date(sortedDates[i-1]).setDate(new Date(sortedDates[i-1]).getDate() -1)).getTime()) {
        // Check if this date is exactly the day before the last checked date (contiguous)
        if (isCompletedToday) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
          lastDateWasCompleted = false;
        }
      } else if (dateString < todayDateString) { // For past dates
         // This logic is a bit tricky for 'current streak' vs 'longest streak over time'.
         // Let's refine for a simpler 'longest streak' for the progress view.
         // For 'current streak', we only care about the most recent consecutive days including today.
         // For 'longest streak', we find the max consecutive completed days anywhere.

         // A more accurate way to check contiguous days for overall longest streak:
         // Iterate from earliest to latest for longest streak, and from current backwards for current streak.
      }
    }

    // Corrected streak calculation logic
    let realCurrentStreak = 0;
    let realLongestStreak = 0;
    let currentConsecutive = 0;

    const allDates = Object.keys(completions).sort(); // Earliest first

    for (const dateString of allDates) {
      if (completions[dateString] && completions[dateString][habitId]) {
        currentConsecutive++;
      } else {
        realLongestStreak = Math.max(realLongestStreak, currentConsecutive);
        currentConsecutive = 0;
      }
    }
    realLongestStreak = Math.max(realLongestStreak, currentConsecutive); // Capture streak at the end

    // Calculate current streak from today backwards
    let tempCurrentDate = new Date();
    let todayIsCompleted = completions[getTodayDateString()] && completions[getTodayDateString()][habitId];
    if(todayIsCompleted) {
        realCurrentStreak = 1;
        tempCurrentDate.setDate(tempCurrentDate.getDate() - 1);
    } else {
        tempCurrentDate.setDate(tempCurrentDate.getDate() - 1); // Start from yesterday if today not completed
    }

    while (true) {
        const dateString = tempCurrentDate.toISOString().split('T')[0];
        // Stop if before habit creation date, or no more data relevant
        if (tempCurrentDate < new Date(selectedHabit?.createdAt || '1970-01-01')) break;

        if (completions[dateString] && completions[dateString][habitId]) {
            realCurrentStreak++;
            tempCurrentDate.setDate(tempCurrentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return { totalCompletions, currentStreak: realCurrentStreak, longestStreak: realLongestStreak };
  };

  const { totalCompletions, currentStreak, longestStreak } = useMemo(() => calculateStats(selectedHabitId), [selectedHabitId, completions, selectedHabit]);

  return (
    <div className="container">
      <h1 className="page-title">Progress View</h1>
      <p className="page-description">Track your consistency and celebrate your achievements.</p>

      {habits.length === 0 ? (
        <div className="glass-card flex-center empty-state">
          <p>No habits defined yet. <Link href="/manage-habits" className="gradient-text text-link">Add your first habit!</Link></p>
        </div>
      ) : (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div className="progress-controls">
            <label htmlFor="habit-select" className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
              <span className="text-muted">Select Habit:</span>
              <select
                id="habit-select"
                className="form-control"
                value={selectedHabitId}
                onChange={(e) => setSelectedHabitId(e.target.value)}
              >
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>{habit.name}</option>
                ))}
              </select>
            </label>
          </div>

          {selectedHabitId ? (
            <>
              <div className="progress-stats">
                <div className="glass-card stat-card">
                  <div className="stat-value">{totalCompletions}</div>
                  <div className="stat-label">Total Completions</div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-value">{currentStreak}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-value">{longestStreak}</div>
                  <div className="stat-label">Longest Streak</div>
                </div>
              </div>

              <div className="glass-card" style={{ marginTop: '2rem' }}>
                <div className="calendar-header">
                  <button onClick={goToPreviousMonth} className="calendar-nav-btn">{'<'}</button>
                  <span>{monthNames[currentMonth]} {currentYear}</span>
                  <button onClick={goToNextMonth} className="calendar-nav-btn">{'>'}</button>
                </div>
                <div className="calendar-grid">
                  {weekdayNames.map(day => <div key={day} className="calendar-day header">{day}</div>)}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${day.type === 'empty' ? 'empty' : ''} ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted" style={{ textAlign: 'center' }}>Please select a habit to view its progress.</p>
          )}
        </div>
      )}
    </div>
  );
}
