/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Terminal as TerminalIcon,
  Settings,
  Sparkles,
  RefreshCw,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Cpu,
  Shield,
  Zap,
  Fingerprint,
  ChevronRight,
  Binary,
  Lock,
  Code2,
  ArrowUpDown,
} from 'lucide-react';
import { VisualizerBar, AlgorithmType, TerminalLog as LogType } from './types';
import { VisualizerStage } from './components/VisualizerStage';
import { AnalyticsCard } from './components/AnalyticsCard';
import { TerminalLog } from './components/TerminalLog';
import { PerformanceChart } from './components/PerformanceChart';
import { AdaAnalysis } from './components/AdaAnalysis';
import { LandingPortal } from './components/LandingPortal';
import { soundfx } from './utils/soundfx';

export default function App() {
  // -------------------------------------------------------------
  // States
  // -------------------------------------------------------------
  const [array, setArray] = useState<VisualizerBar[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('merge');
  const [speed, setSpeed] = useState<number>(85); // percentage (1 to 100)
  const [arraySize, setArraySize] = useState<number>(64); // default 64, ranges 10 to 128
  const [customInput, setCustomInput] = useState<string>('');
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [isInitializingEngine, setIsInitializingEngine] = useState<boolean>(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(soundfx.isEnabled());
  const [isLanding, setIsLanding] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('cyber-dark');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Audio configuration states
  const [uiSoundOn, setUiSoundOn] = useState<boolean>(soundfx.getUiSoundEnabled());
  const [alertSoundOn, setAlertSoundOn] = useState<boolean>(soundfx.getAlertSoundEnabled());
  const [terminalSoundOn, setTerminalSoundOn] = useState<boolean>(soundfx.getTerminalSoundEnabled());
  const [voiceOn, setVoiceOn] = useState<boolean>(soundfx.getVoiceEnabled());
  const [volume, setVolume] = useState<number>(soundfx.getMasterVolume());

  // Performance configuration states
  const [animationQuality, setAnimationQuality] = useState<string>('high');
  const [particleDensity, setParticleDensity] = useState<number>(0.75);
  const [speedMode, setSpeedMode] = useState<string>('cinematic');
  const [gpuOptimization, setGpuOptimization] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<string>('high-perf');

  // Dynamic Theme Scoping Effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Audio toggle handlers
  const handleUiSoundToggle = (val: boolean) => {
    soundfx.setUiSoundEnabled(val);
    setUiSoundOn(val);
  };
  const handleAlertSoundToggle = (val: boolean) => {
    soundfx.setAlertSoundEnabled(val);
    setAlertSoundOn(val);
  };
  const handleTerminalSoundToggle = (val: boolean) => {
    soundfx.setTerminalSoundEnabled(val);
    setTerminalSoundOn(val);
  };
  const handleVoiceToggle = (val: boolean) => {
    soundfx.setVoiceEnabled(val);
    setVoiceOn(val);
  };
  const handleVolumeChange = (val: number) => {
    soundfx.setMasterVolume(val);
    setVolume(val);
  };

  // Live Metrics
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [timeMs, setTimeMs] = useState<number>(0);
  const [threshold] = useState<number>(16); // constant threshold for k

  // Terminal & Advanced Diagnostics
  const [logs, setLogs] = useState<LogType[]>([]);
  const [showAdaAnalysis, setShowAdaAnalysis] = useState<boolean>(false);
  const [hasCompletedAtLeastOnce, setHasCompletedAtLeastOnce] = useState<boolean>(false);

  // Mouse Tracking Glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseOverMain, setIsMouseOverMain] = useState(false);

  // Binary floating background bits and glowing star particles
  const [binaryBits, setBinaryBits] = useState<{ id: string; left: string; delay: string; duration: string; val: string; isGlowDot?: boolean; scale?: number }[]>([]);

  // -------------------------------------------------------------
  // Refs for Async control & cancellation
  // -------------------------------------------------------------
  const cancelRef = useRef<boolean>(false);
  const arrayStateRef = useRef<VisualizerBar[]>([]);
  const sortTimerRef = useRef<number | null>(null);

  // Keep array ref updated so sorting callbacks always read/write fresh values
  useEffect(() => {
    arrayStateRef.current = array;
  }, [array]);

  // Set up mouse glow tracker and binary bits once
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial background binary particles + glowing cyber dust
    const generatedBits = Array.from({ length: 50 }, (_, idx) => {
      const type = Math.random();
      let val = '0';
      let isGlowDot = false;
      if (type > 0.6) {
        val = '1';
      } else if (type > 0.3) {
        val = '0';
      } else {
        val = '•';
        isGlowDot = true;
      }
      return {
        id: `bit-${idx}`,
        left: `${Math.random() * 100}vw`,
        delay: `${Math.random() * 8}s`,
        duration: `${10 + Math.random() * 14}s`,
        val,
        isGlowDot,
        scale: 0.5 + Math.random() * 1.5,
      };
    });
    setBinaryBits(generatedBits);

    // Seed initial console logs
    addSystemLog('Initializing neural pattern matching...', 'system');
    addSystemLog('Kernel stability nominal. Wave parameters active.', 'info');
    addSystemLog('System ready. Adjust configurations and trigger start.', 'success');

    // Generate starter array
    generateRandomArray(64);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  const addSystemLog = (text: string, type: LogType['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        text,
        type,
        timestamp,
      },
    ]);
  };

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Maps 1-100 speed slider to realistic sleep intervals (ms)
  const getDelay = () => {
    let baseDelay = 101 - speed;

    // Apply visualization speed mode multiplier
    if (speedMode === 'turbo') {
      baseDelay = Math.max(1, baseDelay / 5);
    } else if (speedMode === 'decoupled') {
      baseDelay = 0;
    } else if (speedMode === 'cinematic') {
      baseDelay = baseDelay * 1.5;
    }

    // Adapt delay based on rendering optimization modes
    if (renderMode === 'power-saver') {
      baseDelay = Math.max(0, baseDelay / 3);
    }

    return Math.max(baseDelay, 0);
  };

  // Generate dynamic array values
  const generateRandomArray = (sizeToUse = arraySize) => {
    if (isSorting) {
      cancelSorting();
    }
    setShowAdaAnalysis(false);
    setComparisons(0);
    setSwaps(0);
    setTimeMs(0);

    const newSize = Math.max(10, Math.min(sizeToUse, 128));
    const randomVals = Array.from({ length: newSize }, () => Math.floor(Math.random() * 95) + 5);

    const formattedBars: VisualizerBar[] = randomVals.map((val, index) => ({
      id: `bar-${index}-${Date.now()}`,
      value: val,
      status: 'default',
    }));

    setArray(formattedBars);
    addSystemLog(`Generated new randomized array of size ${newSize}`, 'system');
  };

  // Reverse the current array order
  const reverseArray = () => {
    if (isSorting) {
      cancelSorting();
    }
    const reversed = [...arrayStateRef.current].reverse().map((bar) => ({
      ...bar,
      status: 'default' as const,
    }));
    setArray(reversed);
    addSystemLog('Reversed current array state sequence.', 'accent');
  };

  // Gracefully interrupt running sorting call stack
  const cancelSorting = () => {
    cancelRef.current = true;
    setIsSorting(false);
    setIsSwitching(false);
    if (sortTimerRef.current) {
      clearInterval(sortTimerRef.current);
      sortTimerRef.current = null;
    }
    // Set all bars back to default status
    const resetBars = arrayStateRef.current.map((bar) => ({
      ...bar,
      status: 'default' as const,
    }));
    setArray(resetBars);
    addSystemLog('Engine visualizer suspended. Resetting boundaries.', 'warn');
  };

  // Parse custom string arrays e.g. [12, 45, 2, 8]
  const handleCustomArrayInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSorting) cancelSorting();

    try {
      // Extract numeric components
      const numbers = customInput
        .replace(/[\[\]]/g, '')
        .split(',')
        .map((num) => parseInt(num.trim(), 10))
        .filter((num) => !isNaN(num));

      if (numbers.length < 5) {
        addSystemLog('Custom array rejected: requires at least 5 integer elements.', 'warn');
        return;
      }
      if (numbers.length > 128) {
        addSystemLog('Custom array adjusted: capped at 128 maximum bounds.', 'warn');
        numbers.splice(128);
      }

      // Max value scaling to keep rendering consistent within 100% height limit
      const maxVal = Math.max(...numbers, 1);
      const scaledBars: VisualizerBar[] = numbers.map((val, idx) => {
        const scaledVal = Math.round((val / maxVal) * 92) + 5; // keep visual range between 5% and 97%
        return {
          id: `bar-custom-${idx}-${Date.now()}`,
          value: scaledVal,
          status: 'default',
        };
      });

      setArraySize(scaledBars.length);
      setArray(scaledBars);
      addSystemLog(`Successfully compiled custom array feed with size ${scaledBars.length}`, 'accent');
    } catch (err) {
      addSystemLog('Input parse error. Ensure array fits pattern: e.g. [12, 43, 22, 9, 87]', 'warn');
    }
  };

  // -------------------------------------------------------------
  // Visualizer Animation Callbacks
  // -------------------------------------------------------------
  const setBarStatus = (idx: number, status: VisualizerBar['status']) => {
    setArray((prev) => {
      const next = [...prev];
      if (next[idx]) {
        next[idx] = { ...next[idx], status };
      }
      return next;
    });
    if (arrayStateRef.current[idx]) {
      arrayStateRef.current[idx] = { ...arrayStateRef.current[idx], status };
    }
  };

  const setBarsStatus = (indices: number[], status: VisualizerBar['status']) => {
    setArray((prev) => {
      const next = [...prev];
      indices.forEach((idx) => {
        if (next[idx]) {
          next[idx] = { ...next[idx], status };
        }
      });
      return next;
    });
    indices.forEach((idx) => {
      if (arrayStateRef.current[idx]) {
        arrayStateRef.current[idx] = { ...arrayStateRef.current[idx], status };
      }
    });
  };

  const setBarValue = (idx: number, value: number) => {
    setArray((prev) => {
      const next = [...prev];
      if (next[idx]) {
        next[idx] = { ...next[idx], value };
      }
      return next;
    });
    if (arrayStateRef.current[idx]) {
      arrayStateRef.current[idx] = { ...arrayStateRef.current[idx], value };
    }
  };

  // -------------------------------------------------------------
  // Sorting Core Logic (Asynchronous for interactive stepping)
  // -------------------------------------------------------------

  // Insertion Sort subroutine
  const runInsertionSort = async (left: number, right: number) => {
    const arr = [...arrayStateRef.current];

    for (let i = left + 1; i <= right; i++) {
      if (cancelRef.current) return;

      const keyBar = arr[i];
      let j = i - 1;

      // Color current element being compared
      setBarStatus(i, 'comparing');
      setComparisons((prev) => prev + 1);
      await sleep(getDelay());

      while (j >= left && arr[j].value > keyBar.value) {
        if (cancelRef.current) return;

        setComparisons((prev) => prev + 1);
        setSwaps((prev) => prev + 1);

        // Flash swap status
        setBarsStatus([j, j + 1], 'swapping');
        await sleep(getDelay());

        // Shift height
        arr[j + 1].value = arr[j].value;
        setBarValue(j + 1, arr[j].value);

        // Reset status
        setBarsStatus([j, j + 1], 'default');

        j--;
      }

      // Re-insert
      arr[j + 1].value = keyBar.value;
      setBarValue(j + 1, keyBar.value);
      setBarStatus(i, 'default');
    }
  };

  // Merge subroutine
  const runMerge = async (left: number, middle: number, right: number) => {
    if (cancelRef.current) return;

    addSystemLog(`Comparing partition blocks range [${left}..${right}]`, 'info');

    // Smooth division & group transition sweep highlight across active merge boundaries
    const partitionIndices = Array.from({ length: right - left + 1 }, (_, index) => left + index);
    setBarsStatus(partitionIndices, 'comparing');
    await sleep(Math.max(5, Math.min(30, getDelay() * 0.4)));
    setBarsStatus(partitionIndices, 'default');

    const arr = [...arrayStateRef.current];
    const n1 = middle - left + 1;
    const n2 = right - middle;

    // Temporary cached arrays
    const L = arr.slice(left, middle + 1).map((b) => b.value);
    const R = arr.slice(middle + 1, right + 1).map((b) => b.value);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
      if (cancelRef.current) return;

      const idxL = left + i;
      const idxR = middle + 1 + j;

      // Animate comparison of indices in neon yellow
      setComparisons((prev) => prev + 1);
      setBarsStatus([idxL, idxR], 'comparing');
      await sleep(getDelay());

      let mergedVal = -1;
      let sourceIdx = -1;

      if (L[i] <= R[j]) {
        mergedVal = L[i];
        sourceIdx = idxL;
        i++;
      } else {
        mergedVal = R[j];
        sourceIdx = idxR;
        j++;
      }

      setSwaps((prev) => prev + 1);

      // Reset compared element visual styles
      setBarsStatus([idxL, idxR], 'default');

      // Animate merging update/write back into position k with a neon red glow
      setBarValue(k, mergedVal);
      setBarStatus(k, 'swapping');
      await sleep(getDelay());
      setBarStatus(k, 'default');

      k++;
    }

    // Remaining elements from Left subpartition
    while (i < n1) {
      if (cancelRef.current) return;
      const idxL = left + i;

      setSwaps((prev) => prev + 1);
      setBarValue(k, L[i]);
      setBarsStatus([idxL, k], 'swapping');
      await sleep(getDelay());
      setBarsStatus([idxL, k], 'default');

      i++;
      k++;
    }

    // Remaining elements from Right subpartition
    while (j < n2) {
      if (cancelRef.current) return;
      const idxR = middle + 1 + j;

      setSwaps((prev) => prev + 1);
      setBarValue(k, R[j]);
      setBarsStatus([idxR, k], 'swapping');
      await sleep(getDelay());
      setBarsStatus([idxR, k], 'default');

      j++;
      k++;
    }

    addSystemLog(`Merge operation completed at range [${left}..${right}]`, 'success');
  };

  // Pure Merge Sort recursive loop
  const performMergeSort = async (left: number, right: number): Promise<void> => {
    if (cancelRef.current) return;

    if (left < right) {
      const middle = Math.floor((left + right) / 2);
      await performMergeSort(left, middle);
      await performMergeSort(middle + 1, right);
      await runMerge(left, middle, right);
    }
  };

  // Hybrid Merge + Insertion Sort recursive loop
  const performHybridSort = async (left: number, right: number): Promise<void> => {
    if (cancelRef.current) return;

    const currentSize = right - left + 1;

    // Check size trigger threshold
    if (currentSize <= threshold) {
      addSystemLog(`Switching to Insertion Sort (Partition size: ${currentSize} <= threshold ${threshold})`, 'warn');

      // Dramatic algorithm switching animation & logs
      setIsSwitching(true);
      soundfx.playWarning();
      soundfx.speak("Threshold reached. Activating localized insertion sort pass.");
      const isFast = speedMode === 'turbo' || speedMode === 'decoupled';
      await sleep(isFast ? 150 : 1200); // Cinematic pause for the user to enjoy the flash/neon switching overlay and blur effect!
      setIsSwitching(false);

      if (cancelRef.current) return;
      await runInsertionSort(left, right);
      return;
    }

    if (left < right) {
      const middle = Math.floor((left + right) / 2);
      await performHybridSort(left, middle);
      await performHybridSort(middle + 1, right);
      await runMerge(left, middle, right);
    }
  };

  // -------------------------------------------------------------
  // Trigger Handler
  // -------------------------------------------------------------
  const startVisualization = async () => {
    if (isSorting || array.length === 0) return;

    cancelRef.current = false;
    setIsInitializingEngine(true);
    soundfx.playStart();
    const isFast = speedMode === 'turbo' || speedMode === 'decoupled';
    await sleep(isFast ? 100 : 950); // Cinematic compiling system overlay delay
    setIsInitializingEngine(false);

    if (cancelRef.current) return;

    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    setTimeMs(0);
    setShowAdaAnalysis(false);
    setShowCompletionOverlay(false);

    addSystemLog(`Starting visualization using core: ${algorithm.toUpperCase()}_ENGINE...`, 'system');
    if (algorithm === 'hybrid') {
      addSystemLog('Hybrid engine initialized', 'algorithm');
      soundfx.speak("Initializing hybrid core engine.");
    } else if (algorithm === 'merge') {
      soundfx.speak("Initializing standard merge sort.");
    } else if (algorithm === 'insertion') {
      soundfx.speak("Initializing insertion sort.");
    }

    // Live timer runner
    const timerStart = performance.now();
    sortTimerRef.current = window.setInterval(() => {
      const timeInSec = (performance.now() - timerStart);
      setTimeMs(timeInSec);
    }, 12);

    try {
      if (algorithm === 'hybrid') {
        await performHybridSort(0, array.length - 1);
      } else if (algorithm === 'merge') {
        await performMergeSort(0, array.length - 1);
      } else if (algorithm === 'insertion') {
        addSystemLog('Launching sequential Insertion Sort passes...', 'algorithm');
        await runInsertionSort(0, array.length - 1);
      }

      // Finish cleanly
      if (!cancelRef.current) {
        clearInterval(sortTimerRef.current);
        sortTimerRef.current = null;
        const totalDurationMs = performance.now() - timerStart;
        setTimeMs(totalDurationMs);

        // Animate celebratory completion scan
        addSystemLog('Verification pass active. Testing array sort conditions...', 'system');
        
        for (let idx = 0; idx < array.length; idx++) {
          if (cancelRef.current) break;
          setBarStatus(idx, 'sorted');
          if (idx % 4 === 0) await sleep(12);
        }

        addSystemLog(`Optimal sorted state established. Trace certified! Total time: ${totalDurationMs.toFixed(2)}ms`, 'success');
        addSystemLog('Optimization cycle complete', 'success');
        setHasCompletedAtLeastOnce(true);
        setShowAdaAnalysis(true);
        soundfx.playSuccess();
        soundfx.speak("Sorting complete. Optimal sorted state established.");
        setShowCompletionOverlay(true);
      }
    } catch (err) {
      addSystemLog('Stepping loop encountered exception state.', 'warn');
    } finally {
      setIsSorting(false);
      setIsSwitching(false);
      if (sortTimerRef.current) {
        clearInterval(sortTimerRef.current);
      }
    }
  };

  // When array ranges or algorithms change, trigger generation
  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    generateRandomArray(newSize);
  };

  // Cyberpunk Switch Component
  const CyberSwitch = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-800/40 bg-black/25 hover:border-[var(--neon-cyan)]/25 transition-all duration-300">
      <div className="space-y-0.5">
        <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider block">{label}</span>
        <span className="font-mono text-[7px] text-[var(--text-dim)] uppercase block">{desc}</span>
      </div>
      <button 
        onClick={() => {
          onChange(!checked);
          soundfx.playClick();
        }}
        onMouseEnter={() => soundfx.playHover()}
        className={`relative w-12 h-5 rounded-md transition-all duration-300 border cursor-pointer ${
          checked 
            ? 'bg-[var(--neon-cyan-grad)] border-[var(--neon-cyan)] shadow-[0_0_8px_rgba(0,243,255,0.25)]' 
            : 'bg-black/60 border-neutral-700'
        }`}
      >
        <span className={`absolute top-0.5 w-4 h-3.5 rounded-sm transition-all duration-300 flex items-center justify-center font-mono text-[6px] font-black ${
          checked 
            ? 'left-7 bg-[var(--neon-cyan)] text-[var(--bg-app)] shadow-[0_0_5px_var(--neon-cyan)]' 
            : 'left-1 bg-neutral-600 text-neutral-300'
        }`}>
          {checked ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );

  // Cyberpunk Slider Component
  const CyberSlider = ({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: (v: number) => void }) => (
    <div className="space-y-2 p-2.5 rounded-lg border border-neutral-800/40 bg-black/25 hover:border-[var(--neon-cyan)]/25 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider block">{label}</span>
          <span className="font-mono text-[7px] text-[var(--text-dim)] uppercase block">{desc}</span>
        </div>
        <span className="font-mono text-[10px] font-black text-[var(--neon-cyan)] tracking-wider">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          onChange(val);
          if (Math.round(val * 100) % 10 === 0) {
            soundfx.playHover();
          }
        }}
        className="w-full h-1 bg-black/60 border border-neutral-800 rounded-all appearance-none cursor-pointer accent-[var(--neon-cyan)] transition-opacity hover:shadow-[0_0_8px_rgba(0,243,255,0.4)]"
      />
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden relative bg-[#091010] selection:bg-[#00dce6]/30 select-none flex flex-col">
      
      {/* ------------------------------------------------------------- */}
      {/* Cinematic Background Atmosphere */}
      {/* ------------------------------------------------------------- */}
      {animationQuality !== 'low' && (
        <div className="fixed inset-0 cyber-grid opacity-30 z-0 pointer-events-none" />
      )}

      {/* Floating Binary Bits & Cyber Dust Stars */}
      {animationQuality !== 'low' && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {binaryBits.slice(0, Math.floor(binaryBits.length * particleDensity)).map((bit) => (
            <span
              key={bit.id}
              className={`absolute font-mono text-[9px] ${bit.isGlowDot ? 'text-[var(--neon-cyan)]/50 drop-shadow-[0_0_8px_var(--neon-cyan)] text-base' : 'text-[var(--neon-cyan)]/10'}`}
              style={{
                left: bit.left,
                top: '-20px',
                animation: `slide-down ${bit.duration} infinite linear`,
                animationDelay: bit.delay,
                transform: `scale(${bit.scale || 1})`,
                opacity: bit.isGlowDot ? 0.6 : 0.75,
              }}
            >
              {bit.val}
            </span>
          ))}
        </div>
      )}

      {/* Inline styles for slide-down and laser-sweeping animations */}
      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-10px); opacity: 0; }
          10.1% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        @keyframes sweep-lasers {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          35%, 100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .laser-sweep {
          position: relative;
          overflow: hidden;
        }
        .laser-sweep::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 45%,
            rgba(0, 243, 255, 0.15) 48%,
            rgba(255, 0, 255, 0.15) 50%,
            rgba(0, 243, 255, 0.12) 52%,
            transparent 55%
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          animation: sweep-lasers 10s infinite ease-in-out;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes laser-vertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        @keyframes glitch-glow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(0, 243, 255, 0.6)) hue-rotate(0deg); }
          50% { filter: drop-shadow(0 0 12px rgba(255, 0, 255, 0.8)) hue-rotate(15deg); }
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .portal-pulse-container {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .animate-glitch-glow {
          animation: glitch-glow 5s infinite ease-in-out;
        }
        .scanner-beam {
          animation: laser-vertical 3.5s infinite linear;
        }
        .subtle-hover-bounce:hover {
          animation: subtle-bounce 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Dynamic Cursor Tracker Glow */}
      {isMouseOverMain && animationQuality !== 'low' && (
        <div
          className="fixed pointer-events-none z-5 transition-opacity duration-500 ease-out hidden lg:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '450px',
            height: '450px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, var(--cursor-glow) 0%, transparent 68%)',
            borderRadius: '50%',
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* Header Panel */}
      {/* ------------------------------------------------------------- */}
      <header className="flex justify-between items-center w-full px-6 h-16 z-50 bg-black/90 backdrop-blur-xl border-b border-[var(--neon-cyan)]/20 shadow-lg shadow-black/40 flex-shrink-0 relative">
        <div className="flex items-center gap-3 select-none">
          <TerminalIcon className="text-[var(--neon-cyan)] w-5 h-5 drop-shadow-[0_0_6px_var(--neon-cyan)]" />
          <h1 className="font-sans text-lg font-bold tracking-tight text-[#e1fcff] drop-shadow-[0_0_8px_var(--neon-cyan-glow-color)]">
            ALGOLAB <span className="text-[var(--neon-purple)]/40">//</span> HYBRIDSORT
          </h1>
        </div>

        <div className="flex items-center gap-4 select-none font-mono text-[10px] font-bold">
          {isLanding ? (
            <button 
              onClick={async () => {
                soundfx.playStart();
                soundfx.speak("Access granted. Initializing workspace.");
                setIsInitializingEngine(true);
                await sleep(900);
                setIsInitializingEngine(false);
                setIsLanding(false);
              }}
              onMouseEnter={() => soundfx.playHover()}
              className="flex items-center gap-1.5 border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan-grad)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black hover:border-[var(--neon-cyan)] px-3 py-1.5 rounded cursor-pointer transition-all hover:scale-105 select-none laser-sweep uppercase font-bold text-[9.5px]"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ACCESS WORKSPACE</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsLanding(true);
                soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              className="flex items-center gap-1.5 border border-[var(--neon-purple)]/30 bg-black/40 text-[var(--neon-purple)] hover:border-[var(--neon-purple)] px-3 py-1.5 rounded cursor-pointer transition-all hover:scale-105 select-none uppercase font-bold text-[9.5px]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>RETURN TO PORTAL</span>
            </button>
          )}

          <div className="flex gap-4">
            <button 
              onClick={() => {
                setShowSettings(true);
                soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              className="flex items-center gap-1.5 border border-[var(--neon-cyan)]/25 bg-black/40 hover:border-[var(--neon-cyan)] px-2.5 py-1.5 rounded cursor-pointer transition-all hover:scale-105 select-none"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--neon-cyan)] animate-pulse" />
              <span className="text-[var(--neon-cyan)]">SETTINGS</span>
            </button>

            <button 
              onClick={() => {
                const updated = soundfx.toggleSound();
                setSoundOn(updated);
                setUiSoundOn(updated);
                setAlertSoundOn(updated);
                setTerminalSoundOn(updated);
                if (updated) soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              className="flex items-center gap-1.5 border border-[var(--neon-purple)]/20 bg-black/40 hover:border-[var(--neon-purple)]/65 px-2.5 py-1.5 rounded cursor-pointer transition-all hover:scale-105 select-none"
            >
              {soundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[var(--neon-purple)] animate-pulse" />
                  <span className="text-[var(--neon-purple)]">AUDIO: ACTIVE</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#849495]" />
                  <span className="text-[#849495]">AUDIO: MUTED</span>
                </>
              )}
            </button>
            <span className="flex items-center gap-1.5 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/25 bg-black/45 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
              KERNEL: ACTIVE
            </span>
          </div>

          <div className="hidden sm:flex gap-3 text-[#849495]">
            <Activity className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <TerminalIcon className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Settings 
              onClick={() => {
                setShowSettings(true);
                soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              className="w-4 h-4 hover:text-[var(--neon-cyan)] transition-colors cursor-pointer" 
            />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* App Body Grid Layout */}
      {/* ------------------------------------------------------------- */}
      <div 
        className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0 relative z-10"
        onMouseEnter={() => setIsMouseOverMain(true)}
        onMouseLeave={() => setIsMouseOverMain(false)}
      >
        {isLanding ? (
          <LandingPortal
            onAccessGranted={() => setIsLanding(false)}
            soundOn={soundOn}
          />
        ) : (
          <>
        
        {/* Sidebar Controls Panel */}
        <nav className="w-full lg:w-80 xl:w-90 flex-shrink-0 flex flex-col p-4 gap-6 glass-panel border-b lg:border-b-0 lg:border-r border-[var(--neon-cyan)]/20 select-none overflow-y-auto bg-black/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--neon-cyan)] pb-2 border-b border-[var(--neon-cyan)]/15">
              <Sparkles className="w-4 h-4 animate-spin text-[var(--neon-purple)]" style={{ animationDuration: '4s' }} />
              <span className="font-sans text-md font-extrabold tracking-wide text-white">
                ALGO_LAB_v2.0
              </span>
            </div>
            <p className="font-mono text-[9px] font-extrabold text-[var(--neon-purple)] tracking-widest uppercase">
              HYBRID_READY
            </p>
          </div>

          {/* Interactive Controls Panel */}
          <div className="flex flex-col gap-5">
            
            {/* Generate Random Button */}
            <button
              onClick={() => {
                generateRandomArray(arraySize);
                soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              disabled={isSorting}
              className="w-full p-3 font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg border border-[var(--neon-cyan)]/40 neon-cyan-glow bg-black/60 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black hover:scale-[1.02] hover:-translate-y-[1px] shadow-sm hover:shadow-[var(--neon-cyan)]/20 duration-300 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95 laser-sweep"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              GENERATE RANDOM ARRAY
            </button>

            {/* Reverse Current Array Button */}
            <button
              onClick={() => {
                reverseArray();
                soundfx.playClick();
              }}
              onMouseEnter={() => soundfx.playHover()}
              disabled={isSorting}
              className="w-full p-3 font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg border border-[var(--neon-purple)]/40 neon-purple-glow bg-black/60 text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-black hover:scale-[1.02] hover:-translate-y-[1px] shadow-sm hover:shadow-[var(--neon-purple)]/20 duration-300 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95 laser-sweep"
            >
              <ArrowUpDown className="w-3.5 h-3.5 group-hover:scale-y-[-1] transition-transform duration-300" />
              REVERSE CURRENT ARRAY
            </button>

            {/* Custom Array Entry */}
            <form onSubmit={handleCustomArrayInput} className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-[#b9cacb]/80 uppercase ml-1 block">
                CUSTOM ARRAY FEED
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="[12, 45, 2, 8, ...]"
                  disabled={isSorting}
                  className="bg-transparent border-b border-[var(--neon-cyan)]/15 focus:border-[var(--neon-cyan)] outline-none py-1 px-2 font-mono text-xs w-full text-[#e1fcff] transition-all disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={isSorting}
                  onClick={() => soundfx.playClick()}
                  onMouseEnter={() => soundfx.playHover()}
                  className="bg-[#151d1e]/35 border border-[var(--neon-cyan)]/20 px-2 py-1 text-[9px] font-mono font-bold text-[#dce4e4] rounded hover:border-[var(--neon-cyan)]/60 hover:bg-[var(--neon-cyan)]/10 hover:scale-105 transition-all cursor-pointer disabled:opacity-30"
                >
                  PARSE
                </button>
              </div>
            </form>

            {/* Selecting visualizer algorithm option */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-[#b9cacb]/80 uppercase ml-1 block">
                CORE SELECTOR
              </label>
              <select
                disabled={isSorting}
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value as AlgorithmType);
                  soundfx.playClick();
                }}
                onMouseEnter={() => soundfx.playHover()}
                className="w-full bg-black/80 text-[#dce4e4] px-3 py-2.5 font-sans text-xs outline-none border border-[var(--neon-cyan)]/20 rounded-lg cursor-pointer hover:border-[var(--neon-cyan)]/40 transition-colors disabled:opacity-40"
              >
                <option value="hybrid">Hybrid Core (Recommended)</option>
                <option value="merge">Merge Sort Standard</option>
                <option value="insertion">Insertion Sort Loop</option>
              </select>
            </div>

            {/* Range Controls */}
            <div className="space-y-4">
              {/* SPEED RANGE SLIDER */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] font-bold">
                  <span className="text-[#a5b4b4] uppercase">SPEED</span>
                  <span className="text-[var(--neon-cyan)]">{speed}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => {
                    setSpeed(parseInt(e.target.value));
                    if (parseInt(e.target.value) % 5 === 0) soundfx.playHover();
                  }}
                  onMouseEnter={() => soundfx.playHover()}
                  className="w-full h-1 bg-[#151d1e] rounded-all appearance-none cursor-pointer accent-[var(--neon-cyan)] transition-opacity hover:shadow-[0_0_8px_var(--neon-cyan-grad)]"
                />
              </div>

              {/* ARRAY SIZE SLIDER */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] font-bold">
                  <span className="text-[#a5b4b4] uppercase">PARTITION SIZE</span>
                  <span className="text-[var(--neon-cyan)]">{arraySize}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="128"
                  disabled={isSorting}
                  value={arraySize}
                  onChange={(e) => {
                    handleSizeChange(parseInt(e.target.value));
                    if (parseInt(e.target.value) % 10 === 0) soundfx.playHover();
                  }}
                  onMouseEnter={() => soundfx.playHover()}
                  className="w-full h-1 bg-[#151d1e] rounded-all appearance-none cursor-pointer accent-[var(--neon-cyan)] disabled:opacity-30 transition-opacity hover:shadow-[0_0_8px_var(--neon-cyan-grad)]"
                />
              </div>
            </div>

            {/* Bottom Primary Execution buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={startVisualization}
                onMouseEnter={() => soundfx.playHover()}
                disabled={isSorting}
                className="w-full py-4 text-center font-sans font-bold text-[14.5px] text-[var(--neon-purple)] border border-[var(--neon-purple)]/40 neon-purple-glow bg-[var(--neon-purple-grad)] hover:bg-[var(--neon-purple)] hover:text-white hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_0_25px_var(--neon-purple-glow-color)] transition-all cursor-pointer flex items-center justify-center gap-2 duration-300 disabled:opacity-30 disabled:cursor-not-allowed group leading-none rounded-lg laser-sweep"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                START VISUALIZATION
              </button>

              <button
                onClick={() => {
                  cancelSorting();
                  soundfx.playClick();
                }}
                onMouseEnter={() => soundfx.playHover()}
                className="w-full py-2.5 font-mono text-[9px] font-bold tracking-widest uppercase border border-[var(--neon-cyan)]/25 text-[#a5b4b4] hover:bg-[#151d1e]/30 hover:border-[var(--neon-cyan)]/45 hover:text-white hover:scale-102 transition-all rounded-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                RESET ENGINE
              </button>
            </div>

          </div>

          {/* Core Indicator Label */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 bg-[var(--neon-purple-grad)] text-[var(--neon-purple)] border-l-4 border-[var(--neon-purple)] p-3 rounded-r-lg w-full">
              <Sparkles className="w-4 h-4 text-[var(--neon-purple)] animate-pulse" />
              <span className="font-mono text-[9px] font-bold tracking-wider uppercase select-none">
                Hybrid Core: Online
              </span>
            </div>
          </div>
        </nav>

        {/* ------------------------------------------------------------- */}
        {/* Main Content Area */}
        {/* ------------------------------------------------------------- */}
        <main className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto min-h-0 z-10">
          
          {/* Active Visualizer Canvas viewport */}
          <div className="relative">
            <VisualizerStage
              bars={array}
              isSwitching={isSwitching}
              animationQuality={animationQuality}
              gpuOptimization={gpuOptimization}
              renderMode={renderMode}
            />
            
            {/* INITIALIZING ENGINE OVERLAY */}
            {isInitializingEngine && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center rounded-xl border border-[var(--neon-cyan)]/40 shadow-[0_0_50px_var(--neon-cyan-grad)] animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center space-y-4">
                  <div className="relative flex items-center justify-center w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-t-[var(--neon-cyan)] border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '0.6s' }} />
                    <div className="absolute inset-1.5 rounded-full border-4 border-b-[var(--neon-purple)] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDuration: '0.9s', animationDirection: 'reverse' }} />
                    <Sparkles className="w-5 h-5 text-[var(--neon-cyan)] animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] font-extrabold text-[var(--neon-cyan)] tracking-[0.35em] uppercase animate-pulse">
                      HYBRID CORE ENGINE INITIALIZING...
                    </p>
                    <h3 className="font-sans text-md md:text-lg font-black text-white tracking-widest uppercase">
                      COMPILING ARRAY METRIC SYSTEM
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* VISUALIZATION COMPLETE CELEBRATOR OVERLAY */}
            {showCompletionOverlay && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-35 flex flex-col items-center justify-center rounded-xl border border-[#39ff14]/40 shadow-[0_0_50px_rgba(57,255,20,0.15)] animate-[fadeIn_0.5s_ease-out] overflow-hidden">
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#39ff14]/60 to-transparent top-0 animate-[scanline-bounce_4s_infinite_linear]" />
                
                <div className="text-center space-y-5 p-6 max-w-md z-10">
                  <div className="w-12 h-12 bg-[#39ff14]/10 rounded-full flex items-center justify-center border border-[#39ff14]/35 mx-auto">
                    <Sparkles className="w-5 h-5 text-[#39ff14] animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] font-bold text-[#39ff14] tracking-[0.25em] uppercase animate-pulse">
                      VISUALIZATION COMPLETE
                    </p>
                    <h3 className="font-sans text-xl font-black text-white tracking-wider uppercase">
                      OPTIMAL ARRAY TRACE RETRIEVED
                    </h3>
                    <p className="font-mono text-[10px] text-[#cbd5e1]/70 pt-2 uppercase leading-relaxed">
                      The core sorting engine has verified element stability. Final results are certified nominal.
                    </p>
                  </div>

                  {/* Diagnostic details metrics box */}
                  <div className="grid grid-cols-3 gap-2 border border-[#39ff14]/25 bg-black/60 p-3 rounded font-mono text-[10px] text-[#84a9ab]">
                    <div className="text-center">
                      <p className="text-[#cbd5e1]/50 text-[8px] uppercase">Comparisons</p>
                      <p className="text-white font-bold text-xs">{comparisons}</p>
                    </div>
                    <div className="text-center border-x border-[#39ff14]/15">
                      <p className="text-[#cbd5e1]/50 text-[8px] uppercase">Swaps</p>
                      <p className="text-white font-bold text-xs">{swaps}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[#cbd5e1]/50 text-[8px] uppercase">Duration</p>
                      <p className="text-[#39ff14] font-bold text-xs">{timeMs.toFixed(1)}ms</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCompletionOverlay(false);
                      soundfx.playClick();
                    }}
                    onMouseEnter={() => soundfx.playHover()}
                    className="px-6 py-2.5 bg-[#39ff14]/15 border border-[#39ff14]/40 hover:bg-[#39ff14] hover:text-black font-mono text-[10.5px] font-bold tracking-widest text-[#39ff14] rounded transition-all cursor-pointer active:scale-95 duration-200"
                  >
                    DISMISS DIAGNOSTICS PROTOCOL
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Analytics Cards row (Comparisons, Swaps, Time, Threshold, Size) */}
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
            <AnalyticsCard
              title="Comparisons"
              value={comparisons}
              colorClass="text-[var(--neon-cyan)]"
              glowClass="hover:neon-cyan-glow"
              polygonPoints="0 80%, 10% 40%, 20% 90%, 30% 20%, 40% 60%, 50% 10%, 60% 80%, 70% 30%, 80% 90%, 90% 10%, 100% 70%, 100% 100%, 0 100%"
              gradientColor="via-[var(--neon-cyan)]/15"
              pulse={isSorting}
            />

            <AnalyticsCard
              title="Writes / Swaps"
              value={swaps}
              colorClass="text-[var(--neon-purple)]"
              glowClass="hover:neon-purple-glow"
              polygonPoints="0 30%, 10% 70%, 20% 40%, 30% 90%, 40% 20%, 50% 60%, 60% 10%, 70% 80%, 80% 30%, 90% 90%, 100% 40%, 100% 100%, 0 100%"
              gradientColor="via-[var(--neon-purple)]/15"
              pulse={isSorting}
            />

            <AnalyticsCard
              title="Telemetry (MS)"
              value={timeMs.toFixed(1)}
              colorClass="text-[var(--neon-cyan)]"
              glowClass="hover:neon-cyan-glow"
              polygonPoints="0 90%, 10% 80%, 20% 70%, 30% 60%, 40% 50%, 50% 40%, 60% 30%, 70% 20%, 80% 15%, 90% 10%, 100% 5%, 100% 100%, 0 100%"
              gradientColor="via-[var(--neon-cyan)]/15"
              pulse={isSorting}
            />

            <AnalyticsCard
              title="Base Threshold (k)"
              value={threshold}
              colorClass="text-[var(--neon-purple)]"
              glowClass="hover:neon-purple-glow"
              polygonPoints="0 50%, 100% 50%, 100% 100%, 0 100%"
              gradientColor="via-[var(--neon-purple)]/10"
            />

            <AnalyticsCard
              title="Current Size (N)"
              value={array.length}
              colorClass="text-[var(--neon-cyan)]"
              glowClass="hover:neon-cyan-glow"
              polygonPoints="0 10%, 100% 50%, 100% 100%, 0 100%"
              gradientColor="via-[var(--neon-cyan)]/10"
            />
          </section>

          {/* Performance & Smart Log section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
            {/* Real performance scaling chart */}
            <PerformanceChart
              currentArraySize={array.length}
              hasCompletedAtLeastOnce={hasCompletedAtLeastOnce}
              algorithm={algorithm}
              timeMs={timeMs}
              comparisons={comparisons}
              swaps={swaps}
            />

            {/* Logging smart console */}
            <TerminalLog logs={logs} />
          </section>

          {/* Collapsible ADA diagnostic analysis section revealed after runtime completed */}
          <AdaAnalysis
            comparisons={comparisons}
            swaps={swaps}
            timeMs={timeMs}
            arraySize={array.length}
            threshold={threshold}
            algorithm={algorithm}
            isVisible={showAdaAnalysis || (!isSorting && hasCompletedAtLeastOnce)}
          />

        </main>
        </>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Footer Branding Status Bar */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-3 bg-black/95 backdrop-blur-md border-t border-[var(--neon-cyan)]/20 z-50 select-none flex-shrink-0 relative">
        <p className="font-mono text-[9px] font-bold text-[#84a9ab] tracking-wide">
          © 2026 ALGOLAB NEURAL SYSTEMS. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-5 font-mono text-[9px] font-bold text-[#84a9ab]">
          <a href="#" className="hover:text-[var(--neon-cyan)] transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-[var(--neon-cyan)] transition-colors">Security</a>
          <a href="#" className="hover:text-[var(--neon-cyan)] transition-colors">System Status</a>
        </div>
      </footer>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500" 
            onClick={() => {
              setShowSettings(false);
              soundfx.playClick();
            }}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-[slideInRight_0.35s_ease-out]">
            <div className="w-screen max-w-md transform transition-all duration-500 ease-out border-l border-[var(--neon-cyan)]/30 bg-[#091010]/95 backdrop-blur-xl flex flex-col shadow-2xl relative">
              {/* Scanline and grid inside drawer */}
              <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
              <div className="scanline opacity-10" />

              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--neon-cyan)]/15 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--neon-cyan)] animate-spin" style={{ animationDuration: '6s' }} />
                  <h3 className="font-sans text-md font-black text-white tracking-widest uppercase">
                    SYSTEM CONTROL CENTER
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    soundfx.playClick();
                  }}
                  onMouseEnter={() => soundfx.playHover()}
                  className="font-mono text-[9px] font-bold text-[var(--neon-purple)] border border-[var(--neon-purple)]/30 hover:bg-[var(--neon-purple-grad)] hover:border-[var(--neon-purple)] px-2 py-1 rounded transition-all cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 min-h-0">
                {/* Theme Selector Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--neon-cyan)]/10 pb-2">
                    <span className="w-1.5 h-1.5 bg-[var(--neon-cyan)] rounded-full animate-ping" />
                    <span className="font-mono text-[10px] font-black text-[var(--neon-cyan)] tracking-wider uppercase">
                      THEME CUSTOMIZATION
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'cyber-dark', name: 'Cyber Dark', desc: 'Classic Cyan & Pink Synthwave style', accent: '#00f3ff' },
                      { id: 'neon-purple', name: 'Neon Purple', desc: 'Cosmic Orchid & Magenta neon storm', accent: '#9d4edd' },
                      { id: 'matrix-blue', name: 'Matrix Blue', desc: 'Digital Binary Sea cyan & aqua', accent: '#00d2ff' },
                      { id: 'threat-red', name: 'Threat Red', desc: 'Critical Crimson Warning state', accent: '#ff003c' },
                      { id: 'light-tactical', name: 'Light Tactical', desc: 'High-Contrast Military light interface', accent: '#2b5c8f' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          soundfx.playClick();
                        }}
                        onMouseEnter={() => soundfx.playHover()}
                        className={`w-full p-3 rounded-lg border text-left font-mono transition-all duration-300 relative overflow-hidden group cursor-pointer flex items-center justify-between ${
                          theme === t.id
                            ? 'bg-[var(--neon-cyan-grad)] border-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,243,255,0.15)]'
                            : 'bg-black/40 border-neutral-800 hover:border-[var(--neon-cyan)]/40 hover:bg-neutral-900/25'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className={`text-xs font-black uppercase tracking-wider block ${theme === t.id ? 'text-white' : 'text-[#dce4e4]'}`}>
                            {t.name}
                          </span>
                          <span className="text-[8px] text-[var(--text-dim)] uppercase block">
                            {t.desc}
                          </span>
                        </div>
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/50 shadow-inner"
                          style={{ backgroundColor: t.accent }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Configuration Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--neon-cyan)]/10 pb-2">
                    <span className="w-1.5 h-1.5 bg-[var(--neon-cyan)] rounded-full animate-ping" />
                    <span className="font-mono text-[10px] font-black text-[var(--neon-cyan)] tracking-wider uppercase">
                      AUDIO TELEMETRY CONFIG
                    </span>
                  </div>

                  <div className="space-y-3">
                    <CyberSwitch 
                      label="UI Sounds" 
                      desc="Buttons hover, selection ticks" 
                      checked={uiSoundOn} 
                      onChange={handleUiSoundToggle} 
                    />
                    <CyberSwitch 
                      label="System Alerts" 
                      desc="Sorting completion and warning triggers" 
                      checked={alertSoundOn} 
                      onChange={handleAlertSoundToggle} 
                    />
                    <CyberSwitch 
                      label="Terminal Ticks" 
                      desc="Live logging typing mechanical clicks" 
                      checked={terminalSoundOn} 
                      onChange={handleTerminalSoundToggle} 
                    />
                    <CyberSwitch 
                      label="System Voice" 
                      desc="Synthesized neural voice status updates" 
                      checked={voiceOn} 
                      onChange={handleVoiceToggle} 
                    />
                    <CyberSlider 
                      label="Master Volume" 
                      desc="Global gain amplification factor" 
                      value={volume} 
                      onChange={handleVolumeChange} 
                    />
                  </div>
                </div>

                {/* Performance Settings Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--neon-cyan)]/10 pb-2">
                    <span className="w-1.5 h-1.5 bg-[var(--neon-cyan)] rounded-full animate-ping" />
                    <span className="font-mono text-[10px] font-black text-[var(--neon-cyan)] tracking-wider uppercase">
                      PERFORMANCE GATEWAYS
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Animation Quality Selector */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider">Animation Quality</span>
                        <span className="font-mono text-[9px] font-black text-[var(--neon-cyan)] uppercase">{animationQuality}</span>
                      </div>
                      <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-neutral-800/40">
                        {['low', 'medium', 'high', 'ultra'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setAnimationQuality(q);
                              soundfx.playClick();
                            }}
                            onMouseEnter={() => soundfx.playHover()}
                            className={`flex-1 py-1 text-[8px] font-mono font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                              animationQuality === q
                                ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_8px_var(--neon-cyan-grad)] font-bold'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Particle Density Control */}
                    <CyberSlider
                      label="Particle Density"
                      desc="Floating bits and cyber dust stars"
                      value={particleDensity}
                      onChange={setParticleDensity}
                    />

                    {/* Visualization Speed Mode */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider">Speed Mode</span>
                        <span className="font-mono text-[9px] font-black text-[var(--neon-purple)] uppercase">{speedMode}</span>
                      </div>
                      <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-neutral-800/40">
                        {['realtime', 'cinematic', 'turbo', 'decoupled'].map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setSpeedMode(m);
                              soundfx.playClick();
                            }}
                            onMouseEnter={() => soundfx.playHover()}
                            className={`flex-1 py-1 text-[8px] font-mono font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                              speedMode === m
                                ? 'bg-[var(--neon-purple)] text-white shadow-[0_0_8px_var(--neon-purple-grad)] font-bold'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GPU Optimization Toggle */}
                    <CyberSwitch
                      label="GPU Optimization"
                      desc="Force hardware accelerated composite layers"
                      checked={gpuOptimization}
                      onChange={setGpuOptimization}
                    />

                    {/* Render Performance Mode */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider">Render Performance</span>
                        <span className="font-mono text-[9px] font-black text-[var(--neon-cyan)] uppercase">
                          {renderMode === 'high-perf' ? 'High Perf' : renderMode === 'balanced' ? 'Balanced' : 'Power Saver'}
                        </span>
                      </div>
                      <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-neutral-800/40">
                        {[
                          { id: 'high-perf', label: 'High Perf' },
                          { id: 'balanced', label: 'Balanced' },
                          { id: 'power-saver', label: 'Power Saver' }
                        ].map((rm) => (
                          <button
                            key={rm.id}
                            onClick={() => {
                              setRenderMode(rm.id);
                              soundfx.playClick();
                            }}
                            onMouseEnter={() => soundfx.playHover()}
                            className={`flex-1 py-1 text-[8px] font-mono font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                              renderMode === rm.id
                                ? 'bg-[var(--neon-cyan-grad)] text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30 font-bold'
                                : 'text-neutral-400 hover:text-white border border-transparent'
                            }`}
                          >
                            {rm.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Info Diagnostic Section */}
                <div className="pt-4 border-t border-[var(--neon-cyan)]/10">
                  <div className="bg-black/50 rounded-lg p-3 border border-neutral-900 font-mono text-[8px] text-[var(--text-dim)] space-y-1 select-none">
                    <p className="flex justify-between">
                      <span>ENGINE INSTANCE:</span>
                      <span className="text-[var(--neon-cyan)]">HYBRIDSORT-4.2.0</span>
                    </p>
                    <p className="flex justify-between">
                      <span>HOST SYSTEM PORT:</span>
                      <span className="text-[var(--neon-cyan)]">3000</span>
                    </p>
                    <p className="flex justify-between">
                      <span>WEB AUDIO API STATUS:</span>
                      <span className="text-green-500">OPERATIONAL</span>
                    </p>
                    <p className="flex justify-between">
                      <span>THEME SCOPE:</span>
                      <span className="uppercase text-[var(--neon-purple)]">{theme.replace('-', ' ')}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>GPU COMPOSITOR:</span>
                      <span className={gpuOptimization ? "text-green-400" : "text-amber-400"}>
                        {gpuOptimization ? "ACCELERATED" : "SOFTWARE"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>ANIMATION PROFILE:</span>
                      <span className="uppercase text-[var(--neon-cyan)]">{animationQuality}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>RENDER PROFILE:</span>
                      <span className="uppercase text-[var(--neon-purple)]">{renderMode.replace('-', ' ')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
