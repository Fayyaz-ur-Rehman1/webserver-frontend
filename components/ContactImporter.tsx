'use client';

import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Download, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../app/context/AppContext';

export const ContactImporter: React.FC = () => {
  const { uploadContactsFile } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replaceMode, setReplaceMode] = useState(true);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; stats?: any; error?: string } | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setUploadResult(null);

    const result = await uploadContactsFile(file, replaceMode);
    setUploadResult(result);
    setLoading(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Download Sample Excel Template
  const downloadSampleTemplate = () => {
    const sampleData = [
      { Name: 'Danish Khan', Country: '91', Number: '9876543210' },
      { Name: 'Sophia Miller', Country: '1', Number: '2025550143' },
      { Name: 'Rahul Sharma', Country: '91', Number: '9123456789' },
      { Name: 'Aisha Patel', Country: '91', Number: '9988776655' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    XLSX.writeFile(workbook, 'whatsapp_contacts_sample.xlsx');
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-500" /> Import Contacts from Excel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supports <span className="font-semibold text-slate-700 dark:text-slate-300">.XLSX, .XLS, .CSV</span>. Automatic E.164 phone formatting & column detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Append / Replace Mode */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setReplaceMode(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                replaceMode
                  ? 'bg-white dark:bg-slate-800 text-brand-500 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Replace List
            </button>
            <button
              onClick={() => setReplaceMode(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                !replaceMode
                  ? 'bg-white dark:bg-slate-800 text-brand-500 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Append List
            </button>
          </div>

          {/* Sample Download Button */}
          <button
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Sample File
          </button>
        </div>
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all ${
          isDragging
            ? 'border-brand-500 bg-brand-500/5 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="p-4 rounded-full bg-brand-500/10 text-brand-500 mb-3 shadow-glow">
          {loading ? (
            <RefreshCw className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <p className="text-sm font-bold text-slate-900 dark:text-white text-center">
          {loading ? 'Parsing and validating contacts...' : 'Click to upload or drag and drop Excel file'}
        </p>
        <p className="text-xs text-slate-400 mt-1 text-center">
          Accepted Headers: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">Name | Number</code> or <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">Name | Country | Number</code>
        </p>
      </div>

      {/* Upload Stats Banner */}
      {uploadResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            uploadResult.success
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {uploadResult.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            )}
            <div>
              <p className="font-bold text-sm">
                {uploadResult.success ? 'Upload & Validation Successful!' : 'Upload Failed'}
              </p>
              <p className="opacity-90">
                {uploadResult.success
                  ? `Parsed ${uploadResult.stats?.total} records from file.`
                  : uploadResult.error}
              </p>
            </div>
          </div>

          {uploadResult.success && uploadResult.stats && (
            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-emerald-500/20 pt-2 sm:pt-0 sm:pl-4 font-medium">
              <div>
                <span className="opacity-70">Valid:</span>{' '}
                <strong className="text-emerald-600 dark:text-emerald-300">{uploadResult.stats.valid}</strong>
              </div>
              <div>
                <span className="opacity-70">Invalid:</span>{' '}
                <strong className="text-rose-500">{uploadResult.stats.invalid}</strong>
              </div>
              <div>
                <span className="opacity-70">Duplicates:</span>{' '}
                <strong className="text-amber-500">{uploadResult.stats.duplicates}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
