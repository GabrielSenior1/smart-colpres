import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function Results() {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);
  const [students, setStudents] = useState([]);

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

    // Read real-time students data
    const studentsRef = ref(rtdb, 'session/students');
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data)
          .map(([id, info]) => {
            // Simple grading logic for the hardcoded question
            const isCorrect = info.answer === 'Mars';
            const score = isCorrect ? 1000 : 0; // Simple scoring
            return { id, ...info, score, isCorrect };
          })
          .filter(s => s.status !== 'kicked') // Only show active
          .sort((a, b) => b.score - a.score); // Sort by highest score
        
        setStudents(studentList);
      }
    });

    return () => {
      clearTimeout(t);
      unsubscribe();
    };
  }, []);

  const getShapeClasses = (shape, colorId) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : 'rounded-none';
    const bgClass = `bg-${colorId}-200`;
    const borderClass = `border-${colorId}-400`;
    return `${shapeClass} ${bgClass} ${borderClass}`;
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base docked full-width top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">EduPlay</h1>
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
                className="absolute w-2 h-4"
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
            
            {/* Teacher View: Leaderboard */}
            <section>
              <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-primary mb-6 flex items-center gap-2 mt-8">
                <span className="material-symbols-outlined text-secondary-container fill">trophy</span> Class Leaderboard
              </h3>

              {/* Detailed Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Rank</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Student</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Answered</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Score</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant text-center">Alerts</th>
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
                                <img src={`/avatares/${student.avatar}.png`} alt="Avatar" className="w-full h-full object-contain drop-shadow-sm" />
                              </div>
                              <span className="font-bold">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-on-surface-variant">{student.answer || '-'}</td>
                          <td className="p-4 font-bold">{student.score}</td>
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
              <button onClick={() => navigate('/teacher')} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold btn-3d shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-colors">
                Return to Dashboard
              </button>
            </div>
            
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
