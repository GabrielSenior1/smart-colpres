import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentWaitingRoom() {
  const [isExpelled, setIsExpelled] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-pattern animate-slide-bg min-h-screen overflow-hidden font-body-md text-on-surface flex flex-col relative select-none">
      
      {/* ALERT BANNER OVERLAY */}
      {isExpelled && (
        <div className="fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
          <div className="bg-error text-on-error w-full px-margin-mobile md:px-margin-desktop py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl fill">warning</span>
              <p className="font-label-lg text-label-lg uppercase tracking-wider text-center sm:text-left">
                Your name and course have been removed by the teacher, please re-enter them
              </p>
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="bg-surface-container-lowest text-error font-label-lg text-label-lg px-6 py-3 rounded-full font-bold shadow-md hover:bg-surface-container-low transition-colors whitespace-nowrap">
              Re-enter Info
            </button>
          </div>
          <div className="h-screen w-full bg-surface-dim/30 backdrop-blur-sm interaction-blocker absolute top-full left-0"></div>
        </div>
      )}

      {/* MAIN WAITING ROOM CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10 w-full h-full">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-primary-fixed-dim opacity-50 animate-pulse-ring"></div>
          <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-primary-fixed opacity-30 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary bg-surface-container-lowest shadow-lg overflow-hidden flex items-center justify-center z-10">
            <div className="w-full h-full bg-blue-200"></div>
          </div>
        </div>
        
        <div className="text-center max-w-lg mx-auto bg-surface-container-lowest/80 backdrop-blur-md px-8 py-6 rounded-3xl shadow-sm border border-primary-fixed-dim">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-2 flex items-center justify-center gap-2">
            Waiting for teacher
            <span className="flex gap-1 items-baseline h-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Get ready! The quiz will begin on the classroom screen shortly.
          </p>
        </div>
      </main>
      
      {/* Dev button just to test expelled state visually */}
      <button 
        onClick={() => setIsExpelled(!isExpelled)}
        className="fixed bottom-4 right-4 bg-gray-200 text-black px-2 py-1 text-xs rounded z-50">
        Toggle Expelled State (Dev)
      </button>
    </div>
  );
}
