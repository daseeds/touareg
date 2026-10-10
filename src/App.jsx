import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase-config';
import './App.css';

// SVG Icons to avoid bulky imports and preserve visual speed
const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const SunIcon = () => (
  <svg className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const AppLogo = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const CompassIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const CalendarIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DashboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const HistoryIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const HamburgerIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BookIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const StarIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Helper function to generate 30 days list starting from today
const getNext30Days = () => {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    days.push({
      dateObject: date,
      dateNumber: date.getDate(),
      dayNameShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      monthName: date.toLocaleDateString('en-US', { month: 'long' }),
      dateString: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    });
  }
  return days;
};

// Helper function to format timestamp in logs
const formatLogTime = (timestamp) => {
  if (!timestamp) return '';
  const date = (typeof timestamp.toDate === 'function') ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to format dates to user readable formats
const formatTargetDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('planning');
  const [bookings, setBookings] = useState({});
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('color-scheme') || 'system';
  });

  // Load bookings from LocalStorage if Firestore is disabled
  const loadOfflineBookings = () => {
    try {
      const stored = localStorage.getItem('touareg-offline-bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read offline cache", e);
    }
  };

  // Save bookings to LocalStorage in offline mode
  const saveOfflineBookings = (newBookings) => {
    setBookings(newBookings);
    try {
      localStorage.setItem('touareg-offline-bookings', JSON.stringify(newBookings));
    } catch (e) {
      console.error("Failed to update offline cache", e);
    }
  };

  // Load log history from LocalStorage in offline fallback
  const loadOfflineHistory = () => {
    try {
      const stored = localStorage.getItem('touareg-offline-history');
      if (stored) {
        setHistoryLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read offline history logs", e);
    }
  };

  // Track Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync real-time Firestore bookings
  useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(collection(db, "bookings"), 
        (snapshot) => {
          const activeBookings = {};
          snapshot.forEach((doc) => {
            activeBookings[doc.id] = doc.data();
          });
          setBookings(activeBookings);
          setIsOfflineMode(false);
        },
        (error) => {
          console.warn("Firestore access offline/denied. Falling back to localStorage.", error.message);
          setIsOfflineMode(true);
          loadOfflineBookings();
        }
      );
    } catch (err) {
      console.warn("Error establishing onSnapshot. Using offline fallback.", err);
      setTimeout(() => {
        setIsOfflineMode(true);
        loadOfflineBookings();
      }, 0);
    }

    return () => unsubscribe();
  }, [user]);

  // Sync real-time Firestore log history
  useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};
    try {
      const historyQuery = query(collection(db, "history"), orderBy("timestamp", "desc"));
      unsubscribe = onSnapshot(historyQuery, 
        (snapshot) => {
          const logs = [];
          snapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
          });
          setHistoryLogs(logs);
        },
        (error) => {
          console.warn("Firestore history access offline. Loading local storage logs.", error.message);
          loadOfflineHistory();
        }
      );
    } catch (err) {
      console.warn("Error establishing history onSnapshot. Using offline fallback.", err);
      setTimeout(() => {
        loadOfflineHistory();
      }, 0);
    }

    return () => unsubscribe();
  }, [user, isOfflineMode]);

  // Sync color themes
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-theme', 'dark');
      if (metaColorScheme) metaColorScheme.content = 'dark';
    } else {
      root.setAttribute('data-theme', 'light');
      if (metaColorScheme) metaColorScheme.content = 'light';
    }
  };

  useEffect(() => {
    applyTheme(theme);
    if (theme === 'system') {
      localStorage.removeItem('color-scheme');
    } else {
      localStorage.setItem('color-scheme', theme);
    }
  }, [theme]);

  // Sync OS settings
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const toggleTheme = () => {
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentResolvedTheme = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;
    setTheme(currentResolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Handlers for Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      alert(`Login failed: ${error.message}`);
      setLoading(false);
    }
  };

  // Log Out
  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      alert(`Sign out failed: ${error.message}`);
      setLoading(false);
    }
  };

  // Audit Logging Routine
  const addLog = useCallback(async (actionType, dateString) => {
    const logEntry = {
      userId: user.uid,
      userName: user.displayName || 'Member',
      userPhoto: user.photoURL || '',
      action: actionType,
      targetDate: dateString,
      timestamp: isOfflineMode ? Date.now() : new Date() // Firestore utilizes native Date objects
    };

    if (isOfflineMode) {
      const stored = localStorage.getItem('touareg-offline-history');
      let currentLogs = [];
      if (stored) {
        try { currentLogs = JSON.parse(stored); } catch {}
      }
      const updatedLogs = [
        { id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, ...logEntry },
        ...currentLogs
      ];
      setHistoryLogs(updatedLogs);
      localStorage.setItem('touareg-offline-history', JSON.stringify(updatedLogs));
    } else {
      try {
        await addDoc(collection(db, "history"), logEntry);
      } catch (err) {
        console.error("Firestore logging write failed. Writing to local cache.", err);
        const stored = localStorage.getItem('touareg-offline-history');
        let currentLogs = [];
        if (stored) {
          try { currentLogs = JSON.parse(stored); } catch {}
        }
        const updatedLogs = [
          { id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, ...logEntry, timestamp: Date.now() },
          ...currentLogs
        ];
        setHistoryLogs(updatedLogs);
        localStorage.setItem('touareg-offline-history', JSON.stringify(updatedLogs));
      }
    }
  }, [user, isOfflineMode]);

  // Booking Actions (Create booking, Create option, Cancel booking)
  const handleBook = async (dateString, type) => {
    const newBookingData = {
      date: dateString,
      type: type,
      userId: user.uid,
      userName: user.displayName || 'Anonymous User'
    };

    if (isOfflineMode) {
      const updated = { ...bookings, [dateString]: newBookingData };
      saveOfflineBookings(updated);
      addLog(type, dateString);
    } else {
      try {
        await setDoc(doc(db, "bookings", dateString), newBookingData);
        addLog(type, dateString);
      } catch (err) {
        console.error("Firestore write failed. Switching to offline mode.", err);
        setIsOfflineMode(true);
        const updated = { ...bookings, [dateString]: newBookingData };
        saveOfflineBookings(updated);
        addLog(type, dateString);
      }
    }
  };

  const handleCancel = async (dateString) => {
    const previousBooking = bookings[dateString];
    if (!previousBooking) return;

    const actionType = previousBooking.type === 'booked' ? 'cancelled_booking' : 'cancelled_option';

    if (isOfflineMode) {
      const updated = { ...bookings };
      delete updated[dateString];
      saveOfflineBookings(updated);
      addLog(actionType, dateString);
    } else {
      try {
        await deleteDoc(doc(db, "bookings", dateString));
        addLog(actionType, dateString);
      } catch (err) {
        console.error("Firestore delete failed. Switching to offline mode.", err);
        setIsOfflineMode(true);
        const updated = { ...bookings };
        delete updated[dateString];
        saveOfflineBookings(updated);
        addLog(actionType, dateString);
      }
    }
  };

  // Helper theme icons
  const getThemeIcon = () => {
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;
    return resolved === 'dark' ? <SunIcon /> : <MoonIcon />;
  };

  const timelineDays = getNext30Days();

  // Booking statistics helper
  const getBookingStats = () => {
    let bookedCount = 0;
    let optionCount = 0;
    
    timelineDays.forEach(d => {
      const b = bookings[d.dateString];
      if (b) {
        if (b.type === 'booked') bookedCount++;
        if (b.type === 'option') optionCount++;
      }
    });

    return { bookedCount, optionCount };
  };

  const { bookedCount, optionCount } = getBookingStats();

  // Audit Logs action description helper
  const getActionMessage = (log) => {
    switch (log.action) {
      case 'booked':
        return (
          <>
            reserved the boat for <strong>{formatTargetDate(log.targetDate)}</strong>
          </>
        );
      case 'option':
        return (
          <>
            booked a priority option for <strong>{formatTargetDate(log.targetDate)}</strong>
          </>
        );
      case 'cancelled_booking':
        return (
          <>
            cancelled the formal reservation for <strong>{formatTargetDate(log.targetDate)}</strong>
          </>
        );
      case 'cancelled_option':
        return (
          <>
            cancelled the priority option for <strong>{formatTargetDate(log.targetDate)}</strong>
          </>
        );
      default:
        return `modified the status of ${log.targetDate}`;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Decorative Blur Blobs */}
      <div className="bg-glowing-blob-1" aria-hidden="true" />
      <div className="bg-glowing-blob-2" aria-hidden="true" />

      {loading ? (
        /* Main Loading view */
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid var(--primary-bg-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Setting up layout...</span>
        </div>
      ) : !user ? (
        /* Logged Out View - Center card */
        <div className="logged-out-container">
          <div className="auth-card">
            <span className="welcome-badge">
              <CompassIcon /> Shared Boat Management
            </span>
            <h1>Touareg</h1>
            <p className="subtitle">
              Book dates, check options, and manage shared boat allocations in real-time. Login to start planning.
            </p>
            <button 
              onClick={handleGoogleLogin} 
              className="google-signin-btn"
              id="google-login-btn"
              type="button"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Dashboard Layout - Sidebar navigation + Content window */
        <>
          {/* Mobile navigation header */}
          <div className="mobile-top-bar">
            <button 
              className="mobile-hamburger" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu drawer"
              type="button"
            >
              <HamburgerIcon />
            </button>
            <div className="mobile-logo">
              <AppLogo />
              <span>Touareg</span>
            </div>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              style={{ padding: '0.4rem' }}
              aria-label="Switch theme color"
              type="button"
            >
              {getThemeIcon()}
            </button>
          </div>

          {/* Sidebar Drawer Backdrop (Mobile) */}
          <div 
            className={`sidebar-backdrop ${sidebarOpen ? 'sidebar-open' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Nav */}
          <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <AppLogo />
                <span>Touareg</span>
              </div>
              <button 
                className="sidebar-close-btn" 
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu drawer"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="sidebar-nav">
              <div 
                className={`nav-link ${activeView === 'planning' ? 'active' : ''}`}
                onClick={() => { setActiveView('planning'); setSidebarOpen(false); }}
                id="menu-item-planning"
              >
                <CalendarIcon />
                <span>Planning</span>
              </div>

              <div 
                className={`nav-link ${activeView === 'history' ? 'active' : ''}`}
                onClick={() => { setActiveView('history'); setSidebarOpen(false); }}
                id="menu-item-history"
              >
                <HistoryIcon />
                <span>History</span>
              </div>
              
              <div 
                className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }}
                id="menu-item-dashboard"
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </div>
            </nav>

            <div className="sidebar-footer">
              {/* User Identity Panel */}
              <div className="sidebar-profile">
                <img 
                  src={user.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                  alt="Avatar user" 
                  className="sidebar-avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="sidebar-user-info">
                  <span className="sidebar-username">{user.displayName || 'Member'}</span>
                  <span className="sidebar-user-email">{user.email}</span>
                </div>
              </div>

              {/* Actions panel */}
              <div className="sidebar-actions">
                <button 
                  onClick={toggleTheme} 
                  className="sidebar-theme-btn"
                  title="Toggle Light/Dark color scheme"
                  aria-label="Change theme colors"
                  type="button"
                >
                  {getThemeIcon()}
                </button>
                <button 
                  onClick={handleLogout} 
                  className="sidebar-signout-btn" 
                  title="Sign out of your session"
                  aria-label="Sign out"
                  type="button"
                >
                  <LogoutIcon />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Layout view window */}
          <div className="main-layout">
            {/* Display warning banner if database sync is local only */}
            {isOfflineMode && (
              <div className="warning-banner" role="alert">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>Firestore Cloud offline (API disabled)</strong>. Operating in local mock storage. Visit the <a href="https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=touareg-e514f" target="_blank" rel="noreferrer">Cloud Console</a> to enable Firestore.
                </span>
              </div>
            )}

            <div className="content-body">
              {activeView === 'planning' ? (
                /* Planning View */
                <section id="planning-panel">
                  <div className="planning-header">
                    <div>
                      <h1>Boat Planning</h1>
                      <p className="planning-subtitle">Consult dates, request options, and reserve dates for boat usage.</p>
                    </div>
                    <div className="planning-stats">
                      <div className="stat-pill">
                        <span className="stat-dot booked" />
                        <span>{bookedCount} Booked</span>
                      </div>
                      <div className="stat-pill">
                        <span className="stat-dot option" />
                        <span>{optionCount} Options</span>
                      </div>
                    </div>
                  </div>

                  <div className="planning-list">
                    {timelineDays.map((day) => {
                      const booking = bookings[day.dateString];
                      const isBooked = booking?.type === 'booked';
                      const isOption = booking?.type === 'option';
                      const belongsToMe = booking?.userId === user.uid;
                      
                      let rowStatusClass = "status-available";
                      if (isBooked) rowStatusClass = "status-booked";
                      if (isOption) rowStatusClass = "status-option";

                      return (
                        <div 
                          className={`day-row ${rowStatusClass}`} 
                          key={day.dateString}
                          id={`row-${day.dateString}`}
                        >
                          {/* Left: Date indicators */}
                          <div className="date-badge">
                            <span className="day-number">{day.dateNumber}</span>
                            <span className="day-name-short">{day.dayNameShort}</span>
                          </div>

                          {/* Middle: Day labels */}
                          <div className="day-info">
                            <span className="day-name">{day.dayName}</span>
                            <span className="month-name">{day.monthName}</span>
                          </div>

                          {/* Right Middle: Booking Status indicator */}
                          <div className="booking-status-col">
                            {isBooked ? (
                              <span className="status-pill booked">
                                <BookIcon /> Reserved by {booking.userName} {belongsToMe && "(You)"}
                              </span>
                            ) : isOption ? (
                              <span className="status-pill option">
                                <StarIcon /> Option by {booking.userName} {belongsToMe && "(You)"}
                              </span>
                            ) : (
                              <span className="status-pill available">
                                Available
                              </span>
                            )}
                          </div>

                          {/* Right: Booking Buttons */}
                          <div className="row-actions">
                            {/* If available, show primary Book and secondary Option button */}
                            {!booking && (
                              <>
                                <button 
                                  onClick={() => handleBook(day.dateString, 'booked')} 
                                  className="btn-action btn-book"
                                  id={`btn-book-${day.dateString}`}
                                  type="button"
                                >
                                  Book Boat
                                </button>
                                <button 
                                  onClick={() => handleBook(day.dateString, 'option')} 
                                  className="btn-action btn-option"
                                  id={`btn-opt-${day.dateString}`}
                                  type="button"
                                >
                                  Book Option
                                </button>
                              </>
                            )}

                            {/* If formally booked by current user, show cancel */}
                            {isBooked && belongsToMe && (
                              <button 
                                onClick={() => handleCancel(day.dateString)} 
                                className="btn-action btn-cancel"
                                id={`btn-cancel-${day.dateString}`}
                                type="button"
                              >
                                Cancel Booking
                              </button>
                            )}

                            {/* If booked by someone else but no option exists, still allow to place an option! */}
                            {isBooked && !belongsToMe && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                Fully Reserved
                              </span>
                            )}

                            {/* If it is an option (tentative) by current user, show cancel */}
                            {isOption && belongsToMe && (
                              <button 
                                onClick={() => handleCancel(day.dateString)} 
                                className="btn-action btn-cancel"
                                id={`btn-cancel-${day.dateString}`}
                                type="button"
                              >
                                Cancel Option
                              </button>
                            )}

                            {/* If option is held by someone else, anyone can upgrade it to a formal booking! */}
                            {isOption && !belongsToMe && (
                              <button 
                                onClick={() => handleBook(day.dateString, 'booked')} 
                                className="btn-action btn-book"
                                id={`btn-upgrade-${day.dateString}`}
                                type="button"
                              >
                                Book Boat
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : activeView === 'history' ? (
                /* History Log Timeline View */
                <section id="history-panel">
                  <div className="planning-header">
                    <div>
                      <h1>Audit History Log</h1>
                      <p className="planning-subtitle">Consult all changes and reservation activities recorded in the system.</p>
                    </div>
                  </div>

                  <div className="history-timeline">
                    {historyLogs.length === 0 ? (
                      <div className="history-empty-state">
                        <HistoryIcon />
                        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-h)' }}>No changes logged yet</p>
                        <p style={{ fontSize: '0.9rem' }}>Activity will be recorded here when users book or cancel boat usage.</p>
                      </div>
                    ) : (
                      historyLogs.map((log) => {
                        let actionClass = `act-${log.action}`;
                        let actionLabel = log.action;
                        if (log.action === 'cancelled_booking') actionLabel = 'Cancelled reservation';
                        if (log.action === 'cancelled_option') actionLabel = 'Cancelled option';
                        if (log.action === 'booked') actionLabel = 'Booked boat';
                        if (log.action === 'option') actionLabel = 'Booked option';

                        return (
                          <div className={`history-card ${actionClass}`} key={log.id}>
                            <img 
                              src={log.userPhoto || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                              alt="" 
                              className="history-card-avatar"
                              referrerPolicy="no-referrer"
                            />
                            <div className="history-card-content">
                              <div className="history-card-header">
                                <div>
                                  <span className="history-user">{log.userName}</span>
                                  <span className={`history-action-badge ${log.action}`}>
                                    {actionLabel}
                                  </span>
                                </div>
                                <span className="history-time">{formatLogTime(log.timestamp)}</span>
                              </div>
                              <div className="history-card-details">
                                {log.userName} {getActionMessage(log)}.
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              ) : (
                /* Home Dashboard view details */
                <section id="dashboard-panel">
                  <div className="planning-header">
                    <div>
                      <h1>Member Dashboard</h1>
                      <p className="planning-subtitle">Overview of your shared community boat statistics and details.</p>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    <div className="dashboard-card-mini">
                      <h2><CompassIcon /> Shared Boat</h2>
                      <p>Touareg Boat status: Active. Docked in berth A-15. Check safety protocols before setting sail.</p>
                    </div>
                    <div className="dashboard-card-mini">
                      <h2><CalendarIcon /> Active Bookings</h2>
                      <p>Currently consulting schedule timeline. We have registered {bookedCount} active reservation(s) and {optionCount} option request(s) on the roster.</p>
                    </div>
                    <div className="dashboard-card-mini">
                      <h2><UserIcon /> Account Details</h2>
                      <p>Logged in as: <strong>{user.displayName}</strong> ({user.email}). Identity status synchronized with Google OAuth client provider.</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
