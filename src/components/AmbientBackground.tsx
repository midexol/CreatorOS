import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(6px) saturate(1.1) brightness(0.75)' }}
        src="/videos/dashboard-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0" style={{ background: 'rgba(10,16,17,0.72)' }} />
      <div
        className="absolute -inset-[60px] animate-dotdrift"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          opacity: 0.4,
        }}
      />
    </div>
  );
};
