import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid'; // we need to install uuid

export default function StudentLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const [loading, setLoading] = useState(false);

  // Generamos un arreglo con los IDs de los 6 avatares generados
  const avatars = Array.from({ length: 6 }, (_, i) => i + 1);

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
        avatar: avatarId, // Ahora guardamos el ID del PNG directamente
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
        <div className="h-28 mb-4 mx-auto flex items-center justify-center">
          <img 
            src="/Escudos-Presentacion-2020-08-scaled.png" 
            alt="Colegio de la Presentación" 
            className="h-full object-contain drop-shadow-md"
          />
        </div>
        <h1 className="text-headline-xl font-headline-xl text-primary font-bold tracking-tight drop-shadow-sm">Smart-Colpres</h1>
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
              <select 
                id="course" 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-surface-container-low border-2 border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all font-bold text-on-surface appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Selecciona tu curso...</option>
                <optgroup label="Sexto">
                  <option value="Sexto A">Sexto A</option>
                  <option value="Sexto B">Sexto B</option>
                  <option value="Sexto C">Sexto C</option>
                </optgroup>
                <optgroup label="Séptimo">
                  <option value="Séptimo A">Séptimo A</option>
                  <option value="Séptimo B">Séptimo B</option>
                  <option value="Séptimo C">Séptimo C</option>
                </optgroup>
                <optgroup label="Octavo">
                  <option value="Octavo A">Octavo A</option>
                  <option value="Octavo B">Octavo B</option>
                  <option value="Octavo C">Octavo C</option>
                </optgroup>
                <optgroup label="Noveno">
                  <option value="Noveno A">Noveno A</option>
                  <option value="Noveno B">Noveno B</option>
                  <option value="Noveno C">Noveno C</option>
                </optgroup>
                <optgroup label="Media">
                  <option value="Décimo A">Décimo A</option>
                  <option value="Décimo B">Décimo B</option>
                  <option value="Undécimo A">Undécimo A</option>
                  <option value="Undécimo B">Undécimo B</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* AVATAR CREATOR */}
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/50">
            <h3 className="font-label-lg text-label-lg text-primary mb-4 text-center">Selecciona tu Avatar</h3>
            
            {/* Live Preview */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 border-4 border-primary rounded-full shadow-lg flex items-center justify-center overflow-hidden bg-surface-container-lowest">
                <img src={`/avatares/${avatarId}.jpg`} alt="Avatar Preview" className="w-full h-full object-contain p-2 drop-shadow-md hover:scale-105 transition-transform" />
              </div>
            </div>

            {/* Customization Options */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-surface-container-low rounded-xl">
              {avatars.map(id => (
                <button 
                  key={id}
                  type="button" 
                  onClick={() => setAvatarId(id)}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all p-1 flex items-center justify-center bg-surface-container-lowest ${avatarId === id ? 'border-primary ring-4 ring-primary-fixed scale-110 shadow-lg' : 'border-outline-variant opacity-70 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={`/avatares/${id}.jpg`} alt={`Avatar ${id}`} className="w-full h-full object-contain drop-shadow-sm" />
                </button>
              ))}
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
