import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

export default function StudentQuiz() {
  const navigate = useNavigate();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(20);
  const [studentId, setStudentId] = useState(() => localStorage.getItem('studentId') || '');
  const [pin, setPin] = useState(() => localStorage.getItem('gamePin') || '');
  
  // States for student-paced mode
  const [studentCurrentIndex, setStudentCurrentIndex] = useState(() => {
    const savedPin = localStorage.getItem('gamePin');
    const savedId = localStorage.getItem('studentId');
    if (savedPin && savedId) {
      const savedIndex = localStorage.getItem(`quiz_index_${savedPin}_${savedId}`);
      if (savedIndex !== null) return parseInt(savedIndex, 10) || 0;
    }
    return 0;
  });
  const [hasStartedPacedQuiz, setHasStartedPacedQuiz] = useState(false);
  const [showStudentFeedback, setShowStudentFeedback] = useState(false);
  const [studentFinished, setStudentFinished] = useState(false);

  const [sessionState, setSessionState] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [serverOffset, setServerOffset] = useState(0);

  // Persist current question index in localStorage so refresh doesn't lose position
  useEffect(() => {
    if (pin && studentId) {
      localStorage.setItem(`quiz_index_${pin}_${studentId}`, studentCurrentIndex.toString());
    }
  }, [studentCurrentIndex, pin, studentId]);

  // Restore student finished and started states from Firebase data
  useEffect(() => {
    if (studentData) {
      if (studentData.finished) {
        setStudentFinished(true);
      }
      if (studentData.answers && Object.keys(studentData.answers).length > 0) {
        setHasStartedPacedQuiz(true);
      }
    }
  }, [studentData]);

  useEffect(() => {
    // Listen for server time offset
    const offsetRef = ref(rtdb, '.info/serverTimeOffset');
    const unsubscribeOffset = onValue(offsetRef, (snap) => {
      setServerOffset(snap.val() || 0);
    });
    return () => unsubscribeOffset();
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    const currentPin = localStorage.getItem('gamePin');
    if (!id || !currentPin) {
      navigate('/');
      return;
    }
    setStudentId(id);
    setPin(currentPin);

    // Anti-Cheat
    const handleVisibilityChange = () => {
      if (document.hidden) {
        update(ref(rtdb, `sessions/${currentPin}/students/${id}`), { cheated: true })
          .catch(err => console.error("Error setting cheat flag", err));
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Listen to my own student data
    const myRef = ref(rtdb, `sessions/${currentPin}/students/${id}`);
    const unsubMe = onValue(myRef, (snap) => {
      if (snap.exists()) setStudentData(snap.val());
    });

    // Listen to state
    let lastTeacherIndex = -1;
    const stateRef = ref(rtdb, `sessions/${currentPin}/state`);
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        setSessionState(state);
        
        // Reset selected option when question changes in teacher-paced mode
        if (state.mode !== 'student-paced' && state.currentQuestionIndex !== lastTeacherIndex) {
          lastTeacherIndex = state.currentQuestionIndex;
          setSelectedOption(null);
        }

        if (state.status === 'results') {
           navigate(`/results/${currentPin}`);
        }
        
        // Fetch activity if not present
        if (state.activityId) {
          onValue(ref(rtdb, `activities/${state.activityId}`), (actSnap) => {
             if (actSnap.exists()) setActivityData(actSnap.val());
          }, { onlyOnce: true });
        }
      } else {
        alert('El profesor ha terminado la sesión.');
        navigate('/');
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
      unsubMe();
    };
  }, [navigate]);

  const isStudentPaced = sessionState?.mode === 'student-paced';
  
  // Sequence Generation for Randomized Activities
  useEffect(() => {
    if (activityData?.randomizeQuestions && isStudentPaced && studentId && pin && studentData && !studentData.sequence) {
      // Generate sequence
      let seq = [];
      const sections = {}; // { 'inversa': { slides: [], questions: [] }, ... }
      
      activityData.questions.forEach((q, i) => {
        const sec = q.section || 'default';
        if (!sections[sec]) sections[sec] = { slides: [], questions: [] };
        if (q.type === 'slide') sections[sec].slides.push(i);
        else sections[sec].questions.push(i);
      });
      
      // For each section, add slides first, then shuffled questions
      Object.values(sections).forEach(sec => {
        seq.push(...sec.slides);
        const shuffled = [...sec.questions].sort(() => Math.random() - 0.5);
        seq.push(...shuffled);
      });
      
      update(ref(rtdb, `sessions/${pin}/students/${studentId}`), { sequence: seq }).catch(console.error);
    }
  }, [activityData, isStudentPaced, studentId, pin, studentData]);

  let currentIndex = isStudentPaced ? studentCurrentIndex : (sessionState?.currentQuestionIndex || 0);
  
  let mappedIndex = currentIndex;
  if (isStudentPaced && activityData?.randomizeQuestions && studentData?.sequence) {
      mappedIndex = studentData.sequence[currentIndex] ?? currentIndex;
  }
  
  const currentQuestion = activityData?.questions?.[mappedIndex];
  const actualIndex = mappedIndex;

  // Handle timer ONLY for teacher-paced mode
  useEffect(() => {
    if (!sessionState || !activityData || !currentQuestion) return;
    if (isStudentPaced) return; // No time limit for student-paced mode
    
    const qTotalTime = currentQuestion.timeLimit || 20;
    setTotalTime(qTotalTime);
    
    const timer = setInterval(() => {
      if (sessionState.status === 'quiz' && sessionState.startedAt) {
        const currentTime = Date.now() + serverOffset;
        const elapsed = Math.floor((currentTime - sessionState.startedAt) / 1000);
        const remaining = Math.max(0, qTotalTime - elapsed);
        
        setTimeLeft(remaining);
        if (remaining <= 0 && selectedOption === null) {
           setSelectedOption(-1); 
        }
      }
    }, 500);

    return () => clearInterval(timer);
  }, [sessionState, activityData, currentQuestion, isStudentPaced, selectedOption, serverOffset]);

  // Restore selected option when navigating in student-paced mode
  useEffect(() => {
    if (isStudentPaced && activityData && sessionState?.status === 'quiz' && !studentFinished) {
      const answer = studentData?.answers?.[actualIndex];
      if (answer !== undefined && answer !== null) {
        setSelectedOption(answer);
      } else {
        setSelectedOption(null);
      }
      setShowStudentFeedback(false);
    }
  }, [studentCurrentIndex, actualIndex, activityData, sessionState?.status, studentFinished, isStudentPaced, studentData?.answers]);


  const handleSelectOption = (optionIndex) => {
    // Only block if time is up AND it is not student-paced
    if (!isStudentPaced && timeLeft <= 0) return;
    
    // In student-paced mode, if showAnswers is true and they already answered, block changes (freeze)
    if (isStudentPaced && sessionState?.showAnswers && selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    
    const pin = localStorage.getItem('gamePin');
    
    if (studentId && pin) {
      update(ref(rtdb, `sessions/${pin}/students/${studentId}/answers`), {
        [actualIndex]: optionIndex
      }).catch(err => console.error("Error saving answer", err));
    }

    if (isStudentPaced) {
       if (sessionState.showAnswers) {
         setShowStudentFeedback(true);
       }
       // If showAnswers is false, do not auto-next. Let them use the manual navigation bar.
    }
  };

  const handleNextStudentPaced = () => {
    const totalQ = activityData?.questions?.length || 0;
    if (studentCurrentIndex + 1 < totalQ) {
      setStudentCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevStudentPaced = () => {
    if (studentCurrentIndex > 0) {
      setStudentCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinishStudentPaced = () => {
    // Count only actual questions (not slides)
    const gradableQuestions = (activityData?.questions || []).reduce((acc, q, idx) => {
      if (q.type !== 'slide') acc.push(idx);
      return acc;
    }, []);
    const totalGradable = gradableQuestions.length;
    const answeredCount = gradableQuestions.filter(idx => 
      studentData?.answers?.[idx] !== undefined && studentData?.answers?.[idx] !== null
    ).length;
    
    if (answeredCount < totalGradable) {
      alert(`¡Espera! Aún te faltan ${totalGradable - answeredCount} preguntas por responder. Usa los botones de Atrás y Siguiente para revisarlas.`);
      return;
    }
    
    setStudentFinished(true);
    if (studentId && pin) {
      update(ref(rtdb, `sessions/${pin}/students/${studentId}`), {
        finished: true,
        finishedAt: Date.now()
      }).catch(err => console.error("Error setting finished state", err));
    }
  };

  if (!sessionState || !activityData) {
    return <div className="h-screen bg-surface flex items-center justify-center text-primary font-bold">Cargando pregunta...</div>;
  }

  if (studentFinished) {
    return (
      <div className="bg-surface h-[100dvh] flex flex-col items-center justify-center text-center p-8">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">task_alt</span>
        <h1 className="text-headline-md font-bold text-primary mb-2">¡Has terminado!</h1>
        <p className="text-on-surface-variant text-lg">Espera a que el profesor finalice la actividad para ver los resultados globales.</p>
      </div>
    );
  }

  if (isStudentPaced && !hasStartedPacedQuiz) {
    return (
      <div className="bg-surface h-[100dvh] flex flex-col items-center justify-center text-center p-8">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">rocket_launch</span>
        <h1 className="text-headline-md font-bold text-primary mb-2">{sessionState.activityTitle}</h1>
        <p className="text-on-surface-variant text-lg mb-8">Esta actividad es a tu propio ritmo. ¡Lee con cuidado y tómate tu tiempo!</p>
        <button 
          onClick={() => setHasStartedPacedQuiz(true)}
          className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-transform">
          Iniciar Ahora
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (timeLeft / totalTime) * circumference;
  const isUrgent = !isStudentPaced && timeLeft <= 5;
  const timeUp = !isStudentPaced && timeLeft === 0;

  // Modern UI Colors for buttons
  const bgColors = ['bg-[#E53935]', 'bg-[#1E88E5]', 'bg-[#FDD835]', 'bg-[#43A047]'];
  const textColors = ['text-white', 'text-white', 'text-[#2c0000]', 'text-white'];
  const shadowColors = ['shadow-[0_6px_0_0_#C62828]', 'shadow-[0_6px_0_0_#1565C0]', 'shadow-[0_6px_0_0_#F57F17]', 'shadow-[0_6px_0_0_#2E7D32]'];
  const icons = ['change_history', 'square', 'circle', 'square'];
  const rotations = ['', 'transform rotate-45', '', ''];

  return (
    <div className="bg-surface h-[100dvh] flex flex-col overflow-hidden text-on-surface font-body-md select-none">
      <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base bg-surface-container-lowest border-b border-outline-variant shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          {studentData?.avatar ? (
            <img src={`/avatares/${studentData.avatar}.jpg`} alt="Avatar" className="w-10 h-10 object-cover mix-blend-multiply drop-shadow-sm border border-primary/20 rounded-full" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} />
          ) : (
            <div className="h-10 w-10 bg-primary/20 rounded-full"></div>
          )}
          <span className="font-bold text-on-surface-variant hidden md:inline">{studentData?.name}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-label-lg font-label-lg text-on-surface-variant uppercase tracking-wider text-[10px]">Score</span>
            <span className="text-headline-lg-mobile font-headline-lg-mobile text-primary font-bold">{studentData?.score || 0}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-6 h-full overflow-y-auto">
        
        {/* Compact & Premium Question Header */}
        <div className="flex-shrink-0 flex items-start gap-4 mb-6 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden">
          {/* Timer Circle */}
          {!isStudentPaced && (
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#e0e3e6" strokeWidth="10"></circle>
                <circle className="transition-all duration-500 linear" cx="50" cy="50" fill="none" r="45" stroke={isUrgent ? '#ba1a1a' : '#1E88E5'} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="10"></circle>
              </svg>
              <span className={`text-headline-sm font-headline-sm font-bold z-10 ${isUrgent ? 'text-error animate-pulse' : 'text-primary'}`}>{timeLeft}</span>
            </div>
          )}
          
          <div className="flex-1 flex flex-col justify-center min-h-[4rem]">
            {isStudentPaced ? (
              <>
                {currentQuestion.context && (
                  <p className="text-sm md:text-base text-on-surface-variant italic mb-2 leading-tight">
                    "{currentQuestion.context}"
                  </p>
                )}
                <h1 className="text-headline-sm-mobile md:text-headline-sm font-headline-sm font-bold text-on-surface leading-tight">
                  {currentQuestion.title || currentQuestion.text}
                </h1>
                {currentQuestion.type === 'slide' && currentQuestion.text && (
                  <p className="mt-4 text-body-lg text-on-surface-variant">
                    {currentQuestion.text}
                  </p>
                )}
                {currentQuestion.imageUrl && (
                  <div className="mt-4 max-h-48 flex items-center justify-start overflow-hidden rounded-xl border border-outline-variant">
                    <img src={currentQuestion.imageUrl} alt="Imagen de pregunta" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl animate-bounce">cast</span>
                <h1 className="text-headline-sm font-bold text-primary">¡Mira la pantalla del profesor!</h1>
              </div>
            )}
          </div>
        </div>

        {/* Status Message (Waiting for others in teacher-paced) */}
        {!isStudentPaced && selectedOption !== null && !timeUp && (
          <div className="mb-4 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-3 animate-fade-in shrink-0">
             <span className="material-symbols-outlined text-primary animate-pulse">hourglass_empty</span>
             <div>
               <p className="font-bold text-primary text-sm">¡Respuesta enviada!</p>
               <p className="text-xs text-primary/80">Puedes cambiar tu elección seleccionando otra opción abajo 👇</p>
             </div>
          </div>
        )}
        
        {/* Time Up Overlay / Feedback Overlay */}
        {(timeUp || (isStudentPaced && showStudentFeedback)) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm px-6">
            <div className={`bg-surface-container-lowest p-6 rounded-3xl shadow-xl border text-center animate-slide-up mb-6 ${
              sessionState?.showAnswers 
                ? (selectedOption === currentQuestion.correctAnswerIndex ? 'border-[#43A047]/50' : 'border-error/50')
                : 'border-error/20'
            }`}>
              {sessionState?.showAnswers ? (
                <>
                  {selectedOption === currentQuestion.correctAnswerIndex ? (
                    <>
                      <span className="material-symbols-outlined text-5xl text-[#43A047] mb-2">check_circle</span>
                      <h2 className="text-headline-sm font-bold text-on-surface mb-1">¡Correcto!</h2>
                      <p className="text-on-surface-variant">Has respondido correctamente.</p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-5xl text-[#E53935] mb-2">cancel</span>
                      <h2 className="text-headline-sm font-bold text-on-surface mb-1">Incorrecto</h2>
                      <p className="text-on-surface-variant font-bold mb-2">
                        La respuesta correcta es: {currentQuestion.options[currentQuestion.correctAnswerIndex]}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-5xl text-error mb-2">timer_off</span>
                  <h2 className="text-headline-sm font-bold text-on-surface mb-1">¡Tiempo agotado!</h2>
                  {!isStudentPaced && <p className="text-on-surface-variant">Mira la pantalla del profesor para los resultados.</p>}
                </>
              )}
            </div>
            
            {isStudentPaced && sessionState?.showAnswers && (
              <button 
                onClick={handleNextStudentPaced}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-transform animate-slide-up mt-4">
                Siguiente Pregunta
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        )}

        {/* Options Grid or Slide Continue */}
        {currentQuestion.type === 'slide' ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-safe relative z-10">
             {isStudentPaced ? (
               <button 
                 onClick={handleNextStudentPaced}
                 className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold shadow-lg flex items-center gap-3 hover:brightness-110 active:scale-95 transition-transform text-xl">
                 Continuar
                 <span className="material-symbols-outlined">arrow_forward</span>
               </button>
             ) : (
               <p className="text-on-surface-variant text-lg animate-pulse">Espera a que el profesor avance...</p>
             )}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 pb-safe content-stretch relative z-10">
            {currentQuestion.options && currentQuestion.options.map((optionText, index) => {
              const isSelected = selectedOption === index;
              // In teacher-paced, don't dim options since they can change their mind. 
              // In student-paced, only dim if showAnswers is true (frozen answer).
              const isDimmed = isStudentPaced && sessionState?.showAnswers && selectedOption !== null && !isSelected;
              const isDisabled = (isStudentPaced && sessionState?.showAnswers && selectedOption !== null) || timeUp;
              
              return (
                <button 
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={isDisabled}
                  className={`game-btn relative flex items-center w-full min-h-[90px] md:min-h-[120px] rounded-2xl overflow-hidden px-6 transition-all duration-300
                    ${bgColors[index]} ${textColors[index]} ${isSelected ? 'ring-4 ring-primary-container scale-[0.98]' : shadowColors[index]}
                    ${isDimmed ? 'opacity-40 grayscale-[30%]' : 'opacity-100'}
                    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                  `}>
                  
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center mr-4">
                    <span className={`material-symbols-outlined text-4xl opacity-90 drop-shadow-md fill ${rotations[index]}`}>
                      {icons[index]}
                    </span>
                  </div>
                  
                  <span className="text-lg md:text-xl font-bold drop-shadow-md text-left flex-1 leading-tight break-words">
                    {optionText}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar for Student Paced Mode */}
      {isStudentPaced && !showStudentFeedback && (
        <div className="bg-surface-container-lowest border-t border-outline-variant p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30 shrink-0">
          <button 
            onClick={handlePrevStudentPaced}
            disabled={studentCurrentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${studentCurrentIndex === 0 ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed' : 'bg-surface-container-high text-on-surface hover:brightness-110 active:scale-95 shadow-sm'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
            Atrás
          </button>
          
          <span className="text-on-surface-variant font-bold text-sm">
            {studentCurrentIndex + 1} / {activityData?.questions?.length || 0}
          </span>
          
          {studentCurrentIndex + 1 >= (activityData?.questions?.length || 0) ? (
            <button 
              onClick={handleFinishStudentPaced}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold btn-3d shadow-md hover:brightness-110 active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined">task_alt</span>
              Finalizar
            </button>
          ) : (
            <button 
              onClick={handleNextStudentPaced}
              className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold btn-3d shadow-md hover:brightness-110 active:scale-95 flex items-center gap-2">
              {selectedOption === null ? 'Omitir' : 'Siguiente'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
