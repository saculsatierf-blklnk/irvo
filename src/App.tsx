import React, { useState } from 'react';
import { AppState, UserRole } from './types';
import { SplashScreen } from './components/SplashScreen';
import { LandingScreen } from './components/LandingScreen';
import { CockpitScreen } from './components/CockpitScreen';
import { Smartphone, Monitor, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from './utils/audio';

export function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [userRole, setUserRole] = useState<UserRole>('client_pf');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'fullscreen'>('fullscreen');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    setAppState('cockpit');
  };

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playClick(800);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center relative overflow-x-hidden font-sans">
      {/* Floating Tactical Device Control Bar (Bottom Center) */}
      <aside aria-label="Controles do Simulador" className="fixed bottom-4 z-50 flex items-center gap-2 p-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 shadow-2xl backdrop-blur-md font-mono text-[11px]">
        {/* Frame Toggle */}
        <button
          onClick={() => {
            sound.playClick(600);
            setDeviceFrame(deviceFrame === 'mobile' ? 'fullscreen' : 'mobile');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            deviceFrame === 'mobile'
              ? 'bg-yellow-500 text-black font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Alternar entre modo smartphone e tela cheia"
        >
          {deviceFrame === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          <span>{deviceFrame === 'mobile' ? 'iPhone Frame' : 'Fullscreen'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded-full transition-all ${
            soundEnabled ? 'text-emerald-400 hover:bg-zinc-900' : 'text-zinc-600 hover:bg-zinc-900'
          }`}
          title={soundEnabled ? 'Áudio tático ativado' : 'Áudio mudo'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Restart Splash */}
        <button
          onClick={() => {
            sound.playClick(500);
            setAppState('splash');
          }}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-all"
          title="Reiniciar animação de introdução (Splash Big Bang)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </aside>

      {/* Main Container: Mobile Mockup OR Fullscreen */}
      {deviceFrame === 'mobile' ? (
        <div className="py-6 flex items-center justify-center w-full">
          {/* iPhone 16 Pro Chassis */}
          <div className="relative w-[390px] h-[844px] bg-[#09090b] rounded-[52px] border-[10px] border-[#222227] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col">
            {/* Dynamic Island */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a20]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d2818] border border-emerald-500/40" />
            </div>

            {/* Inner App Container */}
            <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col">
              {appState === 'splash' && (
                <SplashScreen onComplete={() => setAppState('auth')} />
              )}
              {appState === 'auth' && (
                <LandingScreen onLoginSuccess={handleLoginSuccess} />
              )}
              {appState === 'cockpit' && (
                <CockpitScreen userRole={userRole} onLogout={() => setAppState('auth')} />
              )}
            </div>

            {/* iOS Home Bar Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        /* Fullscreen Command Center */
        <div className="w-full min-h-screen flex flex-col">
          {appState === 'splash' && (
            <SplashScreen onComplete={() => setAppState('auth')} />
          )}
          {appState === 'auth' && (
            <LandingScreen onLoginSuccess={handleLoginSuccess} />
          )}
          {appState === 'cockpit' && (
            <CockpitScreen userRole={userRole} onLogout={() => setAppState('auth')} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
