'use client';

import React, { useState } from 'react';
import { History, Download, Trash2, RotateCcw, Search, CheckCircle2, XCircle, Clock, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../app/context/AppContext';
import { Campaign } from '../app/types';

export const HistoryTable: React.FC = () => {
  const { campaigns, deleteCampaign, retryFailedCampaign } = useApp();
  const [search, setSearch] = useState('');

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Export Campaign Data
  const exportCampaign = (campaign: Campaign, format: 'xlsx' | 'csv' | 'json') => {
    const data = campaign.contactStatuses.map((item) => ({
      'Contact Name': item.name,
      'Phone Number': item.phone,
      'Delivery Status': item.status,
      'Error Reason': item.error || 'N/A',
      'Sent At': item.sentAt ? new Date(item.sentAt).toLocaleString() : 'N/A'
    }));

    if (format === 'json') {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `${campaign.name.replace(/\s+/g, '_')}_results.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    if (format === 'csv') {
      XLSX.writeFile(workbook, `${campaign.name.replace(/\s+/g, '_')}_results.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(workbook, `${campaign.name.replace(/\s+/g, '_')}_results.xlsx`);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" /> Campaign History & Exports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review past dispatches, analyze delivery reports, and download Excel/CSV logs.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="p-3.5">Campaign Name</th>
              <th className="p-3.5">Date & Time</th>
              <th className="p-3.5 text-center">Recipients</th>
              <th className="p-3.5 text-center">Delivered</th>
              <th className="p-3.5 text-center">Failed</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {campaign.name}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono">
                    {new Date(campaign.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {campaign.totalContacts}
                  </td>
                  <td className="p-3.5 text-center font-bold text-emerald-500">
                    {campaign.sentCount}
                  </td>
                  <td className="p-3.5 text-center font-bold text-rose-500">
                    {campaign.failedCount}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        campaign.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : campaign.status === 'running'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20 animate-pulse'
                          : campaign.status === 'paused'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    {/* Export Dropdown / Buttons */}
                    <button
                      onClick={() => exportCampaign(campaign, 'xlsx')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px] text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1"
                      title="Export Excel"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Excel
                    </button>
                    <button
                      onClick={() => exportCampaign(campaign, 'csv')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px] text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1"
                      title="Export CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-500" /> CSV
                    </button>

                    {campaign.failedCount > 0 && (
                      <button
                        onClick={() => retryFailedCampaign(campaign.id)}
                        className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors"
                        title="Retry Failed Contacts"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No campaign history records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
