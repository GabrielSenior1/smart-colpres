import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';

export default function StudentQuiz() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [studentId, setStudentId] = useState('');
  
  const totalTime = 15;

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) {
      navigate('/');
      return;
    }
    setStudentId(id);

    // 1. Anti-Cheat: Detect if they leave the tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // They left the tab! Flag them as cheating
        update(ref(rtdb, `session/students/${id}`), {
          cheated: true
        }).catch(err => console.error("Error setting cheat flag", err));
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Synchronize Timer with Teacher's Start Time
    const stateRef = ref(rtdb, `session/state`);
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        if (state.status === 'results') {
           // Teacher ended quiz early
           navigate('/results');
        } else if (state.status === 'quiz' && state.startedAt) {
           // Calculate time left based on server/start time
           const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
           const remaining = Math.max(0, totalTime - elapsedSeconds);
           setTimeLeft(remaining);
        }
      }
    });

    // Local countdown interval to update UI smoothly
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up! Wait 1 second then go to results
          setTimeout(() => navigate('/results'), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
      clearInterval(timer);
    };
  }, [navigate]);

  const handleSelectOption = (option) => {
    if (timeLeft <= 0) return; // Prevent answering after time is up
    
    setSelectedOption(option);
    
    // Save to Firebase immediately
    if (studentId) {
      update(ref(rtdb, `session/students/${studentId}`), {
        answer: option,
        answeredAt: Date.now() // to calculate how fast they answered
      }).catch(err => console.error("Error saving answer", err));
    }
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (timeLeft / totalTime) * circumference;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="bg-surface h-screen flex flex-col overflow-hidden text-on-surface font-body-md select-none">
      <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base bg-surface-container-lowest border-b border-outline-variant shadow-sm docked full-width top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-8 md:h-12 w-24 bg-primary/20 rounded"></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-label-lg font-label-lg text-on-surface-variant uppercase tracking-wider text-xs">Score</span>
            <span className="text-headline-lg-mobile font-headline-lg-mobile text-primary font-bold">1,250</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container py-2 px-4 rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-primary fill">star</span>
            <span className="text-label-lg font-label-lg text-on-surface font-bold">Streak: 3</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-6 h-full">
        <div className="flex-shrink-0 flex flex-col items-center justify-center mb-8 relative">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="#e0e3e6" strokeWidth="8"></circle>
              <circle className="timer-ring transition-all duration-1000 linear" cx="50" cy="50" fill="none" r="45" stroke={isUrgent ? '#ba1a1a' : '#1E88E5'} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <span className={`text-headline-xl font-headline-xl font-bold z-10 ${isUrgent ? 'text-error animate-pulse' : 'text-primary'}`}>{timeLeft}</span>
          </div>
          <div className="mt-6 text-center max-w-2xl">
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface font-bold mb-2">
              Which planet is known as the Red Planet?
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Tap an option. You can change your answer before time runs out!
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-game-gap content-end pb-safe">
          <button 
            onClick={() => handleSelectOption('Venus')}
            className={`game-btn relative flex items-center justify-between w-full min-h-[100px] md:min-h-[140px] bg-[#E53935] text-white rounded-xl overflow-hidden px-8 ${selectedOption === 'Venus' ? 'ring-4 ring-white translate-y-2' : 'shadow-[0_8px_0_0_#C62828]'}`}>
            <span className="text-quiz-option font-quiz-option drop-shadow-md z-10 text-left pr-4">Venus</span>
            <span className="material-symbols-outlined text-6xl opacity-80 z-10 drop-shadow-md fill">change_history</span>
          </button>
          
          <button 
            onClick={() => handleSelectOption('Mars')}
            className={`game-btn relative flex items-center justify-between w-full min-h-[100px] md:min-h-[140px] bg-[#1E88E5] text-white rounded-xl overflow-hidden px-8 ${selectedOption === 'Mars' ? 'ring-4 ring-white translate-y-2' : 'shadow-[0_8px_0_0_#1565C0]'}`}>
            <span className="text-quiz-option font-quiz-option drop-shadow-md z-10 text-left pr-4">Mars</span>
            <span className="material-symbols-outlined text-6xl opacity-80 z-10 drop-shadow-md transform rotate-45 fill">square</span>
          </button>
          
          <button 
            onClick={() => handleSelectOption('Jupiter')}
            className={`game-btn relative flex items-center justify-between w-full min-h-[100px] md:min-h-[140px] bg-[#FDD835] text-[#2c0000] rounded-xl overflow-hidden px-8 ${selectedOption === 'Jupiter' ? 'ring-4 ring-white translate-y-2' : 'shadow-[0_8px_0_0_#F57F17]'}`}>
            <span className="text-quiz-option font-quiz-option drop-shadow-sm z-10 text-left pr-4">Jupiter</span>
            <span className="material-symbols-outlined text-6xl opacity-80 z-10 drop-shadow-sm fill">circle</span>
          </button>
          
          <button 
            onClick={() => handleSelectOption('Saturn')}
            className={`game-btn relative flex items-center justify-between w-full min-h-[100px] md:min-h-[140px] bg-[#43A047] text-white rounded-xl overflow-hidden px-8 ${selectedOption === 'Saturn' ? 'ring-4 ring-white translate-y-2' : 'shadow-[0_8px_0_0_#2E7D32]'}`}>
            <span className="text-quiz-option font-quiz-option drop-shadow-md z-10 text-left pr-4">Saturn</span>
            <span className="material-symbols-outlined text-6xl opacity-80 z-10 drop-shadow-md fill">square</span>
          </button>
        </div>
      </main>
    </div>
  );
}
