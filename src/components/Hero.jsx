import React from 'react';

const heroTuning = {
  home: { x: 50, y: 45, from: 0.30, via: 0.20, to: 0.10, baseVh: 78, mdVh: 68 },
  forEmployers: { x: 50, y: 25, from: 0.30, via: 0.20, to: 0.10, baseVh: 78, mdVh: 68 },
  forTrades: { x: 48, y: 42, from: 0.30, via: 0.20, to: 0.10, baseVh: 78, mdVh: 68 },
  corerecruit: { x: 50, y: 50, from: 0.30, via: 0.20, to: 0.10, baseVh: 60, mdVh: 50 },
  jobBoard: { x: 50, y: 40, from: 0.70, via: 0.60, to: 0.50, baseVh: 75, mdVh: 66 },
  resume: { x: 52, y: 44, from: 0.30, via: 0.20, to: 0.10, baseVh: 78, mdVh: 68 },
  daily: { x: 50, y: 45, from: 0.30, via: 0.20, to: 0.10, baseVh: 78, mdVh: 68 },
};

export default function Hero({ pageKey, imageSrc, children }) {
  const tuning = heroTuning[pageKey] || heroTuning.home;
  
  const style = {
    '--hero-x': `${tuning.x}%`,
    '--hero-y': `${tuning.y}%`,
    '--hero-vh-base': `${tuning.baseVh}vh`,
    '--hero-vh-md': `${tuning.mdVh}vh`,
  };

  return (
    <section 
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        ...style,
        minHeight: `var(--hero-vh-base)`,
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          section[style*="--hero-vh-md"] {
            min-height: var(--hero-vh-md);
          }
        }
      `}</style>
      
      {imageSrc && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${tuning.x}% ${tuning.y}%`,
          }}
        />
      )}
      
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${tuning.from}) 0%, rgba(0,0,0,${tuning.via}) 50%, rgba(0,0,0,${tuning.to}) 100%)`,
        }}
      />
      
      <div className="relative z-[2] text-center max-w-7xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
}