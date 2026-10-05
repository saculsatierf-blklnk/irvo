import React, { useState, useEffect } from 'react';
import { Globe, Wifi, Battery, Power } from 'lucide-react';
import { REGIONAL_MULTIPLIERS } from '../constants/data';
import { sound } from '../utils/audio';

interface TelemetryHUDProps {
  region: string;
  setRegion: (r: string) => void;
  onLogout: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ region, setRegion, onLogout }) => {
  const [latency, setLatency] = useState(24);
  const [blink, setBlink] = useState(true);

  // Ping jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedLatency = Math.floor(Math.random() * 32) + 18;
      setLatency(simulatedLatency);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Blinking LED
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(b => !b);
    }, 900);
    return () => clearInterval(blinkInterval);
  }, []);

  const regions = Object.keys(REGIONAL_MULTIPLIERS);

  const cycleRegion = () => {
    sound.playRadarPing();
    const idx = regions.indexOf(region);
    const next = regions[(idx + 1) % regions.length];
    setRegion(next);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 h-12 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between font-mono text-[11px] select-none">
      {/* Left: Region Badge & Network Ping */}
      <div className="flex items-center gap-3">
        <button
          onClick={cycleRegion}
          title="Clique para alternar setor geopolítico"
          className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 transition-all text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/30 font-bold"
        >
          <Globe className="w-3 h-3 text-yellow-500" />
          <span>{region}</span>
          <span className="text-[9px] text-yellow-500/60 ml-0.5">({REGIONAL_MULTIPLIERS[region as keyof typeof REGIONAL_MULTIPLIERS]}x)</span>
        </button>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <Wifi className={`w-3.5 h-3.5 ${latency < 60 ? 'text-emerald-400' : 'text-yellow-500'}`} />
          <span className={latency < 60 ? 'text-emerald-400 font-semibold' : 'text-yellow-500 font-semibold'}>
            {latency}ms
          </span>
        </div>
      </div>

      {/* Center: System Status */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full bg-emerald-500 transition-opacity duration-300 ${
            blink ? 'opacity-100 shadow-[0_0_8px_#22c55e]' : 'opacity-30'
          }`}
        />
        <span className="text-white font-bold tracking-widest text-[10px] hidden sm:inline">
          SISTEMA ONLINE
        </span>
      </div>

      {/* Right: Telemetry & Power Exit */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-zinc-400">
          <Battery className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] text-zinc-300">98%</span>
        </div>

        <button
          onClick={() => {
            sound.playClick(300);
            onLogout();
          }}
          className="flex items-center gap-1 border border-red-500/40 hover:border-red-500 hover:bg-red-500/10 active:scale-95 transition-all text-red-500 px-2 py-0.5 text-[10px] font-bold rounded"
          title="Encerrar Sessão Tática"
        >
          <span>OFF</span>
          <Power className="w-2.5 h-2.5 text-red-500" />
        </button>
      </div>
    </header>
  );
};
