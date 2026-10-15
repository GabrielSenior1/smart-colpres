import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, rtdb } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';

// Define the two allowed teacher emails here
const ALLOWED_EMAILS = ['gabriel.senior.daza@gmail.com', 'rovimartinez@gmail.com'];

// Eliminamos las actividades estáticas
// const ACTIVITIES = [...]

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  
  // Real-time states
  const [activeStudents, setActiveStudents] = useState(0);
  const [activeSessions, setActiveSessions] = useState({}); // { pin: { state, students } }
  const [activities, setActivities] = useState({}); // Dynamic activities
  const [reports, setReports] = useState({}); // Historical reports
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'activeGames', 'classes'
  
  // Configuration settings for activities
  const [activitySettings, setActivitySettings] = useState({});

  // Expanded report for viewing details
  const [expandedReportPin, setExpandedReportPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSetting = (activityId, setting) => {
    setActivitySettings(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [setting]: !prev[activityId]?.[setting]
      }
    }));
  };

  const setSetting = (activityId, setting, value) => {
    setActivitySettings(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [setting]: value
      }
    }));
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    
    // Listen to all sessions
    const sessionsRef = ref(rtdb, 'sessions');
    const unsubscribeSessions = onValue(sessionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        const now = Date.now();
        let cleanedSessions = { ...sessionsData };
        
        // Clean up ghost sessions older than 4 hours, or completely broken ones without state
        Object.entries(sessionsData).forEach(([pin, session]) => {
          if (!session.state || (session.state.createdAt && (now - session.state.createdAt > 4 * 60 * 60 * 1000))) {
            set(ref(rtdb, `sessions/${pin}`), null).catch(console.error);
            delete cleanedSessions[pin];
          }
        });

        setActiveSessions(cleanedSessions);
        
        let totalActiveStudents = 0;
        Object.values(cleanedSessions).forEach(session => {
          if (session.students) {
            totalActiveStudents += Object.values(session.students).filter(s => s.status !== 'kicked').length;
          }
        });
        setActiveStudents(totalActiveStudents);
      } else {
        setActiveSessions({});
        setActiveStudents(0);
      }
    });

    // Listen to activities
    const activitiesRef = ref(rtdb, 'activities');
    const unsubscribeActivities = onValue(activitiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setActivities(data);
      } else {
        setActivities({});
      }
    });

    // Listen to reports
    const reportsRef = ref(rtdb, 'reports');
    const unsubscribeReports = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        setReports(snapshot.val());
      } else {
        setReports({});
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSessions();
      unsubscribeActivities();
      unsubscribeReports();
    };
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      
      // Check if the email is in the allowed list
      if (!ALLOWED_EMAILS.includes(email)) {
        await signOut(auth);
        setAuthError('Access denied: This email is not authorized.');
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      setAuthError('Error during login. Try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit PIN
  };

  const handleHostActivity = async (activity) => {
    // Buscar si ya hay una sesión activa para esta actividad
    const existingSessionEntry = Object.entries(activeSessions).find(
      ([pin, session]) => session.state && session.state.activityId === activity.id
    );

    if (existingSessionEntry) {
      // Reanudar la sesión existente
      const [pin] = existingSessionEntry;
      navigate(`/teacher/live/${pin}`);
    } else {
      // Crear nueva sesión con PIN
      let newPin = generatePin();
      
      const newSessionRef = ref(rtdb, `sessions/${newPin}/state`);
      const sessionMode = activitySettings[activity.id]?.mode || 'teacher-paced';
      await set(newSessionRef, {
        activityId: activity.id,
        activityTitle: activity.title,
        showAnswers: !!activitySettings[activity.id]?.showAnswers,
        mode: sessionMode,
        status: sessionMode === 'student-paced' ? 'quiz' : 'waiting',
        createdAt: Date.now()
      });
      
      navigate(`/teacher/live/${newPin}`);
    }
  };

  const handleStopHost = async (pin) => {
    if (window.confirm('¿Estás seguro de que quieres apagar este juego? Todos los estudiantes serán desconectados.')) {
      try {
        await set(ref(rtdb, `sessions/${pin}`), null);
      } catch (e) {
        console.error("Error stopping host:", e);
      }
    }
  };

  const handleDeleteReport = async (actId, pin) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte del historial? Esta acción no se puede deshacer.')) {
      try {
        await set(ref(rtdb, `reports/${actId}/${pin}`), null);
      } catch (e) {
        console.error("Error eliminando reporte:", e);
      }
    }
  };

  if (loadingAuth) {
    return <div className="flex h-screen items-center justify-center bg-background"><span className="text-primary font-bold">Cargando...</span></div>;
  }

  // If not logged in, show a simple login screen
  if (!user) {
    return (
      <div className="bg-pattern animate-slide-bg min-h-screen flex items-center justify-center p-4 font-body-md text-body-md relative overflow-hidden">
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>

        <div className="bg-surface-container-lowest/90 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl border border-primary/20 max-w-md w-full text-center relative z-10 transform transition-all hover:scale-[1.01]">
          
          <div className="h-28 mb-6 mx-auto flex items-center justify-center">
            <img 
              src="/Escudos-Presentacion-2020-08-scaled.png" 
              alt="Colegio de la Presentación" 
              className="h-full object-contain drop-shadow-md"
            />
          </div>
          
          <h1 className="text-headline-lg font-headline-lg font-extrabold text-primary mb-2 tracking-tight">Portal Docente</h1>
          <p className="text-on-surface-variant mb-8 text-label-lg font-label-lg">Administra tus actividades interactivas y supervisa a tus estudiantes en tiempo real.</p>
          
          {authError && (
            <div className="bg-error-container/80 backdrop-blur-sm text-on-error-container p-4 rounded-xl mb-6 text-sm font-bold border border-error/20 flex items-center gap-2 text-left">
              <span className="material-symbols-outlined shrink-0">error</span>
              <p>{authError}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-on-primary py-4 px-6 rounded-2xl font-label-lg text-label-lg btn-primary-3d flex items-center justify-center gap-3 shadow-lg hover:brightness-110 active:scale-95 transition-all mb-4">
            <img className="w-6 h-6 object-contain bg-white rounded-full p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbrnvEYiXRF1gr130F6_prrLkbsym1sCgJXXpAiPwWkn2RNYXPV8OvUgozPT5Jk4r2pclJkvak81rG9o8rzhmH3dvHEukOwRzYiwfX5xOA9Uai-Eh3nJMmckgj-PUNKw5CA1jSoX8Y-XPyGsE_eSwFBFERxpuYw7JWceOl5eg4xK_SwKDGRGtG_An9P6MHHe1yyUpQNpKrge1gcXcoz7lspGKOEfKlW81StXN6kTcHAweLnmqwNqo" alt="Google" />
            Acceder con Google
          </button>
          
          <p className="text-xs text-on-surface-variant/60 font-bold tracking-widest uppercase mt-6">Acceso Restringido</p>
        </div>
      </div>
    );
  }

  // Helper for active navigation styling
  const navItemClass = (tabName) => 
    `flex items-center gap-4 py-3 px-6 transition-all rounded-r-full cursor-pointer ${
      activeTab === tabName 
        ? 'text-primary-fixed-dim bg-primary-container font-bold active:scale-[0.98]' 
        : 'text-on-surface-variant hover:bg-surface-container-highest active:scale-[0.98]'
    }`;

  // Filtered and sorted activities (newest/highest numbers first)
  const filteredActivities = Object.entries(activities)
    .sort(([idA, actA], [idB, actB]) => {
      const numA = parseInt(idA.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(idB.replace(/\D/g, ''), 10) || 0;
      if (numA !== numB) return numB - numA;
      return (actA.title || '').localeCompare(actB.title || '');
    })
    .filter(([id, activity]) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (activity.title || '').toLowerCase().includes(q) ||
             (activity.subject || '').toLowerCase().includes(q) ||
             id.toLowerCase().includes(q);
    });

  // If logged in and allowed, show the dashboard
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-body-md text-body-md pb-24 md:pb-0 pt-[72px] md:pt-0">
      {/* Top App Bar (Mobile Only) */}
      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile py-base bg-surface-container-lowest shadow-sm fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">Smart-Colpres</span>
        </div>
        <div className="flex gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-100">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-100">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Side Nav Bar (Desktop Only) */}
      <nav className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low border-r border-outline-variant shadow-md fixed left-0 top-0 z-40">
        <div className="p-6 flex flex-col items-center border-b border-outline-variant/30">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-12 w-12 mb-4 rounded-full border-2 border-primary" />
          ) : (
            <div className="h-12 w-12 mb-4 bg-primary rounded-full"></div>
          )}
          <h2 className="text-label-lg font-label-lg font-bold text-primary text-center leading-tight">{user.displayName}</h2>
          <p className="text-xs text-on-surface-variant mt-1">Santa Marta Portal</p>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 pr-4">
            <li>
              <a onClick={() => setActiveTab('dashboard')} className={navItemClass('dashboard')}>
                <span className="material-symbols-outlined fill">dashboard</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab('activeGames')} className={navItemClass('activeGames')}>
                <span className="material-symbols-outlined fill">play_circle</span>
                <span>Active Games</span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab('classes')} className={navItemClass('classes')}>
                <span className="material-symbols-outlined fill">group</span>
                <span>Classes</span>
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab('history')} className={navItemClass('history')}>
                <span className="material-symbols-outlined fill">history</span>
                <span>Historial</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="p-6 border-t border-outline-variant/30 flex flex-col gap-3">
          <button onClick={() => setActiveTab('dashboard')} className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg btn-3d flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Activity
          </button>
          <button onClick={handleLogout} className="w-full bg-surface-container text-error py-2 rounded-lg text-sm font-bold hover:bg-error-container transition-colors">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen">
        
        {activeTab === 'dashboard' && (
          <>
            <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">Welcome Back, {user.displayName?.split(' ')[0]}!</h1>
                <p className="text-on-surface-variant text-body-md font-body-md">Ready to engage your students today?</p>
              </div>
            </section>

            {/* Quick Stats Bento */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-game-gap mb-8">
              <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-primary/20 flex items-center justify-between">
                <div>
                  <p className="text-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Active Students</p>
                  <p className="text-headline-lg font-headline-lg text-primary">{activeStudents}</p>
                </div>
                <div className="bg-primary-container text-on-primary-container p-3 rounded-full">
                  <span className="material-symbols-outlined text-3xl fill">groups</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-primary/20 flex items-center justify-between">
                <div>
                  <p className="text-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Active Hosted Games</p>
                  <p className="text-headline-lg font-headline-lg text-primary">{Object.keys(activeSessions).length}</p>
                </div>
                <div className="bg-secondary-fixed text-on-secondary-fixed p-3 rounded-full">
                  <span className="material-symbols-outlined text-3xl fill">play_circle</span>
                </div>
              </div>
            </section>

            {/* Dashboard Grid */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-primary">Mis Actividades</h2>
                  <p className="text-xs text-on-surface-variant">Mostrando las más recientes primero</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar actividad o tema..."
                    className="w-full pl-10 pr-8 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-sm font-bold">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {filteredActivities.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2">search_off</span>
                  <p className="text-on-surface-variant font-bold">No se encontraron actividades con "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-game-gap">
                  {filteredActivities.map(([activityId, activity]) => {
                    const hostedSessionEntry = Object.entries(activeSessions).find(
                      ([pin, session]) => session.state && session.state.activityId === activityId
                    );
                    const isHosted = !!hostedSessionEntry;
                    const hostedPin = hostedSessionEntry ? hostedSessionEntry[0] : null;
                    const isNew = activityId === 'activity_13';

                    return (
                      <div key={activityId} className={`bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border ${isHosted ? 'border-secondary-container bg-secondary-fixed/5' : isNew ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-outline-variant'} flex flex-col justify-between relative overflow-hidden transition-colors`}>
                        {isHosted && (
                          <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                            LIVE NOW
                          </div>
                        )}
                        
                        <div className="flex-1 mb-4">
                          <div className="flex items-center justify-between gap-2 mb-2 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-on-surface-variant fill">article</span>
                              <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">{activity.subject}</span>
                            </div>
                            {isNew && (
                              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                NUEVA
                              </span>
                            )}
                          </div>
                          <h3 className="text-headline-sm-mobile md:text-headline-sm font-headline-sm-mobile md:font-headline-sm font-bold text-primary mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">
                            {activity.questions?.length || 0} questions • Autogenerated
                          </p>
                          
                          {/* Settings Panel */}
                          <div className="mt-2 bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex flex-col gap-3">
                            
                            {/* Mode Selector */}
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Modo de Juego</span>
                              <div className="flex bg-surface-container-lowest rounded-lg p-1 border border-outline-variant/50">
                                <button 
                                  onClick={() => setSetting(activityId, 'mode', 'teacher-paced')}
                                  className={`flex-1 text-xs font-bold py-1.5 px-2 rounded-md transition-colors ${(!activitySettings[activityId]?.mode || activitySettings[activityId]?.mode === 'teacher-paced') ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                                  Proyector
                                </button>
                                <button 
                                  onClick={() => setSetting(activityId, 'mode', 'student-paced')}
                                  className={`flex-1 text-xs font-bold py-1.5 px-2 rounded-md transition-colors ${activitySettings[activityId]?.mode === 'student-paced' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                                  A tu Ritmo
                                </button>
                              </div>
                            </div>
                            
                            <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="accent-primary w-4 h-4 cursor-pointer"
                                checked={!!activitySettings[activityId]?.showAnswers}
                                onChange={() => toggleSetting(activityId, 'showAnswers')}
                              />
                              Mostrar respuestas a estudiantes
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full mt-2">
                          <button 
                            onClick={() => handleHostActivity({ id: activityId, title: activity.title })}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-95 ${
                              isHosted 
                                ? 'bg-secondary-container text-on-secondary-container hover:bg-[#b38702] hover:text-white' 
                                : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                            }`}>
                            <span className="material-symbols-outlined fill">{isHosted ? 'podium' : 'play_arrow'}</span>
                            {isHosted ? 'Resume Host' : 'Host'}
                          </button>
                          
                          <button 
                            onClick={() => navigate(`/teacher/edit/${activityId}`)}
                            className="flex items-center justify-center w-12 h-12 bg-surface-container-highest text-on-surface rounded-full shadow-md hover:bg-surface-variant transition-colors shrink-0"
                            title="Editar Actividad"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          
                          {isHosted && (
                            <button 
                              onClick={() => handleStopHost(hostedPin)}
                              className="flex items-center justify-center w-12 h-12 bg-error-container text-on-error-container rounded-full shadow-md hover:bg-error hover:text-on-error transition-colors shrink-0"
                              title="Apagar Host"
                            >
                              <span className="material-symbols-outlined">power_settings_new</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'activeGames' && (
          <section className="flex flex-col h-full p-2">
            <h2 className="text-headline-md font-headline-md text-primary mb-6">Active Games</h2>
            {Object.keys(activeSessions).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">play_circle</span>
                <p className="text-on-surface-variant">No active games right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(activeSessions).map(([pin, session]) => (
                  <div key={pin} className="bg-surface-container-lowest p-4 rounded-xl shadow border border-outline-variant flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-primary">{session.state?.activityTitle || 'Quiz Session'}</h3>
                      <p className="text-sm text-on-surface-variant">PIN: {pin}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/teacher/live/${pin}`)} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold btn-3d hover:brightness-110">
                        Entrar (Join)
                      </button>
                      <button onClick={() => handleStopHost(pin)} className="bg-error-container text-on-error-container px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-error/20 hover:bg-error hover:text-on-error transition-colors">
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'classes' && (
          <section className="flex flex-col items-center justify-center h-full text-center p-8">
            <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">group</span>
            <h2 className="text-headline-md font-headline-md text-primary mb-2">My Classes</h2>
            <p className="text-on-surface-variant">Here you can manage your students and view their overall progress.</p>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">history</span>
              <div>
                <h2 className="text-headline-md font-bold text-primary leading-tight">Historial de Actividades</h2>
                <p className="text-on-surface-variant">Revisa los resultados y reportes de juegos anteriores.</p>
              </div>
            </div>

            {Object.keys(reports).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">inbox</span>
                <p className="text-on-surface-variant font-bold text-lg">Aún no hay reportes guardados.</p>
                <p className="text-on-surface-variant text-sm mt-2">Los reportes aparecerán aquí cuando finalices un quiz y hagas clic en "Guardar Reporte".</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="p-4 text-label-lg font-bold text-on-surface-variant">Día / Hora</th>
                        <th className="p-4 text-label-lg font-bold text-on-surface-variant">Actividad</th>
                        <th className="p-4 text-label-lg font-bold text-on-surface-variant">Grupo (Cursos)</th>
                        <th className="p-4 text-label-lg font-bold text-on-surface-variant">Estudiantes</th>
                        <th className="p-4 text-label-lg font-bold text-on-surface-variant text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-body-md font-body-md">
                      {Object.entries(reports)
                        .flatMap(([actId, activityReports]) => {
                          return Object.entries(activityReports).map(([pin, report]) => ({ actId, pin, report }));
                        })
                        .sort((a, b) => b.report.date - a.report.date)
                        .map(({ actId, pin, report }) => {
                          const date = new Date(report.date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                          // Obtener los cursos únicos
                          const courses = report.students ? [...new Set(report.students.map(s => s.course))] : [];
                          const coursesStr = courses.length > 0 ? courses.join(', ') : 'N/A';
                          const studentsCount = report.students ? report.students.length : 0;
                          
                          return (
                            <React.Fragment key={`${actId}-${pin}`}>
                              <tr className="border-b border-outline-variant hover:bg-surface-container-highest transition-colors">
                                <td className="p-4 text-on-surface-variant font-bold">{date}</td>
                                <td className="p-4 text-primary font-bold">{report.activityTitle}</td>
                                <td className="p-4 text-on-surface-variant">
                                  <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-bold border border-outline-variant">
                                    {coursesStr}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">groups</span>
                                    <span className="font-bold text-on-surface">{studentsCount} participantes</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button 
                                      onClick={() => setExpandedReportPin(expandedReportPin === pin ? null : pin)}
                                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors"
                                      title="Ver Calificaciones"
                                    >
                                      <span className="material-symbols-outlined text-sm">{expandedReportPin === pin ? 'expand_less' : 'visibility'}</span>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteReport(actId, pin)}
                                      className="w-10 h-10 flex items-center justify-center rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
                                      title="Eliminar Reporte"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expandedReportPin === pin && (
                                <tr className="bg-surface-container-lowest">
                                  <td colSpan="5" className="p-0">
                                    <div className="p-4 border-b border-outline-variant bg-surface-container-highest/20">
                                      <h4 className="font-bold text-primary mb-3">Calificaciones de Estudiantes</h4>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse bg-surface-container-lowest rounded-xl shadow-sm">
                                          <thead>
                                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                              <th className="p-3 text-label-sm font-bold text-on-surface-variant">Estudiante</th>
                                              <th className="p-3 text-label-sm font-bold text-on-surface-variant">Curso</th>
                                              <th className="p-3 text-label-sm font-bold text-on-surface-variant text-center">Aciertos</th>
                                              <th className="p-3 text-label-sm font-bold text-on-surface-variant text-center">Nota Gral</th>
                                              {report.students && report.students.length > 0 && report.students[0].sectionScores && Object.keys(report.students[0].sectionScores).map(sec => (
                                                <th key={sec} className="p-3 text-label-sm font-bold text-on-surface-variant text-center capitalize">Nota {sec}</th>
                                              ))}
                                              <th className="p-3 text-label-sm font-bold text-on-surface-variant">Desempeño</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {report.students && report.students.length > 0 ? (
                                              report.students.map((student, idx) => (
                                                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                                                  <td className="p-3 font-bold text-on-surface">{student.name}</td>
                                                  <td className="p-3 text-on-surface-variant">{student.course || 'N/A'}</td>
                                                  <td className="p-3 text-center text-on-surface-variant">{student.correctCount ?? '-'}</td>
                                                  <td className="p-3 font-bold text-primary text-center text-lg">{student.score?.toFixed(1) || '0.0'}</td>
                                                  {student.sectionScores && Object.values(student.sectionScores).map((secScore, i) => (
                                                    <td key={i} className="p-3 font-bold text-primary text-center">
                                                      {secScore.toFixed(1)}
                                                    </td>
                                                  ))}
                                                  <td className="p-3 text-on-surface-variant">
                                                    <span className="bg-surface-container px-2 py-1 rounded-lg text-xs font-bold border border-outline-variant">
                                                      {student.classification || '-'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td colSpan="5" className="p-4 text-center text-on-surface-variant text-sm">No hay datos de estudiantes.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
