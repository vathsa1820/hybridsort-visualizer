/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { TerminalLog as LogType } from '../types';
import { soundfx } from '../utils/soundfx';

interface TerminalLogProps {
  logs: LogType[];
}

// Sub-component to perform typing animations for newly added logs smoothly
const LogLine: React.FC<{ log: LogType; isLast: boolean }> = ({ log, isLast }) => {
  const [displayedText, setDisplayedText] = useState(isLast ? '' : log.text);

  useEffect(() => {
    if (!isLast) {
      setDisplayedText(log.text);
      return;
    }

    // Dynamic scale speed based on text size so it remains fast but fully animated
    const textLength = log.text.length;
    const typingInterval = Math.max(5, Math.min(20, 250 / textLength));
    let index = 0;
    let accumulated = '';

    const timer = setInterval(() => {
      if (index < textLength) {
        accumulated += log.text.charAt(index);
        setDisplayedText(accumulated);
        index++;
        if (index % 2 === 0) {
          soundfx.playTerminalType();
        }
      } else {
        clearInterval(timer);
      }
    }, typingInterval);

    return () => clearInterval(timer);
  }, [log.text, isLast]);

  const getColorClass = (type: LogType['type']) => {
    switch (type) {
      case 'system':
        return 'text-[var(--neon-cyan)] font-medium tracking-wide'; // Neon Cyan
      case 'info':
        return 'text-[#cbd5e1]/75'; // Dim Gray
      case 'warn':
        return 'text-amber-400 font-medium animate-[pulse_1.5s_infinite]'; // Warning alert
      case 'success':
        return 'text-[#39ff14] font-bold'; // Sorcery sorted green
      case 'algorithm':
        return 'text-[var(--neon-purple)] font-semibold tracking-wider'; // Neon Purple/Pink
      case 'accent':
        return 'text-[var(--neon-cyan)] font-bold'; // Neon Cyan Accent
      default:
        return 'text-[#e1fcff]';
    }
  };

  return (
    <span className={`${getColorClass(log.type)} whitespace-pre-wrap transition-all`}>
      {displayedText}
      {isLast && (
        <span className="inline-block w-1.5 h-3 bg-[var(--neon-cyan)] ml-1 animate-[terminal-blink_0.8s_infinite] align-middle" />
      )}
    </span>
  );
};

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleMouseEnter = () => {
    soundfx.playHover();
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      className="bg-black/75 p-5 rounded-xl border border-[var(--neon-cyan)]/20 relative overflow-hidden flex flex-col h-full min-h-[220px] transition-all duration-300 hover:border-[var(--neon-cyan)]/40 hover:shadow-2xl hover:shadow-[var(--neon-cyan)]/5 laser-sweep"
    >
      {/* Cinematic grid background effect inside terminal */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="scanline opacity-10" />

      {/* Embedded style tag for blinking terminal cursor */}
      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Terminal Title Bar */}
      <div className="flex items-center gap-2 mb-4 border-b border-[var(--neon-cyan)]/15 pb-3 z-10 select-none">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--neon-purple)]/60 animate-pulse" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#39ff14]/60" />
        <span className="ml-2 font-mono text-[10px] text-[#84a9ab] uppercase tracking-wider font-bold">
          SMART INSIGHTS TERMINAL v4.2.0
        </span>
      </div>

      {/* Logs Feed Container */}
      <div
        ref={containerRef}
        className="font-mono text-xs leading-relaxed space-y-2 overflow-y-auto flex-grow pr-2 z-10 min-h-0"
      >
        {logs.map((log, index) => {
          const isLast = index === logs.length - 1;
          return (
            <div key={log.id} className="flex items-start gap-1 p-0.5 hover:bg-white/5 transition-colors rounded">
              <span className="text-[var(--neon-cyan)] select-none font-bold mr-1">&gt;</span>
              <LogLine log={log} isLast={isLast} />
              {log.timestamp && (
                <span className="ml-auto text-[9px] text-[#84a9ab]/40 select-none font-mono">
                  {log.timestamp}
                </span>
              )}
            </div>
          );
        })}
        
        {/* Rolling Prompt Cursor Indicator */}
        {logs.length === 0 && (
          <div className="flex items-center gap-1.5 pt-1.5 opacity-90 select-none">
            <span className="text-[var(--neon-cyan)] font-bold">&gt;</span>
            <span className="w-2 h-3.5 bg-[var(--neon-cyan)] animate-[terminal-blink_0.8s_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
};
