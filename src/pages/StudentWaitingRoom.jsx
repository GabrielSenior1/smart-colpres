import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';

export default function StudentWaitingRoom() {
  const [isExpelled, setIsExpelled] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/');
      return;
    }

    // Listen to my own student node
    const studentRef = ref(rtdb, `session/students/${studentId}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Node was deleted (kicked)
        setIsExpelled(true);
      } else {
        setStudentData(data);
        if (data.status === 'kicked') {
          setIsExpelled(true);
        }
      }
    });

    // Listen to global session state
    const stateRef = ref(rtdb, `session/state`);
    const unsubscribeState = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state && state.status === 'quiz') {
        navigate('/quiz');
      }
    });

    return () => {
      unsubscribeStudent();
      unsubscribeState();
    };
  }, [navigate]);

  const handleReenterInfo = async () => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      // Clean up the node if it still exists before leaving
      try {
        await remove(ref(rtdb, `session/students/${studentId}`));
      } catch (e) {
        console.error("Cleanup error", e);
      }
      localStorage.removeItem('studentId');
    }
    navigate('/');
  };

  const getShapeClasses = (shape, colorId) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : 'rounded-none';
    const bgClass = `bg-${colorId}-200`;
    const borderClass = `border-${colorId}-400`;
    // We provide a fallback if the dynamic class tailwind compilation fails, 
    // but in a real app we'd map this safely. For now, our colors are standard tailwind.
    return `${shapeClass} ${bgClass} ${borderClass}`;
  };

  return (
    <div className="bg-pattern animate-slide-bg min-h-screen overflow-hidden font-body-md text-on-surface flex flex-col relative select-none">
      
      {/* ALERT BANNER OVERLAY */}
      {isExpelled && (
        <div className="fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
          <div className="bg-error text-on-error w-full px-margin-mobile md:px-margin-desktop py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl fill">warning</span>
              <p className="font-label-lg text-label-lg uppercase tracking-wider text-center sm:text-left">
                Tu nombre y curso han sido eliminados por el profesor, por favor vuelve a ingresarlos
              </p>
            </div>
            <button 
              onClick={handleReenterInfo} 
              className="bg-surface-container-lowest text-error font-label-lg text-label-lg px-6 py-3 rounded-full font-bold shadow-md hover:bg-surface-container-low transition-colors whitespace-nowrap">
              Reingresar Datos
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
          
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center z-10 bg-surface-container-lowest border-primary p-2">
            {studentData?.avatar ? (
              <img src={`/avatares/${studentData.avatar}.jpg`} alt="Avatar" className="w-full h-full object-contain drop-shadow-md" />
            ) : (
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-outline">person</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center max-w-lg mx-auto bg-surface-container-lowest/80 backdrop-blur-md px-8 py-6 rounded-3xl shadow-sm border border-primary-fixed-dim">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-2 flex items-center justify-center gap-2">
            Esperando al profesor
            <span className="flex gap-1 items-baseline h-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dots" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {studentData ? `¡Hola ${studentData.name.split(' ')[0]}!` : '¡Prepárate!'} El quiz empezará pronto en la pantalla principal.
          </p>
        </div>
      </main>
    </div>
  );
}
