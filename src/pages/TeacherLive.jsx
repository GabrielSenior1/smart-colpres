import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';

export default function TeacherLive() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // 1. Initialize session state when teacher opens live view
    const stateRef = ref(rtdb, 'session/state');
    set(stateRef, { status: 'waiting', currentQuestion: 1 });

    // 2. Listen for students joining
    const studentsRef = ref(rtdb, 'session/students');
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and filter out kicked ones if needed
        // For now, we only show those who are 'waiting'
        const studentList = Object.entries(data)
          .map(([id, info]) => ({ id, ...info }))
          .filter(s => s.status === 'waiting');
        setStudents(studentList);
      } else {
        setStudents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleKickStudent = async (studentId) => {
    try {
      // Instead of deleting, we change status to 'kicked' so their app knows
      await set(ref(rtdb, `session/students/${studentId}/status`), 'kicked');
    } catch (e) {
      console.error("Error kicking student:", e);
    }
  };

  const handleStartQuiz = async () => {
    try {
      await set(ref(rtdb, 'session/state'), { status: 'quiz', startedAt: Date.now() });
      navigate('/results'); // For now, we jump straight to results to watch it live
    } catch (e) {
      console.error("Error starting quiz:", e);
    }
  };

  const getShapeClasses = (shape, colorId) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : 'rounded-none';
    const bgClass = `bg-${colorId}-200`;
    const borderClass = `border-${colorId}-400`;
    return `${shapeClass} ${bgClass} ${borderClass}`;
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-body-md overflow-hidden">
      {/* Top App Bar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-desktop py-base z-10 relative">
        <div className="flex items-center gap-4">
          <span className="text-headline-lg font-headline-lg font-bold text-primary">EduPlay</span>
          <span className="text-on-surface-variant font-label-lg text-label-lg ml-4">Sesión Activa</span>
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
              <h2 className="text-headline-xl font-headline-xl text-primary mb-2">Únete a la clase</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Escanea el código QR o entra desde tu app</p>
            </div>
            
            <div className="bg-surface-container-lowest p-card-padding rounded-xl card-shadow border-2 border-primary mb-8 w-64 h-64 flex items-center justify-center">
              {/* Dummy QR code generation based on current URL just for visual purposes */}
              <img className="w-full h-full object-contain" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EduPlay_Local" alt="QR Code" />
            </div>
            
            <button 
              onClick={handleStartQuiz}
              disabled={students.length === 0}
              className={`w-full max-w-xs text-on-secondary-container font-headline-lg-mobile py-4 rounded-2xl shadow-lg border-b-4 transition-all flex items-center justify-center gap-2 ${students.length > 0 ? 'bg-secondary-container border-[#b38702] active:translate-y-1 active:border-b-0 cursor-pointer' : 'bg-surface-container-highest border-outline-variant opacity-50 cursor-not-allowed'}`}>
              <span className="material-symbols-outlined">play_arrow</span>
              Iniciar Quiz
            </button>
          </section>
          
          {/* Right Side: Waiting Room */}
          <section className="lg:w-7/12 p-margin-desktop flex flex-col h-full bg-surface-bright">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-lg font-headline-lg text-primary flex items-center gap-2">
                Sala de Espera
                <span className="bg-secondary-container text-on-secondary-container text-label-lg font-label-lg px-3 py-1 rounded-full ml-2">{students.length} Conectados</span>
              </h2>
              <button onClick={() => navigate('/teacher')} className="bg-surface-container-highest text-on-surface hover:bg-surface-container transition-colors px-4 py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-2 card-shadow">
                <span className="material-symbols-outlined">close</span>
                Cerrar Sesión
              </button>
            </div>
            
            {/* Students Grid */}
            <div className="flex-1 overflow-y-auto pr-4 pb-32">
              {students.length === 0 ? (
                <div className="h-full flex items-center justify-center text-on-surface-variant font-label-lg">
                  Esperando a que los estudiantes se unan...
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {students.map(student => (
                    <div key={student.id} className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant card-shadow group relative overflow-hidden hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 border-2 border-primary rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-surface-container-lowest p-1">
                        <img src={`/avatares/${student.avatar}.jpg`} alt="Avatar" className="w-full h-full object-contain drop-shadow-sm" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-label-lg text-label-lg truncate leading-tight">{student.name}</span>
                        <span className="text-xs text-on-surface-variant truncate">{student.course}</span>
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
      </main>
    </div>
  );
}
