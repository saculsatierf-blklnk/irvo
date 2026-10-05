import React from 'react';

export const RadarBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#09090b]" />
      
      {/* Tactical Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Radial Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(9, 9, 11, 0.8) 75%, #09090b 100%)'
        }}
      />

      {/* Rotating Radar Sweep */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute w-[240px] h-[240px] rounded-full border border-white/[0.08]" />
        <div className="absolute w-[440px] h-[440px] rounded-full border border-white/[0.05]" />
        <div className="absolute w-[580px] h-[580px] rounded-full border border-gold/[0.1] border-dashed" />

        {/* Center Crosshair */}
        <div className="absolute w-6 h-6 border border-gold/40 rotate-45" />
        <div className="absolute w-1.5 h-1.5 bg-gold rounded-full" />
        <div className="absolute w-[200px] h-[1px] bg-white/[0.08]" />
        <div className="absolute h-[200px] w-[1px] bg-white/[0.08]" />

        {/* Sweeping Cone */}
        <div className="absolute w-full h-full animate-[spin_6s_linear_infinite]">
          <div 
            className="w-1/2 h-1/2 ml-auto mt-auto rounded-tl-full origin-bottom-right"
            style={{
              background: 'conic-gradient(from 180deg at 100% 100%, transparent 60deg, rgba(234, 179, 8, 0.08) 90deg, rgba(234, 179, 8, 0.25) 90deg)',
              borderBottom: '1.5px solid rgba(234, 179, 8, 0.4)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
