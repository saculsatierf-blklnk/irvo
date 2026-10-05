import React from 'react';

interface ObsidianMapProps {
  region: string;
  activeMarker?: { lat?: number; lng?: number; label?: string } | null;
}

export const ObsidianMap: React.FC<ObsidianMapProps> = ({ region, activeMarker }) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black select-none pointer-events-none">
      {/* Tactical Sub-grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1f1f23 1px, transparent 1px),
            linear-gradient(to bottom, #1f1f23 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Primary Coordinates Grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #27272a 1px, transparent 1px),
            linear-gradient(to bottom, #27272a 1px, transparent 1px)
          `,
          backgroundSize: '144px 144px'
        }}
      />

      {/* Geopolitical Grid Labels */}
      <div className="absolute top-2 left-4 text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
        GRID SECTOR [{region}] // LAT 23.5505° S, LON 46.6333° W
      </div>
      <div className="absolute bottom-3 right-4 text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
        OBSIDIAN ENGINE v4.1 // SECURE ENCLAVE ACTIVE
      </div>

      {/* Simulated Tactical POIs & Active Nodes */}
      <div className="absolute top-[28%] left-[22%] flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
        </span>
        <span className="text-[8px] font-mono text-gold/70 tracking-widest uppercase bg-black/60 px-1 border border-gold/20">NODE-A [ALPHA]</span>
      </div>

      <div className="absolute top-[58%] left-[68%] flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[8px] font-mono text-emerald-400/70 tracking-widest uppercase bg-black/60 px-1 border border-emerald-500/20">UNIT-44 [PATROL]</span>
      </div>

      <div className="absolute top-[18%] left-[52%] flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
        <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase">STATION {region}-01</span>
      </div>

      <div className="absolute top-[42%] left-[84%] flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
        <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase">RESERVE-B</span>
      </div>

      {/* Center Tactical Command Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-20 h-20 border border-gold/20 bg-gold/[0.03] flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 bg-gold rotate-45 shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
          <div className="absolute -top-3 text-[7px] font-mono text-gold tracking-widest">CENTER HQ</div>
          {/* Reticle brackets */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-gold" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-gold" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-gold" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-gold" />
        </div>
      </div>

      {/* Active Marker for Dispatched Operative */}
      {activeMarker && (
        <div className="absolute top-[45%] left-[55%] flex items-center gap-2 transition-all duration-1000">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </span>
          <div className="bg-black/90 border border-emerald-500/50 px-2 py-1 rounded text-[9px] font-mono text-emerald-400 shadow-lg">
            {activeMarker.label || 'OPERATIVO EM DESLOCAMENTO'}
          </div>
        </div>
      )}
    </div>
  );
};
