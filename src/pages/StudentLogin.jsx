import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid'; // we need to install uuid

export default function StudentLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [avatarColor, setAvatarColor] = useState('blue');
  const [avatarShape, setAvatarShape] = useState('circle');
  const [loading, setLoading] = useState(false);

  const colors = [
    { id: 'blue', value: 'bg-blue-200 border-blue-400' },
    { id: 'green', value: 'bg-green-200 border-green-400' },
    { id: 'yellow', value: 'bg-yellow-200 border-yellow-400' },
    { id: 'red', value: 'bg-red-200 border-red-400' },
    { id: 'purple', value: 'bg-purple-200 border-purple-400' },
    { id: 'orange', value: 'bg-orange-200 border-orange-400' }
  ];

  const shapes = [
    { id: 'circle', value: 'rounded-full' },
    { id: 'square', value: 'rounded-lg' },
    { id: 'triangle', value: 'rounded-none' } // Simple representation for now
  ];

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name || !course) return;
    
    setLoading(true);
    
    try {
      // 1. Generate unique ID for this student session
      const studentId = uuidv4();
      
      // 2. Save student data to Realtime Database
      await set(ref(rtdb, `session/students/${studentId}`), {
        name,
        course,
        avatar: { color: avatarColor, shape: avatarShape },
        status: 'waiting',
        joinedAt: Date.now()
      });
      
      // 3. Save student ID to local storage so they don't lose session on refresh
      localStorage.setItem('studentId', studentId);
      
      // 4. Navigate to waiting room
      navigate('/waiting-room');
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Hubo un error al unirse a la sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pattern animate-slide-bg min-h-screen font-body-md text-on-surface flex flex-col justify-center items-center p-4">
      
      {/* HEADER LOGO OR ICON */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg border-b-4 border-[#00004c]">
          <span className="material-symbols-outlined text-white text-4xl">extension</span>
        </div>
        <h1 className="text-headline-xl font-headline-xl text-primary font-bold tracking-tight drop-shadow-sm">EduPlay</h1>
      </div>

      <main className="w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-primary-fixed">
        <form onSubmit={handleJoin} className="space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-primary font-bold">Únete a la Clase</h2>
            
            <div className="space-y-1">
              <label htmlFor="studentName" className="font-label-lg text-label-lg text-on-surface-variant ml-2">Nombre</label>
              <input 
                type="text" 
                id="studentName" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu primer nombre y apellido..." 
                className="w-full bg-surface-container-low border-2 border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all placeholder:text-outline-variant/60 font-bold text-on-surface"
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="course" className="font-label-lg text-label-lg text-on-surface-variant ml-2">Curso</label>
              <input 
                type="text" 
                id="course" 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Ej. 10A, 8vo..." 
                className="w-full bg-surface-container-low border-2 border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all placeholder:text-outline-variant/60 font-bold text-on-surface"
                required 
              />
            </div>
          </div>

          {/* AVATAR CREATOR */}
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/50">
            <h3 className="font-label-lg text-label-lg text-primary mb-4 text-center">Crea tu Avatar</h3>
            
            {/* Live Preview */}
            <div className="flex justify-center mb-6">
              <div className={`w-24 h-24 ${shapes.find(s => s.id === avatarShape).value} ${colors.find(c => c.id === avatarColor).value} border-4 shadow-inner flex items-center justify-center transition-all duration-300 relative overflow-hidden`}>
                <div className="absolute top-1/3 w-full flex justify-center gap-3">
                  <div className="w-2.5 h-3 bg-inverse-surface rounded-full animate-blink"></div>
                  <div className="w-2.5 h-3 bg-inverse-surface rounded-full animate-blink"></div>
                </div>
                <div className="absolute bottom-1/4 w-6 h-2 border-b-2 border-inverse-surface rounded-full"></div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              {/* Color Picker */}
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">Color</p>
                <div className="flex gap-2 justify-between">
                  {colors.map(color => (
                    <button 
                      key={color.id}
                      type="button" 
                      onClick={() => setAvatarColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.value.split(' ')[0]} ${avatarColor === color.id ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'} transition-all`}
                    ></button>
                  ))}
                </div>
              </div>
              
              {/* Shape Picker */}
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">Forma</p>
                <div className="flex gap-3 justify-center">
                  <button type="button" onClick={() => setAvatarShape('circle')} className={`w-10 h-10 rounded-full bg-surface-dim border-2 ${avatarShape === 'circle' ? 'border-primary shadow-sm' : 'border-outline-variant'} flex items-center justify-center transition-colors`}><div className="w-4 h-4 rounded-full bg-on-surface-variant"></div></button>
                  <button type="button" onClick={() => setAvatarShape('square')} className={`w-10 h-10 rounded-lg bg-surface-dim border-2 ${avatarShape === 'square' ? 'border-primary shadow-sm' : 'border-outline-variant'} flex items-center justify-center transition-colors`}><div className="w-4 h-4 rounded-sm bg-on-surface-variant"></div></button>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-primary text-on-primary font-headline-lg-mobile text-headline-lg-mobile py-4 rounded-2xl shadow-lg border-b-4 ${loading ? 'border-primary opacity-70' : 'border-[#00004c] active:border-b-0 active:translate-y-1'} transition-all flex items-center justify-center gap-2`}
          >
            {loading ? 'Entrando...' : 'Entrar a la Sala'}
            {!loading && <span className="material-symbols-outlined font-bold">arrow_forward</span>}
          </button>
        </form>
      </main>
      
      <p className="mt-8 text-on-surface-variant/80 font-bold tracking-widest uppercase text-sm">Colegio de la Presentación</p>
    </div>
  );
}
