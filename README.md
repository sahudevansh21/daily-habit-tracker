# Daily Habit Tracker

## Project Overview

**Problem:** Building new positive habits or breaking old ones can be challenging due to a lack of structure, consistent reminders, and easy progress tracking. Many individuals abandon self-improvement goals without a simple, private tool to monitor their consistency and celebrate small wins.

**Solution:** The Daily Habit Tracker is a straightforward web application designed to help users define daily habits, mark them as complete, and visualize their streaks and progress on a calendar. All habit and completion data is stored locally in the browser, offering a completely private and accessible way to foster consistency and achieve personal growth.

## Features

*   **Dashboard:** Quickly view and mark today's habits as complete.
*   **Manage Habits:** Add, edit, and delete your daily habits.
*   **Progress View:** Visualize your consistency with streak tracking and a simple calendar view for each habit.
*   **Settings:** Manage application data, including an option to clear all stored habits.
*   **Client-Side Data Storage:** All your data remains private and is stored locally in your browser (using `localStorage`). No external databases or servers are involved.
*   **Stunning UI:** Features a dark theme with vibrant gradient accents, glassmorphic cards, and smooth animations for a modern and engaging user experience.

## Technologies Used

*   Next.js 14 (App Router)
*   React 18
*   Client-side JavaScript (`useState`, `useEffect`)
*   Local Storage for data persistence
*   Pure CSS for styling (no Tailwind, no CSS Modules)

## Getting Started

Follow these steps to set up and run the Daily Habit Tracker locally:

### 1. Clone the repository (if applicable):

```bash
git clone [repository-url]
cd daily-habit-tracker
```

### 2. Install Dependencies:

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 4. Build for Production:

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `.next` directory.

### 5. Start the Production Server:

```bash
npm run start
# or
yarn start
```

This command starts the Next.js production server.

## Usage

1.  **Dashboard:** On the homepage, you'll see your daily habits. Click "Mark Complete" to toggle their completion status for the current day.
2.  **Manage Habits:** Navigate to the "Manage Habits" page to add new habits, or to modify/remove existing ones.
3.  **Progress View:** Select a habit to view its completion history and streaks on the "Progress View" page.
4.  **Settings:** On the "Settings" page, you can clear all your habit data from the browser's local storage.

Enjoy tracking your habits and building a better you!