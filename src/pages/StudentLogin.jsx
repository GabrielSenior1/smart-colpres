import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('red');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/waiting-room');
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md w-[400px]">
        <div className="bg-surface-container-lowest rounded-[24px] card-elevation overflow-hidden border border-primary/10 relative z-10">
          
          <div className="h-32 bg-primary-fixed-dim relative overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(theme('colors.primary-container') 2px, transparent 2px)", backgroundSize: '16px 16px' }}></div>
            <h1 className="text-3xl font-extrabold text-primary-container z-10">Colegio La Presentación</h1>
          </div>
          
          <div className="p-card-padding flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Welcome!</h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">Get ready to learn and play.</p>
            </div>
            
            <form className="flex flex-col gap-4" id="joinForm" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-label-lg font-label-lg text-on-surface" htmlFor="studentName">Your Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none fill">face</span>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-12 pr-4 text-body-md font-body-md text-on-surface placeholder-on-surface-variant/50 input-glow transition-all" id="studentName" placeholder="e.g. Maria G." required type="text" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-label-lg font-label-lg text-on-surface" htmlFor="studentGrade">Grade / Course</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none fill">school</span>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-12 pr-4 text-body-md font-body-md text-on-surface appearance-none input-glow transition-all" id="studentGrade" required defaultValue="">
                    <option disabled value="">Select your grade</option>
                    <option value="grade3">Grade 3</option>
                    <option value="grade4">Grade 4</option>
                    <option value="grade5">Grade 5</option>
                    <option value="grade6">Grade 6</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-label-lg font-label-lg text-on-surface">Choose your Avatar Color</span>
                  <span className="material-symbols-outlined text-primary fill">palette</span>
                </div>
                <div className="flex justify-between gap-2">
                  <button type="button" onClick={() => setSelectedAvatar('red')} className={`w-12 h-12 rounded-full border-2 border-transparent transition-all flex items-center justify-center bg-[#ffb4a8] relative ${selectedAvatar === 'red' ? 'selected' : 'avatar-option'}`}>
                    <span className="material-symbols-outlined text-tertiary transition-opacity">check</span>
                  </button>
                  <button type="button" onClick={() => setSelectedAvatar('blue')} className={`w-12 h-12 rounded-full border-2 border-transparent transition-all flex items-center justify-center bg-[#bfc2ff] ${selectedAvatar === 'blue' ? 'selected' : 'avatar-option'}`}>
                    <span className="material-symbols-outlined text-primary-container transition-opacity">check</span>
                  </button>
                  <button type="button" onClick={() => setSelectedAvatar('yellow')} className={`w-12 h-12 rounded-full border-2 border-transparent transition-all flex items-center justify-center bg-[#ffdf9e] ${selectedAvatar === 'yellow' ? 'selected' : 'avatar-option'}`}>
                    <span className="material-symbols-outlined text-secondary transition-opacity">check</span>
                  </button>
                  <button type="button" onClick={() => setSelectedAvatar('gray')} className={`w-12 h-12 rounded-full border-2 border-transparent transition-all flex items-center justify-center bg-[#c6c5d5] ${selectedAvatar === 'gray' ? 'selected' : 'avatar-option'}`}>
                    <span className="material-symbols-outlined text-on-surface-variant transition-opacity">check</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <button type="submit" className="btn-3d btn-primary-3d w-full rounded-2xl py-5 flex items-center justify-center gap-3 relative overflow-hidden group">
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                      <span className="text-quiz-option font-quiz-option uppercase">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[32px] fill">sports_esports</span>
                      <span className="text-quiz-option font-quiz-option tracking-wide uppercase">Join Game</span>
                    </>
                  )}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
