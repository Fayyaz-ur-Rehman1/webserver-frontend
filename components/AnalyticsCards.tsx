'use client';

import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  QrCode, 
  TrendingUp, 
  Smartphone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const AnalyticsCards: React.FC = () => {
  const { status, contacts, campaigns, activeCampaign, setIsQrModalOpen } = useApp();

  const totalContacts = contacts.length;
  const validContacts = contacts.filter(c => c.status === 'valid').length;
  const invalidContacts = contacts.filter(c => c.status === 'invalid').length;
  const selectedContacts = contacts.filter(c => c.selected && c.status === 'valid').length;

  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + c.failedCount, 0);
  const totalPending = campaigns.reduce((acc, c) => acc + c.pendingCount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Account Connection */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            WhatsApp Account
          </span>
          <div
            className={`p-2 rounded-xl ${
              status.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}
          >
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          {status.connected ? (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {status.user?.pushname || 'Connected Device'}
              </h3>
              <p className="text-xs font-mono text-brand-500 mt-0.5">
                +{status.user?.phone}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Not Connected
              </h3>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="mt-1 text-xs text-brand-500 hover:underline flex items-center gap-1 font-semibold"
              >
                <QrCode className="w-3.5 h-3.5" /> Scan QR Code
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Status</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
              status.connected
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
            }`}
          >
            {status.connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* 2. Total Contacts */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Contacts
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalContacts.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-emerald-500 font-semibold">{validContacts} Valid</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-rose-500 font-semibold">{invalidContacts} Invalid</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Target Selected</span>
          <span className="font-bold text-slate-900 dark:text-white">{selectedContacts}</span>
        </div>
      </div>

      {/* 3. Messages Delivered */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Messages Sent
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalSent.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {campaigns.length} campaigns
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Failed Rate</span>
          <span className="font-semibold text-rose-500">
            {totalSent + totalFailed > 0
              ? `${Math.round((totalFailed / (totalSent + totalFailed)) * 100)}%`
              : '0%'}
          </span>
        </div>
      </div>

      {/* 4. Pending / Active Campaign */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Campaign Queue
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeCampaign?.status === 'running'
              ? `${activeCampaign.pendingCount} Left`
              : `${totalPending} Pending`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeCampaign
              ? `Active: "${activeCampaign.name}" (${activeCampaign.status})`
              : 'No active campaign running'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Queue Engine</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
              activeCampaign?.status === 'running'
                ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20 animate-pulse'
                : 'bg-slate-500/10 text-slate-400'
            }`}
          >
            {activeCampaign?.status || 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};
