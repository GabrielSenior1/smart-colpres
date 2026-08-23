import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
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

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base docked full-width top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary">EduPlay</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary hover:bg-surface-container transition-colors p-2 rounded-full cursor-pointer">notifications</span>
          <span className="material-symbols-outlined text-primary hover:bg-surface-container transition-colors p-2 rounded-full cursor-pointer">settings</span>
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
            
            {/* Student View: Final Score Card */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8 text-center border-t-8 border-primary relative overflow-hidden">
              <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Quiz Completed!</h2>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">Biology 101 - Cell Structures</p>
              
              <div className="inline-block bg-primary-fixed rounded-full p-8 mb-6 relative">
                <span className="material-symbols-outlined text-6xl text-primary absolute -top-4 -right-4 rotate-12 fill">workspace_premium</span>
                <div className="text-headline-xl font-headline-xl text-primary">850</div>
                <div className="text-label-lg font-label-lg text-on-primary-fixed-variant mt-2">Final Score</div>
              </div>
              
              <div className="flex justify-center gap-4">
                <div className="bg-surface-container-low rounded-lg p-4 w-32">
                  <div className="text-headline-lg-mobile font-headline-lg-mobile text-primary">8/10</div>
                  <div className="text-sm text-on-surface-variant">Correct</div>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4 w-32">
                  <div className="text-headline-lg-mobile font-headline-lg-mobile text-primary">12s</div>
                  <div className="text-sm text-on-surface-variant">Avg Time</div>
                </div>
              </div>
            </section>

            {/* Teacher View: Leaderboard */}
            <section>
              <h3 className="text-headline-lg-mobile font-headline-lg-mobile text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">trophy</span> Class Leaderboard
              </h3>
              
              {/* Podium */}
              <div className="flex justify-center items-end gap-4 mb-12 h-64">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-surface-container-highest mb-2 bg-purple-200"></div>
                  <div className="bg-surface-container-highest w-24 h-32 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-md relative border-b-[6px] border-outline-variant">
                    <span className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface-variant font-bold">2</span>
                    <span className="text-sm font-bold text-on-surface-variant mt-2">Maria G.</span>
                  </div>
                </div>
                {/* 1st Place */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-20 h-20 rounded-full border-4 border-secondary-container mb-2 bg-yellow-200 relative -top-4"></div>
                  <div className="bg-secondary-container w-28 h-40 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-lg relative border-b-[8px] border-[#b38702]">
                    <span className="material-symbols-outlined text-on-secondary-container text-3xl fill">workspace_premium</span>
                    <span className="text-headline-lg-mobile font-headline-lg-mobile text-on-secondary-container font-bold">1</span>
                    <span className="text-sm font-bold text-on-secondary-container mt-2">Leo V.</span>
                  </div>
                </div>
                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#cd7f32] mb-2 bg-orange-200"></div>
                  <div className="bg-[#cd7f32] w-24 h-24 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-md relative border-b-[6px] border-[#8c5622]">
                    <span className="text-headline-lg-mobile font-headline-lg-mobile text-white font-bold">3</span>
                    <span className="text-sm font-bold text-white mt-2">Sam T.</span>
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Rank</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Student</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant">Score</th>
                      <th className="p-4 text-label-lg font-label-lg text-on-surface-variant text-center">Alerts</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-md font-body-md">
                    <tr className="border-b border-outline-variant bg-secondary-fixed/20">
                      <td className="p-4 font-bold text-secondary-container flex items-center gap-2"><span className="material-symbols-outlined text-sm">military_tech</span> 1</td>
                      <td className="p-4 font-bold">Leo V.</td>
                      <td className="p-4">1250</td>
                      <td className="p-4 text-center text-outline">-</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="p-4 text-on-surface-variant">2</td>
                      <td className="p-4">Maria G.</td>
                      <td className="p-4">1100</td>
                      <td className="p-4 text-center text-outline">-</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="p-4 text-on-surface-variant">3</td>
                      <td className="p-4">Sam T.</td>
                      <td className="p-4">980</td>
                      <td className="p-4 text-center">
                        <span className="material-symbols-outlined text-error" title="Screen switch detected">swap_horiz</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <div className="flex justify-center mt-8 pb-12">
              <button onClick={() => navigate('/teacher')} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold btn-3d">Return to Dashboard</button>
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
