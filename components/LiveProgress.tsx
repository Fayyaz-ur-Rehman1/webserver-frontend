'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  Activity,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const LiveProgress: React.FC = () => {
  const { activeCampaign, pauseCampaign, resumeCampaign, cancelCampaign, retryFailedCampaign, logs } = useApp();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeCampaign]);

  if (!activeCampaign) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm text-center text-slate-400 space-y-2">
        <Activity className="w-10 h-10 mx-auto opacity-30 text-brand-500" />
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Active Campaign Running</h3>
        <p className="text-xs">
          Select contacts and compose a message to launch a bulk WhatsApp dispatch.
        </p>
      </div>
    );
  }

  const {
    id,
    name,
    status,
    totalContacts,
    sentCount,
    failedCount,
    pendingCount,
    durationSeconds,
    contactStatuses
  } = activeCampaign;

  const progressPercent = totalContacts > 0 ? Math.round(((sentCount + failedCount) / totalContacts) * 100) : 0;
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  // Current processing item
  const currentItem = contactStatuses.find((c) => c.status === 'pending');

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Campaign Top Bar & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {name}
            </h2>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isRunning
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse'
                  : isPaused
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : isCompleted
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            ID: {id} • Duration: {durationSeconds}s
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isRunning && (
            <button
              onClick={() => pauseCampaign(id)}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-4 h-4 fill-current" /> Pause
            </button>
          )}

          {isPaused && (
            <button
              onClick={() => resumeCampaign(id)}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" /> Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={() => cancelCampaign(id)}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" /> Cancel
            </button>
          )}

          {failedCount > 0 && !isRunning && (
            <button
              onClick={() => retryFailedCampaign(id)}
              className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retry Failed ({failedCount})
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Overall Progress</span>
          <span className="font-mono text-brand-500">{progressPercent}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-400 transition-all duration-500 shadow-glow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Recipients</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalContacts}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Delivered</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{sentCount}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-[11px] text-rose-500 font-semibold uppercase">Failed</span>
          <p className="text-xl font-bold text-rose-500 mt-0.5">{failedCount}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <span className="text-[11px] text-purple-500 font-semibold uppercase">Pending</span>
          <p className="text-xl font-bold text-purple-500 mt-0.5">{pendingCount}</p>
        </div>
      </div>

      {/* Current Target Indicator */}
      {currentItem && isRunning && (
        <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-brand-500 animate-spin" />
            <div>
              <span className="text-slate-400 font-medium">Currently Sending To:</span>{' '}
              <strong className="text-slate-900 dark:text-white">{currentItem.name}</strong>{' '}
              <span className="font-mono text-slate-500">({currentItem.phone})</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 font-semibold text-[10px]">
            In Progress
          </span>
        </div>
      )}

      {/* Real-time Console Log Terminal */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Terminal className="w-3.5 h-3.5 text-brand-400" /> Live Output Console
          </span>
          <span>{logs.length} events logged</span>
        </div>

        <div className="h-48 overflow-y-auto space-y-1 pr-2 pt-1 text-[11px] leading-relaxed">
          {logs.slice(0, 50).map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-2 ${
                log.level === 'success'
                  ? 'text-emerald-400'
                  : log.level === 'error'
                  ? 'text-rose-400'
                  : log.level === 'warning'
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-slate-600 flex-shrink-0">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className="break-all">{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
