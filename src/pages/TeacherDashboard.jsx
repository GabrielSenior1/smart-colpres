import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();

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
          <div className="h-12 w-12 mb-4 bg-primary rounded-full"></div>
          <h2 className="text-label-lg font-label-lg font-bold text-primary">Santa Marta</h2>
          <p className="text-sm text-on-surface-variant">EduPlay Portal</p>
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
        <div className="p-6 border-t border-outline-variant/30">
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg btn-3d flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Start New Quiz
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen">
        <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-primary mb-2">Welcome Back, Prof. Gomez!</h1>
            <p className="text-on-surface-variant text-body-md font-body-md">Ready to engage your students today?</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-surface-container-lowest text-on-surface border border-outline-variant py-3 px-6 rounded-lg font-label-lg text-label-lg btn-3d flex items-center justify-center gap-3 shadow-sm">
              Login with Google
            </button>
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
