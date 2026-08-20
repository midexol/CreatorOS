import React from 'react';

interface PanelTextureProps {
  opacity?: number;
}

export const PanelTexture: React.FC<PanelTextureProps> = ({ opacity = 0.08 }) => {
  return (
    <div
      className="absolute -inset-[60px] animate-dotdrift pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        opacity,
      }}
      aria-hidden="true"
    />
  );
};
