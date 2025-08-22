import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import Button from '../ui/Button';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const toggleTheme = () => setDark(d => !d);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-900 via-indigo-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-base-fg font-sans relative overflow-hidden">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-16 h-72 w-72 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-20 flex items-center justify-between gap-4 px-4 sm:px-8 py-4 backdrop-blur-md">
        <Link to={user ? '/dashboard' : '/'} className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-200 to-indigo-200">Task Manager</Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link aria-label="Dashboard" to="/dashboard" className="hidden sm:inline-flex"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <Link aria-label="Calendar" to="/calendar" className="hidden sm:inline-flex"><Button variant="ghost" size="sm">Calendar</Button></Link>
              {user.role === 'admin' && (
                <Link aria-label="Users" to="/users" className="hidden sm:inline-flex"><Button variant="ghost" size="sm">Users</Button></Link>
              )}
              <Button aria-label="Logout" onClick={handleLogout} variant="primary" size="sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" variant="primary">Login</Button></Link>
              <Link to="/signup"><Button size="sm" variant="outline">Signup</Button></Link>
            </>
          )}
          <Button aria-label="Toggle theme" onClick={toggleTheme} variant="ghost" size="icon">
            {dark ? '🌙' : '☀️'}
          </Button>
        </nav>
      </header>

      <main className="relative z-10 px-4 sm:px-8 py-6">
        {title && <h1 className="sr-only">{title}</h1>}
        {children}
      </main>
      <footer className="relative z-10 text-indigo-200/60 text-xs px-4 sm:px-8 py-6 text-center">© {new Date().getFullYear()} Productivity Suite</footer>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} />
    </div>
  );
};

export default Layout;