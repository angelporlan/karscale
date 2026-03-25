import React, { useState } from 'react';

export default function ExpansionUniverse() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-neonPurple/30 transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group my-12 ${expanded ? 'h-[500px]' : 'h-48'} bg-black/80`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-neonPurple/5 to-electricCyan/5 group-hover:from-neonPurple/15 group-hover:to-electricCyan/15 transition-all duration-700" />
      
      {/* Visual Singularity / Expansion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Halo cyan */}
        <div className={`absolute rounded-full bg-electricCyan blur-[60px] opacity-30 transition-all duration-[1500ms] ${expanded ? 'w-[600px] h-[600px] opacity-10' : 'w-24 h-24'}`} />
        
        {/* Core Purple */}
        <div className={`absolute rounded-full bg-neonPurple shadow-[0_0_80px_#00f0ff] mix-blend-screen transition-all duration-[1500ms] ease-out ${expanded ? 'w-48 h-48 blur-lg' : 'w-4 h-4'}`} />

        {/* Center white ping */}
        <div className={`absolute rounded-full bg-white transition-all duration-1000 ${expanded ? 'w-full h-full opacity-0' : 'w-1 h-1 shadow-[0_0_15px_#fff] animate-pulse'}`} />
      </div>

      {/* Decorative UI elements */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] md:text-sm text-electricCyan select-none tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
        {expanded ? '> ESTADO: EXPANSIÓN CÓSMICA ACELERADA' : '> ESTADO: SINGULARIDAD INICIAL'}
      </div>
      <div className="absolute top-6 right-6 text-[10px] text-gray-500 font-sans tracking-[0.2em] uppercase select-none group-hover:text-gray-300 transition-colors">
        {expanded ? 'Click to compress' : 'Click to interact'}
      </div>
    </div>
  );
}
