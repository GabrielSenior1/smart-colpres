import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function Results() {
  const navigate = useNavigate();
  const { pin } = useParams();
  const [confetti, setConfetti] = useState([]);
  
  const [sessionState, setSessionState] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [studentsData, setStudentsData] = useState({});
  const [students, setStudents] = useState([]);

  const studentId = localStorage.getItem('studentId');
  const isStudent = !!studentId;

  useEffect(() => {
    // Generate Confetti
    const colors = ['#00004c', '#fdc003', '#e06857', '#4951c3'];
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: (Math.random() * 2 + 2) + 's',
      animationDelay: Math.random() * 2 + 's'
    }));
    setConfetti(pieces);
    
    const t = setTimeout(() => setConfetti([]), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!pin) return;

    // Read session state
    const stateRef = ref(rtdb, `sessions/${pin}/state`);
    const unsubState = onValue(stateRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val();
        setSessionState(state);
        
        if (state.activityId && !activityData) {
          onValue(ref(rtdb, `activities/${state.activityId}`), (actSnap) => {
            if (actSnap.exists()) setActivityData(actSnap.val());
          }, { onlyOnce: true });
        }
      } else {
        // Session was deleted (host turned off or teacher saved report)
        if (isStudent) {
          alert('La sesión ha finalizado y el host se apagó.');
          navigate('/');
        }
      }
    });

    // Read real-time students data
    const studentsRef = ref(rtdb, `sessions/${pin}/students`);
    const unsubStudents = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudentsData(snapshot.val());
      } else {
        setStudentsData({});
      }
    });

    return () => {
      unsubState();
      unsubStudents();
    };
  }, [pin, activityData]);

  // Calculate scores dynamically
  useEffect(() => {
    if (!activityData || !studentsData) return;

    const studentList = Object.entries(studentsData)
      .filter(([id, info]) => info.status !== 'kicked')
      .map(([id, info]) => {
        let correctCount = 0;
        let sectionCorrect = {};
        
        if (info.answers && activityData.questions) {
          Object.entries(info.answers).forEach(([qIndexStr, answerIndex]) => {
            const qIndex = parseInt(qIndexStr);
            const question = activityData.questions[qIndex];
            
            // Check if the answer is correct — skip slides
            if (question && question.type !== 'slide' && question.correctAnswerIndex === answerIndex) {
              correctCount++;
              if (question.section) {
                 sectionCorrect[question.section] = (sectionCorrect[question.section] || 0) + 1;
              }
            }
          });
        }

        // Calculate total questions excluding slides
        let totalQuestions = 0;
        const sectionTotals = {};
        if (activityData.questions) {
          activityData.questions.forEach(q => {
            if (q.type !== 'slide') {
              totalQuestions++;
              if (q.section) {
                sectionTotals[q.section] = (sectionTotals[q.section] || 0) + 1;
              }
            }
          });
        }

        let rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
        let numericScore = Math.max(1.0, rawScore);
        numericScore = Math.round(numericScore * 10) / 10;
        
        const hasSections = Object.keys(sectionTotals).length > 0;
        let sectionScores = null;
        if (hasSections) {
           sectionScores = {};
           Object.keys(sectionTotals).forEach(sec => {
              const secTotal = sectionTotals[sec];
              const secCorrect = sectionCorrect[sec] || 0;
              let sRaw = secTotal > 0 ? (secCorrect / secTotal) * 10 : 0;
              sectionScores[sec] = Math.round(Math.max(1.0, sRaw) * 10) / 10;
           });
        }

        let classification = '';
        let colorClass = '';
        if (numericScore >= 9.5) {
          classification = 'Excelente';
          colorClass = 'bg-primary-container text-on-primary-container border-primary/30';
        } else if (numericScore >= 8.1) {
          classification = 'Alto';
          colorClass = 'bg-secondary-container text-on-secondary-container border-secondary/30';
        } else if (numericScore >= 7.0) {
          classification = 'Básico';
          colorClass = 'bg-[#fff0c2] text-[#705d00] border-[#705d00]/30'; 
        } else {
          classification = 'Bajo';
          colorClass = 'bg-error-container text-on-error-container border-error/30';
        }
        
        return { id, ...info, score: numericScore, sectionScores, classification, colorClass, correctCount, totalQuestions };
      })
      .sort((a, b) => b.score - a.score); // Sort by highest score

    setStudents(studentList);
  }, [studentsData, activityData]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base docked full-width top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">Smart-Colpres</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary hover:bg-surface-container transition-colors p-2 rounded-full cursor-pointer fill">notifications</span>
          <span className="material-symbols-outlined text-primary hover:bg-surface-container transition-colors p-2 rounded-full cursor-pointer fill">settings</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-surface-bright relative">
          
          {/* Confetti Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {confetti.map(c => (
              <div 
                key={c.id}
                className="absolute w-2 h-4 rounded-full"
                style={{
                  left: c.left,
                  backgroundColor: c.backgroundColor,
                  animation: `fall ${c.animationDuration} linear infinite`,
                  animationDelay: c.animationDelay
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto space-y-12 relative z-10">
            
            {!isStudent ? (
              <>
                {/* Teacher View: Leaderboard */}
                <section>
                  <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-primary mb-6 flex items-center gap-2 mt-8">
                    <span className="material-symbols-outlined text-secondary-container fill">trophy</span> Class Leaderboard - {activityData?.title || 'Resultados'}
                  </h3>

                  {/* Detailed Table */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                          <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Rank</th>
                          <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Estudiante</th>
                          <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Respuestas Correctas</th>
                          <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Puntuación General</th>
                          {students.length > 0 && students[0].sectionScores && Object.keys(students[0].sectionScores).map(sec => (
                            <th key={sec} className="p-4 text-label-lg font-label-lg text-on-surface-variant capitalize">Nota {sec}</th>
                          ))}
                          <th className="p-4 text-label-lg font-label-lg text-on-surface-variant text-center">Alertas</th>
                        </tr>
                      </thead>
                      <tbody className="text-body-md font-body-md">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-on-surface-variant">No students participated.</td>
                          </tr>
                        ) : (
                          students.map((student, index) => (
                            <tr key={student.id} className={`border-b border-outline-variant ${index === 0 ? 'bg-secondary-fixed/20' : ''}`}>
                              <td className={`p-4 font-bold flex items-center gap-2 ${index === 0 ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                                {index === 0 && <span className="material-symbols-outlined text-sm fill">military_tech</span>} 
                                {index + 1}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 border-2 border-primary rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-surface-container-lowest p-1">
                                    <img src={`/avatares/${student.avatar}.jpg`} alt="Avatar" className="w-full h-full object-contain drop-shadow-sm" />
                                  </div>
                                  <span className="font-bold">{student.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-on-surface-variant">
                                {student.correctCount} / {student.totalQuestions || 0}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-headline-sm-mobile">{student.score.toFixed(1)}</span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${student.colorClass}`}>
                                    {student.classification}
                                  </span>
                                </div>
                              </td>
                              {student.sectionScores && Object.values(student.sectionScores).map((secScore, i) => (
                                <td key={i} className="p-4 font-bold text-primary">
                                  {secScore.toFixed(1)}
                                </td>
                              ))}
                              <td className="p-4 text-center">
                                {student.cheated ? (
                                  <span className="material-symbols-outlined text-error cursor-help" title="Screen switch detected">swap_horiz</span>
                                ) : (
                                  <span className="text-outline">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
                
                <div className="flex justify-center mt-8 pb-12">
                  <button 
                    onClick={async () => {
                      if (students.length > 0 && activityData) {
                        const reportRef = ref(rtdb, `reports/${sessionState.activityId}/${pin}`);
                        const reportData = {
                          activityTitle: activityData.title,
                          date: Date.now(),
                          students: students.map(student => ({
                            name: student.name,
                            avatar: student.avatar,
                            score: student.score,
                            sectionScores: student.sectionScores || null,
                            correctCount: student.correctCount,
                            classification: student.classification,
                            course: student.course || '',
                            cheated: !!student.cheated
                          }))
                        };
                        try {
                          await import('firebase/database').then(({ set }) => set(reportRef, reportData));
                          // Delete the session since it's finished
                          await import('firebase/database').then(({ set }) => set(ref(rtdb, `sessions/${pin}`), null));
                        } catch (e) {
                          console.error("Error saving report", e);
                        }
                      } else {
                        // Just delete session if no students
                        try {
                          await import('firebase/database').then(({ set }) => set(ref(rtdb, `sessions/${pin}`), null));
                        } catch (e) { }
                      }
                      navigate('/teacher');
                    }} 
                    className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold btn-3d shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">save</span>
                    Guardar Reporte y Finalizar
                  </button>
                </div>
              </>
            ) : (
              /* Student View: Personal Results */
              (() => {
                const myData = students.find(s => s.id === studentId);
                if (!myData || !activityData) return null;
                
                return (
                  <section className="flex flex-col items-center max-w-3xl mx-auto space-y-8 mt-8 pb-12">
                    <h2 className="text-display-sm text-primary font-bold">¡Buen trabajo, {myData.name}!</h2>
                    
                    <div className={`p-8 rounded-3xl border-4 ${myData.colorClass} shadow-xl text-center w-full max-w-md`}>
                      <p className="text-title-lg font-bold mb-2">Tu Puntuación</p>
                      <p className="text-[5rem] font-black leading-none mb-4">{myData.score.toFixed(1)}</p>
                      <p className="text-headline-sm font-bold uppercase tracking-widest">{myData.classification}</p>
                      <p className="text-title-md mt-4 opacity-80">
                        {myData.correctCount} respuestas correctas de {myData.totalQuestions || 0}
                      </p>
                      {myData.sectionScores && (
                        <div className="mt-6 w-full space-y-3">
                          {Object.entries(myData.sectionScores).map(([secName, secScore]) => {
                            const secClass = secScore >= 7.0 ? 'text-[#43A047]' : 'text-error';
                            return (
                              <div key={secName} className="flex justify-between items-center bg-surface-container/40 px-4 py-2 rounded-xl">
                                <span className="font-bold text-sm">{secName}</span>
                                <span className={`font-black text-lg ${secClass}`}>{secScore.toFixed(1)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="w-full bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
                      <h3 className="text-headline-sm font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Tus Respuestas</h3>
                      <div className="space-y-6">
                        {activityData.questions?.map((q, idx) => {
                          if (q.type === 'slide') return null;
                          const studentAnswerIdx = myData.answers?.[idx];
                          const isCorrect = studentAnswerIdx === q.correctAnswerIndex;
                          const hasAnswered = studentAnswerIdx !== undefined && studentAnswerIdx !== null;
                          
                          return (
                            <div key={idx} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
                              <p className="font-bold text-on-surface mb-3"><span className="text-primary mr-2">{q.text.match(/^\d+/) ? '' : `${idx + 1}. `}</span>{q.text}</p>
                              {q.section && <p className="text-xs font-bold text-on-surface-variant uppercase mb-2 tracking-wider">{q.section}</p>}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-surface-container p-3 rounded-xl">
                                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Tu respuesta:</p>
                                  <p className={`font-bold flex items-center gap-2 ${hasAnswered ? (isCorrect ? 'text-[#43A047]' : 'text-error') : 'text-on-surface-variant'}`}>
                                    <span className="material-symbols-outlined text-lg">
                                      {!hasAnswered ? 'horizontal_rule' : isCorrect ? 'check_circle' : 'cancel'}
                                    </span>
                                    {!hasAnswered ? 'No respondida' : q.options[studentAnswerIdx]}
                                  </p>
                                </div>
                                <div className="bg-primary-container/20 p-3 rounded-xl border border-primary/10">
                                  <p className="text-xs font-bold text-primary uppercase mb-1">Respuesta correcta:</p>
                                  <p className="font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">verified</span>
                                    {q.options[q.correctAnswerIndex]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        localStorage.removeItem('studentId');
                        localStorage.removeItem('studentPin');
                        localStorage.removeItem('studentName');
                        navigate('/');
                      }}
                      className="bg-surface-container-high text-on-surface px-8 py-3 rounded-xl font-bold btn-3d shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 mt-4"
                    >
                      <span className="material-symbols-outlined">home</span>
                      Volver al Inicio
                    </button>
                  </section>
                );
              })()
            )}
            
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes fall {
          0% { top: -10%; opacity: 1; transform: translateX(0) rotate(0deg); }
          100% { top: 110%; opacity: 0; transform: translateX(20px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
