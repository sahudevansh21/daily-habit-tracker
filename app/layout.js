import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Daily Habit Tracker',
  description: 'A private, client-side habit tracker to build consistency.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header className="app-header">
          <nav className="navbar">
            <Link href="/" className="logo-link">
              <span className="logo-text">Daily Habit Tracker</span>
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-item">Dashboard</Link>
              <Link href="/manage-habits" className="nav-item">Manage Habits</Link>
              <Link href="/progress-view" className="nav-item">Progress View</Link>
              <Link href="/settings" className="nav-item">Settings</Link>
            </div>
          </nav>
        </header>
        <main className="app-main">
          {children}
        </main>
        <footer className="app-footer">
          <p>© 2023 Daily Habit Tracker. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
