import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Define the two allowed teacher emails here
const ALLOWED_EMAILS = ['gabriel.senior.daza@gmail.com', 'rovimartinez@gmail.com'];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      
      // Check if the email is in the allowed list
      if (!ALLOWED_EMAILS.includes(email)) {
        // If not allowed, sign them out immediately
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

  // If logged in and allowed, show the dashboard
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-body-md text-body-md pb-24 md:pb-0 pt-[72px] md:pt-0">
      {/* Top App Bar (Mobile Only) */}
      <header className="md:hidden flex justify-between items-center w-full px-margin-mobile py-base bg-surface-container-lowest shadow-sm fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">EduPlay</span>
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
              <a className="flex items-center gap-4 text-primary-fixed-dim bg-primary-container font-bold rounded-r-full py-3 px-6 hover:bg-surface-container-highest transition-all active:scale-[0.98]" href="#">
                <span className="material-symbols-outlined fill">dashboard</span>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-r-full" href="#">
                <span className="material-symbols-outlined fill">play_circle</span>
                <span>Active Games</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-r-full" href="#">
                <span className="material-symbols-outlined fill">group</span>
                <span>Classes</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-r-full" href="#">
                <span className="material-symbols-outlined fill">assessment</span>
                <span>Reports</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="p-6 border-t border-outline-variant/30 flex flex-col gap-3">
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg btn-3d flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Start New Quiz
          </button>
          <button onClick={handleLogout} className="w-full bg-surface-container text-error py-2 rounded-lg text-sm font-bold hover:bg-error-container transition-colors">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen">
        <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-primary mb-2">Welcome Back, {user.displayName?.split(' ')[0]}!</h1>
            <p className="text-on-surface-variant text-body-md font-body-md">Ready to engage your students today?</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={() => navigate('/teacher/live')} className="flex-1 md:flex-none bg-secondary-container text-on-secondary-container py-3 px-6 rounded-lg font-label-lg text-label-lg btn-3d flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">rocket_launch</span>
              Launch Live
            </button>
          </div>
        </section>

        {/* Quick Stats Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-game-gap mb-8">
          <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Active Students</p>
              <p className="text-headline-lg font-headline-lg text-primary">142</p>
            </div>
            <div className="bg-primary-container text-on-primary-container p-3 rounded-full">
              <span className="material-symbols-outlined text-3xl fill">groups</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Quizzes Played</p>
              <p className="text-headline-lg font-headline-lg text-primary">28</p>
            </div>
            <div className="bg-secondary-fixed text-on-secondary-fixed p-3 rounded-full">
              <span className="material-symbols-outlined text-3xl fill">quiz</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Avg. Score</p>
              <p className="text-headline-lg font-headline-lg text-primary">85%</p>
            </div>
            <div className="bg-tertiary-fixed text-on-tertiary-fixed p-3 rounded-full">
              <span className="material-symbols-outlined text-3xl fill">moving</span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-primary">My Activities</h2>
            <a className="text-primary font-label-lg text-label-lg hover:underline flex items-center gap-1" href="#">View All <span className="material-symbols-outlined">arrow_forward</span></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-game-gap">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-outline-variant/30 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-32 bg-primary-fixed-dim relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <span className="absolute bottom-2 right-2 bg-background text-on-background text-xs px-2 py-1 rounded-full font-bold">12 Qs</span>
              </div>
              <div className="p-4">
                <h3 className="text-label-lg font-label-lg text-on-surface mb-1 line-clamp-1">Intro to Biology</h3>
                <p className="text-sm text-on-surface-variant mb-4">Grade 6 Science</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-surface-container text-on-surface py-2 rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-colors">Edit</button>
                  <button onClick={() => navigate('/teacher/live')} className="flex-1 bg-primary text-on-primary py-2 rounded-lg text-sm font-bold btn-3d">Host</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
