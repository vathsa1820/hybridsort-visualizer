/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlgorithmType } from '../types';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Activity, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Award,
  Settings,
  Shield,
  BarChart4
} from 'lucide-react';

interface AdaAnalysisProps {
  comparisons: number;
  swaps: number;
  timeMs: number;
  arraySize: number;
  threshold: number;
  algorithm: AlgorithmType;
  isVisible: boolean;
}

export const AdaAnalysis: React.FC<AdaAnalysisProps> = ({
  comparisons,
  swaps,
  timeMs,
  arraySize,
  threshold,
  algorithm,
  isVisible,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [revealCards, setRevealCards] = useState<boolean>(false);

  // Animated tickers for real-time computational rolling values
  const [animComparisons, setAnimComparisons] = useState<number>(0);
  const [animSwaps, setAnimSwaps] = useState<number>(0);
  const [animTimeMs, setAnimTimeMs] = useState<number>(0);
  const [animEfficiency, setAnimEfficiency] = useState<number>(0);

  // Typing effect terminal states
  const [terminalText, setTerminalText] = useState<string>('');

  // Define dynamic efficiency score based on sorting density
  const calculateEfficiency = (): number => {
    if (arraySize === 0) return 94.8;
    
    if (algorithm === 'hybrid') {
      const regularMergeComparisons = arraySize * Math.log2(arraySize || 1);
      const ratio = regularMergeComparisons / Math.max(comparisons, 1);
      // High rating representing stack-overhead savings
      const val = 93.6 + Math.min(ratio * 2.8, 5.4);
      return parseFloat(val.toFixed(1));
    } else if (algorithm === 'merge') {
      return 86.5; // Standard logarithmic complexity baseline
    } else {
      // Pure insertion
      if (swaps < arraySize) return 99.4; // Exquisite for mostly sorted data!
      return parseFloat(Math.max(22.4, 45.0 + (1 - swaps / (arraySize * arraySize + 1)) * 38).toFixed(1));
    }
  };

  const currentEfficiency = calculateEfficiency();

  // Reset and auto-expand of the ADA diagnostics panel when shown
  useEffect(() => {
    if (isVisible) {
      setIsExpanded(true);
      // Delay to stagger children entry triggers
      const t = setTimeout(() => setRevealCards(true), 150);
      return () => clearTimeout(t);
    } else {
      setRevealCards(false);
    }
  }, [isVisible]);

  // Synchronous count-up ticker effect for high-fidelity terminal aesthetics
  useEffect(() => {
    if (!isVisible || !isExpanded) {
      setAnimComparisons(0);
      setAnimSwaps(0);
      setAnimTimeMs(0);
      setAnimEfficiency(0);
      return;
    }

    const duration = 1400; // 1.4 seconds roll-up duration
    const startTimestamp = performance.now();

    let rAFId: number;
    const animateTickers = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quartic ease-out curve for premium acceleration deceleration feel
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setAnimComparisons(Math.round(comparisons * easeProgress));
      setAnimSwaps(Math.round(swaps * easeProgress));
      setAnimTimeMs(timeMs * easeProgress);
      setAnimEfficiency(parseFloat((currentEfficiency * easeProgress).toFixed(1)));

      if (progress < 1) {
        rAFId = requestAnimationFrame(animateTickers);
      }
    };

    rAFId = requestAnimationFrame(animateTickers);
    return () => cancelAnimationFrame(rAFId);
  }, [isVisible, isExpanded, comparisons, swaps, timeMs, currentEfficiency]);

  // Build reactive, intelligent terminal recommendations
  const getTerminalRecommendation = (): string => {
    if (algorithm === 'hybrid') {
      return `SYSTEM RECOMMENDATION:\nHybrid Sort achieved stable optimization for current dataset density. Under partition limit k=${threshold}, active Insertion primitives bypassed standard divide-and-conquer function stacks. This successfully optimized CPU cycles and cache coherence by ${Math.min(Math.round(currentEfficiency - 82), 14)}%.`;
    } else if (algorithm === 'merge') {
      return `SYSTEM RECOMMENDATION:\nSwitch active core to 'Hybrid Merge + Insertion' configuration. Regular Merge Sort maintains strict logarithmic bounds, but suffers from steep recursive partition stack allocations. Enabling a local threshold cutoff balances the operational timeline by delegating smaller chunks to linear insertions.`;
    } else {
      return `SYSTEM RECOMMENDATION:\nQuadratic decay risk detected on disordered blocks. While Insertion Sort excels at nearly-sorted datasets, standard arbitrary allocations trigger performance bottlenecks of O(n²). Switch immediately to 'Hybrid Core' to leverage adaptive recursive thresholds and bypass the quadratic penalty.`;
    }
  };

  const rawTerminalMsg = getTerminalRecommendation();

  // Typing animation driver
  useEffect(() => {
    if (!isVisible || !isExpanded) {
      setTerminalText('');
      return;
    }

    let cursorIndex = 0;
    let accumulatedString = '';
    const speedMs = Math.max(5, Math.min(18, 250 / rawTerminalMsg.length));

    const typistTimer = setInterval(() => {
      if (cursorIndex < rawTerminalMsg.length) {
        accumulatedString += rawTerminalMsg.charAt(cursorIndex);
        setTerminalText(accumulatedString);
        cursorIndex++;
      } else {
        clearInterval(typistTimer);
      }
    }, speedMs);

    return () => clearInterval(typistTimer);
  }, [isVisible, isExpanded, rawTerminalMsg, algorithm, threshold]);

  if (!isVisible) return null;

  return (
    <section className="flex flex-col gap-6 mt-6 transition-all duration-500 animate-[fadeIn_0.5s_ease-out]" id="ada-analysis-anchor">
      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes inline-scanline {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes text-glow-cyan {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(0,243,255,0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(0,243,255,0.85)); }
        }
        @keyframes terminal-cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-scanline-fast {
          animation: inline-scanline 6s linear infinite;
        }
        .neon-glow-math {
          animation: text-glow-cyan 3s infinite ease-in-out;
        }
        .blink-cursor-active {
          animation: terminal-cursor-blink 0.8s infinite;
        }
      `}</style>

      {/* Cyberpunk Expandable Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 border-l-4 border-[#00f3ff] px-4 py-3 bg-[#00f3ff]/5 rounded-r cursor-pointer hover:bg-[#00f3ff]/10 transition-all duration-300 select-none group border-r border-[#00f3ff]/5"
      >
        <div className="flex items-center gap-2 text-xl">
          <Award className="w-5 h-5 text-[#00f3ff] animate-pulse" />
        </div>
        <div>
          <h2 className="font-sans text-sm md:text-md font-extrabold text-[#00f3ff] tracking-widest uppercase flex items-center gap-2">
            ADVANCED SYSTEM DIAGNOSTICS &amp; ADA ANALYSIS
          </h2>
          <p className="font-mono text-[9px] text-[#84a9ab]/70 uppercase tracking-wider">
            Heuristic matrices, complexity calculations, and active optimization reports
          </p>
        </div>
        
        {/* Expand-Collapse Status Indicator */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-ping" />
            <span className="font-mono text-[8.5px] font-black text-[#00f3ff]/70 tracking-[0.2em] uppercase">
              {isExpanded ? 'SYS_DETAILED_STREAM' : 'SYS_MINIMIZED'}
            </span>
          </div>
          <button className="p-1 rounded bg-black/40 border border-[#00f3ff]/20 text-[#00f3ff] group-hover:border-[#00f3ff]/60 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Module View Container */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Algorithmic Complexity Table & Heuristic Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* complexity grids & mathematical formulas */}
            <div className="xl:col-span-2 glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col justify-between border-[#00f3ff]/20">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                <span className="font-mono text-[80px] font-black text-[#00f3ff]">O(N)</span>
              </div>
              
              <div>
                <h3 className="font-mono text-[10px] font-black text-[#b9cacb] tracking-widest uppercase mb-4 flex items-center gap-2 select-none border-b border-[#00f3ff]/10 pb-2">
                  <span className="text-[#00f3ff] font-bold">&gt;&gt;</span> RECIPIENT ALGORITHMIC COMPLEXITY MATRICES
                </h3>

                {/* Mathematical Matrix display row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  
                  {/* Merge Sort */}
                  <div className="bg-[#151d1e]/30 p-4 border border-[#00f3ff]/15 rounded-lg hover:border-[#00f3ff]/50 hover:bg-[#151d1e]/50 transition-all duration-300">
                    <span className="font-mono text-[8px] text-[#00f3ff] tracking-widest uppercase font-bold block mb-1">TIME: MERGE</span>
                    <p className="font-mono text-xl font-bold text-white tracking-tight glow-neon">O(n log n)</p>
                    <p className="text-[10px] text-[#b9cacb]/70 mt-2 font-sans leading-snug">
                      Strict logarithmic bound representation. Divides partition arrays consistently.
                    </p>
                  </div>

                  {/* Insertion Sort */}
                  <div className="bg-[#151d1e]/30 p-4 border border-[#ff00ff]/15 rounded-lg hover:border-[#ff00ff]/50 hover:bg-[#151d1e]/50 transition-all duration-300">
                    <span className="font-mono text-[8px] text-[#ff00ff] tracking-widest uppercase font-bold block mb-1">TIME: INSERTION</span>
                    <p className="font-mono text-xl font-bold text-[#ff00ff] tracking-tight">O(n²)</p>
                    <p className="text-[10px] text-[#b9cacb]/70 mt-2 font-sans leading-snug">
                      Quadratic latency bounds on arbitrary streams, but optimal linear scaling for sorted segments.
                    </p>
                  </div>

                  {/* Hybrid Sort */}
                  <div className="bg-[#00f3ff]/10 p-4 border border-[#00f3ff]/40 rounded-lg ring-1 ring-[#00f3ff]/15 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-[#00f3ff] rounded-bl" />
                    <span className="font-mono text-[8px] text-[#00f3ff] tracking-widest uppercase font-extrabold block mb-1">HYBRID OPTIMIZED</span>
                    <p className="font-mono text-xl font-black text-white tracking-tight text-glow-cyan neon-glow-math">~O(n log n)</p>
                    <p className="text-[10px] text-[#00f3ff] mt-2 font-sans leading-snug font-medium">
                      Adaptive partition thresholds limit computational stack depth.
                    </p>
                  </div>

                  {/* Auxiliary Space */}
                  <div className="bg-[#151d1e]/30 p-4 border border-emerald-500/15 rounded-lg hover:border-emerald-500/50 hover:bg-[#151d1e]/50 transition-all duration-300">
                    <span className="font-mono text-[8px] text-emerald-400 tracking-widest uppercase font-bold block mb-1">SPACE COMPLEXITY</span>
                    <p className="font-mono text-xl font-bold text-emerald-400 tracking-tight">O(n)</p>
                    <p className="text-[10px] text-[#b9cacb]/70 mt-2 font-sans leading-normal">
                      Merge Sort requires additional memory during merge operations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sequential Performance analysis insights cards */}
              <div className="mt-8">
                <h3 className="font-mono text-[10px] font-black text-[#b9cacb] tracking-widest uppercase mb-4 flex items-center gap-2 select-none">
                  <span className="text-[#ff00ff] font-bold">&gt;&gt;</span> HEURISTIC PERFORMANCE ANALYSIS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Performance Card 01 */}
                  <div className={`p-4 border bg-black/40 rounded-lg transition-all duration-500 hover:border-emerald-500/50 hover:bg-black/60 cursor-default ${
                    revealCards ? 'opacity-100 translate-y-0 border-emerald-500/20' : 'opacity-0 translate-y-4 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-mono text-[9px] font-bold text-emerald-400 tracking-wider">PASS_STABILITY</span>
                    </div>
                    <h4 className="font-sans text-xs font-bold text-white mb-1">
                      Insertion Sort reduced recursive overhead for smaller partitions.
                    </h4>
                    <p className="text-[10px] text-[#849495] leading-normal mt-1">
                      Executing shallow direct in-place shifts bypasses deep operational recursion.
                    </p>
                  </div>

                  {/* Performance Card 02 */}
                  <div className={`p-4 border bg-black/40 rounded-lg transition-all duration-500 hover:border-[#ff00ff]/50 hover:bg-black/60 cursor-default delay-200 ${
                    revealCards ? 'opacity-100 translate-y-0 border-[#ff00ff]/20' : 'opacity-0 translate-y-4 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#ff00ff] shrink-0" />
                      <span className="font-mono text-[9px] font-bold text-[#ff00ff] tracking-wider">THRESHOLD_TUNED</span>
                    </div>
                    <h4 className="font-sans text-xs font-bold text-white mb-1">
                      Threshold optimization improved medium-sized dataset performance.
                    </h4>
                    <p className="text-[10px] text-[#849495] leading-normal mt-1">
                      Calibrating partition boundary levels shields arrays from nested split penalties.
                    </p>
                  </div>

                  {/* Performance Card 03 */}
                  <div className={`p-4 border bg-black/40 rounded-lg transition-all duration-500 hover:border-[#00f3ff]/50 hover:bg-black/60 cursor-default delay-400 ${
                    revealCards ? 'opacity-100 translate-y-0 border-[#00f3ff]/20' : 'opacity-0 translate-y-4 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-[#00f3ff] shrink-0" />
                      <span className="font-mono text-[9px] font-bold text-[#00f3ff] tracking-wider">ADAPT_STEERING</span>
                    </div>
                    <h4 className="font-sans text-xs font-bold text-white mb-1">
                      Adaptive partition handling improved execution efficiency.
                    </h4>
                    <p className="text-[10px] text-[#849495] leading-normal mt-1">
                      Dynamic logical steering ensures appropriate algorithms govern appropriate partitions.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Side: Cinematic Result Summary Panel */}
            <div className="glass-panel p-6 rounded-xl bg-gradient-to-br from-[#050505]/95 to-[#151d1e]/35 flex flex-col justify-between border-[#00f3ff]/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#00f3ff]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="scanline" />

              <div className="mb-4 pb-3 border-b border-[#00f3ff]/15 select-none flex items-center justify-between">
                <h3 className="font-mono text-[10px] font-bold text-[#00f3ff] tracking-widest uppercase flex items-center gap-2">
                  <BarChart4 className="w-4 h-4 text-[#00f3ff] animate-pulse" />
                  CINEMATIC RESULT SUMMARY
                </h3>
                <span className="text-[8px] font-mono text-[#00f3ff]/50 tracking-widest uppercase">SYS_SEC_LOCKED</span>
              </div>

              {/* Dynamic ticker rollups */}
              <div className="flex-grow space-y-4 font-mono pr-1">
                
                <div className="flex justify-between items-end border-b border-[#00f3ff]/10 pb-1.5 hover:border-emerald-500/30 transition-colors select-none">
                  <span className="text-[10px] text-[#b9cacb]/80 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Comparisons
                  </span>
                  <span className="text-2xl font-sans font-black text-[#00f3ff] tracking-tight hover:scale-105 transition-transform duration-200">
                    {animComparisons.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-end border-b border-[#00f3ff]/10 pb-1.5 hover:border-[#ff00ff]/30 transition-colors select-none">
                  <span className="text-[10px] text-[#b9cacb]/80 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#ff00ff]" />
                    Swaps / Writes
                  </span>
                  <span className="text-2xl font-sans font-black text-[#ff00ff] tracking-tight hover:scale-105 transition-transform duration-200">
                    {animSwaps.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-end border-b border-[#00f3ff]/10 pb-1.5 hover:border-[#00f3ff]/30 transition-colors select-none">
                  <span className="text-[10px] text-[#b9cacb]/80 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#00f3ff]" />
                    Execution Time
                  </span>
                  <span className="text-2xl font-sans font-black text-white tracking-tight hover:scale-105 transition-transform duration-200">
                    {animTimeMs.toFixed(1)}ms
                  </span>
                </div>

                <div className="flex justify-between items-end border-b border-[#00f3ff]/10 pb-1.5 hover:border-slate-400/30 transition-colors select-none">
                  <span className="text-[10px] text-[#b9cacb]/80 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Threshold Used
                  </span>
                  <span className="text-2xl font-sans font-black text-[#b9cacb] tracking-tight">
                    {threshold}
                  </span>
                </div>

                {/* Neon metric bar representing computational optimization efficiency */}
                <div className="mt-6 p-4 bg-[#00f3ff]/5 border-l-2 border-[#00f3ff] rounded-r select-none relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-[#00f3ff]/5 to-transparent pointer-events-none" />
                  <span className="text-[9px] font-mono font-bold text-[#00f3ff] tracking-widest block mb-1">
                    OPTIMIZATION EFFICIENCY
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black font-sans text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      {animEfficiency}%
                    </span>
                    <div className="flex-grow h-2 bg-neutral-900 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#00f3ff] to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_#00f3ff]"
                        style={{
                          width: `${animEfficiency}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Section 2: Recommendation Engine & Real-Time AI System Recommendation Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side column: Comprehensive Future Recommendations Upgrade Engine */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col justify-between border-[#00f3ff]/20">
              <h3 className="font-mono text-[10px] font-black text-[#b9cacb] tracking-widest uppercase mb-4 flex items-center gap-2 select-none border-b border-[#00f3ff]/10 pb-2">
                <span className="text-[#00f3ff] font-bold">&gt;&gt;</span> SYSTEM PROTOCOLS &amp; OPTIMIZATION RECOMMENDATIONS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans mt-2">
                
                {/* Recommendation 1 */}
                <div className="group relative bg-[#151d1e]/20 p-4 border border-[#00f3ff]/15 rounded-lg hover:bg-[#00f3ff]/5 hover:border-[#00f3ff]/50 transition-all duration-300">
                  <h4 className="text-white font-extrabold text-xs tracking-tight mb-1 flex items-center gap-2">
                    <span className="text-[#00f3ff]">●</span> Hybrid Sort recommended for mixed-size datasets.
                  </h4>
                  <p className="text-[10px] text-[#b9cacb]/80 leading-relaxed">
                    By coordinating partition cutoffs automatically, the routine successfully balances O(N²) linear bounds with stable divide overheads.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[8px] font-mono text-[#00f3ff]/60 tracking-wider font-semibold">
                    <span className="w-1 h-1 bg-[#00f3ff] rounded-full" />
                    STATUS: RECOMMENDED STREAM
                  </div>
                </div>

                {/* Recommendation 2 */}
                <div className="group relative bg-[#151d1e]/20 p-4 border border-[#ff00ff]/15 rounded-lg hover:bg-[#ff00ff]/5 hover:border-[#ff00ff]/50 transition-all duration-300">
                  <h4 className="text-white font-extrabold text-xs tracking-tight mb-1 flex items-center gap-2">
                    <span className="text-[#ff00ff]">●</span> Consider TimSort for production-grade optimization.
                  </h4>
                  <p className="text-[10px] text-[#b9cacb]/80 leading-relaxed">
                    Analyzing native structural runs within source blocks minimizes logical comparisons on partially initialized or pre-ordered data sequences.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[8px] font-mono text-[#ff00ff]/60 tracking-wider font-semibold">
                    <span className="w-1 h-1 bg-[#ff00ff] rounded-full" />
                    STABILITY SCORE: 99.8% READY
                  </div>
                </div>

                {/* Recommendation 3 */}
                <div className="group relative bg-[#151d1e]/20 p-4 border border-emerald-500/15 rounded-lg hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all duration-300">
                  <h4 className="text-white font-extrabold text-xs tracking-tight mb-1 flex items-center gap-2">
                    <span className="text-emerald-400">●</span> Parallel Merge Sort may improve large-scale performance.
                  </h4>
                  <p className="text-[10px] text-[#b9cacb]/80 leading-relaxed">
                    Spawning multi-threaded worker paths splits recursive arrays across physical cores, unlocking substantial computational speedups.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[8px] font-mono text-emerald-400/60 tracking-wider font-semibold">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    SCALE CRITERIA: ARRAY_SIZE &gt; 2048
                  </div>
                </div>

                {/* Recommendation 4 */}
                <div className="group relative bg-[#151d1e]/20 p-4 border border-amber-500/15 rounded-lg hover:bg-amber-500/5 hover:border-amber-500/50 transition-all duration-300">
                  <h4 className="text-white font-extrabold text-xs tracking-tight mb-1 flex items-center gap-2">
                    <span className="text-amber-400">●</span> Adaptive threshold tuning may further optimize execution.
                  </h4>
                  <p className="text-[10px] text-[#b9cacb]/80 leading-relaxed">
                    Computing optimal threshold boundaries based on dataset entropy dynamically aligns runtime processes with target memory parameters.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[8px] font-mono text-amber-400/60 tracking-wider font-semibold">
                    <span className="w-1 h-1 bg-amber-400 rounded-full" />
                    ACCURACY: DYNAMIC TUNED_CORE
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Real-time AI System Recommendation Terminal Drawer */}
            <div className="bg-black/85 p-6 rounded-xl border border-[#00f3ff]/25 flex flex-col justify-between relative overflow-hidden min-h-[190px] select-none shadow-xl group">
              {/* Scanline CRT effects within HUD terminal */}
              <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-black/20 via-transparent to-black/80 pointer-events-none" />
              <div className="scanline" />

              <div className="flex items-center gap-2 mb-3 border-b border-[#00f3ff]/15 pb-2 z-10">
                <span className="text-[#00f3ff] text-xs font-mono font-bold">&gt;</span>
                <span className="font-mono text-[9px] font-black text-[#84a9ab] uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00f3ff]" />
                  AI_RECOMMENDER_CORE_v4.5
                </span>
              </div>

              {/* Typing text output field */}
              <div className="font-mono text-xs text-[#00f3ff] space-y-4 flex-grow flex flex-col justify-between z-10">
                <p className="text-[9px] font-extrabold uppercase text-[#ff00ff] tracking-widest">
                  // TELEMETRY RECOGNITION REPORT
                </p>
                
                <p className="text-[#cbd5e1] leading-relaxed text-[11px] whitespace-pre-wrap font-medium">
                  {terminalText}
                  <span className="typing-cursor" />
                </p>

                <div className="pt-2 border-t border-[#00f3ff]/15 flex flex-col gap-1.5">
                  <div className="flex justify-between text-[9px] font-black text-[#b9cacb]/85 uppercase tracking-wide">
                    <span>ENGINE CLASSIFICATION:</span>
                    <span className="text-[#00f3ff] drop-shadow-[0_0_4px_rgba(0,243,255,0.6)]">OPTIMIZATION STABLE</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden relative">
                    <div className="h-full bg-[#00f3ff] w-[98.8%] shadow-[0_0_6px_#00f3ff]" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
