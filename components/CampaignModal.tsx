'use client';

import React, { useState } from 'react';
import { X, Rocket, Clock, ShieldCheck, AlertCircle, Play } from 'lucide-react';
import { useApp } from '../app/context/AppContext';
import { MediaAttachment } from '../app/types';

export const CampaignModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  messageTemplate: string;
  media?: MediaAttachment | null;
}> = ({ isOpen, onClose, messageTemplate, media }) => {
  const { contacts, startCampaign } = useApp();
  const [campaignName, setCampaignName] = useState(`Campaign ${new Date().toLocaleDateString()}`);
  const [minDelay, setMinDelay] = useState<number>(2);
  const [maxDelay, setMaxDelay] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedContacts = contacts.filter((c) => c.selected && c.status === 'valid');
  const targetCount = selectedContacts.length;

  const avgDelay = (minDelay + maxDelay) / 2;
  const estimatedSeconds = targetCount * avgDelay;
  const estimatedMinutes = (estimatedSeconds / 60).toFixed(1);

  const handleStartSending = async () => {
    if (!campaignName.trim()) {
      setError('Please provide a campaign name');
      return;
    }
    if (targetCount === 0) {
      setError('No valid contacts selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await startCampaign({
        name: campaignName,
        messageTemplate,
        minDelay,
        maxDelay,
        media,
        targetContactIds: selectedContacts.map((c) => c.id)
      });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to start campaign');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configure Bulk Campaign
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safety parameters & sequential send queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Delay Range Config */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500" /> Safe Random Delay Between Messages
              </span>
              <span className="text-xs font-mono font-bold text-brand-500">
                {minDelay}s - {maxDelay}s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Minimum Delay ({minDelay}s)
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={minDelay}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMinDelay(val);
                    if (val > maxDelay) setMaxDelay(val + 1);
                  }}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Maximum Delay ({maxDelay}s)
                </label>
                <input
                  type="range"
                  min={minDelay}
                  max={30}
                  value={maxDelay}
                  onChange={(e) => setMaxDelay(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Random delays prevent WhatsApp spam detection algorithms.
            </p>
          </div>

          {/* Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 text-xs space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-600 dark:text-slate-400">Recipients Selected:</span>
              <span className="font-bold text-slate-900 dark:text-white">{targetCount} Contacts</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-600 dark:text-slate-400">Est. Total Time:</span>
              <span className="font-bold text-brand-500 font-mono">~{estimatedMinutes} Minutes</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartSending}
            disabled={loading || targetCount === 0}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            {loading ? 'Starting Campaign...' : 'Confirm & Start Sending'}
          </button>
        </div>
      </div>
    </div>
  );
};
