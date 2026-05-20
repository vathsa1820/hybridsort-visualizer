import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Shield,
  Zap,
  Fingerprint,
  ChevronRight,
  Binary,
  Lock,
  Sparkles,
  Terminal as TerminalIcon,
  Database,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { soundfx } from '../utils/soundfx';

interface LandingPortalProps {
  onAccessGranted: () => void;
  soundOn: boolean;
}

export function LandingPortal({ onAccessGranted, soundOn }: LandingPortalProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('DECRYPTOR MODE: STANDBY');
  
  // Real-time floating diagnostic logs
  const [bootLogs, setBootLogs] = useState<string[]>([
    '» INITIALIZING ALGOLAB SEQUENTIAL BOOT',
    '» KERNEL: ACTIVE // PORT 3000 CONNECTED',
    '» LOADED CORE_HYBRID_ENGINE_v4.0.1',
  ]);

  // Mini Dynamic Array Visualizer (Teaser Demo)
  const [miniArray, setMiniArray] = useState<{ height: number; active: boolean; sorted: boolean }[]>([
    { height: 40, active: false, sorted: false },
    { height: 85, active: false, sorted: false },
    { height: 25, active: false, sorted: false },
    { height: 95, active: false, sorted: false },
    { height: 60, active: false, sorted: false },
    { height: 15, active: false, sorted: false },
    { height: 70, active: false, sorted: false },
    { height: 50, active: false, sorted: false },
  ]);

  // -------------------------------------------------------------
  // Live Self-Sorting Teaser Loop (Hands-free mini visualizer)
  // -------------------------------------------------------------
  useEffect(() => {
    let active = true;
    const runDemo = async () => {
      while (active) {
        // Shuffle
        setMiniArray([
          { height: 45, active: false, sorted: false },
          { height: 80, active: false, sorted: false },
          { height: 20, active: false, sorted: false },
          { height: 95, active: false, sorted: false },
          { height: 60, active: false, sorted: false },
          { height: 35, active: false, sorted: false },
          { height: 75, active: false, sorted: false },
          { height: 15, active: false, sorted: false },
        ]);
        await new Promise((r) => setTimeout(r, 1200));

        // Let's do a mini Insertion Sort emulation step-by-step
        const arr = [45, 80, 20, 95, 60, 35, 75, 15];
        for (let i = 1; i < arr.length; i++) {
          if (!active) return;
          const key = arr[i];
          let j = i - 1;

          setMiniArray((prev) => {
            const next = [...prev];
            if (next[i]) next[i].active = true;
            return next;
          });
          await new Promise((r) => setTimeout(r, 400));

          while (j >= 0 && arr[j] > key) {
            if (!active) return;
            arr[j + 1] = arr[j];
            
            setMiniArray((prev) => {
              const next = [...prev];
              next[j + 1] = { height: arr[j], active: true, sorted: false };
              next[j] = { height: key, active: true, sorted: false };
              return next;
            });
            await new Promise((r) => setTimeout(r, 300));
            j--;
          }
          arr[j + 1] = key;
          
          setMiniArray((prev) => {
            const next = prev.map((item, idx) => ({
              ...item,
              active: false,
            }));
            return next;
          });
        }

        // Complete sweep
        for (let k = 0; k < arr.length; k++) {
          if (!active) return;
          setMiniArray((prev) => {
            const next = [...prev];
            next[k] = { ...next[k], sorted: true };
            return next;
          });
          await new Promise((r) => setTimeout(r, 80));
        }

        await new Promise((r) => setTimeout(r, 3500));
      }
    };
    
    runDemo();
    return () => {
      active = false;
    };
  }, []);

  // -------------------------------------------------------------
  // Automated diagnostic terminal log stream
  // -------------------------------------------------------------
  useEffect(() => {
    const streamItems = [
      '» REGISTER SUBSYSTEMS MAPPED NOMINAL',
      '» INJECTING MEMORY SPACE ALLOCATIONS',
      '» BUFFER POOLS AT SECURE OFFSET',
      '» RECURSION BRANCH LIMITS SET [N <= 128]',
      '» CACHE COHERENCE VERIFIED NOMINAL',
      '» AUDITING HARMONIC WAVE SIGNAL INDICES',
      '» ADA RECOMMENDATION ENGINE ARMED',
      '» HYBRID THRESHOLD CONSTANT SET [k=16]',
      '» PORTAL HANDSHAKE PROTOCOL COMPLETE',
    ];

    let count = 0;
    const interval = setInterval(() => {
      const item = streamItems[count % streamItems.length];
      setBootLogs((prev) => {
        const next = [...prev, item];
        if (next.length > 8) next.shift(); // keep last 8 entries
        return next;
      });
      count++;
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // Biometric access scanner sequence
  // -------------------------------------------------------------
  const handleTriggerScanner = async () => {
    if (isScanning) return;
    setIsScanning(true);
    soundfx.playWarning();
    setScanStatus('ANALYZING NEURAL SIGNATURE...');

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.round(Math.random() * 8) + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setScanStatus('SIGNATURE VALID // ACCESS DECREED');
        soundfx.playSuccess();
        setTimeout(() => {
          onAccessGranted();
        }, 700);
      } else {
        setScanProgress(progress);
        if (progress > 75) {
          setScanStatus('INJECTING REGISTRY TOKENS...');
        } else if (progress > 45) {
          setScanStatus('DECODING BASE POLYNOMIALS...');
        } else if (progress > 20) {
          setScanStatus('MAPPING REGISTER INDEX...');
        }
      }
    }, 120);
  };

  return (
    <div className="w-full min-h-[calc(100vh-128px)] flex flex-col p-4 md:p-6 lg:p-8 z-10 xl:max-w-[92%] 2xl:max-w-[85%] mx-auto gap-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Dynamic Header Titles */}
      <div className="text-center space-y-3 pt-5 shrink-0 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--neon-cyan-grad)] border border-[var(--neon-cyan)]/25 rounded-full font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] uppercase animate-pulse">
          <Sparkles className="w-3 h-3 text-[var(--neon-purple)]" />
          <span>CYBERNETIC CORE INGRESS PROTOCOL V4</span>
        </div>
        
        <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none animate-glitch-glow">
          ALGOLAB // <span className="text-[var(--neon-cyan)]">HYBRIDSORT</span>
        </h2>
        
        <p className="font-sans text-xs md:text-sm text-[var(--text-dim)] max-w-lg mx-auto font-medium leading-relaxed uppercase">
          An adaptive hybrid sorting engine combining recursive Merge Sort partitioning with fast in-place Insertion Sort base levels.
        </p>
      </div>

      {/* Main Grid: Biometric Center + Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-2">
        
        {/* Left: Interactive Biometric Gate (lg:col-span-8) */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel border border-[var(--neon-cyan)]/25 p-6 rounded-xl relative overflow-hidden backdrop-blur-md min-h-[400px]">
          {/* Laser-sweep line overlay inside scanner body and scanning vertical beam */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent scanner-beam opacity-40 z-10 pointer-events-none" />
          <div className="absolute top-0 right-3 font-mono text-[8px] text-[var(--neon-cyan)]/35">PORT: 3000 // HOST: LOCAL</div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--neon-cyan)]">
              <Shield className="w-4 h-4" />
              <span className="font-mono text-[10px] font-extrabold tracking-widest uppercase">
                BIOMETRIC GATE PROTOCOL
              </span>
            </div>
            
            <h3 className="font-sans text-lg md:text-xl font-black text-white tracking-wide uppercase">
              DECRYPT ACCESS PORTAL
            </h3>
            
            <p className="font-mono text-[10px] text-[var(--text-dim)] uppercase leading-relaxed max-w-md">
              Secure authentication layer. Rest your cursor or scan below to launch the multi-threaded array visualizer, live telemetry meters, and mathematical complexity charts.
            </p>
          </div>

          {/* Interactive Fingerprint circle scanner */}
          <div className="flex flex-col items-center justify-center my-6 py-4 space-y-4">
            <div 
              onClick={handleTriggerScanner}
              onMouseEnter={() => soundfx.playHover()}
              className={`relative flex items-center justify-center w-28 h-28 border rounded-full cursor-pointer transition-all duration-300 select-none group focus:outline-none ${
                isScanning 
                  ? 'border-[var(--neon-purple)]/60 bg-[var(--neon-purple-grad)] shadow-[0_0_35px_var(--btn-glow-purple)]' 
                  : 'border-[var(--neon-cyan)]/40 bg-black/50 hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan-grad)] hover:shadow-[0_0_25px_var(--btn-glow-cyan)]'
              }`}
            >
              {/* Spinning background neon ring during signature authentication scan */}
              {isScanning && (
                <>
                  <div className="absolute inset-1 rounded-full border-2 border-t-[var(--neon-purple)] border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '0.8s' }} />
                  <div className="absolute inset-2.5 rounded-full border-2 border-b-[var(--neon-cyan)] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-4 rounded-full border border-dotted border-[var(--neon-cyan)]/40 animate-pulse" />
                </>
              )}
              
              <Fingerprint className={`w-12 h-12 transition-all duration-300 ${
                isScanning ? 'text-[var(--neon-purple)] animate-pulse scale-95' : 'text-[var(--neon-cyan)] group-hover:scale-105'
              }`} />
            </div>

            <div className="text-center space-y-1">
              <p className={`font-mono text-[10px] font-extrabold tracking-widest uppercase animate-pulse ${isScanning ? 'text-[var(--neon-purple)]' : 'text-[var(--neon-cyan)]'}`}>
                {scanStatus}
              </p>
              {isScanning ? (
                <div className="w-56 h-1 w-full bg-black/60 rounded-full border border-[var(--neon-purple)]/20 overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] transition-all duration-100 ease-linear"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              ) : (
                <p className="font-mono text-[8px] text-[var(--text-dim)]/60 uppercase">
                  TAP SCANNER TO DECRYPT
                </p>
              )}
            </div>
          </div>

          {/* Action CTA Trigger Access Button */}
          <button
            onClick={handleTriggerScanner}
            onMouseEnter={() => soundfx.playHover()}
            disabled={isScanning}
            className={`w-full py-3 border font-mono text-[10.5px] font-black tracking-widest rounded flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer uppercase ${
              isScanning 
                ? 'border-[var(--neon-purple)]/30 text-[var(--neon-purple)]/50 bg-black/40' 
                : 'border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] bg-[var(--neon-cyan-grad)] hover:bg-[var(--neon-cyan)] hover:text-black hover:border-[var(--neon-cyan)] laser-sweep shadow-[0_0_15px_var(--btn-glow-cyan)]'
            }`}
          >
            <span>INITIALIZE CORESORT INSTANCE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Technical Specs Bento Cards (lg:col-span-4) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 1: Interactive Self-sorting Demo Visualizer teaser */}
          <div className="glass-panel border border-[var(--neon-cyan)]/20 p-5 rounded-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-[190px]">
            <div className="absolute top-0 right-3 font-mono text-[8.5px] text-[var(--neon-purple)]/30">STATUS: EMULATIVE TRACE</div>
            
            <div className="space-y-1.5 shrink-0">
              <div className="flex items-center gap-1.5 text-[var(--neon-purple)]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-mono text-[8.5px] font-extrabold tracking-widest uppercase">
                  ACTIVE CORE EMULATION (k=16)
                </span>
              </div>
              <h4 className="font-sans text-xs md:text-sm font-black text-white uppercase tracking-wide">
                SUB-SECTOR PASSTHROUGH ACTIVE
              </h4>
            </div>

            {/* Live animated mini bars visualizer */}
            <div className="flex items-end justify-between px-6 h-20 w-full mb-1">
              {miniArray.map((bar, idx) => (
                <div
                  key={`bar-teaser-${idx}`}
                  style={{ height: `${bar.height}%` }}
                  className={`w-4 rounded-t-sm transition-all duration-350 shadow-inner ${
                    bar.sorted 
                      ? 'bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.5)]'
                      : bar.active 
                      ? 'bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple-grad)]' 
                      : 'bg-[var(--neon-cyan)] opacity-65 hover:opacity-100 shadow-[0_0_6px_var(--neon-cyan-grad)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card 2: Rolling boot kernel terminal stream */}
          <div className="glass-panel border border-[var(--neon-purple)]/15 p-5 rounded-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-[190px]">
            <div className="flex items-center gap-1.5 text-[var(--neon-cyan)] shrink-0 border-b border-[var(--neon-cyan)]/10 pb-2">
              <TerminalIcon className="w-4 h-4 text-[var(--neon-cyan)] drop-shadow-[0_0_4px_var(--btn-glow-cyan)]" />
              <span className="font-mono text-[8.5px] font-extrabold tracking-widest uppercase">
                SYSTEM CORE BOOTSTREAM LOG
              </span>
            </div>

            <div className="font-mono text-[8.5px] text-[var(--text-dim)] space-y-1 my-3 overflow-hidden leading-relaxed h-[110px] select-none text-left">
              {bootLogs.map((log, i) => (
                <div key={`bootlog-${i}`} className={`truncate ${log.includes('COMPLETE') || log.includes('SUCCESS') ? 'text-[#39ff14]' : log.includes('CORE') ? 'text-[var(--neon-purple)]' : ''}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Dual CORE Architecture Highlight Specifications explanation (bento-grid style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 md:my-2">
        
        {/* Merge Sort Core Specs Box */}
        <div className="glass-panel border border-[var(--neon-cyan)]/20 hover:border-[var(--neon-cyan)]/40 p-5 rounded-xl relative overflow-hidden transition-all hover:neon-cyan-glow duration-300 group subtle-hover-bounce">
          <div className="absolute top-0 right-3 font-mono text-[8px] text-[var(--neon-cyan)]/30">STABLE // O(N LOG N)</div>
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[var(--neon-cyan-grad)] border border-[var(--neon-cyan)]/25 rounded text-[var(--neon-cyan)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-sans text-sm md:text-md font-black text-white tracking-wide uppercase">
                PARTITION RECURSION CORE
              </h4>
              <p className="font-mono text-[10px] text-[var(--text-dim)] uppercase leading-relaxed">
                Splits target array sizes recursively into binary partition nodes to guarantee reliable sorting stability. When partition ranges settle below threshold $k$, variables bypass directly to register cache.
              </p>
            </div>
          </div>
        </div>

        {/* Insertion Sort Core Specs Box */}
        <div className="glass-panel border border-[var(--neon-purple)]/15 hover:border-[var(--neon-purple)]/35 p-5 rounded-xl relative overflow-hidden transition-all hover:neon-purple-glow duration-300 group subtle-hover-bounce">
          <div className="absolute top-0 right-3 font-mono text-[8px] text-[var(--neon-purple)]/30">IN-PLACE // O(N²)</div>
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-[var(--neon-purple-grad)] border border-[var(--neon-purple)]/25 rounded text-[var(--neon-purple)]">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-sans text-sm md:text-md font-black text-white tracking-wide uppercase">
                IN-PLACE ACCELERATOR (k=16)
              </h4>
              <p className="font-mono text-[10px] text-[var(--text-dim)] uppercase leading-relaxed">
                Eliminates recursion stack creation limits for small arrays. Shifts contiguous memory offsets with close local registry footprint to speed up sub-sort calls in the pipeline.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
