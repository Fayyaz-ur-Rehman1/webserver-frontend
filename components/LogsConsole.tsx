'use client';

import React, { useState } from 'react';
import { Terminal, Trash2, Search, Filter } from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const LogsConsole: React.FC = () => {
  const { logs, clearLogs } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = filterCategory === 'all' ? true : log.category === filterCategory;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-500" /> Real-time System Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit trailing socket emissions, file parsing logs, and dispatch responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter logs..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={clearLogs}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Log Category Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
        {['all', 'connection', 'import', 'campaign', 'system'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-xl capitalize transition-all ${
              filterCategory === cat
                ? 'bg-brand-500 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terminal View */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 text-xs font-mono h-96 overflow-y-auto space-y-1.5">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
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
              <span className="text-brand-500/80 font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                {log.category || 'system'}
              </span>
              <span className="break-all">{log.message}</span>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-600">
            No system log events recorded.
          </div>
        )}
      </div>
    </div>
  );
};
