'use client';

import React from 'react';
import { Sun, Moon, QrCode, Wifi, WifiOff, RefreshCw, Battery, Smartphone } from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const Header: React.FC = () => {
  const { status, activeTab, theme, toggleTheme, connectWhatsApp, setIsQrModalOpen } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Analytics';
      case 'connection': return 'WhatsApp Device Connection';
      case 'contacts': return 'Excel & CSV Contact Import';
      case 'compose': return 'Message Composer & Media';
      case 'campaigns': return 'Live Sending Engine';
      case 'history': return 'Campaign History & Export';
      case 'logs': return 'Live System Logs';
      case 'settings': return 'Application Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <div
          onClick={() => setIsQrModalOpen(true)}
          className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold border transition-all ${
            status.connected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              : status.authenticated
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status.connected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                status.connected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
          </span>

          <span className="hidden sm:inline">
            {status.connected
              ? `Connected (${status.user?.pushname || status.user?.phone || 'WA'})`
              : 'Disconnected'}
          </span>

          {status.connected && status.battery?.level !== undefined && (
            <span className="flex items-center gap-1 text-[11px] opacity-80 border-l border-emerald-500/20 pl-2">
              <Battery className="w-3 h-3" /> {status.battery.level}%
            </span>
          )}
        </div>

        {/* Connect WhatsApp Button */}
        {!status.connected && (
          <button
            onClick={() => connectWhatsApp()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-glow transition-all"
          >
            <QrCode className="w-4 h-4" />
            Connect WhatsApp
          </button>
        )}

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
