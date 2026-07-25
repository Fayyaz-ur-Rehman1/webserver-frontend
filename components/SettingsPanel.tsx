'use client';

import React from 'react';
import { Settings, Moon, Sun, Bell, Volume2, Shield, RefreshCw, Power, Trash2 } from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, theme, setTheme, reconnectWhatsApp, disconnectWhatsApp } = useApp();

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-500" /> System & Engine Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure message sending parameters, notification alerts, and session credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Appearance & Theme
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Application Mode</span>
            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  theme === 'dark'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  theme === 'light'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
            </div>
          </div>
        </div>

        {/* Dispatch Delays */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Default Delays
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">Min Delay (Seconds)</span>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.defaultMinDelay}
                onChange={(e) => updateSettings({ defaultMinDelay: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">Max Delay (Seconds)</span>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.defaultMaxDelay}
                onChange={(e) => updateSettings({ defaultMaxDelay: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Toggles */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Notifications & Alerts
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Volume2 className="w-4 h-4 text-brand-500" /> Sound Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.notificationSound}
                onChange={(e) => updateSettings({ notificationSound: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Bell className="w-4 h-4 text-brand-500" /> Desktop Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                onChange={(e) => updateSettings({ desktopNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500"
              />
            </label>
          </div>
        </div>

        {/* Session Management */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Session & Authentication
          </h3>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => reconnectWhatsApp()}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconnect WhatsApp Session
            </button>
            <button
              onClick={disconnectWhatsApp}
              className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Power className="w-3.5 h-3.5" /> Terminate & Logout WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
