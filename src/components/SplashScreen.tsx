import React, { useState, useEffect } from 'react';
import { SLOGANS } from '../constants/data';
import { sound } from '../utils/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [sloganIdx, setSloganIdx] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [fadeSlogan, setFadeSlogan] = useState(false);

  useEffect(() => {
    sound.playRadarPing();

    // Slogan cycle every 750ms
    const sloganTimer = setInterval(() => {
      setFadeSlogan(true);
      setTimeout(() => {
        setSloganIdx(prev => (prev + 1) % SLOGANS.length);
        setFadeSlogan(false);
      }, 150);
    }, 750);

    // Zoom Big Bang trigger after 3.2s
    const zoomTimer = setTimeout(() => {
      clearInterval(sloganTimer);
      sound.playDispatch();
      setZooming(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 3200);

    return () => {
      clearInterval(sloganTimer);
      clearTimeout(zoomTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sound.playClick(900);
    setZooming(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-700 ${
        zooming ? 'opacity-0 scale-[8] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Rotating Logo "I" */}
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-3xl bg-white/[0.06] border-[1.5px] border-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] animate-[spin_3s_ease-in-out_infinite]">
          <span className="text-5xl font-black text-white tracking-tighter">
            I
          </span>
        </div>
        {/* Tactical Crosshair corner marks */}
        <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-yellow-500" />
        <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-yellow-500" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-yellow-500" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-yellow-500" />
      </div>

      {/* Cycling Multilingual Slogans */}
      <div className="h-8 flex items-center justify-center">
        <span 
          className={`text-yellow-500 text-xs font-mono font-bold tracking-[0.25em] uppercase text-center transition-opacity duration-150 ${
            fadeSlogan ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          {SLOGANS[sloganIdx]}
        </span>
      </div>

      {/* Skip indicator at bottom */}
      <div className="absolute bottom-10 text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
        TOQUE PARA AVANÇAR // IRVO INC. 2026
      </div>
    </div>
  );
};
