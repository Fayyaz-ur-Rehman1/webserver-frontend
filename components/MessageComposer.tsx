'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Eye, 
  Sparkles,
  Bold,
  Italic,
  Code,
  Strikethrough
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';
import { MediaAttachment } from '../app/types';

export const MessageComposer: React.FC<{
  onOpenCampaignModal: (template: string, media?: MediaAttachment | null) => void;
}> = ({ onOpenCampaignModal }) => {
  const { contacts } = useApp();
  const [message, setMessage] = useState<string>(
    'Hello {{name}}! 👋\n\nThank you for choosing our services. We have an exclusive update regarding your phone account ({{number}}).\n\nBest regards,\nSupport Team'
  );
  const [media, setMedia] = useState<MediaAttachment | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const charCount = message.length;
  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  // Insert Variable Tag into textarea
  const insertVariable = (variableName: string) => {
    setMessage((prev) => prev + ` {{${variableName}}}`);
  };

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const insertFormatting = (syntax: string) => {
    setMessage((prev) => `${prev} ${syntax}text${syntax} `);
  };

  // Media Attachment Upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMedia({
        filename: file.name,
        mimetype: file.type,
        data: reader.result as string,
        caption: ''
      });
    };
    reader.readAsDataURL(file);
  };

  // Sample dynamic interpolation for preview
  const sampleContact = contacts.find(c => c.status === 'valid') || {
    name: 'Danish Khan',
    phone: '+919876543210'
  };

  const previewMessage = message
    .replace(/\{\{\s*name\s*\}\}/gi, sampleContact.name)
    .replace(/\{\{\s*number\s*\}\}/gi, sampleContact.phone);

  const selectedCount = contacts.filter(c => c.selected && c.status === 'valid').length;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Top Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-brand-500" /> Create Dynamic Message Template
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Use placeholders like <code className="text-brand-500 font-mono font-bold">{"{{name}}"}</code> and <code className="text-brand-500 font-mono font-bold">{"{{number}}"}</code> for personalized bulk messaging.
          </p>
        </div>

        {/* Editor vs Mobile Preview Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-slate-800 text-brand-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Composer
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-800 text-brand-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> WhatsApp Preview
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-4">
          {/* Quick Insertion Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            {/* Variable Tags */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Insert Tags:</span>
              <button
                onClick={() => insertVariable('name')}
                className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold hover:bg-brand-500/20 transition-colors"
              >
                + {"{{name}}"}
              </button>
              <button
                onClick={() => insertVariable('number')}
                className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold hover:bg-brand-500/20 transition-colors"
              >
                + {"{{number}}"}
              </button>
            </div>

            {/* Formatting & Emojis */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => insertFormatting('*')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('_')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('~')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('`')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {['😊', '👋', '🔥', '🎉', '🚀', '💡', '📞'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 text-sm hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Main Textarea */}
          <div className="relative">
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your WhatsApp message template here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 leading-relaxed font-sans"
            />

            {/* Character & Word counter */}
            <div className="absolute right-4 bottom-4 text-[11px] font-mono text-slate-400 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
              <span>{charCount} chars</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Media Attachment Upload Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors">
                <Paperclip className="w-4 h-4 text-brand-500" />
                Attach Media (Image, PDF, Video)
                <input
                  type="file"
                  accept="image/*, application/pdf, video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>

              {media && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium">
                  {media.mimetype.includes('image') ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : media.mimetype.includes('video') ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="max-w-[150px] truncate">{media.filename}</span>
                  <button
                    onClick={() => setMedia(null)}
                    className="p-1 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenCampaignModal(message, media)}
              disabled={selectedCount === 0 || !message.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-40 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> Configure & Send ({selectedCount} Selected)
            </button>
          </div>
        </div>
      ) : (
        /* Mobile Preview Mode */
        <div className="flex flex-col items-center py-6">
          <div className="w-full max-w-sm rounded-[40px] border-4 border-slate-300 dark:border-slate-800 bg-[#efeae2] dark:bg-[#0b141a] shadow-2xl p-4 overflow-hidden relative min-h-[400px]">
            {/* WhatsApp Header Mock */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                {sampleContact.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {sampleContact.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {sampleContact.phone}
                </p>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="ml-auto max-w-[85%] p-3 rounded-2xl rounded-tr-none bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 text-xs shadow-sm leading-relaxed whitespace-pre-wrap relative font-sans">
              {media && (
                <div className="mb-2 p-2 rounded-xl bg-black/10 text-[10px] font-semibold flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{media.filename}</span>
                </div>
              )}
              {previewMessage}
              <div className="text-[9px] text-right opacity-60 mt-1 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
