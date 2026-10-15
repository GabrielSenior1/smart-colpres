import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';

export default function TeacherLive() {
  const navigate = useNavigate();
  const { pin } = useParams();
  
  const [students, setStudents] = useState([]);
  const [sessionState, setSessionState] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(20);
  const [serverOffset, setServerOffset] = useState(0);

  useEffect(() => {
    // Listen for server time offset
    const offsetRef = ref(rtdb, '.info/serverTimeOffset');
    const unsubscribeOffset = onValue(offsetRef, (snap) => {
      setServerOffset(snap.val() || 0);
    });
    return () => unsubscribeOffset();
  }, []);

  useEffect(() => {
    if (!pin) return;

    // Listen to session state
    const stateRef = ref(rtdb, `sessions/${pin}/state`);
    const unsubscribeState = onValue(stateRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val();
        setSessionState(state);
        
        // Fetch activity data once we know the activityId
        if (state.activityId && !activityData) {
          const actRef = ref(rtdb, `activities/${state.activityId}`);
          onValue(actRef, (actSnap) => {
            if (actSnap.exists()) {
              setActivityData(actSnap.val());
            }
          }, { onlyOnce: true });
        }
      }
    });

    // Listen for students
    const studentsRef = ref(rtdb, `sessions/${pin}/students`);
    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data)
          .map(([id, info]) => ({ id, ...info }))
          .filter(s => s.status !== 'kicked');
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    });

    return () => {
      unsubscribeState();
      unsubscribeStudents();
    };
  }, [pin, activityData]);

  // Timer logic for teacher-paced
  useEffect(() => {
    if (!sessionState || !activityData || sessionState.status !== 'quiz') return;
    if (sessionState.mode === 'student-paced') return;
    
    const currentIndex = sessionState.currentQuestionIndex || 0;
    const currentQ = activityData.questions?.[currentIndex];
    const qTotalTime = currentQ?.timeLimit || 20;
    setTotalTime(qTotalTime);
    
    const timer = setInterval(() => {
      if (sessionState.startedAt) {
        const estimatedServerTime = Date.now() + serverOffset;
        const elapsed = Math.floor((estimatedServerTime - sessionState.startedAt) / 1000);
        const remaining = Math.max(0, qTotalTime - elapsed);
        setTimeLeft(remaining);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [sessionState, activityData, serverOffset]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleKickStudent = async (studentId) => {
    try {
      await set(ref(rtdb, `sessions/${pin}/students/${studentId}/status`), 'kicked');
    } catch (e) {
      console.error("Error kicking student:", e);
    }
  };

  const handleStartQuiz = async () => {
    try {
      await set(ref(rtdb, `sessions/${pin}/state/status`), 'quiz');
      await set(ref(rtdb, `sessions/${pin}/state/currentQuestionIndex`), 0);
      await set(ref(rtdb, `sessions/${pin}/state/startedAt`), serverTimestamp());
    } catch (e) {
      console.error("Error starting quiz:", e);
    }
  };

  const handleNextQuestion = async () => {
    if (!sessionState || !activityData) return;
    
    const nextIndex = (sessionState.currentQuestionIndex || 0) + 1;
    
    if (nextIndex >= (activityData.questions?.length || 0)) {
      // Quiz finished
      await set(ref(rtdb, `sessions/${pin}/state/status`), 'results');
      navigate(`/results/${pin}`);
    } else {
      // Next question
      await set(ref(rtdb, `sessions/${pin}/state/currentQuestionIndex`), nextIndex);
      await set(ref(rtdb, `sessions/${pin}/state/startedAt`), serverTimestamp()); // reset timer
    }
  };

  const handleEndQuiz = async () => {
    await set(ref(rtdb, `sessions/${pin}/state/status`), 'results');
    navigate(`/results/${pin}`);
  };

  if (!sessionState) return <div className="p-8 text-primary font-bold">Cargando sesión...</div>;

  const joinUrl = `${window.location.origin}/?pin=${pin}`;
  const isWaiting = sessionState.status === 'waiting';
  
  // Calculate answered count if in quiz
  const currentQIndex = sessionState.currentQuestionIndex || 0;
  const currentQuestion = activityData?.questions?.[currentQIndex];
  const activeStudentsList = students.filter(s => s.status !== 'kicked');
  const answeredCount = activeStudentsList.filter(s => s.answers && s.answers[currentQIndex] !== undefined).length;
  
  // Timer visual variables
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (timeLeft / totalTime) * circumference;
  const isUrgent = timeLeft <= 5;

  const leaderboard = activeStudentsList.map(student => {
    let score = 0;
    const ansCount = student.answers ? Object.keys(student.answers).length : 0;
    const gradableQuestions = (activityData?.questions || []).filter(q => q.type !== 'slide');
    const totalQ = gradableQuestions.length || 1;
    
    if (student.answers && activityData?.questions) {
      Object.entries(student.answers).forEach(([qIndexStr, answerIndex]) => {
        const qIndex = parseInt(qIndexStr, 10);
        const question = activityData.questions[qIndex];
        if (question && question.correctAnswerIndex === answerIndex) {
          score += 1000;
        }
      });
    }
    
    return {
      ...student,
      liveScore: score,
      ansCount,
      totalQ,
      progress: Math.min(100, (ansCount / totalQ) * 100),
      isFinished: student.finished || ansCount >= totalQ
    };
  }).sort((a, b) => b.liveScore - a.liveScore || b.ansCount - a.ansCount);

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-body-md overflow-hidden">
      {/* Top App Bar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-desktop py-base z-10 relative">
        <div className="flex items-center gap-4">
          <span className="text-headline-lg font-headline-lg font-bold text-primary">Smart-Colpres</span>
          <span className="text-on-surface-variant font-label-lg text-label-lg ml-4">
            {isWaiting ? 'Sala de Espera' : (sessionState.mode === 'student-paced' ? 'A tu ritmo' : 'Quiz en Vivo')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button onClick={toggleFullscreen} className="hover:bg-surface-container p-2 rounded-full transition-colors active:scale-95 duration-100" title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
            <span className="material-symbols-outlined fill">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
          </button>
          {!isWaiting && (
            <button onClick={handleEndQuiz} className="bg-error text-on-error px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all">
              Terminar Quiz
            </button>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {isWaiting ? (
          <div className="w-full flex flex-col lg:flex-row h-full transition-opacity duration-300">
            {/* Left Side: QR Code & Pin */}
            <section className="lg:w-5/12 bg-surface-container-low p-margin-desktop flex flex-col items-center justify-center border-r border-outline-variant relative">
              <div className="text-center mb-6 w-full">
                <h2 className="text-headline-sm font-headline-sm text-on-surface-variant mb-2">PIN DEL JUEGO</h2>
                <div className="bg-white rounded-3xl py-4 px-8 shadow-md border-4 border-primary inline-block mb-4">
                  <span className="text-[4rem] font-black tracking-widest text-primary leading-none">{pin}</span>
                </div>
                <p className="text-body-lg font-body-lg text-on-surface-variant font-bold">{sessionState.activityTitle}</p>
                <p className="text-sm font-bold text-primary mt-2">Modo: {sessionState.mode === 'student-paced' ? 'A tu ritmo' : 'Proyector'}</p>
              </div>
              
              <div 
                onClick={() => setIsQrExpanded(true)}
                className="bg-surface-container-lowest p-card-padding rounded-xl card-shadow border-2 border-primary mb-8 w-48 h-48 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform group relative">
                <img className="w-full h-full object-contain" src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinUrl)}`} alt="QR Code" />
                <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <span className="material-symbols-outlined text-primary text-4xl bg-surface-container-lowest rounded-full p-2 shadow-lg">zoom_in</span>
                </div>
              </div>

              
              <button 
                onClick={handleStartQuiz}
                disabled={activeStudentsList.length === 0}
                className={`w-full max-w-xs text-on-secondary-container font-headline-lg-mobile py-4 rounded-2xl shadow-lg border-b-4 transition-all flex items-center justify-center gap-2 ${activeStudentsList.length > 0 ? 'bg-secondary-container border-[#b38702] active:translate-y-1 active:border-b-0 cursor-pointer' : 'bg-surface-container-highest border-outline-variant opacity-50 cursor-not-allowed'}`}>
                <span className="material-symbols-outlined">play_arrow</span>
                Iniciar Quiz
              </button>
            </section>
            
            {/* Right Side: Waiting Room */}
            <section className="lg:w-7/12 p-margin-desktop flex flex-col h-full bg-surface-bright">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-lg font-headline-lg text-primary flex items-center gap-2">
                  Sala de Espera
                  <span className="bg-secondary-container text-on-secondary-container text-label-lg font-label-lg px-3 py-1 rounded-full ml-2">{activeStudentsList.length} Conectados</span>
                </h2>
                <button onClick={() => navigate('/teacher')} className="bg-surface-container-highest text-on-surface hover:bg-surface-container transition-colors px-4 py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-2 card-shadow">
                  <span className="material-symbols-outlined">close</span>
                  Volver al Panel
                </button>
              </div>
              
              {/* Students Grid */}
              <div className="flex-1 overflow-y-auto pr-4 pb-32">
                {activeStudentsList.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-on-surface-variant font-label-lg">
                    Esperando a que los estudiantes se unan...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeStudentsList.map(student => (
                      <div key={student.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 border border-outline-variant card-shadow group relative overflow-hidden hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 border-2 border-primary rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-surface-container-lowest p-1">
                          <img src={`/avatares/${student.avatar}.jpg`} alt="Avatar" className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                          <span className="font-bold text-lg truncate leading-tight block">{student.name}</span>
                          <span className="text-sm text-on-surface-variant truncate block">{student.course}</span>
                        </div>
                        <button 
                          onClick={() => handleKickStudent(student.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-error-container text-on-error-container p-1.5 rounded-full transition-opacity hover:bg-error hover:text-on-error" 
                          title="Expulsar"
                        >
                          <span className="material-symbols-outlined text-sm">person_remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col p-8 bg-surface-bright items-center justify-center">
            {sessionState.mode === 'student-paced' ? (
              /* Student Paced View: Dashboard of progress */
              <div className="max-w-6xl w-full h-full bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8 shrink-0">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-4xl">leaderboard</span>
                    <h2 className="text-headline-md font-bold text-primary">Ranking en Vivo</h2>
                  </div>
                  
                  {/* Join Info */}
                  <div className="flex items-center gap-6 bg-surface-container-low px-6 py-2 rounded-2xl border border-primary/20 shadow-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">PIN del Juego</span>
                      <span className="text-3xl font-black text-primary tracking-widest">{pin}</span>
                    </div>
                    <div 
                      onClick={() => setIsQrExpanded(true)}
                      className="w-12 h-12 bg-white rounded-lg p-1 cursor-pointer hover:scale-105 transition-transform border border-outline-variant shadow-sm"
                      title="Ampliar QR">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinUrl)}`} alt="QR" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <button onClick={handleEndQuiz} className="bg-error text-on-error px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined">stop_circle</span>
                    Finalizar Actividad
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-12 w-full max-w-4xl mx-auto px-2">
                  {leaderboard.map((student, idx) => (
                    <div key={student.id} className="bg-surface-container p-5 rounded-2xl flex items-center gap-5 border border-outline-variant/50 relative overflow-hidden shadow-sm transition-all">
                      {/* Rank Number */}
                      <div className="w-10 shrink-0 text-center">
                        <span className={`text-2xl font-black ${idx === 0 ? 'text-[#FFD700]' : idx === 1 ? 'text-[#C0C0C0]' : idx === 2 ? 'text-[#CD7F32]' : 'text-on-surface-variant'}`}>
                          #{idx + 1}
                        </span>
                      </div>
                      
                      <div className="w-16 h-16 border-2 border-primary rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-surface-container-lowest p-1 z-10">
                        <img src={`/avatares/${student.avatar}.jpg`} alt="Avatar" className="w-full h-full object-contain drop-shadow-sm" />
                      </div>
                      
                      <div className="flex-1 flex flex-col z-10 min-w-0">
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <span className="font-bold text-on-surface text-xl truncate flex-1">{student.name}</span>
                          <span className="font-black text-primary text-2xl shrink-0">{student.liveScore} <span className="text-sm text-on-surface-variant font-bold">pts</span></span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden border border-outline-variant/30">
                          <div className="bg-primary h-full transition-all duration-500 ease-out" style={{width: `${student.progress}%`}}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-on-surface-variant font-bold">
                          <span>{student.isFinished ? '¡Terminó!' : 'Respondiendo...'}</span>
                          <span>{student.ansCount} / {student.totalQ} preguntas</span>
                        </div>
                      </div>
                      
                      {/* Subtile background highlight for top 3 */}
                      {idx === 0 && <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-transparent pointer-events-none"></div>}
                      {idx === 1 && <div className="absolute inset-0 bg-gradient-to-r from-[#C0C0C0]/10 to-transparent pointer-events-none"></div>}
                      {idx === 2 && <div className="absolute inset-0 bg-gradient-to-r from-[#CD7F32]/10 to-transparent pointer-events-none"></div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Teacher Paced View */
              <div className="max-w-4xl w-full bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant p-8 flex flex-col items-center text-center">
                <div className="w-full flex justify-between items-center mb-6">
                  <span className="bg-primary/10 text-primary px-4 py-1 rounded-full font-bold">
                    Pregunta {currentQIndex + 1} de {activityData?.questions?.length || 0}
                  </span>
                  
                  {/* Timer Circle inside header */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="45" stroke="#e0e3e6" strokeWidth="10"></circle>
                        <circle className="transition-all duration-500 linear" cx="50" cy="50" fill="none" r="45" stroke={isUrgent ? '#ba1a1a' : '#1E88E5'} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="10"></circle>
                      </svg>
                      <span className={`text-label-lg font-bold z-10 ${isUrgent ? 'text-error animate-pulse' : 'text-primary'}`}>{timeLeft}</span>
                    </div>
                    
                    <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-bold">
                      Respuestas: {answeredCount} / {activeStudentsList.length}
                    </span>
                  </div>
                </div>
                
                {currentQuestion?.context && (
                  <p className="text-body-lg text-on-surface-variant mb-6 max-w-2xl italic">
                    "{currentQuestion.context}"
                  </p>
                )}
                
                <h2 className="text-headline-lg font-headline-lg text-primary mb-6 max-w-3xl">
                  {currentQuestion?.text || "Cargando pregunta..."}
                </h2>
                
                {currentQuestion?.imageUrl && (
                  <div className="mb-12 max-w-2xl max-h-64 flex items-center justify-center overflow-hidden rounded-2xl shadow-md border border-outline-variant">
                    <img src={currentQuestion.imageUrl} alt="Imagen de pregunta" className="w-full h-full object-contain" />
                  </div>
                )}
                
                <button 
                  onClick={handleNextQuestion}
                  className="bg-primary text-on-primary font-headline-sm-mobile px-12 py-4 rounded-full btn-3d flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all">
                  {currentQIndex + 1 >= (activityData?.questions?.length || 0) ? (
                    <>
                      <span className="material-symbols-outlined">emoji_events</span>
                      Ver Resultados
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">skip_next</span>
                      Siguiente Pregunta
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Mini PIN reminder at bottom */}
            <div className="absolute bottom-8 right-8 bg-surface-container-low px-6 py-3 rounded-full shadow-md border border-outline-variant flex items-center gap-3">
              <span className="text-on-surface-variant font-bold text-sm uppercase">PIN:</span>
              <span className="text-primary font-black text-2xl tracking-wider">{pin}</span>
            </div>
          </div>
        )}

        {/* QR Expanded Modal (Moved outside conditionals) */}
        {isQrExpanded && (
          <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsQrExpanded(false)}>
            
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-2xl flex flex-col items-center w-fit max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
              <div className="w-full flex justify-between items-center mb-6 gap-8">
                <h2 className="text-headline-sm font-bold text-primary">Únete al Juego</h2>
                <button onClick={() => setIsQrExpanded(false)} className="w-12 h-12 flex items-center justify-center bg-surface-container hover:bg-surface-container-high rounded-full transition-colors shrink-0">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full">
                <div className="bg-white p-4 rounded-3xl shadow-inner shrink-0">
                  <img className="w-64 h-64 md:w-80 md:h-80 object-contain" src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinUrl)}`} alt="QR Code Expanded" />
                </div>
                
                <div className="flex flex-col items-center justify-center text-center shrink-0">
                  <p className="text-body-lg text-on-surface-variant font-bold mb-4 uppercase tracking-widest">o ingresa con el PIN</p>
                  <div className="bg-surface-container-low rounded-3xl py-6 px-8 shadow-md border-4 border-primary mb-6">
                    <span className="text-[4rem] md:text-[6rem] font-black tracking-widest text-primary leading-none block">{pin}</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant font-bold uppercase tracking-widest mb-2">enlace directo</p>
                  <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold text-lg break-all px-4">
                    {joinUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
