/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnalyticsCardProps } from '../types';
import { soundfx } from '../utils/soundfx';

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  colorClass,
  glowClass,
  polygonPoints,
  gradientColor,
  pulse = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Skip pulse for empty/reset states
    if (value === 0 || value === '0.0' || value === '0') return;

    setIsUpdating(true);
    const timeout = setTimeout(() => setIsUpdating(false), 180);
    return () => clearTimeout(timeout);
  }, [value]);

  const activeGlowClass = glowClass === 'hover:neon-cyan-glow' ? 'neon-cyan-glow' : 'neon-purple-glow';

  const handleMouseEnter = () => {
    soundfx.playHover();
  };

  const isCyan = glowClass === 'hover:neon-cyan-glow';
  const cardAccent = isCyan ? 'var(--neon-cyan)' : 'var(--neon-purple)';
  const cardGradient = isCyan ? 'var(--neon-cyan-grad)' : 'var(--neon-purple-grad)';

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className={`glass-panel p-4 flex flex-col gap-2 group transition-all duration-300 rounded-xl rounded-l-lg hover:bg-black/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--shadow-accent)] ${glowClass} ${
        (pulse || isUpdating) ? `${activeGlowClass} scale-[1.03] bg-black/45 border-opacity-100` : ''
      } relative overflow-hidden laser-sweep`}
      style={{
        '--shadow-accent': cardAccent
      } as React.CSSProperties}
    >
      <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-dim)] uppercase select-none z-10">
        {title}
      </span>
      <span
        className={`font-sans text-3xl font-bold tracking-tight transition-all duration-300 z-10 ${
          isUpdating ? 'brightness-125 scale-105' : ''
        }`}
        style={{ color: cardAccent }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <div className="h-8 w-full mt-2 opacity-40 group-hover:opacity-75 transition-opacity overflow-hidden select-none z-10">
        <div
          className="w-full h-full"
          style={{ 
            clipPath: `polygon(${polygonPoints})`,
            backgroundImage: `linear-gradient(to right, transparent, ${cardGradient}, transparent)`
          }}
        />
      </div>
    </div>
  );
};
