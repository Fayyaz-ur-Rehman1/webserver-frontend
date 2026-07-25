'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  Send, 
  Rocket, 
  History, 
  Settings, 
  Terminal, 
  ChevronLeft, 
  ChevronRight,
  MessageSquareDot
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const Sidebar: React.FC<{ isCollapsed: boolean; toggleCollapse: () => void }> = ({
  isCollapsed,
  toggleCollapse
}) => {
  const { activeTab, setActiveTab, status } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'connection', label: 'WhatsApp Connection', icon: QrCode, badge: status.connected ? 'Connected' : 'Offline' },
    { id: 'contacts', label: 'Import & Contacts', icon: Users },
    { id: 'compose', label: 'Compose Message', icon: Send },
    { id: 'campaigns', label: 'Live Campaigns', icon: Rocket },
    { id: 'history', label: 'Campaign History', icon: History },
    { id: 'logs', label: 'System Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 border-r ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-[#0d1322] border-slate-200 dark:border-slate-800 z-20`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold shadow-glow flex-shrink-0">
            <MessageSquareDot className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none text-base">
                WhatsApp<span className="text-brand-500">Bulk</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-1">
                SaaS Enterprise
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'text-brand-500 scale-110' : 'group-hover:scale-105'
                }`}
              />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    status.connected
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Account Info at bottom */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-xs uppercase">
              {status.user?.pushname ? status.user.pushname.charAt(0) : 'WA'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {status.user?.pushname || 'WhatsApp Client'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {status.connected ? status.user?.phone || 'Connected' : 'Scanner Ready'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
