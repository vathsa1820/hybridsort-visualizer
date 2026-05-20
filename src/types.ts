/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BarStatus = 'default' | 'comparing' | 'swapping' | 'sorted';

export interface VisualizerBar {
  id: string;
  value: number; // 1 to 100 percentage height
  status: BarStatus;
}

export type AlgorithmType = 'hybrid' | 'merge' | 'insertion';

export interface TerminalLog {
  id: string;
  text: string;
  type: 'system' | 'info' | 'warn' | 'success' | 'algorithm' | 'accent';
  timestamp?: string;
}

export interface MetricState {
  comparisons: number;
  swaps: number;
  timeElapsed: number; // in seconds
  arraySize: number;
  threshold: number;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  colorClass: string;
  glowClass: 'hover:neon-cyan-glow' | 'hover:neon-purple-glow';
  polygonPoints: string;
  gradientColor: string;
  pulse?: boolean;
}

