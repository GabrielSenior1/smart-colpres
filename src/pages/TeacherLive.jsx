import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherLive() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-body-md overflow-hidden">
      {/* Top App Bar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-desktop py-base z-10 relative">
        <div className="flex items-center gap-4">
          <span className="text-headline-lg font-headline-lg font-bold text-primary">EduPlay</span>
          <span className="text-on-surface-variant font-label-lg text-label-lg ml-4">Active Session: Science Quiz 101</span>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button className="hover:bg-surface-container p-2 rounded-full transition-colors active:scale-95 duration-100">
            <span className="material-symbols-outlined fill">notifications</span>
          </button>
          <button className="hover:bg-surface-container p-2 rounded-full transition-colors active:scale-95 duration-100">
            <span className="material-symbols-outlined fill">settings</span>
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="w-full flex flex-col lg:flex-row h-full transition-opacity duration-300" id="view-waiting">
          
          {/* Left Side: QR Code & Pin */}
          <section className="lg:w-5/12 bg-surface-container-low p-margin-desktop flex flex-col items-center justify-center border-r border-outline-variant relative">
            <div className="text-center mb-8">
              <h2 className="text-headline-xl font-headline-xl text-primary mb-2">Join at eduplay.it</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">or scan the QR code</p>
            </div>
            
            <div className="bg-surface-container-lowest p-card-padding rounded-xl card-shadow border-2 border-primary mb-8 w-64 h-64 flex items-center justify-center">
              <img className="w-full h-full object-contain" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduPlay" alt="QR Code" />
            </div>
            
            <div className="bg-primary-container text-on-primary-container rounded-xl px-12 py-6 text-center shadow-lg border-b-4 border-[#00004c]">
              <span className="block text-label-lg font-label-lg mb-1 opacity-80 uppercase tracking-widest">Game PIN</span>
              <span className="text-headline-xl font-headline-xl tracking-[0.2em] font-bold">482 913</span>
            </div>
          </section>
          
          {/* Right Side: Waiting Room */}
          <section className="lg:w-7/12 p-margin-desktop flex flex-col h-full bg-surface-bright">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-lg font-headline-lg text-primary flex items-center gap-2">
                Waiting Room
                <span className="bg-secondary-container text-on-secondary-container text-label-lg font-label-lg px-3 py-1 rounded-full ml-2">12 Joined</span>
              </h2>
              <button onClick={() => navigate('/results')} className="bg-surface-container-highest text-on-surface hover:bg-surface-container transition-colors px-4 py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-2 card-shadow">
                <span className="material-symbols-outlined">switch_access_shortcut</span>
                End Quiz / Results
              </button>
            </div>
            
            {/* Students Grid */}
            <div className="flex-1 overflow-y-auto pr-4 pb-32">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Student 1 */}
                <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant card-shadow group relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <div className="w-full h-full bg-red-200"></div>
                  </div>
                  <span className="font-label-lg text-label-lg truncate">Alex</span>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-error-container text-on-error-container p-1.5 rounded-full transition-opacity hover:bg-error hover:text-on-error" title="Kick Player">
                    <span className="material-symbols-outlined text-sm">person_remove</span>
                  </button>
                </div>
                {/* Student 2 */}
                <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant card-shadow group relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <div className="w-full h-full bg-green-200"></div>
                  </div>
                  <span className="font-label-lg text-label-lg truncate">Maria</span>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-error-container text-on-error-container p-1.5 rounded-full transition-opacity hover:bg-error hover:text-on-error" title="Kick Player">
                    <span className="material-symbols-outlined text-sm">person_remove</span>
                  </button>
                </div>
                {/* Student 3 */}
                <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant card-shadow group relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shrink-0 bg-secondary-fixed flex items-center justify-center">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-secondary-fixed">S</span>
                  </div>
                  <span className="font-label-lg text-label-lg truncate">Sam</span>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-error-container text-on-error-container p-1.5 rounded-full transition-opacity hover:bg-error hover:text-on-error" title="Kick Player">
                    <span className="material-symbols-outlined text-sm">person_remove</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
