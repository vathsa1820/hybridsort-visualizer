/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VisualizerBar, BarStatus } from '../types';

interface VisualizerStageProps {
  bars: VisualizerBar[];
  isSwitching?: boolean;
  animationQuality?: string;
  gpuOptimization?: boolean;
  renderMode?: string;
}

export const VisualizerStage: React.FC<VisualizerStageProps> = ({
  bars,
  isSwitching,
  animationQuality = 'high',
  gpuOptimization = true,
  renderMode = 'high-perf',
}) => {
  // Translate bar status to custom color schemes and neon glows
  const getBarClasses = (status: BarStatus) => {
    const gpuClass = gpuOptimization ? 'transform-gpu will-change-transform' : '';
    const noShadow = animationQuality === 'low' || renderMode === 'power-saver';
    
    // In power-saver mode, map comparisons to default style to avoid rendering highlights
    const effectiveStatus = (renderMode === 'power-saver' && status === 'comparing') ? 'default' : status;

    switch (effectiveStatus) {
      case 'comparing':
        return `bg-gradient-to-t from-transparent via-yellow-400/20 to-yellow-400 border-t-2 border-yellow-300 ${noShadow ? '' : 'shadow-[0_0_18px_rgba(250,204,21,0.85)]'} z-10 scale-x-105 ${gpuClass}`;
      case 'swapping':
        return `bg-gradient-to-t from-transparent via-red-500/20 to-red-500 border-t-2 border-red-400 ${noShadow ? '' : 'shadow-[0_0_18px_rgba(239,68,68,0.85)]'} z-10 scale-x-105 ${animationQuality === 'low' ? '' : 'animate-pulse'} ${gpuClass}`;
      case 'sorted':
        return `bg-gradient-to-t from-transparent via-[#39ff14]/20 to-[#39ff14] border-t-2 border-[#39ff14] ${noShadow ? '' : 'shadow-[0_0_12px_rgba(57,255,20,0.65)]'} ${animationQuality === 'low' ? '' : 'shimmer'}`;
      case 'default':
      default:
        return `visualizer-bar-default transition-all cursor-pointer ${gpuClass}`;
    }
  };

  return (
    <section
      id="viz-container"
      className={`glass-panel h-[400px] md:h-[450px] lg:h-[480px] xl:h-[560px] 2xl:h-[680px] rounded-xl flex items-end justify-center px-4 md:px-6 pb-6 gap-[2px] md:gap-[3px] relative overflow-hidden group select-none border-[var(--neon-cyan)]/25 transition-all duration-300 ${
        gpuOptimization ? 'transform-gpu' : ''
      }`}
    >
      {/* Background Cyber-style grids and scanlines */}
      {animationQuality !== 'low' && (
        <>
          <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
          <div className="scanline" />
        </>
      )}

      {/* Switching Algorithm Dramatic Overlay */}
      {isSwitching && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-red-500/30">
          <div className="text-center space-y-3 p-6 rounded-lg bg-black/90 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.45)] animate-[pulse_1.5s_ease-in-out_infinite]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[ping_1s_infinite]" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-red-450 font-extrabold uppercase">
                THRESHOLD REACHED
              </span>
            </div>
            <h3 className="font-sans text-lg md:text-xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.85)] uppercase">
              SWITCHING TO INSERTION SORT...
            </h3>
            <p className="font-mono text-[9px] text-[#cbd5e1]/70 max-w-xs leading-relaxed uppercase">
              Subsegment partition size ≤ threshold limit: activating localized insertion sort pass.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Bars Layout */}
      <div className={`w-full h-[90%] flex items-end justify-center gap-[1px] md:gap-[2px] z-10 transition-all duration-500 ${isSwitching ? 'filter blur-xs scale-98 pointer-events-none' : ''}`}>
        {bars.map((bar) => (
          <div
            key={bar.id}
            className={`visualizer-bar w-full rounded-t-sm transition-all duration-200 relative ${getBarClasses(
              bar.status
            )}`}
            style={{
              height: `${Math.max(bar.value, 4)}%`,
            }}
          >
            {/* Index label displayed above each bar when space permits (array size <= 64) */}
            {bars.length <= 64 && (
              <span
                className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold select-none transition-all duration-300 ${
                  bar.status === 'default'
                    ? 'text-[var(--neon-cyan)]/60'
                    : bar.status === 'comparing'
                    ? 'text-yellow-400 scale-110'
                    : bar.status === 'swapping'
                    ? 'text-red-500 scale-115'
                    : 'text-[#39ff14] font-bold'
                }`}
              >
                {bar.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Key Indicators */}
      <div className="absolute top-4 right-6 flex items-center gap-4 bg-[#050505]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--neon-cyan)]/30 z-20 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-gradient-to-t from-transparent to-[var(--neon-cyan)] border-t-2 border-[var(--neon-cyan)] rounded-xs shadow-[0_0_6px_var(--neon-cyan-grad)]" />
          <span className="font-mono text-[9px] font-bold text-[#e1fcff] tracking-wider uppercase">
            Default
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-gradient-to-t from-transparent to-yellow-400 border-t-2 border-yellow-250 rounded-xs shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
          <span className="font-mono text-[9px] font-bold text-[#e1fcff] tracking-wider uppercase">
            Comparing
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-gradient-to-t from-transparent to-red-500 border-t-2 border-red-400 rounded-xs shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse" />
          <span className="font-mono text-[9px] font-bold text-[#e1fcff] tracking-wider uppercase">
            Swap / Write
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-gradient-to-t from-transparent to-[#39ff14] border-t-2 border-[#39ff14] rounded-xs shadow-[0_0_6px_rgba(57,255,20,0.5)]" />
          <span className="font-mono text-[9px] font-bold text-[#e1fcff] tracking-wider uppercase">
            Sorted
          </span>
        </div>
      </div>
    </section>
  );
};
